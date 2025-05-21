"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { PencilIcon, TrashBinIcon, OpremaIcon } from "../../../../icons";
import PaginationWithTextAndIcon from "../../../ui/pagination/PaginationWithTextAndIcon";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface DataTableTwoProps {
  data: any[];
  columns: Column[];
}

export default function DataTableTwo({ data: initialData, columns }: DataTableTwoProps) {
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
  const [isRadnaMestaOpen, setIsRadnaMestaOpen] = useState(false);
  const [isLokacijeOpen, setIsLokacijeOpen] = useState(false);
  const radnaMestaRef = useRef<HTMLDivElement>(null);
  const lokacijeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (radnaMestaRef.current && !radnaMestaRef.current.contains(event.target as Node)) {
        setIsRadnaMestaOpen(false);
      }
      if (lokacijeRef.current && !lokacijeRef.current.contains(event.target as Node)) {
        setIsLokacijeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAndSortedData = useMemo(() => {
    return initialData
      .filter((item) => {
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
  }, [sortKey, sortOrder, selectedRadnaMesta, selectedLokacije, initialData]);

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

  const handleSelectAllRadnaMesta = () => {
    if (selectedRadnaMesta.length === uniqueRadnaMesta.length) {
      // If all are selected, deselect all
      setSelectedRadnaMesta([]);
    } else {
      // If not all are selected, select all
      setSelectedRadnaMesta([...uniqueRadnaMesta]);
    }
  };

  const handleSelectAllLokacije = () => {
    if (selectedLokacije.length === uniqueLokacije.length) {
      // If all are selected, deselect all
      setSelectedLokacije([]);
    } else {
      // If not all are selected, select all
      setSelectedLokacije([...uniqueLokacije]);
    }
  };

  const handleRadnaMestaChange = (value: string) => {
    setSelectedRadnaMesta(prev => {
      const newSelection = prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value];
      
      // If we're deselecting the last item, deselect "Prikaži sve" as well
      if (newSelection.length === 0) {
        return [];
      }
      
      return newSelection;
    });
  };

  const handleLokacijeChange = (value: string) => {
    setSelectedLokacije(prev => {
      const newSelection = prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value];
      
      // If we're deselecting the last item, deselect "Prikaži sve" as well
      if (newSelection.length === 0) {
        return [];
      }
      
      return newSelection;
    });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400"> Prikaži </span>
          <div className="relative z-20 bg-transparent">
            <select
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {[5, 8, 10].map((value) => (
                <option
                  key={value}
                  value={value}
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  {value}
                </option>
              ))}
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400"> rezultata </span>
        </div>

        <div className="flex gap-4">
          {/* Radna Mesta Dropdown */}
          <div className="relative" ref={radnaMestaRef}>
            <button
              onClick={() => setIsRadnaMestaOpen(!isRadnaMestaOpen)}
              className="flex items-center justify-between w-[250px] h-11 px-4 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg dark:bg-dark-900 dark:border-gray-700 dark:text-white/90"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Prikazana radna mesta</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isRadnaMestaOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isRadnaMestaOpen && (
              <div className="absolute z-[100] w-[300px] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <div className="max-h-60 overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none"
                      onClick={handleSelectAllRadnaMesta}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRadnaMesta.length === uniqueRadnaMesta.length}
                        onChange={handleSelectAllRadnaMesta}
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Prikaži sve</span>
                    </div>
                  </div>
                  {uniqueRadnaMesta.map((radnoMesto) => (
                    <label
                      key={radnoMesto}
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRadnaMesta.includes(radnoMesto)}
                        onChange={() => handleRadnaMestaChange(radnoMesto)}
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{radnoMesto}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lokacije Dropdown */}
          <div className="relative" ref={lokacijeRef}>
            <button
              onClick={() => setIsLokacijeOpen(!isLokacijeOpen)}
              className="flex items-center justify-between w-[200px] h-11 px-4 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg dark:bg-dark-900 dark:border-gray-700 dark:text-white/90"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Prikazane lokacije</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isLokacijeOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isLokacijeOpen && (
              <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <div className="max-h-60 overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none"
                      onClick={handleSelectAllLokacije}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLokacije.length === uniqueLokacije.length}
                        onChange={handleSelectAllLokacije}
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Prikaži sve</span>
                    </div>
                  </div>
                  {uniqueLokacije.map((lokacija) => (
                    <label
                      key={lokacija}
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLokacije.includes(lokacija)}
                        onChange={() => handleLokacijeChange(lokacija)}
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{lokacija}</span>
                    </label>
                  ))}
                </div>
              </div>
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
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => handleSort(key)}
                      >
                        <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400">
                          {label}
                        </p>
                        <button className="flex flex-col gap-0.5">
                          <svg
                            className={`text-gray-300 dark:text-gray-700  ${
                              sortKey === key && sortOrder === "asc"
                                ? "text-brand-500"
                                : ""
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
                            className={`text-gray-300 dark:text-gray-700  ${
                              sortKey === key && sortOrder === "desc"
                                ? "text-brand-500"
                                : ""
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
                <TableRow key={item.id}>
                  {columns.map(({ key }, index) => (
                    <TableCell
                      key={key}
                      className={`px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ${
                        key === 'nazivRadnogMesta' ? 'font-bold' : 'font-normal'
                      } ${index === 0 ? 'border-l-0' : index === columns.length - 1 ? 'border-r-0' : ''}`}
                    >
                      {item[key]}
                    </TableCell>
                  ))}
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap border-r-0">
                    <div className="flex items-center w-full gap-2">
                      <button className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
                        <OpremaIcon className="size-5" />
                      </button>
                      <button className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
                        <TrashBinIcon className="size-5" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
                        <PencilIcon className="size-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="border border-t-0 rounded-b-xl border-gray-100 dark:border-white/[0.05]">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
          <PaginationWithTextAndIcon 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <div className="pt-3 xl:pt-0 px-6">
            <p className="pt-3 text-sm font-medium text-center text-gray-500 border-t border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-t-0 xl:pt-0 xl:text-left">
              Prikaz {startIndex + 1} do {endIndex} od {totalItems} zapisa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
