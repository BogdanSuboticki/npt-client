"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PreglediOpremeIcon } from "../../icons";
import { api } from "../../api/client";

export default function PreglediOpremeWidget() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    needsRepair: 0,
    expired: 0,
  });

  useEffect(() => {
    api
      .get<{
        total: number;
        upcoming: number;
        needsRepair: number;
        expired: number;
      }>("dashboard/pregledi-opreme-stats")
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleClick = () => {
    navigate("/pregledi-opreme");
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-2xl border border-gray-200 bg-white p-5 cursor-pointer transition-all hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] md:p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/20">
            <PreglediOpremeIcon className="text-green-600 size-6 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Pregledi opreme
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ukupno: {stats.total}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Narednih 30 dana
          </p>
          <p className="mt-1 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
            {stats.upcoming}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Zahtevaju popravku
          </p>
          <p className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">
            {stats.needsRepair}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Istekli</p>
          <p className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">
            {stats.expired}
          </p>
        </div>
      </div>
    </div>
  );
}
