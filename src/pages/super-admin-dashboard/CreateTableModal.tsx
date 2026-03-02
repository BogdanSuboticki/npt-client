import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { api } from "../../api/client";

const COLUMN_TYPES = [
  { value: "string", label: "String (VARCHAR)" },
  { value: "text", label: "Text" },
  { value: "integer", label: "Integer" },
  { value: "biginteger", label: "Big Integer" },
  { value: "boolean", label: "Boolean" },
  { value: "decimal", label: "Decimal" },
  { value: "float", label: "Float" },
  { value: "enum", label: "Enum" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "DateTime" },
  { value: "timestamp", label: "Timestamp" },
  { value: "time", label: "Time" },
  { value: "json", label: "JSON" },
  { value: "longtext", label: "Long Text" },
  { value: "uuid", label: "UUID" },
];

interface ColumnDef {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string;
  enumValues: string[];
}

interface CreateTableModalProps {
  onClose: () => void;
  onCreated: (tableName: string) => void;
}

let nextId = 1;

export default function CreateTableModal({
  onClose,
  onCreated,
}: CreateTableModalProps) {
  const [tableName, setTableName] = useState("");
  const [addId, setAddId] = useState(true);
  const [addTimestamps, setAddTimestamps] = useState(true);
  const [columns, setColumns] = useState<ColumnDef[]>([
    { id: String(nextId++), name: "", type: "string", nullable: false, defaultValue: "", enumValues: [] },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameError =
    tableName && !/^[a-z][a-z0-9_]*$/.test(tableName)
      ? "Use lowercase letters, numbers, underscores. Must start with a letter."
      : null;

  const addColumn = () => {
    setColumns((prev) => [
      ...prev,
      { id: String(nextId++), name: "", type: "string", nullable: false, defaultValue: "", enumValues: [] },
    ]);
  };

  const removeColumn = (id: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== id));
  };

  const updateColumn = (id: string, field: keyof ColumnDef, value: string | boolean | string[]) => {
    setColumns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, [field]: value };
        // Reset enum values when switching away from enum type
        if (field === "type" && value !== "enum") {
          updated.enumValues = [];
        }
        return updated;
      })
    );
  };

  const addEnumValueToColumn = (colId: string, val: string) => {
    setColumns((prev) =>
      prev.map((c) => {
        if (c.id !== colId || c.enumValues.includes(val)) return c;
        return { ...c, enumValues: [...c.enumValues, val] };
      })
    );
  };

  const removeEnumValueFromColumn = (colId: string, val: string) => {
    setColumns((prev) =>
      prev.map((c) => {
        if (c.id !== colId) return c;
        return { ...c, enumValues: c.enumValues.filter((v) => v !== val) };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableName || nameError) return;

    // Filter out empty column names
    const validColumns = columns
      .filter((c) => c.name.trim() !== "")
      .map((c) => ({
        name: c.name,
        type: c.type,
        nullable: c.nullable,
        default: c.defaultValue || null,
        ...(c.type === "enum" && c.enumValues.length > 0
          ? { enum_values: c.enumValues }
          : {}),
      }));

    // Validate enum columns have values
    const enumWithoutValues = validColumns.find(
      (c) => c.type === "enum" && (!("enum_values" in c) || !(c as { enum_values?: string[] }).enum_values?.length)
    );
    if (enumWithoutValues) {
      setError(`Enum column "${enumWithoutValues.name}" requires at least one value.`);
      return;
    }

    if (validColumns.length === 0 && !addId) {
      setError("Add at least one column.");
      return;
    }

    // Check for duplicate column names
    const names = validColumns.map((c) => c.name);
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
    if (duplicates.length > 0) {
      setError(`Duplicate column name: ${duplicates[0]}`);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await api.post("admin/database/tables", {
        name: tableName,
        columns: validColumns,
        add_id: addId,
        add_timestamps: addTimestamps,
      });
      onCreated(tableName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create table.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} className="max-w-2xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Table
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Define the table name and its columns
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg">
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Table Name */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Table Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="e.g. user_preferences"
              className="w-full px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              autoFocus
            />
            {nameError && (
              <p className="mt-1 text-[10px] text-red-500">{nameError}</p>
            )}
          </div>

          {/* Options */}
          <div className="flex items-center gap-6 mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addId}
                onChange={(e) => setAddId(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Auto-increment <code className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">id</code> primary key
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addTimestamps}
                onChange={(e) => setAddTimestamps(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Add <code className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">created_at</code> / <code className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">updated_at</code>
              </span>
            </label>
          </div>

          {/* Columns */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Columns
              </label>
              <button
                type="button"
                onClick={addColumn}
                className="text-xs text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Column
              </button>
            </div>

            {/* Column header */}
            <div className="grid grid-cols-[1fr_140px_60px_100px_32px] gap-2 mb-1.5 px-1">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Name</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Type</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Null</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Default</span>
              <span />
            </div>

            <div className="max-h-[40vh] overflow-y-auto space-y-2 pr-1">
              {/* Show id row if enabled */}
              {addId && (
                <div className="grid grid-cols-[1fr_140px_60px_100px_32px] gap-2 items-center opacity-50">
                  <div className="px-3 py-1.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500">
                    id
                  </div>
                  <div className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500">
                    Big Integer
                  </div>
                  <div className="px-3 py-1.5 text-xs text-gray-400 text-center">
                    No
                  </div>
                  <div className="px-3 py-1.5 text-xs text-gray-400 italic">
                    auto
                  </div>
                  <div />
                </div>
              )}

              {columns.map((col) => (
                <div key={col.id} className="space-y-1.5">
                  <div className="grid grid-cols-[1fr_140px_60px_100px_32px] gap-2 items-center">
                    {/* Name */}
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) =>
                        updateColumn(
                          col.id,
                          "name",
                          e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                        )
                      }
                      placeholder="column_name"
                      className="px-3 py-1.5 text-xs font-mono border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    {/* Type */}
                    <select
                      value={col.type}
                      onChange={(e) => updateColumn(col.id, "type", e.target.value)}
                      className="px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      {COLUMN_TYPES.map((ct) => (
                        <option key={ct.value} value={ct.value}>
                          {ct.label}
                        </option>
                      ))}
                    </select>
                    {/* Nullable */}
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={col.nullable}
                        onChange={(e) => updateColumn(col.id, "nullable", e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500"
                      />
                    </div>
                    {/* Default */}
                    {col.type === "enum" && col.enumValues.length > 0 ? (
                      <select
                        value={col.defaultValue}
                        onChange={(e) => updateColumn(col.id, "defaultValue", e.target.value)}
                        className="px-2 py-1.5 text-xs font-mono border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="">—</option>
                        {col.enumValues.map((val) => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={col.defaultValue}
                        onChange={(e) => updateColumn(col.id, "defaultValue", e.target.value)}
                        placeholder="—"
                        className="px-2 py-1.5 text-xs font-mono border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    )}
                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeColumn(col.id)}
                      className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Remove column"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {/* Enum values editor - shown when type is enum */}
                  {col.type === "enum" && (
                    <div className="ml-1 pl-3 border-l-2 border-orange-200 dark:border-orange-500/30">
                      <div className="flex items-center gap-1.5 mb-1">
                        <input
                          type="text"
                          placeholder="Add enum value..."
                          className="flex-1 px-2 py-1 text-[11px] font-mono border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) {
                                addEnumValueToColumn(col.id, val);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }
                          }}
                        />
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          Press Enter
                        </span>
                      </div>
                      {col.enumValues.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {col.enumValues.map((val) => (
                            <span
                              key={val}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30 rounded"
                            >
                              {val}
                              <button
                                type="button"
                                onClick={() => removeEnumValueFromColumn(col.id, val)}
                                className="p-0.5 rounded hover:bg-orange-200 dark:hover:bg-orange-500/20"
                              >
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-orange-400 dark:text-orange-500 italic">
                          Add at least one enum value
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Show timestamps if enabled */}
              {addTimestamps && (
                <>
                  <div className="grid grid-cols-[1fr_140px_60px_100px_32px] gap-2 items-center opacity-50">
                    <div className="px-3 py-1.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500">
                      created_at
                    </div>
                    <div className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500">
                      Timestamp
                    </div>
                    <div className="px-3 py-1.5 text-xs text-gray-400 text-center">
                      Yes
                    </div>
                    <div className="px-3 py-1.5 text-xs text-gray-400 italic">
                      auto
                    </div>
                    <div />
                  </div>
                  <div className="grid grid-cols-[1fr_140px_60px_100px_32px] gap-2 items-center opacity-50">
                    <div className="px-3 py-1.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500">
                      updated_at
                    </div>
                    <div className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500">
                      Timestamp
                    </div>
                    <div className="px-3 py-1.5 text-xs text-gray-400 text-center">
                      Yes
                    </div>
                    <div className="px-3 py-1.5 text-xs text-gray-400 italic">
                      auto
                    </div>
                    <div />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!tableName || !!nameError || isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Table"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
