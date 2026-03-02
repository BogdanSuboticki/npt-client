"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PovredeIcon } from "../../icons";
import { api } from "../../api/client";

export default function PovredeWidget() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({ total: 0, recent: 0, needsAttention: 0 });

  useEffect(() => {
    api
      .get<{ total: number; recent: number; needsAttention: number }>(
        "dashboard/povrede-stats"
      )
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleClick = () => {
    navigate("/povrede");
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-2xl border border-gray-200 bg-white p-5 cursor-pointer transition-all hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] md:p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl dark:bg-red-900/20">
            <PovredeIcon className="text-red-600 size-6 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Povrede
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ukupno: {stats.total}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ukupno</p>
          <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white/90">
            {stats.total}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Poslednjih 30 dana
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white/90">
            {stats.recent}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Zahtevaju pažnju
          </p>
          <p className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">
            {stats.needsAttention}
          </p>
        </div>
      </div>
    </div>
  );
}
