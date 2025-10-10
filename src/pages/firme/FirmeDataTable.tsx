"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { EditButtonIcon, DeleteButtonIcon } from "../../icons";
import PaginationWithTextAndIcon from "../../components/ui/pagination/PaginationWithTextAndIcon";
import ItemsPerPageDropdown from "../../components/ui/dropdown/ItemsPerPageDropdown";



interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface FirmeData {
  id: number;
  redniBroj: number;
  naziv: string;
  adresa: string;
  mesto: string;
  pib: string;
  maticniBroj: string;
  delatnost: string;
  datumIstekaUgovora: Date;
  aktivan: boolean;
  [key: string]: any;
}

interface DataTableProps {
  data: FirmeData[];
  columns: Column[];
  onDeleteClick?: (item: FirmeData) => void;
  onEditClick?: (item: FirmeData) => void;
}

export default function FirmeDataTable({ data: initialData, columns, onDeleteClick, onEditClick }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>(columns.find(col => col.sortable)?.key || columns[0].key);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  




  const filteredAndSortedData = useMemo(() => {
    return initialData
      .sort((a, b) => {
        if (sortKey.includes('datum')) {
          const aDate = a[sortKey] instanceof Date ? a[sortKey] : new Date(a[sortKey]);
          const bDate = b[sortKey] instanceof Date ? b[sortKey] : new Date(b[sortKey]);
          return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
        }
        
        if (typeof a[sortKey] === "number" && typeof b[sortKey] === "number") {
          return sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
        }
        
        return sortOrder === "asc"
          ? String(a[sortKey]).localeCompare(String(b[sortKey]))
          : String(b[sortKey]).localeCompare(String(a[sortKey]));
      });
  }, [sortKey, sortOrder, initialData]);

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };



  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('sr-Latn-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };



  return (
        <div className="overflow-hidden rounded-xl bg-white dark:bg-[#1D2939] shadow-theme-sm">
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400"> Prikaži </span>
                <ItemsPerPageDropdown
                  value={itemsPerPage}
                  onChange={setItemsPerPage}
                  options={[10, 20, 50, 100]}
                  className="w-[80px]"
                />
                <span className="text-gray-500 dark:text-gray-400"> rezultata </span>
              </div>


            </div>
          </div>

          <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div className="min-h-[200px]">
              <Table>
                <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    {columns.map(({ key, label, sortable }, index) => (
                      <TableCell
                        key={key}
                        isHeader
                        className={`px-4 py-3 border border-gray-100 dark:border-white/[0.05] ${
                          index === 0 ? 'border-l-0' : index === columns.length - 1 ? 'border-r-0' : ''
                        }`}
                      >
                        {sortable ? (
                          <div
                            className="flex items-center justify-center cursor-pointer"
                            onClick={() => handleSort(key)}
                          >
                            <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400 mr-2">
                              {key === 'redniBroj' ? '' : label}
                            </p>
                            <button className="flex flex-col gap-0.5">
                              <svg
                                className={`text-gray-300 dark:text-gray-700 ${
                                  sortKey === key && sortOrder === "asc" ? "text-brand-500" : ""
                                }`}
                                width="8"
                                height="5"
                                viewBox="0 0 8 5"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                                  fill="currentColor"
                                />
                              </svg>
                              <svg
                                className={`text-gray-300 dark:text-gray-700 ${
                                  sortKey === key && sortOrder === "desc" ? "text-brand-500" : ""
                                }`}
                                width="8"
                                height="5"
                                viewBox="0 0 8 5"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400">
                            {key === 'redniBroj' ? '' : label}
                          </p>
                        )}
                      </TableCell>
                    ))}
                    <TableCell
                      isHeader
                      className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] border-r-0"
                    >
                      <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400">
                      </p>
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((item, index) => (
                    <TableRow key={item.id}>
                      {columns.map(({ key }, colIndex) => (
                        <TableCell
                          key={key}
                          className={`px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ${
                            colIndex === 0 ? 'border-l-0' : colIndex === columns.length - 1 ? 'border-r-0' : ''
                          }`}
                        >
                          {key === 'redniBroj' ? (
                            startIndex + index + 1
                          ) : key === 'datumIstekaUgovora' ? (
                            formatDate(item[key])
                          ) : (
                            item[key]
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap border-r-0">
                        <div className="flex items-center w-full gap-2">
                          <div className="relative inline-block group">
                            <button className="text-gray-500 hover:text-[#10B981] dark:text-gray-400 dark:hover:text-[#10B981]">
                              <svg
                                className="size-4"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M10.3177 12.4723C10.4803 12.547 10.6636 12.5641 10.8372 12.5207C11.0108 12.4773 11.1645 12.3761 11.2729 12.2337L11.5525 11.8675C11.6992 11.6719 11.8894 11.5131 12.1081 11.4038C12.3268 11.2944 12.568 11.2375 12.8125 11.2375H15.175C15.5927 11.2375 15.9933 11.4034 16.2887 11.6988C16.5841 11.9942 16.75 12.3948 16.75 12.8125V15.175C16.75 15.5927 16.5841 15.9933 16.2887 16.2887C15.9933 16.5841 15.5927 16.75 15.175 16.75C11.4156 16.75 7.81009 15.2566 5.15176 12.5982C2.49343 9.93991 1 6.33444 1 2.575C1 2.15728 1.16594 1.75668 1.46131 1.46131C1.75668 1.16594 2.15728 1 2.575 1H4.9375C5.35522 1 5.75582 1.16594 6.05119 1.46131C6.34656 1.75668 6.5125 2.15728 6.5125 2.575V4.9375C6.5125 5.18201 6.45557 5.42316 6.34622 5.64186C6.23687 5.86056 6.07811 6.05079 5.8825 6.1975L5.51395 6.47391C5.36938 6.5843 5.26748 6.74134 5.22556 6.91834C5.18364 7.09534 5.20429 7.2814 5.284 7.4449C6.36026 9.63089 8.13036 11.3988 10.3177 12.4723Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <div className="invisible absolute top-full left-1/2 mt-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100 z-50">
                              <div className="relative">
                                <div className="drop-shadow-4xl whitespace-nowrap rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white">
                                  Kontakt podaci
                                </div>
                                <div className="absolute -top-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-brand-600"></div>
                              </div>
                            </div>
                          </div>
                          <div className="relative inline-block group">
                            <button 
                              onClick={() => onEditClick?.(item)}
                              className="text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF]"
                            >
                              <EditButtonIcon className="size-4" />
                            </button>
                            <div className="invisible absolute top-full left-1/2 mt-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100 z-50">
                              <div className="relative">
                                <div className="drop-shadow-4xl whitespace-nowrap rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white">
                                  Izmeni
                                </div>
                                <div className="absolute -top-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-brand-600"></div>
                              </div>
                            </div>
                          </div>
                          <div className="relative inline-block group">
                            <button 
                              onClick={() => onDeleteClick?.(item)}
                              className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                            >
                              <DeleteButtonIcon className="size-4" />
                            </button>
                            <div className="invisible absolute top-full left-1/2 mt-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100 z-50">
                              <div className="relative">
                                <div className="drop-shadow-4xl whitespace-nowrap rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white">
                                  Obriši
                                </div>
                                <div className="absolute -top-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-brand-600"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

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
        </div>

  );
} 
