import { useEffect, useState } from "react";
import { api } from "../../api/client";
import AddColumnModal from "./AddColumnModal";
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

interface IndexInfo {
  name: string;
  columns: string[];
  type: string;
  unique: boolean;
  primary: boolean;
}

interface ForeignKeyInfo {
  name: string;
  columns: string[];
  foreign_table: string;
  foreign_columns: string[];
}

interface SchemaData {
  table: string;
  columns: ColumnInfo[];
  indexes: IndexInfo[];
  foreign_keys: ForeignKeyInfo[];
  primary_key: string[] | null;
  row_count: number;
}

interface SchemaViewerProps {
  tableName: string;
  onRefreshTables?: () => void;
}

export default function SchemaViewer({ tableName, onRefreshTables }: SchemaViewerProps) {
  const [schema, setSchema] = useState<SchemaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<
    "columns" | "indexes" | "foreign_keys"
  >("columns");
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showDropColumnConfirm, setShowDropColumnConfirm] = useState(false);
  const [columnToDrop, setColumnToDrop] = useState<string | null>(null);

  const loadSchema = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<{ data: SchemaData }>(
        `admin/database/tables/${tableName}/schema`
      );
      setSchema(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load schema.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchema();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName]);

  const handleColumnAdded = () => {
    setShowAddColumn(false);
    loadSchema();
    onRefreshTables?.();
  };

  const handleDropColumnClick = (colName: string) => {
    setColumnToDrop(colName);
    setShowDropColumnConfirm(true);
  };

  const handleDropColumnConfirm = async () => {
    if (!columnToDrop) return;
    try {
      await api.del(`admin/database/tables/${tableName}/columns/${columnToDrop}`);
      loadSchema();
      onRefreshTables?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to drop column.");
    }
    setColumnToDrop(null);
    setShowDropColumnConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  if (!schema) return null;

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Table Info Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
            <svg
              className="w-5 h-5 text-brand-500"
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
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white font-mono">
              {schema.table}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {schema.columns.length} columns &middot;{" "}
              {schema.row_count.toLocaleString()} rows &middot;{" "}
              {schema.indexes.length} indexes &middot;{" "}
              {schema.foreign_keys.length} foreign keys
            </p>
          </div>
        </div>
      </div>

      {/* Section Tabs + Add Column */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 w-fit">
          <SectionTab
            active={activeSection === "columns"}
            onClick={() => setActiveSection("columns")}
            count={schema.columns.length}
          >
            Columns
          </SectionTab>
          <SectionTab
            active={activeSection === "indexes"}
            onClick={() => setActiveSection("indexes")}
            count={schema.indexes.length}
          >
            Indexes
          </SectionTab>
          <SectionTab
            active={activeSection === "foreign_keys"}
            onClick={() => setActiveSection("foreign_keys")}
            count={schema.foreign_keys.length}
          >
            Foreign Keys
          </SectionTab>
        </div>
        <button
          onClick={() => setShowAddColumn(true)}
          className="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Column
        </button>
      </div>

      {/* Columns */}
      {activeSection === "columns" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                  #
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                  Column
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                  Type
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                  Nullable
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                  Default
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                  Attributes
                </th>
                <th className="px-4 py-2.5 text-right font-medium text-gray-500 dark:text-gray-400 w-12">
                </th>
              </tr>
            </thead>
            <tbody>
              {schema.columns.map((col, idx) => {
                const isPK = schema.primary_key?.includes(col.name);
                const isFK = schema.foreign_keys.some((fk) =>
                  fk.columns.includes(col.name)
                );
                const fkRef = schema.foreign_keys.find((fk) =>
                  fk.columns.includes(col.name)
                );

                return (
                  <tr
                    key={col.name}
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 group"
                  >
                    <td className="px-4 py-2.5 text-gray-400 dark:text-gray-500 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {isPK && (
                          <span className="flex items-center justify-center w-4 h-4 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded text-[8px] font-bold" title="Primary Key">
                            PK
                          </span>
                        )}
                        {isFK && (
                          <span className="flex items-center justify-center w-4 h-4 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-[8px] font-bold" title="Foreign Key">
                            FK
                          </span>
                        )}
                        <span className="font-mono font-medium text-gray-900 dark:text-white">
                          {col.name}
                        </span>
                      </div>
                      {fkRef && (
                        <span className="text-[10px] text-blue-500 dark:text-blue-400 font-mono mt-0.5 block ml-6">
                          → {fkRef.foreign_table}.{fkRef.foreign_columns.join(", ")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-1.5 py-0.5 rounded inline-block w-fit">
                          {col.type_name || col.type}
                        </span>
                        {col.enum_values && col.enum_values.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {col.enum_values.map((val) => (
                              <span
                                key={val}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20"
                              >
                                {val}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      {col.nullable ? (
                        <span className="text-yellow-600 dark:text-yellow-400">Yes</span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-600 dark:text-gray-400">
                      {col.default !== null && col.default !== undefined ? (
                        <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          {col.default}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {col.auto_increment && (
                          <Badge color="green">auto_increment</Badge>
                        )}
                        {isPK && <Badge color="yellow">primary</Badge>}
                        {isFK && <Badge color="blue">foreign</Badge>}
                        {col.enum_values && col.enum_values.length > 0 && (
                          <Badge color="orange">enum ({col.enum_values.length})</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {!isPK && !col.auto_increment && (
                        <button
                          onClick={() => handleDropColumnClick(col.name)}
                          className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                          title={`Drop column ${col.name}`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Indexes */}
      {activeSection === "indexes" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {schema.indexes.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 dark:text-gray-500">
              No indexes found for this table.
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                    Name
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                    Columns
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                    Type
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                    Properties
                  </th>
                </tr>
              </thead>
              <tbody>
                {schema.indexes.map((idx) => (
                  <tr
                    key={idx.name}
                    className="border-b border-gray-100 dark:border-gray-700/50"
                  >
                    <td className="px-4 py-2.5 font-mono text-gray-900 dark:text-white">
                      {idx.name}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-600 dark:text-gray-400">
                      {(idx.columns || []).join(", ")}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">
                      {idx.type || "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        {idx.primary && <Badge color="yellow">primary</Badge>}
                        {idx.unique && !idx.primary && (
                          <Badge color="purple">unique</Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Foreign Keys */}
      {activeSection === "foreign_keys" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {schema.foreign_keys.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 dark:text-gray-500">
              No foreign keys found for this table.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {schema.foreign_keys.map((fk, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-gray-900 dark:text-white font-medium">
                      {fk.name || `FK #${idx + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded">
                      {schema.table}.{fk.columns.join(", ")}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                    <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                      {fk.foreign_table}.{fk.foreign_columns.join(", ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Add Column Modal */}
      {showAddColumn && schema && (
        <AddColumnModal
          tableName={tableName}
          existingColumns={schema.columns.map((c) => c.name)}
          onClose={() => setShowAddColumn(false)}
          onAdded={handleColumnAdded}
        />
      )}

      {/* Drop Column Confirmation */}
      <ConfirmModal
        isOpen={showDropColumnConfirm}
        onClose={() => {
          setShowDropColumnConfirm(false);
          setColumnToDrop(null);
        }}
        onConfirm={handleDropColumnConfirm}
        title="Drop Column"
        message={`Are you sure you want to drop the column "${columnToDrop}" from "${tableName}"? This will permanently delete all data in this column. This cannot be undone.`}
        confirmText="Drop Column"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

function SectionTab({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
        active
          ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      }`}
    >
      {children}
      <span
        className={`text-[10px] px-1 py-0.5 rounded-full min-w-[18px] text-center ${
          active
            ? "bg-gray-100 dark:bg-gray-500 text-gray-600 dark:text-gray-200"
            : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "green" | "yellow" | "blue" | "purple" | "orange";
}) {
  const colorClasses = {
    green:
      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
    yellow:
      "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    purple:
      "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
    orange:
      "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
  };

  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
}
