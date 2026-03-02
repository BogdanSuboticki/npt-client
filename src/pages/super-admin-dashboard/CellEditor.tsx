import { useState, useRef, useEffect, useCallback } from "react";

interface ColumnInfo {
  name: string;
  type: string;
  type_name: string;
  nullable: boolean;
  default: string | null;
  auto_increment: boolean;
  enum_values?: string[];
}

interface CellEditorProps {
  column: ColumnInfo;
  value: unknown;
  anchorRect: DOMRect;
  onSave: (value: unknown) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function CellEditor({
  column,
  value,
  anchorRect,
  onSave,
  onCancel,
  isSaving,
}: CellEditorProps) {
  const isNull = value === null || value === undefined;
  const [isNullChecked, setIsNullChecked] = useState(isNull);
  const [inputValue, setInputValue] = useState<string>(
    isNull ? "" : typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>(null);

  const typeName = (column.type_name || column.type || "").toLowerCase();
  const editorType = getEditorType(typeName, column.enum_values);

  // Position the panel
  const [position, setPosition] = useState({ top: 0, left: 0, placement: "below" as "below" | "above" });

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const panelRect = panel.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    let top = anchorRect.bottom + 4;
    let placement: "below" | "above" = "below";

    // If not enough room below, place above
    if (top + panelRect.height > viewportH - 8) {
      top = anchorRect.top - panelRect.height - 4;
      placement = "above";
    }

    // Clamp top
    top = Math.max(8, Math.min(top, viewportH - panelRect.height - 8));

    // Horizontal: align left edge to cell, but clamp to viewport
    let left = anchorRect.left;
    if (left + panelRect.width > viewportW - 8) {
      left = viewportW - panelRect.width - 8;
    }
    left = Math.max(8, left);

    setPosition({ top, left, placement });
  }, [anchorRect]);

  // Focus input on open
  useEffect(() => {
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        if ("select" in inputRef.current && editorType !== "boolean" && editorType !== "select") {
          (inputRef.current as HTMLInputElement).select();
        }
      }
    });
  }, [editorType]);

  // Close on click outside
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onCancel]);

  // Close on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onCancel]);

  const handleSave = useCallback(() => {
    if (isNullChecked) {
      onSave(null);
      return;
    }

    let finalValue: unknown = inputValue;

    // Type coercion
    if (editorType === "number" && inputValue !== "") {
      finalValue = Number(inputValue);
    } else if (editorType === "boolean") {
      finalValue = inputValue === "true" || inputValue === "1" ? 1 : 0;
    } else if (inputValue === "") {
      finalValue = column.nullable ? null : "";
    }

    onSave(finalValue);
  }, [isNullChecked, inputValue, editorType, column.nullable, onSave]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Cmd/Ctrl+Enter to save
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
    // Plain Enter saves for single-line inputs
    if (e.key === "Enter" && !e.shiftKey && editorType !== "textarea") {
      e.preventDefault();
      handleSave();
    }
    // Tab to save and move on
    if (e.key === "Tab") {
      e.preventDefault();
      handleSave();
    }
  };

  const hasChanged =
    isNullChecked !== isNull ||
    (!isNullChecked && inputValue !== (isNull ? "" : typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)));

  return (
    <>
      {/* Backdrop overlay - transparent but captures clicks */}
      <div className="fixed inset-0 z-[60]" />

      {/* Editor panel */}
      <div
        ref={panelRef}
        className="fixed z-[61] w-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-xl"
        style={{ top: position.top, left: position.left }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono font-medium text-gray-900 dark:text-white truncate">
              {column.name}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex-shrink-0">
              {column.type_name || column.type}
            </span>
            {column.enum_values && column.enum_values.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex-shrink-0">
                {column.enum_values.length} values
              </span>
            )}
          </div>
          <button
            onClick={onCancel}
            className="p-0.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-3">
          {/* NULL toggle for nullable columns */}
          {column.nullable && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Set as NULL
              </span>
              <button
                type="button"
                onClick={() => setIsNullChecked(!isNullChecked)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                  isNullChecked
                    ? "bg-brand-500"
                    : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5 ${
                    isNullChecked ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          )}

          {/* Input area */}
          <div className={isNullChecked ? "opacity-40 pointer-events-none" : ""}>
            {editorType === "select" && column.enum_values && column.enum_values.length > 0 ? (
              <select
                ref={inputRef as React.RefObject<HTMLSelectElement>}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isNullChecked}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                {column.nullable && <option value="">— none —</option>}
                {column.enum_values.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            ) : editorType === "boolean" ? (
              <select
                ref={inputRef as React.RefObject<HTMLSelectElement>}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isNullChecked}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="1">true</option>
                <option value="0">false</option>
              </select>
            ) : editorType === "textarea" ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isNullChecked}
                rows={5}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-y"
                placeholder={isNullChecked ? "NULL" : `Enter ${column.name}...`}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={editorType === "number" ? "number" : editorType === "date" ? "date" : editorType === "datetime" ? "datetime-local" : editorType === "time" ? "time" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isNullChecked}
                step={editorType === "number" ? "any" : undefined}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder={isNullChecked ? "NULL" : `Enter ${column.name}...`}
              />
            )}
          </div>

          {/* Hint text */}
          <div className="mt-2 text-[10px] text-gray-400 dark:text-gray-500">
            {editorType === "textarea" ? (
              <span><kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-mono">Ctrl+Enter</kbd> to save</span>
            ) : (
              <span><kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-mono">Enter</kbd> to save &middot; <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-mono">Esc</kbd> to cancel</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-lg">
          <div className="text-[10px] text-gray-400 dark:text-gray-500">
            {isNullChecked ? (
              <span className="italic">Value will be NULL</span>
            ) : hasChanged ? (
              <span className="text-yellow-600 dark:text-yellow-400">Modified</span>
            ) : (
              <span>No changes</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanged || isSaving}
              className="px-2.5 py-1 text-[11px] font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {isSaving ? (
                <>
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Determines the editor type based on the SQL column type.
 */
function getEditorType(
  typeName: string,
  enumValues?: string[]
): "text" | "number" | "boolean" | "date" | "datetime" | "time" | "textarea" | "select" {
  // Enum/set columns with known values → dropdown select
  if (
    (typeName === "enum" || typeName === "set") &&
    enumValues &&
    enumValues.length > 0
  ) {
    return "select";
  }
  if (
    typeName === "tinyint(1)" ||
    typeName === "boolean" ||
    typeName === "bool"
  ) {
    return "boolean";
  }
  if (
    typeName === "text" ||
    typeName === "longtext" ||
    typeName === "mediumtext" ||
    typeName === "tinytext" ||
    typeName === "json" ||
    typeName === "jsonb"
  ) {
    return "textarea";
  }
  if (
    typeName.includes("int") ||
    typeName === "bigint" ||
    typeName === "smallint" ||
    typeName === "tinyint" ||
    typeName === "decimal" ||
    typeName === "float" ||
    typeName === "double" ||
    typeName === "numeric" ||
    typeName === "real"
  ) {
    return "number";
  }
  if (typeName === "date") {
    return "date";
  }
  if (
    typeName === "datetime" ||
    typeName === "timestamp"
  ) {
    return "datetime";
  }
  if (typeName === "time") {
    return "time";
  }
  return "text";
}
