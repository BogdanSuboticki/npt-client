import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { api } from "../../api/client";

const COLUMN_TYPES = [
  { value: "string", label: "String (VARCHAR)", description: "Up to 255 characters" },
  { value: "text", label: "Text", description: "Long text content" },
  { value: "integer", label: "Integer", description: "Whole numbers" },
  { value: "biginteger", label: "Big Integer", description: "Large whole numbers" },
  { value: "boolean", label: "Boolean", description: "True or false" },
  { value: "decimal", label: "Decimal", description: "Precise decimal (10,2)" },
  { value: "float", label: "Float", description: "Floating point number" },
  { value: "enum", label: "Enum", description: "One of a fixed set of values" },
  { value: "date", label: "Date", description: "YYYY-MM-DD" },
  { value: "datetime", label: "DateTime", description: "YYYY-MM-DD HH:MM:SS" },
  { value: "timestamp", label: "Timestamp", description: "Unix timestamp" },
  { value: "time", label: "Time", description: "HH:MM:SS" },
  { value: "json", label: "JSON", description: "JSON data" },
  { value: "longtext", label: "Long Text", description: "Very long text content" },
  { value: "uuid", label: "UUID", description: "Universally unique identifier" },
];

interface AddColumnModalProps {
  tableName: string;
  existingColumns: string[];
  onClose: () => void;
  onAdded: () => void;
}

export default function AddColumnModal({
  tableName,
  existingColumns,
  onClose,
  onAdded,
}: AddColumnModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("string");
  const [nullable, setNullable] = useState(true);
  const [defaultValue, setDefaultValue] = useState("");
  const [afterColumn, setAfterColumn] = useState("");
  const [enumValues, setEnumValues] = useState<string[]>([]);
  const [enumInput, setEnumInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameError = name && !/^[a-z][a-z0-9_]*$/.test(name)
    ? "Use lowercase letters, numbers, underscores. Must start with a letter."
    : null;

  const addEnumValue = () => {
    const val = enumInput.trim();
    if (val && !enumValues.includes(val)) {
      setEnumValues((prev) => [...prev, val]);
      setEnumInput("");
    }
  };

  const removeEnumValue = (val: string) => {
    setEnumValues((prev) => prev.filter((v) => v !== val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || nameError) return;
    if (type === "enum" && enumValues.length === 0) {
      setError("Enum type requires at least one value.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await api.post(`admin/database/tables/${tableName}/columns`, {
        name,
        type,
        nullable,
        default: defaultValue || null,
        after: afterColumn || null,
        ...(type === "enum" ? { enum_values: enumValues } : {}),
      });
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add column.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} className="max-w-lg">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg">
            <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add Column
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {tableName}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg">
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Column Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Column Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase())}
              placeholder="e.g. user_email"
              className="w-full px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              autoFocus
            />
            {nameError && (
              <p className="mt-1 text-[10px] text-red-500">{nameError}</p>
            )}
          </div>

          {/* Column Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type <span className="text-red-400">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {COLUMN_TYPES.map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
              {COLUMN_TYPES.find((ct) => ct.value === type)?.description}
            </p>
          </div>

          {/* Enum Values */}
          {type === "enum" && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Enum Values <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={enumInput}
                  onChange={(e) => setEnumInput(e.target.value)}
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
                  className="px-3 py-2 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              {enumValues.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {enumValues.map((val) => (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30 rounded-md"
                    >
                      {val}
                      <button
                        type="button"
                        onClick={() => removeEnumValue(val)}
                        className="p-0.5 rounded hover:bg-orange-200 dark:hover:bg-orange-500/20 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">
                  No values added yet. Add at least one value for the enum.
                </p>
              )}
            </div>
          )}

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
              {type === "enum" && enumValues.length > 0 ? (
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
                  value={defaultValue}
                  onChange={(e) => setDefaultValue(e.target.value)}
                  placeholder="None"
                  className="w-full px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              )}
            </div>
          </div>

          {/* After Column */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Position (after column)
            </label>
            <select
              value={afterColumn}
              onChange={(e) => setAfterColumn(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">End of table</option>
              {existingColumns.map((col) => (
                <option key={col} value={col}>
                  After &quot;{col}&quot;
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name || !!nameError || isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add Column"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
