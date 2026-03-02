import { useEffect, useState, useCallback } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link, useNavigate } from "react-router";
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

interface NotificationDropdownProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  rok_expired: { icon: "!", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
  rok_expiring: { icon: "⏰", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
  dnevni_izvestaj_reminder: { icon: "📋", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
};

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
  return `pre ${diffDay} dana`;
}

export default function NotificationDropdown({
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
  onClose: externalOnClose,
}: NotificationDropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get<{ count: number }>("notifications/unread-count");
      setUnreadCount(res.count);
    } catch {
      // silent
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: NotificationItem[] }>("notifications?per_page=10");
      setNotifications(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  function toggleDropdown() {
    if (externalOnToggle) {
      externalOnToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  }

  function closeDropdown() {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  }

  const handleClick = () => {
    toggleDropdown();
  };

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
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
      setUnreadCount(0);
    } catch {
      // silent
    }
  };

  const cfg = (type: string) => typeConfig[type] || typeConfig.rok_expiring;

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[260px] mt-[25px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Obaveštenja
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                {unreadCount}
              </span>
            )}
          </h5>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                title="Označi sve kao pročitano"
              >
                Označi sve
              </button>
            )}
            <button
              onClick={toggleDropdown}
              className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar flex-1">
          {loading && notifications.length === 0 && (
            <li className="flex items-center justify-center py-8 text-gray-400 dark:text-gray-500">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Učitavanje...
            </li>
          )}

          {!loading && notifications.length === 0 && (
            <li className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-40">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
              </svg>
              <span className="text-sm">Nemate obaveštenja</span>
            </li>
          )}

          {notifications.map((n) => {
            const c = cfg(n.type);
            return (
              <li key={n.id}>
                <button
                  onClick={() => {
                    if (!n.read_at) handleMarkAsRead(n.id);
                    closeDropdown();
                    const link = n.data?.link;
                    if (link) {
                      navigate(link);
                    }
                  }}
                  className={`flex w-full gap-3 rounded-lg border-b border-gray-100 p-3 text-left transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 ${
                    !n.read_at ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${c.bg}`}>
                    {n.type === "rok_expired" ? "⚠️" : n.type === "dnevni_izvestaj_reminder" ? "📋" : "⏰"}
                  </span>
                  <span className="block min-w-0 flex-1">
                    <span className="mb-1 flex items-center gap-2">
                      <span className={`text-sm font-medium ${!n.read_at ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                        {n.title}
                      </span>
                      {!n.read_at && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {n.message}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                      {n.data?.preduzece && (
                        <>
                          <span>{n.data.preduzece}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                        </>
                      )}
                      <span>{timeAgo(n.created_at)}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <Link
          to="/centar-obavestenja"
          onClick={closeDropdown}
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Pogledaj sva obaveštenja
        </Link>
      </Dropdown>
    </div>
  );
}
