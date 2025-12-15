"use client";

import { useMemo } from "react";
import { useNavigate } from "react-router";
import { PovredeIcon } from "../../icons";

// Sample data - in a real app, this would come from an API
const samplePovrede = [
  {
    id: 1,
    zaposleni: "Zaposleni 1",
    datumPovrede: new Date("2024-01-15"),
    tezinaPovrede: "Laka",
    datumObavestenjaInspekcije: new Date("2024-01-16"),
  },
  {
    id: 2,
    zaposleni: "Zaposleni 2",
    datumPovrede: new Date("2024-02-10"),
    tezinaPovrede: "Srednja",
    datumObavestenjaInspekcije: new Date("2024-02-11"),
  },
  {
    id: 3,
    zaposleni: "Zaposleni 3",
    datumPovrede: new Date("2024-03-05"),
    tezinaPovrede: "Teška",
    datumObavestenjaInspekcije: null,
  },
];

export default function PovredeWidget() {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const total = samplePovrede.length;
    const recent = samplePovrede.filter(
      (p) => p.datumPovrede >= thirtyDaysAgo
    ).length;
    const needsAttention = samplePovrede.filter(
      (p) => p.datumObavestenjaInspekcije === null
    ).length;

    return { total, recent, needsAttention };
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

