import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { api, clearAuthToken } from "../../api/client";
import { useUser } from "../../context/UserContext";
import TableBrowser from "./TableBrowser";
import SchemaViewer from "./SchemaViewer";
import RelationshipsViewer from "./RelationshipsViewer";
import StatsOverview from "./StatsOverview";
import SchemaVisualizer from "./SchemaVisualizer";
import CreateTableModal from "./CreateTableModal";
import CreateEnumModal from "./CreateEnumModal";
import EnumBrowser from "./EnumBrowser";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";

interface TableInfo {
  name: string;
  row_count: number;
  column_count: number;
}

interface EnumInfo {
  table: string;
  column: string;
  type: string;
  values: string[];
  nullable: boolean;
  default: string | null;
}

type TabType = "data" | "schema" | "relationships" | "overview" | "visualizer" | "enums";
type SidebarView = "tables" | "enums";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { setUserType } = useUser();
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const handleLogout = async () => {
    try {
      await api.post("auth/logout", {});
    } catch {
      // ignore
    }
    clearAuthToken();
    localStorage.removeItem("userType");
    setUserType("user");
    navigate("/signin");
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [showCreateEnum, setShowCreateEnum] = useState(false);
  const [showDropConfirm, setShowDropConfirm] = useState(false);
  const [tableToDropName, setTableToDropName] = useState<string | null>(null);
  const [sidebarView, setSidebarView] = useState<SidebarView>("tables");
  const [enumList, setEnumList] = useState<EnumInfo[]>([]);
  const [isLoadingEnums, setIsLoadingEnums] = useState(false);
  const [enumSearchQuery, setEnumSearchQuery] = useState("");
  const [selectedEnum, setSelectedEnum] = useState<{
    table: string;
    column: string;
  } | null>(null);

  const loadTables = useCallback(async () => {
    setIsLoadingTables(true);
    setError(null);
    try {
      const response = await api.get<{ data: TableInfo[] }>(
        "admin/database/tables"
      );
      setTables(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tables."
      );
    } finally {
      setIsLoadingTables(false);
    }
  }, []);

  const loadEnums = useCallback(async () => {
    setIsLoadingEnums(true);
    try {
      const res = await api.get<{ data: EnumInfo[] }>("admin/database/enums");
      setEnumList(res.data);
    } catch {
      // silent — errors shown in main panel
    } finally {
      setIsLoadingEnums(false);
    }
  }, []);

  useEffect(() => {
    loadTables();
    loadEnums();
  }, [loadTables, loadEnums]);

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEnums = enumList.filter(
    (e) =>
      e.column.toLowerCase().includes(enumSearchQuery.toLowerCase()) ||
      e.table.toLowerCase().includes(enumSearchQuery.toLowerCase()) ||
      e.values.some((v) =>
        v.toLowerCase().includes(enumSearchQuery.toLowerCase())
      )
  );

  // Group filtered enums by table for sidebar display
  const enumsByTable: Record<string, EnumInfo[]> = {};
  filteredEnums.forEach((e) => {
    if (!enumsByTable[e.table]) enumsByTable[e.table] = [];
    enumsByTable[e.table].push(e);
  });

  const totalRows = tables.reduce((sum, t) => sum + t.row_count, 0);

  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
    setActiveTab("data");
    setSelectedEnum(null);
    setSidebarView("tables");
  };

  const handleSelectEnum = (table: string, column: string) => {
    setSelectedEnum({ table, column });
    setActiveTab("enums");
    setSelectedTable(null);
  };

  const handleRefreshTables = () => {
    loadTables();
  };

  const handleTableCreated = (newTableName: string) => {
    setShowCreateTable(false);
    loadTables();
    setSelectedTable(newTableName);
    setActiveTab("data");
  };

  const handleEnumCreated = (table: string, column: string) => {
    setShowCreateEnum(false);
    loadEnums();
    loadTables();
    setSelectedEnum({ table, column });
    setActiveTab("enums");
    setSidebarView("enums");
  };

  const handleDropTableClick = (name: string) => {
    setTableToDropName(name);
    setShowDropConfirm(true);
  };

  const handleDropTableConfirm = async () => {
    if (!tableToDropName) return;
    try {
      await api.del(`admin/database/tables/${tableToDropName}`);
      if (selectedTable === tableToDropName) {
        setSelectedTable(null);
        setActiveTab("overview");
      }
      loadTables();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to drop table.");
    }
    setTableToDropName(null);
    setShowDropConfirm(false);
  };

  return (
    <>
      <PageMeta title="Database Browser | Super Admin" description="" />
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Standalone Header */}
        <header className="flex items-center justify-between px-4 h-12 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              HSEradar
            </span>
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-1.5">
              <DatabaseIcon className="w-4 h-4 text-brand-500" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Database Browser
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Table Sidebar */}
        <div
          className={`flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200 ${
            sidebarCollapsed ? "w-12" : "w-72"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200 dark:border-gray-700">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 flex-1 mr-2">
                <button
                  onClick={() => setSidebarView("tables")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                    sidebarView === "tables"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <TableIcon className="w-3 h-3" />
                  Tables
                  <span className={`text-[10px] px-1 py-0.5 rounded-full min-w-[18px] text-center ${
                    sidebarView === "tables"
                      ? "bg-gray-100 dark:bg-gray-500 text-gray-600 dark:text-gray-200"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  }`}>
                    {tables.length}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setSidebarView("enums");
                    if (enumList.length === 0 && !isLoadingEnums) loadEnums();
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                    sidebarView === "enums"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <EnumSidebarIcon className="w-3 h-3" />
                  Enums
                  <span className={`text-[10px] px-1 py-0.5 rounded-full min-w-[18px] text-center ${
                    sidebarView === "enums"
                      ? "bg-gray-100 dark:bg-gray-500 text-gray-600 dark:text-gray-200"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  }`}>
                    {enumList.length}
                  </span>
                </button>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 flex-shrink-0"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  sidebarCollapsed ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          {!sidebarCollapsed && sidebarView === "tables" && (
            <>
              {/* Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <svg
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search tables..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* New Table + Stats Bar */}
              <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <button
                  onClick={() => setShowCreateTable(true)}
                  className="flex items-center gap-1 text-[10px] font-medium text-brand-500 hover:text-brand-600 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Table
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {totalRows.toLocaleString()} rows
                  </span>
                  <button
                    onClick={handleRefreshTables}
                    className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                    title="Refresh"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Table List */}
              <div className="flex-1 overflow-y-auto">
                {isLoadingTables ? (
                  <div className="p-4 text-xs text-gray-400 dark:text-gray-500">
                    Loading tables...
                  </div>
                ) : error ? (
                  <div className="p-4 text-xs text-red-500">{error}</div>
                ) : filteredTables.length === 0 ? (
                  <div className="p-4 text-xs text-gray-400 dark:text-gray-500">
                    No tables found.
                  </div>
                ) : (
                  <div className="py-1">
                    {filteredTables.map((table) => (
                      <div
                        key={table.name}
                        className={`flex items-center justify-between px-3 py-2 text-xs transition-colors group ${
                          selectedTable === table.name
                            ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <button
                          onClick={() => handleSelectTable(table.name)}
                          className="flex items-center gap-2 min-w-0 flex-1 text-left"
                        >
                          <TableIcon
                            className={`w-3.5 h-3.5 flex-shrink-0 ${
                              selectedTable === table.name
                                ? "text-brand-500"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          />
                          <span className="truncate font-mono">
                            {table.name}
                          </span>
                        </button>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums group-hover:hidden">
                            {table.row_count}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums hidden group-hover:inline">
                            {table.row_count}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDropTableClick(table.name);
                            }}
                            className="p-0.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                            title={`Drop table ${table.name}`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {!sidebarCollapsed && sidebarView === "enums" && (
            <>
              {/* Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <svg
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search enums..."
                    value={enumSearchQuery}
                    onChange={(e) => setEnumSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* New Enum + View All + stats */}
              <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateEnum(true)}
                    className="flex items-center gap-1 text-[10px] font-medium text-brand-500 hover:text-brand-600 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Enum
                  </button>
                  <div className="w-px h-3 bg-gray-200 dark:bg-gray-600" />
                  <button
                    onClick={() => {
                      setSelectedEnum(null);
                      setSelectedTable(null);
                      setActiveTab("enums");
                    }}
                    className="flex items-center gap-1 text-[10px] font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <EnumSidebarIcon className="w-3 h-3" />
                    View All
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {Object.keys(enumsByTable).length} tables
                  </span>
                  <button
                    onClick={loadEnums}
                    className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                    title="Refresh"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Enum List grouped by table */}
              <div className="flex-1 overflow-y-auto">
                {isLoadingEnums ? (
                  <div className="p-4 text-xs text-gray-400 dark:text-gray-500">
                    Loading enums...
                  </div>
                ) : filteredEnums.length === 0 ? (
                  <div className="p-4 text-xs text-gray-400 dark:text-gray-500">
                    {enumSearchQuery ? "No enums match your search." : "No enum columns found."}
                  </div>
                ) : (
                  <div className="py-1">
                    {Object.entries(enumsByTable).map(([table, cols]) => (
                      <div key={table}>
                        {/* Table group header */}
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50 sticky top-0">
                          {table}
                        </div>
                        {/* Enum columns in this table */}
                        {cols.map((col) => {
                          const isSelected =
                            selectedEnum?.table === col.table &&
                            selectedEnum?.column === col.column;
                          return (
                            <button
                              key={`${col.table}-${col.column}`}
                              onClick={() =>
                                handleSelectEnum(col.table, col.column)
                              }
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                                isSelected
                                  ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <EnumSidebarIcon
                                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                                    isSelected
                                      ? "text-orange-500"
                                      : "text-gray-400 dark:text-gray-500"
                                  }`}
                                />
                                <span className="truncate font-mono">
                                  {col.column}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0 ml-2">
                                {col.values.length}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-4">
              {/* Overview Tab */}
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setSelectedTable(null);
                  setSelectedEnum(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "overview"
                    ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Overview
              </button>

              {/* Enums Tab */}
              {activeTab === "enums" && (
                <>
                  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
                  <div className="flex items-center gap-1.5">
                    <EnumSidebarIcon className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedEnum ? (
                        <span className="font-mono">
                          {selectedEnum.table}.{selectedEnum.column}
                        </span>
                      ) : (
                        "All Enums"
                      )}
                    </span>
                  </div>
                </>
              )}

              {selectedTable && (
                <>
                  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
                  <div className="flex items-center gap-1">
                    <TableIcon className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                      {selectedTable}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                    <TabButton
                      active={activeTab === "data"}
                      onClick={() => setActiveTab("data")}
                    >
                      Data
                    </TabButton>
                    <TabButton
                      active={activeTab === "schema"}
                      onClick={() => setActiveTab("schema")}
                    >
                      Schema
                    </TabButton>
                  </div>
                </>
              )}

              {!selectedTable && activeTab !== "overview" && (
                <>
                  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
                  <button
                    onClick={() => setActiveTab("relationships")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      activeTab === "relationships"
                        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    Relationships
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab("visualizer");
                  setSelectedTable(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "visualizer"
                    ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                  Visualizer
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("relationships");
                  setSelectedTable(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "relationships"
                    ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  All Relations
                </span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "overview" && (
              <StatsOverview
                tables={tables}
                onSelectTable={handleSelectTable}
              />
            )}
            {activeTab === "data" && selectedTable && (
              <TableBrowser
                tableName={selectedTable}
                onRefreshTables={handleRefreshTables}
              />
            )}
            {activeTab === "schema" && selectedTable && (
              <SchemaViewer tableName={selectedTable} onRefreshTables={handleRefreshTables} />
            )}
            {activeTab === "visualizer" && (
              <SchemaVisualizer
                onSelectTable={handleSelectTable}
              />
            )}
            {activeTab === "relationships" && (
              <RelationshipsViewer onSelectTable={handleSelectTable} />
            )}
            {activeTab === "enums" && (
              <EnumBrowser
                selectedEnum={selectedEnum}
                onSelectTable={handleSelectTable}
                onEnumsChanged={loadEnums}
                onCreateEnum={() => setShowCreateEnum(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Table Modal */}
      {showCreateTable && (
        <CreateTableModal
          onClose={() => setShowCreateTable(false)}
          onCreated={handleTableCreated}
        />
      )}

      {/* Create Enum Modal */}
      {showCreateEnum && (
        <CreateEnumModal
          tables={tables}
          onClose={() => setShowCreateEnum(false)}
          onCreated={handleEnumCreated}
        />
      )}

      {/* Drop Table Confirmation */}
      <ConfirmModal
        isOpen={showDropConfirm}
        onClose={() => {
          setShowDropConfirm(false);
          setTableToDropName(null);
        }}
        onConfirm={handleDropTableConfirm}
        title="Drop Table"
        message={`Are you sure you want to drop the table "${tableToDropName}"? This will permanently delete the table and ALL its data. This cannot be undone.`}
        confirmText="Drop Table"
        cancelText="Cancel"
        type="danger"
      />
      </div>
    </>
  );
}

/* ---------- Small helper components ---------- */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
        active
          ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth={2} />
      <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" strokeWidth={2} />
      <path
        d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"
        strokeWidth={2}
      />
    </svg>
  );
}

function TableIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M3 14h18M10 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z"
      />
    </svg>
  );
}

function EnumSidebarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  );
}
