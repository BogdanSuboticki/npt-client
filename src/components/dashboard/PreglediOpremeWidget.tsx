"use client";

import { useMemo } from "react";
import { useNavigate } from "react-router";
import { PreglediOpremeIcon } from "../../icons";

// Sample data - in a real app, this would come from an API
const samplePreglediOpreme = [
  {
    id: 1,
    nazivOpreme: "Kompresor vazduha",
    datumPregleda: new Date("2024-01-01"),
    datumNarednogPregleda: new Date("2024-07-01"),
    status: "Ispravno",
  },
  {
    id: 2,
    nazivOpreme: "Kran mostni",
    datumPregleda: new Date("2024-02-15"),
    datumNarednogPregleda: new Date("2024-08-15"),
    status: "Ispravno",
  },
  {
    id: 3,
    nazivOpreme: "Ventilator industrijski",
    datumPregleda: new Date("2024-03-10"),
    datumNarednogPregleda: new Date("2024-06-10"),
    status: "Neispravno",
  },
  {
    id: 4,
    nazivOpreme: "Pumpa za vodu",
    datumPregleda: new Date("2024-01-30"),
    datumNarednogPregleda: new Date("2026-01-30"),
    status: "Ispravno",
  },
  {
    id: 5,
    nazivOpreme: "Generator električni",
    datumPregleda: new Date("2024-02-05"),
    datumNarednogPregleda: new Date("2025-02-05"),
    status: "Ispravno",
  },
];

export default function PreglediOpremeWidget() {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const total = samplePreglediOpreme.length;
    const upcoming = samplePreglediOpreme.filter(
      (p) =>
        p.datumNarednogPregleda <= thirtyDaysFromNow &&
        p.datumNarednogPregleda >= now
    ).length;
    const needsRepair = samplePreglediOpreme.filter(
      (p) => p.status === "Neispravno"
    ).length;
    const expired = samplePreglediOpreme.filter(
      (p) => p.datumNarednogPregleda < now
    ).length;

    return { total, upcoming, needsRepair, expired };
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

