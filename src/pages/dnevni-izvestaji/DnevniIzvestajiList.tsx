"use client";

import { useState, useMemo, useEffect } from "react";
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
import ItemsPerPageDropdown from "../../components/ui/dropdown/ItemsPerPageDropdown";
import CustomDatePicker from "../../components/form/input/DatePicker";
import PaginationWithTextAndIcon from "../../components/ui/pagination/PaginationWithTextAndIcon";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("sr-Latn-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredReports = useMemo(() => {
    let filtered = selectedCompany
      ? reports.filter((report) => report.firma === selectedCompany.naziv)
      : [];

    // Apply date filters
    if (dateFrom || dateTo) {
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.datum);
        reportDate.setHours(0, 0, 0, 0);
        
        if (dateFrom) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          if (reportDate < fromDate) return false;
        }
        
        if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (reportDate > toDate) return false;
        }
        
        return true;
      });
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => b.datum.getTime() - a.datum.getTime());
  }, [reports, selectedCompany, dateFrom, dateTo]);

  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset to first page if current page is out of bounds after filtering
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredReports.slice(startIndex, endIndex);

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

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 dark:text-gray-400"> Prikaži </span>
            <ItemsPerPageDropdown
              value={itemsPerPage}
              onChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
              options={[10, 20, 50, 100]}
              className="w-[80px]"
            />
            <span className="text-gray-500 dark:text-gray-400"> rezultata </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-2">
            <div className="relative w-full lg:w-42">
              <CustomDatePicker
                value={dateFrom}
                onChange={(date) => {
                  setDateFrom(date);
                  setCurrentPage(1); // Reset to first page when changing filters
                }}
                placeholder="Datum od"
                className="bg-[#F9FAFB] dark:bg-[#101828]"
              />
            </div>
            <div className="relative w-full lg:w-42">
              <CustomDatePicker
                value={dateTo}
                onChange={(date) => {
                  setDateTo(date);
                  setCurrentPage(1); // Reset to first page when changing filters
                }}
                placeholder="Datum do"
                className="bg-[#F9FAFB] dark:bg-[#101828]"
              />
            </div>
          </div>
        </div>
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
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] border-r-0 text-center"
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
              {currentData.length === 0 ? (
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
                currentData.map((report) => (
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
                    <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] border-r-0">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onReportSelect(report);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors font-medium text-sm"
                      >
                        <EyeIcon className="size-4" />
                        <span>Pregledaj</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalItems > 0 && (
        <div className="rounded-b-xl border-gray-100 dark:border-white/[0.05] pb-4">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
            <PaginationWithTextAndIcon 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <div className="pt-3 xl:pt-0 px-6">
              <p className="pt-3 text-sm font-medium text-center text-gray-500 border-t border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-t-0 xl:pt-0 xl:text-left">
                Prikaz {startIndex + 1} - {endIndex} od {totalItems} zapisa
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

