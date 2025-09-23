"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { EditButtonIcon, DeleteButtonIcon, CheckmarkIcon } from "../../icons";
import PaginationWithTextAndIcon from "../../components/ui/pagination/PaginationWithTextAndIcon";
import ItemsPerPageDropdown from "../../components/ui/dropdown/ItemsPerPageDropdown";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import CustomDatePicker from "../../components/form/input/DatePicker";
import TextArea from "../../components/form/input/TextArea";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface Mera {
  id: number;
  nazivMere: string;
  rokIzvrsenja: Date;
  datumRealizacije: Date | null;
}

interface InspekcijskiNadzorItem {
  id: number;
  brojResenja: string;
  datumNadzora: Date;
  napomena: string;
  mere: Mera[];
  [key: string]: any;
}

interface DataTableProps {
  data: InspekcijskiNadzorItem[];
  columns: Column[];
}

export default function InspekcijskiNadzorDataTable({ data: initialData, columns }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>(columns.find(col => col.sortable)?.key || columns[0].key);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { isOpen, openModal, closeModal } = useModal();
  const [modalDate, setModalDate] = useState<Date>(new Date());
  const [modalNote, setModalNote] = useState<string>("");

  // Filters
  const uniqueBrojResenja = useMemo(() => {
    return Array.from(new Set(initialData.map(item => item.brojResenja)));
  }, [initialData]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter broj resenja based on search term
  const filteredBrojResenja = useMemo(() => {
    if (!searchTerm) return uniqueBrojResenja;
    return uniqueBrojResenja.filter(resenje => 
      resenje.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [uniqueBrojResenja, searchTerm]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Flatten data to show each mera as a separate row
  const flattenedData = useMemo(() => {
    const flattened: Array<InspekcijskiNadzorItem & { meraIndex: number; isFirstRow: boolean; totalRows: number }> = [];
    
    initialData.forEach((item) => {
      if (item.mere && item.mere.length > 0) {
        item.mere.forEach((mera, index) => {
          flattened.push({
            ...item,
            meraIndex: index,
            isFirstRow: index === 0,
            totalRows: item.mere.length,
            // Override with mera-specific data
            nazivMere: mera.nazivMere,
            rokIzvrsenja: mera.rokIzvrsenja,
            datumRealizacije: mera.datumRealizacije,
          });
        });
      } else {
        // If no mere, show as single row
        flattened.push({
          ...item,
          meraIndex: 0,
          isFirstRow: true,
          totalRows: 1,
          nazivMere: '',
          rokIzvrsenja: new Date(),
          datumRealizacije: null,
        });
      }
    });
    
    return flattened;
  }, [initialData]);

  const filteredAndSortedData = useMemo(() => {
    return flattenedData
      .filter((item) => {
        const matchesResenje = !searchTerm || item.brojResenja.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDateRange = (!dateFrom || item.datumNadzora >= dateFrom) && (!dateTo || item.datumNadzora <= dateTo);
        return matchesResenje && matchesDateRange;
      })
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
  }, [sortKey, sortOrder, searchTerm, dateFrom, dateTo, flattenedData]);

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleActionClick = () => {
    setModalDate(new Date());
    setModalNote("");
    openModal();
  };

  const handleSave = () => {
    console.log("Saving inspekcijski nadzor action with date:", modalDate, "and note:", modalNote);
    closeModal();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsSearchOpen(true);
  };

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
  };

  const handleOptionSelect = (resenje: string) => {
    setSearchTerm(resenje);
    setIsSearchOpen(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);
  
  // Calculate unique resolutions for display count
  const uniqueResolutions = useMemo(() => {
    const uniqueIds = new Set(filteredAndSortedData.map(item => item.id));
    return uniqueIds.size;
  }, [filteredAndSortedData]);

  const formatDate = (value: Date | null): string => {
    if (!value) return "";
    return value.toLocaleDateString('sr-Latn-RS', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative w-full lg:w-64" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  placeholder="Pretraži broj rešenja..."
                  className="w-full h-11 px-4 pr-10 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400"
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
              </div>
              {isSearchOpen && filteredBrojResenja.length > 0 && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {filteredBrojResenja.map((resenje, index) => (
                      <div
                        key={resenje}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          index === filteredBrojResenja.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                        onClick={() => handleOptionSelect(resenje)}
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{resenje}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full lg:w-42">
              <CustomDatePicker
                value={dateFrom}
                onChange={(date) => setDateFrom(date)}
                placeholder="Datum od"
              />
            </div>
            <div className="relative w-full lg:w-42">
              <CustomDatePicker
                value={dateTo}
                onChange={(date) => setDateTo(date)}
                placeholder="Datum do"
              />
            </div>
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
                <TableRow key={`${item.id}-${item.meraIndex}`}>
                  {columns.map(({ key }, colIndex) => {
                    // Only render spanning columns on the first row of each group
                    if ((key === 'brojResenja' || key === 'datumNadzora' || key === 'napomena') && !item.isFirstRow) {
                      return null;
                    }
                    
                    return (
                      <TableCell
                        key={key}
                        className={`px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ${
                          colIndex === 0 ? 'border-l-0' : colIndex === columns.length - 1 ? 'border-r-0' : ''
                        }`}
                        rowSpan={key === 'brojResenja' || key === 'datumNadzora' || key === 'napomena' ? item.totalRows : undefined}
                      >
                        {key === 'redniBroj' ? (
                          item.isFirstRow ? startIndex + index + 1 : ''
                        ) : key === 'brojResenja' ? (
                          item.brojResenja
                        ) : key === 'datumNadzora' ? (
                          formatDate(item.datumNadzora)
                        ) : key === 'napomena' ? (
                          item.napomena
                        ) : key === 'nazivMere' ? (
                          item.nazivMere
                        ) : key === 'rokIzvrsenja' ? (
                          formatDate(item.rokIzvrsenja)
                        ) : key === 'datumRealizacije' ? (
                          formatDate(item.datumRealizacije)
                        ) : (
                          item[key]
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap border-r-0">
                    <div className="flex items-center w-full gap-2">
                      <button 
                        className="text-gray-500 hover:text-success-500 dark:text-gray-400 dark:hover:text-success-500"
                        onClick={handleActionClick}
                      >
                        <CheckmarkIcon className="size-4" />
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
              Prikaz {startIndex + 1} - {endIndex} od {totalItems} redova ({uniqueResolutions} rešenja)
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-5 lg:p-8"
      >
        <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
          Evidentiraj realizaciju mere
        </h4>
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Datum realizacije:</p>
          <CustomDatePicker value={modalDate} onChange={(d) => d && setModalDate(d)} />
        </div>
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Napomena:</p>
          <TextArea value={modalNote} onChange={(e: any) => setModalNote(e.target.value)} placeholder="Unesite napomenu" />
        </div>
        <div className="flex items-center justify-end w-full gap-3">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Otkaži
          </Button>
          <Button size="sm" onClick={handleSave}>
            Sačuvaj
          </Button>
        </div>
      </Modal>
    </div>
  );
}


