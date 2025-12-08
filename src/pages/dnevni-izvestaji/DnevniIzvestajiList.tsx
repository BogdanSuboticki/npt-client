"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { DnevniIzvestajiData } from "./DnevniIzvestajiDataTable";
import { Company } from "../../data/companies";
import { ReactComponent as EyeIcon } from '../../icons/eye.svg?react';

interface DnevniIzvestajiListProps {
  reports: DnevniIzvestajiData[];
  selectedCompany: Company | null;
  onReportSelect: (report: DnevniIzvestajiData) => void;
}

export default function DnevniIzvestajiList({
  reports,
  selectedCompany,
  onReportSelect,
}: DnevniIzvestajiListProps) {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("sr-Latn-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredReports = selectedCompany
    ? reports.filter((report) => report.firma === selectedCompany.naziv)
    : [];

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-[#1D2939] shadow-theme-sm">
      <div className="flex flex-col gap-4 px-4 py-4">
        {selectedCompany && (
          <div className="flex flex-col gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Preduzeće:
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {selectedCompany.naziv}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar">
        <div className="min-h-[200px]">
          <Table className="w-full">
            <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] border-l-0 text-center"
                >
                  <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400">
                    Datum
                  </p>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] text-center"
                >
                  <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400">
                    Status
                  </p>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] border-r-0 text-center"
                >
                  <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400">
                    Akcije
                  </p>
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <td
                    colSpan={3}
                    className="px-4 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    {selectedCompany
                      ? "Nema dostupnih izveštaja za ovo preduzeće."
                      : "Odaberite Preduzeće preko pretrage u zaglavlju kako bi se prikazali izveštaji."}
                  </td>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 border-l-0 text-center">
                      {formatDate(report.datum)}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.pregledan
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {report.pregledan ? "Pregledan" : "Nije Pregledan"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 border-r-0 text-center">
                      <div className="relative inline-block group">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onReportSelect(report);
                          }}
                          className="text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF]"
                        >
                          <EyeIcon className="size-5" />
                        </button>
                        <div className="invisible absolute top-full left-1/2 mt-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100 z-50">
                          <div className="relative">
                            <div className="drop-shadow-4xl whitespace-nowrap rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white">
                              Pregledaj
                            </div>
                            <div className="absolute -top-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-brand-600"></div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

