import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { api } from "../../api/client";

interface TableInfo {
  name: string;
  row_count: number;
  column_count: number;
}

interface CreateEnumModalProps {
  tables: TableInfo[];
  onClose: () => void;
  onCreated: (table: string, column: string) => void;
}

export default function CreateEnumModal({
  tables,
  onClose,
  onCreated,
}: CreateEnumModalProps) {
  const [selectedTable, setSelectedTable] = useState("");
  const [columnName, setColumnName] = useState("");
  const [enumValues, setEnumValues] = useState<string[]>([]);
  const [enumInput, setEnumInput] = useState("");
  const [nullable, setNullable] = useState(true);
  const [defaultValue, setDefaultValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameError =
    columnName && !/^[a-z][a-z0-9_]*$/.test(columnName)
      ? "Use lowercase letters, numbers, underscores. Must start with a letter."
      : null;

  const addEnumValue = () => {
    const val = enumInput.trim();
    if (!val) return;
    if (enumValues.some((v) => v.toLowerCase() === val.toLowerCase())) {
      setError(`Value "${val}" already exists.`);
      return;
    }
    setEnumValues((prev) => [...prev, val]);
    setEnumInput("");
    setError(null);
  };

  const removeEnumValue = (val: string) => {
    setEnumValues((prev) => prev.filter((v) => v !== val));
    // Clear default if it was the removed value
    if (defaultValue === val) setDefaultValue("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) {
      setError("Please select a table.");
      return;
    }
    if (!columnName || nameError) {
      setError(nameError || "Please enter a column name.");
      return;
    }
    if (enumValues.length === 0) {
      setError("Please add at least one enum value.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await api.post(`admin/database/tables/${selectedTable}/columns`, {
        name: columnName,
        type: "enum",
        nullable,
        default: defaultValue || null,
        enum_values: enumValues,
      });
      onCreated(selectedTable, columnName);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create enum column."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} className="max-w-lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
            <svg
              className="w-5 h-5 text-orange-500"
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
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Enum
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add a new enum column to an existing table
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg flex items-center justify-between">
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Table Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Table <span className="text-red-400">*</span>
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select a table...</option>
              {tables.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Column Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Column Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value.toLowerCase())}
              placeholder="e.g. status, vrsta, tip"
              className="w-full px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              autoFocus
            />
            {nameError && (
              <p className="mt-1 text-[10px] text-red-500">{nameError}</p>
            )}
          </div>

          {/* Enum Values */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Enum Values <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={enumInput}
                onChange={(e) => {
                  setEnumInput(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addEnumValue();
                  }
                }}
                placeholder="Type a value and press Enter"
                className="flex-1 px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <button
                type="button"
                onClick={addEnumValue}
                disabled={!enumInput.trim()}
                className="px-3 py-2 text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>

            {/* Values display */}
            {enumValues.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {enumValues.map((val, idx) => (
                  <div
                    key={val}
                    className="flex items-center gap-2 group"
                  >
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums w-5 text-right flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-xs font-mono bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/20 rounded-lg">
                      {val}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEnumValue(val)}
                      className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                      title="Remove value"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">
                No values added yet. Add at least one value for the enum.
              </p>
            )}
          </div>

          {/* Nullable & Default row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nullable
              </label>
              <button
                type="button"
                onClick={() => setNullable(!nullable)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                  nullable ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 mt-0.5 ${
                    nullable ? "translate-x-5 ml-0.5" : "translate-x-0.5"
                  }`}
                />
              </button>
              <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                {nullable ? "Column can be NULL" : "Column is required"}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Value
              </label>
              {enumValues.length > 0 ? (
                <select
                  value={defaultValue}
                  onChange={(e) => setDefaultValue(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">None</option>
                  {enumValues.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  disabled
                  placeholder="Add values first"
                  className="w-full px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                />
              )}
            </div>
          </div>

          {/* Preview */}
          {selectedTable && columnName && enumValues.length > 0 && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1.5">
                Preview
              </p>
              <p className="text-xs font-mono text-gray-900 dark:text-white">
                <span className="text-blue-600 dark:text-blue-400">ALTER TABLE</span>{" "}
                <span className="text-orange-600 dark:text-orange-400">{selectedTable}</span>{" "}
                <span className="text-blue-600 dark:text-blue-400">ADD</span>{" "}
                <span className="text-green-600 dark:text-green-400">{columnName}</span>{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  ENUM({enumValues.map((v) => `'${v}'`).join(", ")})
                </span>
                {nullable && (
                  <span className="text-gray-500"> NULL</span>
                )}
                {defaultValue && (
                  <span className="text-gray-500"> DEFAULT '{defaultValue}'</span>
                )}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !selectedTable ||
                !columnName ||
                !!nameError ||
                enumValues.length === 0 ||
                isSaving
              }
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Enum"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
