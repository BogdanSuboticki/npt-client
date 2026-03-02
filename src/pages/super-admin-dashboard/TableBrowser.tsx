import { useEffect, useState, useCallback } from "react";
import { api } from "../../api/client";
import RowEditorModal from "./RowEditorModal";
import CellEditor from "./CellEditor";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";

interface ColumnInfo {
  name: string;
  type: string;
  type_name: string;
  nullable: boolean;
  default: string | null;
  auto_increment: boolean;
  enum_values?: string[];
}

interface SchemaData {
  table: string;
  columns: ColumnInfo[];
  primary_key: string[] | null;
  foreign_keys: { columns: string[]; foreign_table: string; foreign_columns: string[] }[];
}

interface PaginatedResponse {
  data: Record<string, unknown>[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

interface TableBrowserProps {
  tableName: string;
  onRefreshTables: () => void;
}

export default function TableBrowser({
  tableName,
  onRefreshTables,
}: TableBrowserProps) {
  const [schema, setSchema] = useState<SchemaData | null>(null);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(50);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showRowEditor, setShowRowEditor] = useState(false);
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRow, setDeletingRow] = useState<Record<string, unknown> | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Cell editor popover
  const [editingCell, setEditingCell] = useState<{
    row: string;
    col: string;
    value: unknown;
    anchorRect: DOMRect;
  } | null>(null);
  const [isCellSaving, setIsCellSaving] = useState(false);

  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load schema
  useEffect(() => {
    const loadSchema = async () => {
      try {
        const res = await api.get<{ data: SchemaData }>(
          `admin/database/tables/${tableName}/schema`
        );
        setSchema(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load schema.");
      }
    };
    loadSchema();
    // Reset state on table change
    setPage(1);
    setSortBy(null);
    setSortDir("asc");
    setSearch("");
    setDebouncedSearch("");
    setSelectedRows(new Set());
    setColumnFilters({});
    setEditingCell(null);
  }, [tableName]);

  // Load rows
  const loadRows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("per_page", String(perPage));
      if (sortBy) {
        params.set("sort_by", sortBy);
        params.set("sort_dir", sortDir);
      }
      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }
      if (Object.keys(columnFilters).length > 0) {
        const nonEmpty = Object.fromEntries(
          Object.entries(columnFilters).filter(([, v]) => v !== "")
        );
        if (Object.keys(nonEmpty).length > 0) {
          params.set("filters", JSON.stringify(nonEmpty));
        }
      }
      const res = await api.get<PaginatedResponse>(
        `admin/database/tables/${tableName}/rows?${params.toString()}`
      );
      setRows(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rows.");
    } finally {
      setIsLoading(false);
    }
  }, [tableName, page, perPage, sortBy, sortDir, debouncedSearch, columnFilters]);

  useEffect(() => {
    if (schema) {
      loadRows();
    }
  }, [loadRows, schema]);

  const primaryKey = schema?.primary_key?.[0] ?? "id";

  const getRowId = (row: Record<string, unknown>) => {
    return String(row[primaryKey] ?? "");
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleCellClick = (
    e: React.MouseEvent<HTMLTableCellElement>,
    row: Record<string, unknown>,
    column: string
  ) => {
    // Don't allow editing auto_increment primary key
    if (column === primaryKey && schema?.columns.find(c => c.name === column)?.auto_increment) {
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setEditingCell({
      row: getRowId(row),
      col: column,
      value: row[column],
      anchorRect: rect,
    });
  };

  const handleCellSave = async (newValue: unknown) => {
    if (!editingCell) return;

    // Check if value actually changed
    const row = rows.find((r) => getRowId(r) === editingCell.row);
    if (row) {
      const oldVal = row[editingCell.col];
      if (newValue === oldVal) {
        setEditingCell(null);
        return;
      }
      if (newValue === null && (oldVal === null || oldVal === undefined)) {
        setEditingCell(null);
        return;
      }
      if (String(newValue) === String(oldVal)) {
        setEditingCell(null);
        return;
      }
    }

    setIsCellSaving(true);
    try {
      await api.put(
        `admin/database/tables/${tableName}/rows/${editingCell.row}`,
        { [editingCell.col]: newValue }
      );
      await loadRows();
      onRefreshTables();
      setEditingCell(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update cell.");
    } finally {
      setIsCellSaving(false);
    }
  };

  const handleDeleteClick = (row: Record<string, unknown>) => {
    setDeletingRow(row);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRow) return;
    try {
      await api.del(
        `admin/database/tables/${tableName}/rows/${getRowId(deletingRow)}`
      );
      await loadRows();
      onRefreshTables();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete row.");
    }
    setDeletingRow(null);
    setShowDeleteModal(false);
  };

  const handleBulkDelete = async () => {
    if (selectedRows.size === 0) return;
    try {
      for (const rowId of selectedRows) {
        await api.del(`admin/database/tables/${tableName}/rows/${rowId}`);
      }
      setSelectedRows(new Set());
      await loadRows();
      onRefreshTables();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete rows.");
    }
  };

  const toggleRowSelection = (rowId: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === rows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(rows.map(getRowId)));
    }
  };

  const handleRowSaved = async () => {
    setShowRowEditor(false);
    setEditingRow(null);
    await loadRows();
    onRefreshTables();
  };

  const handleEditRow = (row: Record<string, unknown>) => {
    setEditingRow(row);
    setShowRowEditor(true);
  };

  const columns = schema?.columns ?? [];

  const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const isNullValue = (value: unknown): boolean => {
    return value === null || value === undefined;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          {/* Search */}
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
              placeholder="Search rows..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 w-48"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-2.5 py-1.5 text-xs border rounded-md flex items-center gap-1.5 transition-colors ${
              showFilters || Object.values(columnFilters).some((v) => v !== "")
                ? "border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10"
                : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
          </button>

          {selectedRows.size > 0 && (
            <>
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {selectedRows.size} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-2.5 py-1.5 text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
              >
                Delete Selected
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Row count */}
          <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
            {total.toLocaleString()} rows
          </span>

          {/* Insert row */}
          <button
            onClick={() => {
              setEditingRow(null);
              setShowRowEditor(true);
            }}
            className="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Insert Row
          </button>

          {/* Refresh */}
          <button
            onClick={loadRows}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Refresh data"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Error bar */}
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-500/30 flex items-center justify-between">
          <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10">
            {/* Column headers */}
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              {/* Checkbox column */}
              <th className="w-10 px-3 py-2 text-left sticky left-0 bg-gray-50 dark:bg-gray-800 z-20">
                <input
                  type="checkbox"
                  checked={rows.length > 0 && selectedRows.size === rows.length}
                  onChange={toggleSelectAll}
                  className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500"
                />
              </th>
              {/* Row number */}
              <th className="w-10 px-2 py-2 text-right text-gray-400 dark:text-gray-500 font-normal sticky left-10 bg-gray-50 dark:bg-gray-800 z-20 border-r border-gray-200 dark:border-gray-700">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col.name}
                  onClick={() => handleSort(col.name)}
                  className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none whitespace-nowrap transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono">{col.name}</span>
                    <span className="text-[9px] text-gray-400 dark:text-gray-500 font-normal">
                      {col.type_name || col.type}
                    </span>
                    {col.enum_values && col.enum_values.length > 0 && (
                      <span
                        className="text-[9px] text-orange-500 dark:text-orange-400 font-normal"
                        title={`Enum values: ${col.enum_values.join(", ")}`}
                      >
                        enum
                      </span>
                    )}
                    {col.nullable && (
                      <span className="text-[9px] text-yellow-500 font-normal">?</span>
                    )}
                    {sortBy === col.name && (
                      <svg
                        className={`w-3 h-3 text-brand-500 transition-transform ${
                          sortDir === "desc" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
              {/* Actions column */}
              <th className="w-20 px-3 py-2 text-right text-gray-400 dark:text-gray-500 font-normal sticky right-0 bg-gray-50 dark:bg-gray-800 z-20">
                Actions
              </th>
            </tr>

            {/* Column filters */}
            {showFilters && (
              <tr className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-1 sticky left-0 bg-gray-50/80 dark:bg-gray-800/80 z-20" />
                <th className="px-2 py-1 sticky left-10 bg-gray-50/80 dark:bg-gray-800/80 z-20 border-r border-gray-200 dark:border-gray-700" />
                {columns.map((col) => (
                  <th key={col.name} className="px-1 py-1">
                    <input
                      type="text"
                      placeholder={`Filter ${col.name}...`}
                      value={columnFilters[col.name] ?? ""}
                      onChange={(e) => {
                        setColumnFilters((prev) => ({
                          ...prev,
                          [col.name]: e.target.value,
                        }));
                        setPage(1);
                      }}
                      className="w-full px-2 py-1 text-[10px] border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </th>
                ))}
                <th className="px-3 py-1 sticky right-0 bg-gray-50/80 dark:bg-gray-800/80 z-20">
                  <button
                    onClick={() => {
                      setColumnFilters({});
                      setPage(1);
                    }}
                    className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    Clear
                  </button>
                </th>
              </tr>
            )}
          </thead>

          <tbody>
            {isLoading ? (
              // Skeleton loading
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="px-3 py-2.5 sticky left-0 bg-white dark:bg-gray-900">
                    <div className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </td>
                  <td className="px-2 py-2.5 sticky left-10 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-700/50">
                    <div className="w-4 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto" />
                  </td>
                  {columns.map((col) => (
                    <td key={col.name} className="px-3 py-2.5">
                      <div
                        className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                        style={{ width: `${40 + Math.random() * 60}%` }}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2.5 sticky right-0 bg-white dark:bg-gray-900" />
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 3}
                  className="text-center py-12 text-gray-400 dark:text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <span className="text-sm">No rows found</span>
                    <button
                      onClick={() => {
                        setEditingRow(null);
                        setShowRowEditor(true);
                      }}
                      className="mt-2 text-xs text-brand-500 hover:text-brand-600 font-medium"
                    >
                      Insert first row
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                const rowId = getRowId(row);
                const isSelected = selectedRows.has(rowId);
                return (
                  <tr
                    key={rowId || idx}
                    className={`border-b border-gray-100 dark:border-gray-700/50 transition-colors ${
                      isSelected
                        ? "bg-brand-50/50 dark:bg-brand-500/5"
                        : "hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-3 py-1.5 sticky left-0 bg-white dark:bg-gray-900 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRowSelection(rowId)}
                        className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500"
                      />
                    </td>
                    {/* Row number */}
                    <td className="px-2 py-1.5 text-right text-gray-400 dark:text-gray-500 tabular-nums sticky left-10 bg-white dark:bg-gray-900 z-10 border-r border-gray-100 dark:border-gray-700/50">
                      {((page - 1) * perPage) + idx + 1}
                    </td>
                    {/* Data cells */}
                    {columns.map((col) => {
                      const isCellActive =
                        editingCell?.row === rowId &&
                        editingCell?.col === col.name;
                      const value = row[col.name];
                      const isNull = isNullValue(value);
                      const isAutoIncrementPK =
                        col.name === primaryKey &&
                        col.auto_increment;

                      return (
                        <td
                          key={col.name}
                          onClick={(e) => handleCellClick(e, row, col.name)}
                          className={`px-3 py-1.5 max-w-[300px] transition-colors ${
                            isAutoIncrementPK
                              ? "cursor-default"
                              : "cursor-pointer"
                          } ${
                            isCellActive
                              ? "bg-brand-50 dark:bg-brand-500/10 ring-2 ring-inset ring-brand-500"
                              : isAutoIncrementPK
                              ? ""
                              : "hover:bg-blue-50/50 dark:hover:bg-blue-500/5"
                          }`}
                        >
                          <span
                            className={`block truncate font-mono ${
                              isNull
                                ? "text-gray-400 dark:text-gray-500 italic"
                                : col.name === primaryKey
                                ? "text-brand-600 dark:text-brand-400 font-medium"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                            title={formatCellValue(value)}
                          >
                            {formatCellValue(value)}
                          </span>
                        </td>
                      );
                    })}
                    {/* Actions */}
                    <td className="px-3 py-1.5 sticky right-0 bg-white dark:bg-gray-900 z-10">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditRow(row)}
                          className="p-1 rounded text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                          title="Edit row"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(row)}
                          className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          title="Delete row"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Rows per page:
          </span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {[25, 50, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
            Page {page} of {lastPage}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page <= 1}
              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
              title="First page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= lastPage}
              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => setPage(lastPage)}
              disabled={page >= lastPage}
              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Last page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cell Editor Popover */}
      {editingCell && schema && (() => {
        const col = schema.columns.find(c => c.name === editingCell.col);
        if (!col) return null;
        return (
          <CellEditor
            column={col}
            value={editingCell.value}
            anchorRect={editingCell.anchorRect}
            onSave={handleCellSave}
            onCancel={() => setEditingCell(null)}
            isSaving={isCellSaving}
          />
        );
      })()}

      {/* Row Editor Modal */}
      {showRowEditor && schema && (
        <RowEditorModal
          tableName={tableName}
          columns={schema.columns}
          primaryKey={primaryKey}
          editingRow={editingRow}
          onClose={() => {
            setShowRowEditor(false);
            setEditingRow(null);
          }}
          onSaved={handleRowSaved}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingRow(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Row"
        message={`Are you sure you want to delete this row${
          deletingRow ? ` (${primaryKey}: ${getRowId(deletingRow)})` : ""
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
