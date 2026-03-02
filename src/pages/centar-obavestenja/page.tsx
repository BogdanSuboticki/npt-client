import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { api } from "../../api/client";

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  data: Record<string, any> | null;
  firma_pib: string | null;
  read_at: string | null;
  created_at: string;
}

interface PaginatedResponse {
  data: NotificationItem[];
  current_page: number;
  last_page: number;
  total: number;
}

const typeConfig: Record<string, { label: string; emoji: string; badgeClass: string }> = {
  rok_expired: {
    label: "Istekao rok",
    emoji: "⚠️",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  rok_expiring: {
    label: "Rok ističe",
    emoji: "⏰",
    badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  dnevni_izvestaj_reminder: {
    label: "Dnevni izveštaj",
    emoji: "📋",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
};

type FilterType = "all" | "rok_expired" | "rok_expiring" | "dnevni_izvestaj_reminder" | "unread";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "upravo";
  if (diffMin < 60) return `pre ${diffMin} min`;
  if (diffHr < 24) return `pre ${diffHr}h`;
  if (diffDay === 1) return "juče";
  if (diffDay < 7) return `pre ${diffDay} dana`;
  return new Date(dateStr).toLocaleDateString("sr-Latn-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("sr-Latn-RS", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CentarObavestenjaPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse>(`notifications?page=${page}`);
      setNotifications(res.data);
      setCurrentPage(res.current_page);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get<{ count: number }>("notifications/unread-count");
      setUnreadCount(res.count);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.post(`notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silent
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post("notifications/read-all", {});
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch {
      // silent
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.del(`notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setTotal((prev) => prev - 1);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch {
      // silent
    }
  };

  const handleBulkMarkRead = async () => {
    for (const id of selectedIds) {
      const n = notifications.find((x) => x.id === id);
      if (n && !n.read_at) {
        await handleMarkAsRead(id);
      }
    }
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)));
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read_at;
    return n.type === filter;
  });

  const cfg = (type: string) => typeConfig[type] || typeConfig.rok_expiring;

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Sva" },
    { key: "unread", label: "Nepročitana" },
    { key: "rok_expired", label: "Istekli rokovi" },
    { key: "rok_expiring", label: "Rokovi ističu" },
    { key: "dnevni_izvestaj_reminder", label: "Dnevni izveštaji" },
  ];

  return (
    <>
      <PageMeta
        title="Centar obaveštenja | NPT"
        description="Pregled svih obaveštenja"
      />
      <PageBreadcrumb pageTitle="" />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Centar obaveštenja
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {total} obaveštenja ukupno
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    {unreadCount} nepročitano
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedIds.size > 0 && (
                <button
                  onClick={handleBulkMarkRead}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Označi ({selectedIds.size})
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Označi sve kao pročitano
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); setSelectedIds(new Set()); }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f.key
                    ? "bg-brand-500 text-white shadow-sm dark:bg-brand-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin h-8 w-8 text-brand-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-gray-400 dark:text-gray-600">
                <path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {filter === "all" ? "Nemate obaveštenja" : "Nema obaveštenja za ovaj filter"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
              {filter === "all"
                ? "Obaveštenja o rokovima i dnevnim izveštajima će se pojaviti ovde."
                : "Pokušajte sa drugim filterom."}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Select All */}
            <div className="flex items-center gap-3 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
              <input
                type="checkbox"
                checked={selectedIds.size === filteredNotifications.length && filteredNotifications.length > 0}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
              />
              <span>Izaberi sve</span>
            </div>

            {filteredNotifications.map((n) => {
              const c = cfg(n.type);
              return (
                <div
                  key={n.id}
                  className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all ${
                    !n.read_at
                      ? "border-blue-200 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-900/10"
                      : "border-gray-200 bg-white dark:border-gray-700 dark:bg-[#1D2939]"
                  } hover:shadow-md`}
                >
                  {/* Checkbox */}
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(n.id)}
                      onChange={() => toggleSelect(n.id)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>

                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl cursor-pointer ${
                      !n.read_at ? "ring-2 ring-blue-200 dark:ring-blue-800/50" : ""
                    } ${n.type === "rok_expired" ? "bg-red-100 dark:bg-red-900/30" : n.type === "dnevni_izvestaj_reminder" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-orange-100 dark:bg-orange-900/30"}`}
                    onClick={() => {
                      if (!n.read_at) handleMarkAsRead(n.id);
                      const link = n.data?.link;
                      if (link) {
                        navigate(link);
                      }
                    }}
                  >
                    {c.emoji}
                  </div>

                  {/* Content */}
                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => {
                      if (!n.read_at) handleMarkAsRead(n.id);
                      const link = n.data?.link;
                      if (link) {
                        navigate(link);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold ${!n.read_at ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                        {n.title}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${c.badgeClass}`}>
                        {c.label}
                      </span>
                      {!n.read_at && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>

                    <p className={`text-sm mb-2 ${!n.read_at ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>
                      {n.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                      {n.data?.preduzece && (
                        <span className="inline-flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          </svg>
                          {n.data.preduzece}
                        </span>
                      )}
                      {n.data?.rok && (
                        <span className="inline-flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          Rok: {new Date(n.data.rok).toLocaleDateString("sr-Latn-RS")}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {timeAgo(n.created_at)}
                      </span>
                      <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
                        {formatFullDate(n.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    {n.data?.link && (
                      <button
                        onClick={() => {
                          if (!n.read_at) handleMarkAsRead(n.id);
                          navigate(n.data!.link);
                        }}
                        className="rounded-lg p-2 text-gray-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20 dark:hover:text-brand-400"
                        title="Otvori stranicu"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </button>
                    )}
                    <div className="opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
                      {!n.read_at && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                          title="Označi kao pročitano"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        title="Obriši"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => fetchNotifications(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Prethodna
                </button>
                <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  {currentPage} / {lastPage}
                </span>
                <button
                  onClick={() => fetchNotifications(currentPage + 1)}
                  disabled={currentPage === lastPage}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Sledeća
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
