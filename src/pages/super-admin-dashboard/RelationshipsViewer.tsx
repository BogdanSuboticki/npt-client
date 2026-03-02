import { useEffect, useState } from "react";
import { api } from "../../api/client";

interface Relationship {
  from_table: string;
  from_columns: string[];
  to_table: string;
  to_columns: string[];
  name: string | null;
}

interface RelationshipsViewerProps {
  onSelectTable: (tableName: string) => void;
}

export default function RelationshipsViewer({
  onSelectTable,
}: RelationshipsViewerProps) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState<"source" | "target" | "flat">("source");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await api.get<{ data: Relationship[] }>(
          "admin/database/relationships"
        );
        setRelationships(res.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load relationships."
        );
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filtered = relationships.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.from_table.toLowerCase().includes(q) ||
      r.to_table.toLowerCase().includes(q) ||
      r.from_columns.some((c) => c.toLowerCase().includes(q)) ||
      r.to_columns.some((c) => c.toLowerCase().includes(q))
    );
  });

  // Group relationships
  const grouped = (() => {
    if (groupBy === "flat") return null;
    const map = new Map<string, Relationship[]>();
    filtered.forEach((r) => {
      const key = groupBy === "source" ? r.from_table : r.to_table;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  })();

  // Get unique tables for the mini ER diagram
  const uniqueTables = new Set<string>();
  relationships.forEach((r) => {
    uniqueTables.add(r.from_table);
    uniqueTables.add(r.to_table);
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-500">{error}</div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Table Relationships
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {relationships.length} foreign key relationships across{" "}
            {uniqueTables.size} tables
          </p>
        </div>
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
              placeholder="Filter relationships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 w-48"
            />
          </div>

          {/* Group toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            {(["source", "target", "flat"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setGroupBy(mode)}
                className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors capitalize ${
                  groupBy === mode
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {mode === "source"
                  ? "By Source"
                  : mode === "target"
                  ? "By Target"
                  : "Flat"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {relationships.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No foreign key relationships found in the database.
          </p>
        </div>
      ) : groupBy === "flat" ? (
        /* Flat view */
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                  #
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                  Source Table
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                  Column
                </th>
                <th className="px-4 py-2.5 text-center font-medium text-gray-500 dark:text-gray-400">
                  &nbsp;
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                  Target Table
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                  Column
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-2.5 text-gray-400 tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => onSelectTable(r.from_table)}
                      className="font-mono text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {r.from_table}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-600 dark:text-gray-400">
                    {r.from_columns.join(", ")}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <svg
                      className="w-4 h-4 mx-auto text-gray-400"
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
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => onSelectTable(r.to_table)}
                      className="font-mono text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {r.to_table}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-600 dark:text-gray-400">
                    {r.to_columns.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grouped view */
        <div className="space-y-4">
          {grouped?.map(([table, rels]) => (
            <div
              key={table}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => onSelectTable(table)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
              >
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
                    d="M3 10h18M3 14h18M10 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z"
                  />
                </svg>
                <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                  {table}
                </span>
                <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                  {rels.length}
                </span>
              </button>
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {rels.map((r, idx) => (
                  <div key={idx} className="px-4 py-2.5 flex items-center gap-3">
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      {groupBy === "source"
                        ? r.from_columns.join(", ")
                        : r.to_columns.join(", ")}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0"
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
                    <button
                      onClick={() =>
                        onSelectTable(
                          groupBy === "source" ? r.to_table : r.from_table
                        )
                      }
                      className="font-mono text-xs text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {groupBy === "source" ? r.to_table : r.from_table}
                      .
                      {groupBy === "source"
                        ? r.to_columns.join(", ")
                        : r.from_columns.join(", ")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
