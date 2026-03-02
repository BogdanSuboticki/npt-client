"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { DnevniIzvestajiData } from "../../pages/dnevni-izvestaji/DnevniIzvestajiDataTable";
import { DnevniIzvestajiIcon } from "../../icons";
import { api } from "../../api/client";

export default function DnevniIzvestajiWidget() {
  const navigate = useNavigate();
  const { userType } = useUser();

  const isKomitent = userType === 'komitent';

  const [reports, setReports] = useState<DnevniIzvestajiData[]>([]);

  useEffect(() => {
    api
      .get<{ data: any[] }>("dnevni-izvestaji")
      .then((res) => {
        const mapped = res.data.map((item): DnevniIzvestajiData => ({
          id: item.id,
          firma: item.firma?.naziv ?? "",
          datum: new Date(item.datum),
          pregledan: item.pregledan,
          napomenaBZR: item.napomena_bzr ?? "",
          osobaZaSaradnju: item.osoba_za_saradnju ?? "",
          ...item.podaci,
        }));
        setReports(mapped);
      })
      .catch(() => {});
  }, []);

  const allUnreviewedReports = useMemo(() => {
    return reports.filter((report) => !report.pregledan);
  }, [reports]);

  const sortedReports = useMemo(() => {
    return allUnreviewedReports
      .sort((a, b) => b.datum.getTime() - a.datum.getTime())
      .slice(0, 10);
  }, [allUnreviewedReports]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("sr-Latn-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleAddToday = () => {
    navigate("/dnevni-izvestaji");
  };

  const handleReportClick = (report: DnevniIzvestajiData) => {
    navigate(`/dnevni-izvestaji?reportId=${report.id}`);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <DnevniIzvestajiIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Dnevni Izveštaji
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {isKomitent 
                ? "Prethodni izveštaji"
                : "Nepregledani izveštaji"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-5 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800">
        {sortedReports.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            {isKomitent 
              ? "Nemate prethodnih izveštaja."
              : "Nema nepregledanih izveštaja."}
          </div>
        ) : (
          sortedReports.map((report) => (
            <div
              key={report.id}
              onClick={() => handleReportClick(report)}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {!isKomitent && report.firma}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {formatDate(report.datum)}
                </p>
                {!isKomitent && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {report.osobaZaSaradnju}
                  </p>
                )}
              </div>
              <div className="ml-3 flex-shrink-0">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                >
                  Nije Pregledan
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {sortedReports.length > 10 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
          Prikazano 10 od {allUnreviewedReports.length} izveštaja
        </p>
      )}

      <button
        onClick={handleAddToday}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-medium text-sm"
      >
        Dodaj današnji izveštaj
      </button>
    </div>
  );
}
