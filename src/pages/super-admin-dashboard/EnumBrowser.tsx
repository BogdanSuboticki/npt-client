import { useEffect, useState, useCallback } from "react";
import { api } from "../../api/client";

interface EnumColumn {
  table: string;
  column: string;
  type: string;
  values: string[];
  nullable: boolean;
  default: string | null;
}

interface EnumBrowserProps {
  selectedEnum: { table: string; column: string } | null;
  onSelectTable: (table: string) => void;
  onEnumsChanged?: () => void;
  onCreateEnum?: () => void;
}

export default function EnumBrowser({
  selectedEnum,
  onSelectTable,
  onEnumsChanged,
  onCreateEnum,
}: EnumBrowserProps) {
  const [enums, setEnums] = useState<EnumColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEnums = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<{ data: EnumColumn[] }>("admin/database/enums");
      setEnums(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load enums.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnums();
  }, [loadEnums]);

  // Group enums by table
  const groupedByTable: Record<string, EnumColumn[]> = {};
  enums.forEach((e) => {
    if (!groupedByTable[e.table]) groupedByTable[e.table] = [];
    groupedByTable[e.table].push(e);
  });

  // If a specific enum is selected, show its detail view
  const selectedEnumData = selectedEnum
    ? enums.find(
        (e) =>
          e.table === selectedEnum.table && e.column === selectedEnum.column
      )
    : null;

  const handleEnumSaved = () => {
    loadEnums();
    onEnumsChanged?.();
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-full inline-block mb-3">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadEnums}
            className="mt-3 text-xs text-brand-500 hover:text-brand-600 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (enums.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full inline-block mb-3">
            <EnumIcon className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No enum columns found in the database.
          </p>
          {onCreateEnum && (
            <button
              onClick={onCreateEnum}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create First Enum
            </button>
          )}
        </div>
      </div>
    );
  }

  // Detail view for a selected enum
  if (selectedEnumData) {
    return (
      <EnumDetailView
        enumData={selectedEnumData}
        onSelectTable={onSelectTable}
        onSaved={handleEnumSaved}
      />
    );
  }

  // Overview: all enums grouped by table
  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Summary header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
            <EnumIcon className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              All Enum Columns
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {enums.length} enum column{enums.length !== 1 ? "s" : ""} across{" "}
              {Object.keys(groupedByTable).length} table
              {Object.keys(groupedByTable).length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onCreateEnum && (
            <button
              onClick={onCreateEnum}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Enum
            </button>
          )}
          <button
            onClick={loadEnums}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Refresh"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Enum Columns" value={enums.length} color="orange" />
        <StatCard
          label="Tables with Enums"
          value={Object.keys(groupedByTable).length}
          color="blue"
        />
        <StatCard
          label="Total Values"
          value={enums.reduce((sum, e) => sum + e.values.length, 0)}
          color="purple"
        />
      </div>

      {/* Grouped by table */}
      <div className="space-y-4">
        {Object.entries(groupedByTable).map(([table, cols]) => (
          <div
            key={table}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <TableIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                <span className="text-xs font-mono font-semibold text-gray-900 dark:text-white">
                  {table}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {cols.length} enum{cols.length !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={() => onSelectTable(table)}
                className="text-[10px] text-brand-500 hover:text-brand-600 font-medium"
              >
                View table &rarr;
              </button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {cols.map((col) => (
                <div
                  key={`${col.table}-${col.column}`}
                  className="px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <EnumIcon className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-mono font-medium text-gray-900 dark:text-white">
                        {col.column}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        {col.type}
                      </span>
                      {col.nullable && (
                        <span className="text-[10px] text-yellow-600 dark:text-yellow-400">
                          nullable
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {col.values.length} values
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {col.values.map((val) => (
                      <span
                        key={val}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md border bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/20"
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====================================================================
   EnumDetailView — full CRUD for a single enum column's values
   ==================================================================== */

function EnumDetailView({
  enumData,
  onSelectTable,
  onSaved,
}: {
  enumData: EnumColumn;
  onSelectTable: (table: string) => void;
  onSaved: () => void;
}) {
  // Editable state: list of values, each with original + current name
  const [editValues, setEditValues] = useState<
    { original: string; current: string }[]
  >(() => enumData.values.map((v) => ({ original: v, current: v })));
  const [newValue, setNewValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reset edit state when selectedEnum changes
  useEffect(() => {
    setEditValues(enumData.values.map((v) => ({ original: v, current: v })));
    setNewValue("");
    setSaveError(null);
    setSaveSuccess(false);
  }, [enumData.table, enumData.column, enumData.values]);

  const hasChanges =
    editValues.length !== enumData.values.length ||
    editValues.some((v) => v.original !== v.current) ||
    editValues.some(
      (v, i) => v.original !== enumData.values[i]
    );

  const hasDuplicates = (() => {
    const names = editValues.map((v) => v.current.trim().toLowerCase());
    return names.some((n, i) => n !== "" && names.indexOf(n) !== i);
  })();

  const hasEmpty = editValues.some((v) => v.current.trim() === "");

  const handleAddValue = () => {
    const val = newValue.trim();
    if (!val) return;
    if (
      editValues.some(
        (v) => v.current.trim().toLowerCase() === val.toLowerCase()
      )
    ) {
      setSaveError(`Value "${val}" already exists.`);
      return;
    }
    setEditValues((prev) => [...prev, { original: "", current: val }]);
    setNewValue("");
    setSaveError(null);
  };

  const handleRemoveValue = (idx: number) => {
    setEditValues((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRenameValue = (idx: number, newName: string) => {
    setEditValues((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, current: newName } : v))
    );
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    setEditValues((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const handleMoveDown = (idx: number) => {
    if (idx === editValues.length - 1) return;
    setEditValues((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const handleReset = () => {
    setEditValues(enumData.values.map((v) => ({ original: v, current: v })));
    setNewValue("");
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (editValues.length === 0) {
      setSaveError("At least one value is required.");
      return;
    }
    if (hasEmpty) {
      setSaveError("Values cannot be empty.");
      return;
    }
    if (hasDuplicates) {
      setSaveError("Duplicate values are not allowed.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    // Build the renames array (only for values that existed before and were renamed)
    const renames: { from: string; to: string }[] = [];
    editValues.forEach((v) => {
      if (v.original && v.original !== v.current) {
        renames.push({ from: v.original, to: v.current });
      }
    });

    const newValues = editValues.map((v) => v.current.trim());

    try {
      await api.put(
        `admin/database/enums/${enumData.table}/${enumData.column}`,
        {
          values: newValues,
          renames: renames.length > 0 ? renames : undefined,
        }
      );
      setSaveSuccess(true);
      onSaved();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to update enum values."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
          <EnumIcon className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white font-mono">
              {enumData.column}
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              {enumData.type}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <button
              onClick={() => onSelectTable(enumData.table)}
              className="font-mono text-brand-500 hover:text-brand-600 hover:underline"
            >
              {enumData.table}
            </button>
            <span className="mx-1.5">&middot;</span>
            {enumData.nullable ? "Nullable" : "Required"}
            {enumData.default !== null && (
              <>
                <span className="mx-1.5">&middot;</span>
                Default:{" "}
                <span className="font-mono">{enumData.default}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Manage Values Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Manage Values
          </h3>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {editValues.length} value{editValues.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="p-4">
          {/* Error / Success messages */}
          {saveError && (
            <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg flex items-center justify-between">
              <p className="text-xs text-red-600 dark:text-red-400">
                {saveError}
              </p>
              <button
                onClick={() => setSaveError(null)}
                className="text-red-400 hover:text-red-600 ml-2"
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
          {saveSuccess && (
            <div className="mb-3 p-2.5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg">
              <p className="text-xs text-green-600 dark:text-green-400">
                Enum values updated successfully. Existing data has been
                migrated.
              </p>
            </div>
          )}

          {/* Values list */}
          <div className="space-y-1.5 mb-4">
            {editValues.map((val, idx) => {
              const isRenamed =
                val.original !== "" && val.original !== val.current;
              const isNew = val.original === "";
              const isDuplicate =
                editValues.some(
                  (v, i) =>
                    i !== idx &&
                    v.current.trim().toLowerCase() ===
                      val.current.trim().toLowerCase()
                ) && val.current.trim() !== "";

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2 group ${
                    isDuplicate
                      ? "ring-1 ring-red-300 dark:ring-red-500/50 rounded-lg"
                      : ""
                  }`}
                >
                  {/* Index */}
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums w-5 text-right flex-shrink-0">
                    {idx + 1}
                  </span>

                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === editValues.length - 1}
                      className="p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Editable value */}
                  <input
                    type="text"
                    value={val.current}
                    onChange={(e) => handleRenameValue(idx, e.target.value)}
                    className={`flex-1 px-3 py-1.5 text-xs font-mono border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 ${
                      isDuplicate
                        ? "border-red-300 dark:border-red-500/50 bg-red-50 dark:bg-red-500/5 text-red-700 dark:text-red-300"
                        : isNew
                        ? "border-green-300 dark:border-green-500/30 bg-green-50 dark:bg-green-500/5 text-green-800 dark:text-green-200"
                        : isRenamed
                        ? "border-yellow-300 dark:border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/5 text-yellow-800 dark:text-yellow-200"
                        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  />

                  {/* Status badges */}
                  <div className="flex items-center gap-1 flex-shrink-0 min-w-[60px]">
                    {isNew && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 font-medium">
                        new
                      </span>
                    )}
                    {isRenamed && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-medium"
                        title={`Renamed from "${val.original}"`}
                      >
                        renamed
                      </span>
                    )}
                    {isDuplicate && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-medium">
                        duplicate
                      </span>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveValue(idx)}
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add new value */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <input
              type="text"
              value={newValue}
              onChange={(e) => {
                setNewValue(e.target.value);
                setSaveError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddValue();
                }
              }}
              placeholder="Add new value..."
              className="flex-1 px-3 py-2 text-xs font-mono border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
            <button
              onClick={handleAddValue}
              disabled={!newValue.trim()}
              className="px-3 py-2 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add
            </button>
          </div>
        </div>

        {/* Action bar */}
        {hasChanges && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-yellow-50/50 dark:bg-yellow-500/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-xs text-yellow-700 dark:text-yellow-400">
                Unsaved changes
                {editValues.some(
                  (v) => v.original !== "" && v.original !== v.current
                ) && (
                  <span className="ml-1 text-yellow-600 dark:text-yellow-500">
                    — renamed values will update existing data
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={
                  isSaving || hasDuplicates || hasEmpty || editValues.length === 0
                }
                className="px-4 py-1.5 text-xs font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <svg
                      className="w-3 h-3 animate-spin"
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
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Metadata card */}
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Column Details
          </h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <DetailItem label="Table" value={enumData.table} mono />
          <DetailItem label="Column" value={enumData.column} mono />
          <DetailItem label="Type" value={enumData.type} />
          <DetailItem
            label="Nullable"
            value={enumData.nullable ? "Yes" : "No"}
          />
          <DetailItem
            label="Default"
            value={enumData.default ?? "—"}
            mono={enumData.default !== null}
          />
          <DetailItem
            label="Values Count"
            value={String(enumData.values.length)}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Small helper components ---------- */

function DetailItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
        {label}
      </dt>
      <dd
        className={`text-xs text-gray-900 dark:text-white ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "orange" | "blue" | "purple";
}) {
  const colorMap = {
    orange:
      "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    purple:
      "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-2xl font-semibold tabular-nums ${colorMap[color]}`}>
        {value}
      </p>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function EnumIcon({ className }: { className?: string }) {
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
