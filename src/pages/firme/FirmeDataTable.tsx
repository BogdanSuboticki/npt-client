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
}

export default function FirmeDataTable({ data: initialData, columns }: DataTableProps) {
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
                        <button className="text-gray-500 hover:text-[#10B981] dark:text-gray-400 dark:hover:text-[#10B981]">
                            <svg
                              className="size-4"
                              width="16"
                              height="20"
                              viewBox="0 0 16 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M1.5847 5.80017C1.29009 3.9021 2.65824 2.19716 4.74825 1.57252C5.11915 1.46235 5.519 1.49427 5.86673 1.66182C6.21445 1.82937 6.48403 2.12 6.62078 2.47478L7.29175 4.22498C7.39976 4.50655 7.41929 4.81326 7.34783 5.10575C7.27638 5.39825 7.11719 5.66318 6.89071 5.86655L4.89479 7.65447C4.79628 7.7427 4.72288 7.85444 4.68179 7.97874C4.64069 8.10305 4.6333 8.23567 4.66034 8.36361L4.67884 8.44207L4.72666 8.63821C4.9755 9.59103 5.35368 10.507 5.8511 11.3616C6.39423 12.269 7.0674 13.0957 7.85011 13.8164L7.91181 13.8707C8.01145 13.9572 8.13231 14.017 8.2626 14.0442C8.3929 14.0715 8.52818 14.0652 8.65527 14.0261L11.2358 13.231C11.529 13.1409 11.8431 13.1386 12.1378 13.2244C12.4324 13.3101 12.6941 13.48 12.8893 13.7123L14.1109 15.1622C14.6199 15.7658 14.5582 16.6529 13.9736 17.1855C12.3741 18.6445 10.1746 18.9433 8.64447 17.7408C6.76811 16.2617 5.18686 14.4566 3.98012 12.4162C2.76157 10.3786 1.94982 8.13369 1.5847 5.80017ZM6.27682 8.46319L7.93032 6.97853C8.38355 6.57197 8.70221 6.04218 8.8454 5.45718C8.98859 4.87218 8.94978 4.25866 8.73393 3.6954L8.06451 1.9452C7.78988 1.23119 7.2477 0.646215 6.5481 0.309091C5.8485 -0.028033 5.04395 -0.0920244 4.29786 0.130115C1.70193 0.907144 -0.381919 3.18392 0.0592207 6.02799C0.36771 8.01357 1.07878 10.5393 2.64744 13.1767C3.94944 15.3767 5.65513 17.3229 7.6789 18.9176C9.97406 20.7206 13.0374 20.105 15.0271 18.2915C15.5964 17.7729 15.942 17.0614 15.9933 16.3021C16.0447 15.5428 15.7978 14.793 15.3032 14.2057L14.0816 12.7542C13.6908 12.2902 13.1672 11.951 12.578 11.78C11.9888 11.6091 11.3608 11.6141 10.7746 11.7946L8.63213 12.454C8.07892 11.8961 7.59438 11.2768 7.1884 10.6087C6.79665 9.93308 6.49102 9.21305 6.27836 8.4647" fill="currentColor"/>
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF]">
                            <EditButtonIcon className="size-4" />
                          </button>

                          <button className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
                            <DeleteButtonIcon className="size-4" />
                          </button>
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
