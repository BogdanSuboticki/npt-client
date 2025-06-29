"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { LightbulbIcon, EditButtonIcon, DeleteButtonIcon, CalenderIcon } from "../../icons";
import PaginationWithTextAndIcon from "../../components/ui/pagination/PaginationWithTextAndIcon";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { sr } from "date-fns/locale";
import Checkbox from "../../components/form/input/Checkbox";
import { useTheme } from "../../context/ThemeContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface OsposobljavanjeData {
  id: number;
  zaposleni: string;
  radnoMesto: string;
  lokacija: string;
  povecanRizik: boolean;
  osposobljavanjeBZR: string;
  datumNarednogBZR: string;
  osposobljavanjeZOP: string;
  datumNarednogZOP: string;
  prikaziUPodsetniku: boolean;
  bzrOdradjeno: boolean;
  [key: string]: any;
}

interface DataTableTwoProps {
  data: OsposobljavanjeData[];
  columns: Column[];
}

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sr-Latn-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
};

export default function OsposobljavanjeDataTable({ data: initialData, columns }: DataTableTwoProps) {
  const { theme: appTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>(columns[0]?.key || 'redniBroj');
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [data, setData] = useState<OsposobljavanjeData[]>(initialData);
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  
  // Get unique values for dropdowns with safe defaults
  const uniqueZaposleni = useMemo(() => {
    try {
      return Array.from(new Set(data?.map(item => item.zaposleni) || []));
    } catch (error) {
      console.error('Error getting unique zaposleni:', error);
      return [];
    }
  }, [data]);

  // Initialize filter states with safe defaults
  const [selectedZaposleni, setSelectedZaposleni] = useState<string[]>(uniqueZaposleni);
  const [selectedOsposobljavanje, setSelectedOsposobljavanje] = useState<{ bzr: boolean; zop: boolean }>({ bzr: true, zop: true });
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  // Dropdown refs
  const zaposleniRef = useRef<HTMLDivElement>(null);
  const [isZaposleniOpen, setIsZaposleniOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (zaposleniRef.current && !zaposleniRef.current.contains(event.target as Node)) {
        setIsZaposleniOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Safe data processing
  const filteredAndSortedData = useMemo(() => {
    try {
      if (!data) return [];

      return data
        .filter((item) => {
          try {
            const matchesZaposleni = selectedZaposleni.includes(item.zaposleni);
            const matchesOsposobljavanje = 
              (selectedOsposobljavanje.bzr && item.osposobljavanjeBZR) ||
              (selectedOsposobljavanje.zop && item.osposobljavanjeZOP);
            
            const matchesDateRange = (!dateFrom || new Date(item.osposobljavanjeBZR) >= dateFrom) &&
                                   (!dateTo || new Date(item.osposobljavanjeBZR) <= dateTo);

            return matchesZaposleni && matchesOsposobljavanje && matchesDateRange;
          } catch (error) {
            console.error('Error filtering item:', error);
            return false;
          }
        })
        .sort((a, b) => {
          try {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            
            if (sortKey.includes('datum') || sortKey.includes('osposobljavanje')) {
              const aDate = new Date(aValue);
              const bDate = new Date(bValue);
              return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
            }
            
            if (typeof aValue === "number" && typeof bValue === "number") {
              return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
            }
            
            return sortOrder === "asc"
              ? String(aValue).localeCompare(String(bValue))
              : String(bValue).localeCompare(String(aValue));
          } catch (error) {
            console.error('Error sorting items:', error);
            return 0;
          }
        });
    } catch (error) {
      console.error('Error processing data:', error);
      return [];
    }
  }, [data, sortKey, sortOrder, selectedZaposleni, selectedOsposobljavanje, dateFrom, dateTo]);

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

  const handleSelectAllZaposleni = () => {
    if (selectedZaposleni.length === uniqueZaposleni.length) {
      setSelectedZaposleni([]);
    } else {
      setSelectedZaposleni([...uniqueZaposleni]);
    }
  };

  const handleZaposleniChange = (value: string) => {
    setSelectedZaposleni(prev => {
      const newSelection = prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value];
      return newSelection.length === 0 ? [] : newSelection;
    });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const handleCheckboxChange = (id: number, field: 'prikaziUPodsetniku' | 'bzrOdradjeno') => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, [field]: !item[field] }
          : item
      )
    );
  };

  // Create theme based on app theme
  const muiTheme = createTheme({
    palette: {
      mode: appTheme,
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={sr}>
        <div className="overflow-hidden rounded-xl bg-white dark:bg-[#1D2939]">
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400"> Prikaži </span>
                <div className="relative z-20 bg-transparent w-[80px]">
                  <select
                    className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg appearance-none dark:bg-[#101828] h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    {[10, 20, 50, 100].map((value) => (
                      <option
                        key={value}
                        value={value}
                        className="text-gray-500 dark:bg-[#101828] dark:text-gray-400"
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-gray-500 dark:text-gray-400"> rezultata </span>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Zaposleni Dropdown */}
                <div className="relative w-full lg:w-48" ref={zaposleniRef}>
                  <button
                    onClick={() => setIsZaposleniOpen(!isZaposleniOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
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
                      <span>Zaposleni</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isZaposleniOpen ? 'rotate-180' : ''} ml-1`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isZaposleniOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto">
                        <div className="sticky top-0 bg-white rounded-t-lg dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <div
                            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={handleSelectAllZaposleni}
                          >
                            <input
                              type="checkbox"
                              checked={selectedZaposleni.length === uniqueZaposleni.length}
                              onChange={handleSelectAllZaposleni}
                              className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Prikaži sve</span>
                          </div>
                        </div>
                        {uniqueZaposleni.map((zaposleni) => (
                          <label
                            key={zaposleni}
                            className="flex items-start px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <input
                              type="checkbox"
                              checked={selectedZaposleni.includes(zaposleni)}
                              onChange={() => handleZaposleniChange(zaposleni)}
                              className="w-4 h-4 mt-0.5 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600 flex-shrink-0"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 break-words">{zaposleni}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Date Range */}
                <div className="relative w-full lg:w-42">
                  <DatePicker
                    value={dateFrom}
                    onChange={(newValue) => setDateFrom(newValue)}
                    open={isFromOpen}
                    onOpen={() => setIsFromOpen(true)}
                    onClose={() => setIsFromOpen(false)}
                    slots={{
                      toolbar: () => null
                    }}
                    slotProps={{
                      textField: {
                        placeholder: "Datum od",
                        size: "small",
                        fullWidth: true,
                        onClick: () => setIsFromOpen(true),
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: '44px',
                            backgroundColor: appTheme === 'dark' ? '#101828' : '#F9FAFB',
                            '& fieldset': {
                              borderColor: appTheme === 'dark' ? '#374151' : '#D1D5DB',
                            },
                            '&:hover fieldset': {
                              borderColor: appTheme === 'dark' ? '#4B5563' : '#9CA3AF',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: appTheme === 'dark' ? '#465FFF' : '#465FFF',
                            },
                          },
                          '& .MuiInputBase-input': {
                            padding: '12px 14px',
                            color: appTheme === 'dark' ? '#F9FAFB' : '#111827',
                            '&::placeholder': {
                              color: appTheme === 'dark' ? '#9CA3AF' : '#6B7280',
                              opacity: 1,
                            },
                          },
                        },
                        InputProps: {
                          style: {
                            borderRadius: 8,
                            height: 44,
                            backgroundColor: appTheme === 'dark' ? '#101828' : '#F9FAFB',
                          },
                          endAdornment: (
                            <CalenderIcon className="size-5 text-gray-500 dark:text-gray-400" />
                          ),
                        },
                      },
                    }}
                    format="dd/MM/yyyy"
                  />
                </div>
                <div className="relative w-full lg:w-42">
                  <DatePicker
                    value={dateTo}
                    onChange={(newValue) => setDateTo(newValue)}
                    open={isToOpen}
                    onOpen={() => setIsToOpen(true)}
                    onClose={() => setIsToOpen(false)}
                    slots={{
                      toolbar: () => null
                    }}
                    slotProps={{
                      textField: {
                        placeholder: "Datum do",
                        size: "small",
                        fullWidth: true,
                        onClick: () => setIsToOpen(true),
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: '44px',
                            backgroundColor: appTheme === 'dark' ? '#101828' : '#F9FAFB',
                            '& fieldset': {
                              borderColor: appTheme === 'dark' ? '#374151' : '#D1D5DB',
                            },
                            '&:hover fieldset': {
                              borderColor: appTheme === 'dark' ? '#4B5563' : '#9CA3AF',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: appTheme === 'dark' ? '#465FFF' : '#465FFF',
                            },
                          },
                          '& .MuiInputBase-input': {
                            padding: '12px 14px',
                            color: appTheme === 'dark' ? '#F9FAFB' : '#111827',
                            '&::placeholder': {
                              color: appTheme === 'dark' ? '#9CA3AF' : '#6B7280',
                              opacity: 1,
                            },
                          },
                        },
                        InputProps: {
                          style: {
                            borderRadius: 8,
                            height: 44,
                            backgroundColor: appTheme === 'dark' ? '#101828' : '#F9FAFB',
                          },
                          endAdornment: (
                            <CalenderIcon className="size-5 text-gray-500 dark:text-gray-400" />
                          ),
                        },
                      },
                    }}
                    format="dd/MM/yyyy"
                  />
                </div>
                {/* Osposobljavanje Checkboxes */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <Checkbox
                      checked={selectedOsposobljavanje.bzr}
                      onChange={(checked) => setSelectedOsposobljavanje(prev => ({ ...prev, bzr: checked }))}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">BZR</span>
                  </label>
                  <label className="flex items-center">
                    <Checkbox
                      checked={selectedOsposobljavanje.zop}
                      onChange={(checked) => setSelectedOsposobljavanje(prev => ({ ...prev, zop: checked }))}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">ZOP</span>
                  </label>
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
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => handleSort(key)}
                          >
                            <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400">
                              {index === 0 ? '' : label}
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
                            {index === 0 ? '' : label}
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
                            index === 0 ? 'border-l-0' : index === columns.length - 1 ? 'border-r-0' : ''
                          }`}
                        >
                          {key === 'povecanRizik' ? (
                            item[key] ? 'DA' : 'NE'
                          ) : key === 'bzrOdradjeno' ? (
                            <Checkbox
                              checked={item[key]}
                              onChange={() => handleCheckboxChange(item.id, 'bzrOdradjeno')}
                              className="w-4 h-4"
                            />
                          ) : key === 'datumNarednogBZR' || key === 'osposobljavanjeBZR' || key === 'osposobljavanjeZOP' || key === 'datumNarednogZOP' ? (
                            <div className="flex items-center">
                              <span className="flex-1">{formatDate(item[key])}</span>
                              {key === 'datumNarednogBZR' && (
                                <div className="w-[40px] flex justify-center">
                                  <Checkbox
                                    checked={item.prikaziUPodsetniku}
                                    onChange={() => handleCheckboxChange(item.id, 'prikaziUPodsetniku')}
                                    className="w-4 h-4"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            item[key]
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap border-r-0">
                        <div className="flex items-center w-full gap-2">
                          <button className="text-gray-500 hover:text-[#FF9D00] dark:text-gray-400 dark:hover:text-[#FF9D00]">
                            <LightbulbIcon className="size-5" />
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
      </LocalizationProvider>
    </ThemeProvider>
  );
}
