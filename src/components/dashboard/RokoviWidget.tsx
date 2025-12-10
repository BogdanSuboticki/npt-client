"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useCompanySelection } from "../../context/CompanyContext";
import { RokoviData } from "../../pages/rokovi/RokoviDataTable";
import { RokoviIcon } from "../../icons";
import { getAllRokovi } from "../../data/rokovi";
import { companies } from "../../data/companies";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getDaysUntilRok = (rok: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = rok.getTime() - today.getTime();
  return Math.ceil(diff / MS_PER_DAY);
};

const getStatusLabel = (rok: Date) => {
  const daysUntil = getDaysUntilRok(rok);

  if (daysUntil < 0) {
    return "Isteklo";
  }

  if (daysUntil <= 3) {
    return "Ističe za 3 dana";
  }

  return "U toku";
};

const getStatusClassNames = (status: string) => {
  switch (status) {
    case "U toku":
      return "bg-success-100 text-success-700 dark:bg-success-500/10 dark:text-success-300";
    case "Ističe za 3 dana":
      return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300";
    case "Isteklo":
      return "bg-error-100 text-error-700 dark:bg-error-500/10 dark:text-error-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

type FilterType = "all" | "expiring" | "expired";

export default function RokoviWidget() {
  const navigate = useNavigate();
  const { selectCompany } = useCompanySelection();
  const [filter, setFilter] = useState<FilterType>("all");

  // Get all Rokovi from all companies
  const allRokovi = useMemo(() => getAllRokovi(), []);

  // Filter Rokovi that are expiring (within 3 days) or expired, excluding completed ones
  const relevantRokovi = useMemo(() => {
    return allRokovi.filter((rok) => {
      // Exclude completed rokovi
      if (rok.isCompleted) return false;
      const daysUntil = getDaysUntilRok(rok.rok);
      return daysUntil <= 3; // Expiring in 3 days or expired
    });
  }, [allRokovi]);

  // Apply filter
  const filteredRokovi = useMemo(() => {
    if (filter === "all") {
      return relevantRokovi;
    } else if (filter === "expiring") {
      return relevantRokovi.filter((rok) => {
        const daysUntil = getDaysUntilRok(rok.rok);
        return daysUntil >= 0 && daysUntil <= 3;
      });
    } else if (filter === "expired") {
      return relevantRokovi.filter((rok) => {
        const daysUntil = getDaysUntilRok(rok.rok);
        return daysUntil < 0;
      });
    }
    return relevantRokovi;
  }, [relevantRokovi, filter]);

  // Sort by deadline (expired first, then by days until)
  const sortedRokovi = useMemo(() => {
    return [...filteredRokovi].sort((a, b) => {
      const daysA = getDaysUntilRok(a.rok);
      const daysB = getDaysUntilRok(b.rok);
      
      // Expired items first
      if (daysA < 0 && daysB >= 0) return -1;
      if (daysA >= 0 && daysB < 0) return 1;
      
      // Then sort by days until (ascending)
      return daysA - daysB;
    });
  }, [filteredRokovi]);

  // Get counts
  const expiringCount = useMemo(() => {
    return relevantRokovi.filter((rok) => {
      const daysUntil = getDaysUntilRok(rok.rok);
      return daysUntil >= 0 && daysUntil <= 3;
    }).length;
  }, [relevantRokovi]);

  const expiredCount = useMemo(() => {
    return relevantRokovi.filter((rok) => {
      const daysUntil = getDaysUntilRok(rok.rok);
      return daysUntil < 0;
    }).length;
  }, [relevantRokovi]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("sr-Latn-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleRokClick = (rok: RokoviData) => {
    // Find the company by companyId or preduzece name
    const company = companies.find(
      (c) => c.id === rok.companyId || c.naziv === rok.preduzece
    );
    
    if (company) {
      selectCompany(company);
      navigate("/rokovi");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <RokoviIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Rokovi
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Ističu za 3 dana ili su istekli
            </p>
          </div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Svi ({relevantRokovi.length})
        </button>
        <button
          onClick={() => setFilter("expiring")}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === "expiring"
              ? "bg-orange-600 text-white dark:bg-orange-500"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Ističu ({expiringCount})
        </button>
        <button
          onClick={() => setFilter("expired")}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === "expired"
              ? "bg-red-600 text-white dark:bg-red-500"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Istekli ({expiredCount})
        </button>
      </div>

      <div className="space-y-3 mb-5 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800">
        {sortedRokovi.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            Nema rokova koji ističu ili su istekli.
          </div>
        ) : (
          sortedRokovi.slice(0, 10).map((rok) => {
            const status = getStatusLabel(rok.rok);
            const daysUntil = getDaysUntilRok(rok.rok);
            
            return (
              <div
                key={rok.id}
                onClick={() => handleRokClick(rok)}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {rok.preduzece || "Nepoznato preduzeće"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {rok.oblast} - {rok.vrstaObaveze}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Rok: {formatDate(rok.rok)}
                  </p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClassNames(
                      status
                    )}`}
                  >
                    {daysUntil < 0
                      ? `Isteklo (${Math.abs(daysUntil)} d)`
                      : daysUntil === 0
                      ? "Danas"
                      : `${daysUntil} d`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {sortedRokovi.length > 10 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
          Prikazano 10 od {sortedRokovi.length} rokova
        </p>
      )}

      <button
        onClick={() => navigate("/rokovi")}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-medium text-sm"
      >
        Vidi sve rokove
      </button>
    </div>
  );
}

