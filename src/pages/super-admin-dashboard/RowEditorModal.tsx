import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { api } from "../../api/client";

interface ColumnInfo {
  name: string;
  type: string;
  type_name: string;
  nullable: boolean;
  default: string | null;
  auto_increment: boolean;
  enum_values?: string[];
}

interface RowEditorModalProps {
  tableName: string;
  columns: ColumnInfo[];
  primaryKey: string;
  editingRow: Record<string, unknown> | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function RowEditorModal({
  tableName,
  columns,
  primaryKey,
  editingRow,
  onClose,
  onSaved,
}: RowEditorModalProps) {
  const isEditing = editingRow !== null;

  // Initialize form values
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    columns.forEach((col) => {
      if (isEditing) {
        const val = editingRow[col.name];
        initial[col.name] = val === null || val === undefined ? "" : String(val);
      } else {
        // Skip auto_increment columns for new rows
        if (!col.auto_increment) {
          initial[col.name] = col.default ?? "";
        }
      }
    });
    return initial;
  });

  const [nullFields, setNullFields] = useState<Set<string>>(() => {
    const set = new Set<string>();
    if (isEditing) {
      columns.forEach((col) => {
        if (editingRow[col.name] === null || editingRow[col.name] === undefined) {
          set.add(col.name);
        }
      });
    }
    return set;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Build payload
      const payload: Record<string, unknown> = {};
      columns.forEach((col) => {
        // Skip auto_increment on create
        if (!isEditing && col.auto_increment) return;
        // Skip primary key on update (handled by URL)
        if (isEditing && col.name === primaryKey && col.auto_increment) return;
        // Skip timestamp columns (handled by backend)
        if (
          !isEditing &&
          (col.name === "created_at" || col.name === "updated_at")
        )
          return;

        if (nullFields.has(col.name)) {
          payload[col.name] = null;
        } else {
          const val = formValues[col.name];
          // Convert to appropriate types
          const typeName = (col.type_name || col.type || "").toLowerCase();
          if (
            (typeName.includes("int") || typeName === "bigint" || typeName === "smallint" || typeName === "tinyint") &&
            val !== ""
          ) {
            payload[col.name] = Number(val);
          } else if (
            (typeName === "boolean" || typeName === "tinyint(1)") &&
            val !== ""
          ) {
            payload[col.name] = val === "true" || val === "1" ? 1 : 0;
          } else {
            payload[col.name] = val || null;
          }
        }
      });

      if (isEditing) {
        const id =
          editingRow[primaryKey] !== undefined
            ? String(editingRow[primaryKey])
            : "";
        await api.put(`admin/database/tables/${tableName}/rows/${id}`, payload);
      } else {
        await api.post(`admin/database/tables/${tableName}/rows`, payload);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save row.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleNull = (colName: string) => {
    setNullFields((prev) => {
      const next = new Set(prev);
      if (next.has(colName)) {
        next.delete(colName);
      } else {
        next.add(colName);
      }
      return next;
    });
  };

  const getInputType = (col: ColumnInfo): string => {
    const typeName = (col.type_name || col.type || "").toLowerCase();
    if (typeName.includes("date") && !typeName.includes("datetime") && !typeName.includes("timestamp")) {
      return "date";
    }
    if (typeName.includes("datetime") || typeName.includes("timestamp")) {
      return "datetime-local";
    }
    if (typeName.includes("time") && !typeName.includes("timestamp")) {
      return "time";
    }
    if (
      typeName.includes("int") ||
      typeName === "bigint" ||
      typeName === "smallint" ||
      typeName === "tinyint" ||
      typeName === "decimal" ||
      typeName === "float" ||
      typeName === "double"
    ) {
      return "number";
    }
    return "text";
  };

  const isTextArea = (col: ColumnInfo): boolean => {
    const typeName = (col.type_name || col.type || "").toLowerCase();
    return (
      typeName === "text" ||
      typeName === "longtext" ||
      typeName === "mediumtext" ||
      typeName === "json"
    );
  };

  const isEnum = (col: ColumnInfo): boolean => {
    const typeName = (col.type_name || col.type || "").toLowerCase();
    return (
      (typeName === "enum" || typeName === "set") &&
      !!col.enum_values &&
      col.enum_values.length > 0
    );
  };

  const isBoolean = (col: ColumnInfo): boolean => {
    const typeName = (col.type_name || col.type || "").toLowerCase();
    return typeName === "tinyint(1)" || typeName === "boolean" || typeName === "bool";
  };

  return (
    <Modal isOpen={true} onClose={onClose} className="max-w-2xl">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {isEditing ? "Edit Row" : "Insert Row"}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 font-mono">
          {tableName}
          {isEditing && ` — ${primaryKey}: ${editingRow[primaryKey]}`}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg">
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
            {columns.map((col) => {
              // Skip auto_increment primary key on create
              if (!isEditing && col.auto_increment) return null;
              // Skip timestamps on create
              if (
                !isEditing &&
                (col.name === "created_at" || col.name === "updated_at")
              )
                return null;

              const isNull = nullFields.has(col.name);
              const isDisabled =
                isEditing && col.name === primaryKey && col.auto_increment;

              return (
                <div key={col.name} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 font-mono flex items-center gap-2">
                      {col.name}
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">
                        {col.type_name || col.type}
                      </span>
                      {isEnum(col) && (
                        <span className="text-[10px] text-orange-500 dark:text-orange-400 font-normal">
                          enum
                        </span>
                      )}
                      {!col.nullable && (
                        <span className="text-[10px] text-red-400 font-normal">
                          required
                        </span>
                      )}
                    </label>
                    {col.nullable && (
                      <button
                        type="button"
                        onClick={() => toggleNull(col.name)}
                        className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                          isNull
                            ? "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        NULL
                      </button>
                    )}
                  </div>
                  {isEnum(col) ? (
                    <select
                      value={isNull ? "" : formValues[col.name] ?? ""}
                      onChange={(e) =>
                        setFormValues((prev) => ({
                          ...prev,
                          [col.name]: e.target.value,
                        }))
                      }
                      disabled={isDisabled || isNull}
                      className={`w-full px-3 py-2 text-xs font-mono border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 ${
                        isNull
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 italic border-gray-200 dark:border-gray-600"
                          : isDisabled
                          ? "bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed"
                          : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      {col.nullable && <option value="">— none —</option>}
                      {!col.nullable && !formValues[col.name] && (
                        <option value="">Select {col.name}...</option>
                      )}
                      {col.enum_values!.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  ) : isBoolean(col) ? (
                    <select
                      value={isNull ? "" : formValues[col.name] ?? ""}
                      onChange={(e) =>
                        setFormValues((prev) => ({
                          ...prev,
                          [col.name]: e.target.value,
                        }))
                      }
                      disabled={isDisabled || isNull}
                      className={`w-full px-3 py-2 text-xs font-mono border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 ${
                        isNull
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 italic border-gray-200 dark:border-gray-600"
                          : isDisabled
                          ? "bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed"
                          : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      {col.nullable && <option value="">— none —</option>}
                      <option value="1">true</option>
                      <option value="0">false</option>
                    </select>
                  ) : isTextArea(col) ? (
                    <textarea
                      value={isNull ? "" : formValues[col.name] ?? ""}
                      onChange={(e) =>
                        setFormValues((prev) => ({
                          ...prev,
                          [col.name]: e.target.value,
                        }))
                      }
                      disabled={isDisabled || isNull}
                      rows={3}
                      className={`w-full px-3 py-2 text-xs font-mono border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 resize-y ${
                        isNull
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 italic border-gray-200 dark:border-gray-600"
                          : isDisabled
                          ? "bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed"
                          : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
                      }`}
                      placeholder={isNull ? "NULL" : `Enter ${col.name}...`}
                    />
                  ) : (
                    <input
                      type={getInputType(col)}
                      value={isNull ? "" : formValues[col.name] ?? ""}
                      onChange={(e) =>
                        setFormValues((prev) => ({
                          ...prev,
                          [col.name]: e.target.value,
                        }))
                      }
                      disabled={isDisabled || isNull}
                      className={`w-full px-3 py-2 text-xs font-mono border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 ${
                        isNull
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 italic border-gray-200 dark:border-gray-600"
                          : isDisabled
                          ? "bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed"
                          : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
                      }`}
                      placeholder={isNull ? "NULL" : `Enter ${col.name}...`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
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
                  Saving...
                </span>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Insert Row"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
