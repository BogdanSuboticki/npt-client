"use client";

import { useState, useMemo} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { OpremaDugmevIcon, EditButtonIcon, DeleteButtonIcon } from "../../../../icons";
import PaginationWithTextAndIcon from "../../../ui/pagination/PaginationWithTextAndIcon";
import FilterDropdown from "../../../ui/dropdown/FilterDropdown";
import ItemsPerPageDropdown from "../../../ui/dropdown/ItemsPerPageDropdown";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface DataTableTwoProps {
  data: any[];
  columns: Column[];
  onOpremaClick?: (item: any) => void;
  onEditClick?: (item: any) => void;
  onDeleteClick?: (item: any) => void;
  showFilters?: boolean;
  showPagination?: boolean;
  showOpremaButton?: boolean;
}

export default function DataTableTwo({ data: initialData, columns, onOpremaClick, onEditClick, onDeleteClick, showFilters = true, showPagination = true, showOpremaButton = true }: DataTableTwoProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>(columns.find(col => col.sortable)?.key || columns[0].key);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Get unique values for dropdowns
  const uniqueRadnaMesta = useMemo(() => {
    return Array.from(new Set(initialData.map(item => item.nazivRadnogMesta)));
  }, [initialData]);

  const uniqueLokacije = useMemo(() => {
    return Array.from(new Set(initialData.map(item => item.nazivLokacije)));
  }, [initialData]);

  // Initialize with all items selected
  const [selectedRadnaMesta, setSelectedRadnaMesta] = useState<string[]>(uniqueRadnaMesta);
  const [selectedLokacije, setSelectedLokacije] = useState<string[]>(uniqueLokacije);

  const filteredAndSortedData = useMemo(() => {
    return initialData
      .filter((item) => {
        // If filters are disabled, show all items
        if (!showFilters) {
          return true;
        }
        // If no items are selected in either filter, show no results
        if (selectedRadnaMesta.length === 0 || selectedLokacije.length === 0) {
          return false;
        }
        const matchesRadnaMesta = selectedRadnaMesta.includes(item.nazivRadnogMesta);
        const matchesLokacije = selectedLokacije.includes(item.nazivLokacije);
        return matchesRadnaMesta && matchesLokacije;
      })
      .sort((a, b) => {
        if (typeof a[sortKey] === "number" && typeof b[sortKey] === "number") {
          return sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
        }
        return sortOrder === "asc"
          ? String(a[sortKey]).localeCompare(String(b[sortKey]))
          : String(b[sortKey]).localeCompare(String(a[sortKey]));
      });
  }, [sortKey, sortOrder, selectedRadnaMesta, selectedLokacije, initialData, showFilters]);

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

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-[#1D2939]">
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

          <div className="flex flex-col lg:flex-row gap-4">
            {showFilters && (
              <>
                <FilterDropdown
                  label="Prikazana radna mesta"
                  options={uniqueRadnaMesta}
                  selectedOptions={selectedRadnaMesta}
                  onSelectionChange={setSelectedRadnaMesta}
                />
                <FilterDropdown
                  label="Prikazane lokacije"
                  options={uniqueLokacije}
                  selectedOptions={selectedLokacije}
                  onSelectionChange={setSelectedLokacije}
                />
              </>
            )}
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
                          {label}
                        </p>
                        <button className="flex flex-col gap-0.5 mr-2">
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
                        {label}
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
              {currentData.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {columns.map(({ key }, index) => (
                    <TableCell
                      key={key}
                      className={`px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ${
                        key === 'nazivRadnogMesta' ? 'font-medium' : 'font-normal'
                      } ${index === 0 ? 'border-l-0' : index === columns.length - 1 ? 'border-r-0' : ''}`}
                    >
                      {key === 'oprema' ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1">
                            {item.oprema && item.oprema.length > 0 ? (
                              item.oprema.slice(0, 2).map((oprema: string, idx: number) => (
                                <span key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                                  {oprema}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-400 dark:text-gray-500">
                                Nema opreme
                              </span>
                            )}
                          </div>
                          {item.oprema && item.oprema.length > 2 && (
                            <button
                              onClick={() => onOpremaClick?.(item)}
                              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-left"
                            >
                              Pogledaj sve ({item.oprema.length})
                            </button>
                          )}
                          {item.oprema && item.oprema.length <= 2 && item.oprema.length > 0 && (
                            <button
                              onClick={() => onOpremaClick?.(item)}
                              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-left"
                            >
                              Pogledaj sve
                            </button>
                          )}
                        </div>
                      ) : (
                        item[key]
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap border-r-0">
                    <div className="flex items-center w-full gap-2">
                      {showOpremaButton && (
                        <button className="text-gray-500 hover:text-[#FF9D00] dark:text-gray-400 dark:hover:text-[#FF9D00]">
                          <OpremaDugmevIcon className="size-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => onDeleteClick?.(item)}
                        className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                      >
                        <DeleteButtonIcon className="size-4" />
                      </button>
                      <button 
                        onClick={() => onEditClick?.(item)}
                        className="text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF]"
                      >
                        <EditButtonIcon className="size-4" />
                      </button> 
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {showPagination && (
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