"use client";

import { useMemo } from "react";
import { useNavigate } from "react-router";
import { LekarskiPreglediIcon } from "../../icons";

// Sample data - in a real app, this would come from an API
const sampleLekarskiPregledi = [
  {
    id: 1,
    zaposleni: "Marko Petrović",
    datumLekarskog: new Date("2024-01-15"),
    datumNarednogLekarskog: new Date("2024-07-15"),
    aktivan: true,
  },
  {
    id: 2,
    zaposleni: "Ana Jovanović",
    datumLekarskog: new Date("2024-02-20"),
    datumNarednogLekarskog: new Date("2024-08-20"),
    aktivan: true,
  },
  {
    id: 3,
    zaposleni: "Stefan Nikolić",
    datumLekarskog: new Date("2024-03-10"),
    datumNarednogLekarskog: new Date("2024-09-10"),
    aktivan: true,
  },
  {
    id: 4,
    zaposleni: "Marija Đorđević",
    datumLekarskog: new Date("2024-01-05"),
    datumNarednogLekarskog: new Date("2024-07-05"),
    aktivan: false,
  },
  {
    id: 5,
    zaposleni: "Dragan Simić",
    datumLekarskog: new Date("2024-02-28"),
    datumNarednogLekarskog: new Date("2024-08-28"),
    aktivan: true,
  },
  {
    id: 6,
    zaposleni: "Jelena Popović",
    datumLekarskog: new Date("2024-03-15"),
    datumNarednogLekarskog: new Date("2024-09-15"),
    aktivan: true,
  },
];

export default function LekarskiPreglediWidget() {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const total = sampleLekarskiPregledi.length;
    const active = sampleLekarskiPregledi.filter((p) => p.aktivan).length;
    const upcoming = sampleLekarskiPregledi.filter(
      (p) =>
        p.aktivan &&
        p.datumNarednogLekarskog <= thirtyDaysFromNow &&
        p.datumNarednogLekarskog >= now
    ).length;
    const expired = sampleLekarskiPregledi.filter(
      (p) => p.aktivan && p.datumNarednogLekarskog < now
    ).length;

    return { total, active, upcoming, expired };
  }, []);

  const handleClick = () => {
    navigate("/lekarski-pregledi");
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-2xl border border-gray-200 bg-white p-5 cursor-pointer transition-all hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] md:p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
            <LekarskiPreglediIcon className="text-blue-600 size-6 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lekarski pregledi
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ukupno: {stats.total}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Aktivni</p>
          <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white/90">
            {stats.active}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Narednih 30 dana
          </p>
          <p className="mt-1 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
            {stats.upcoming}
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

