import { useEffect, useState } from "react";
import { api } from "../../api/client";

interface TableInfo {
  name: string;
  row_count: number;
  column_count: number;
}

interface Stats {
  total_tables: number;
  total_rows: number;
  total_users: number;
  total_companies: number;
  table_counts: Record<string, number>;
}

interface StatsOverviewProps {
  tables: TableInfo[];
  onSelectTable: (tableName: string) => void;
}

export default function StatsOverview({
  tables,
  onSelectTable,
}: StatsOverviewProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get<{ data: Stats }>("admin/database/stats");
        setStats(res.data);
      } catch {
        // Silently fail; tables info is still available
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  const sortedBySize = [...tables].sort(
    (a, b) => b.row_count - a.row_count
  );
  const maxRows = sortedBySize[0]?.row_count || 1;

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Tables"
          value={stats?.total_tables ?? tables.length}
          icon={
            <svg
              className="w-5 h-5"
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
          }
          color="brand"
          isLoading={isLoading}
        />
        <StatCard
          label="Total Rows"
          value={stats?.total_rows ?? tables.reduce((s, t) => s + t.row_count, 0)}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          }
          color="success"
          isLoading={isLoading}
        />
        <StatCard
          label="Users"
          value={stats?.total_users ?? "—"}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
          color="warning"
          isLoading={isLoading}
        />
        <StatCard
          label="Companies"
          value={stats?.total_companies ?? "—"}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
          color="error"
          isLoading={isLoading}
        />
      </div>

      {/* Table Size Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Table Sizes
        </h3>
        <div className="space-y-2.5">
          {sortedBySize.map((table) => (
            <button
              key={table.name}
              onClick={() => onSelectTable(table.name)}
              className="w-full group text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {table.name}
                </span>
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span>{table.column_count} cols</span>
                  <span className="font-medium text-gray-600 dark:text-gray-300 tabular-nums">
                    {table.row_count.toLocaleString()} rows
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300 group-hover:bg-brand-600"
                  style={{
                    width: `${Math.max(
                      (table.row_count / maxRows) * 100,
                      1
                    )}%`,
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  isLoading,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: "brand" | "success" | "warning" | "error";
  isLoading: boolean;
}) {
  const bgColorMap = {
    brand: "bg-brand-50 dark:bg-brand-500/10",
    success: "bg-green-50 dark:bg-green-500/10",
    warning: "bg-yellow-50 dark:bg-yellow-500/10",
    error: "bg-red-50 dark:bg-red-500/10",
  };
  const iconColorMap = {
    brand: "text-brand-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${bgColorMap[color]}`}
        >
          <span className={iconColorMap[color]}>{icon}</span>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          {isLoading ? (
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-0.5" />
          ) : (
            <p className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
