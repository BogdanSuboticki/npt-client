"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { EditButtonIcon, DeleteButtonIcon, LightbulbIcon } from "../../icons";
import PaginationWithTextAndIcon from "../../components/ui/pagination/PaginationWithTextAndIcon";
import FilterDropdown from "../../components/ui/dropdown/FilterDropdown";
import ItemsPerPageDropdown from "../../components/ui/dropdown/ItemsPerPageDropdown";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import CustomDatePicker from "../../components/form/input/DatePicker";
import Checkbox from "../../components/form/input/Checkbox";



interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface LekarskiPreglediData {
  id: number;
  zaposleni: string;
  radnoMesto: string;
  povecanRizik: boolean;
  nocniRad: boolean;
  vrstaLekarskog: string;
  datumLekarskog: Date;
  datumNarednogLekarskog: Date;
  [key: string]: any;
}

interface DataTableProps {
  data: LekarskiPreglediData[];
  columns: Column[];
}

export default function LekarskiPreglediDataTable({ data: initialData, columns }: DataTableProps) {

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>(columns.find(col => col.sortable)?.key || columns[0].key);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { isOpen, openModal, closeModal } = useModal();
  const [modalDate, setModalDate] = useState<Date>(new Date());
  const [showAktivni, setShowAktivni] = useState(false);
  
  // Get unique values for dropdowns
  const uniqueZaposleni = useMemo(() => {
    return Array.from(new Set(initialData.map(item => item.zaposleni)));
  }, [initialData]);

  const uniqueVrsteLekarskog = useMemo(() => {
    return ["Predhodni", "Periodični", "Vanredni"];
  }, []);

  // Initialize with all items selected
  const [selectedZaposleni, setSelectedZaposleni] = useState<string[]>(uniqueZaposleni);
  const [selectedVrsteLekarskog, setSelectedVrsteLekarskog] = useState<string[]>(uniqueVrsteLekarskog);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const filteredAndSortedData = useMemo(() => {
    return initialData
      .filter((item) => {
        if (selectedZaposleni.length === 0 || selectedVrsteLekarskog.length === 0) {
          return false;
        }
        const matchesZaposleni = selectedZaposleni.includes(item.zaposleni);
        const matchesVrsta = selectedVrsteLekarskog.includes(item.vrstaLekarskog);
        const matchesDateRange = (!dateFrom || item.datumLekarskog >= dateFrom) &&
                               (!dateTo || item.datumLekarskog <= dateTo);
        const matchesAktivni = !showAktivni || item.aktivan;
        return matchesZaposleni && matchesVrsta && matchesDateRange && matchesAktivni;
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
  }, [sortKey, sortOrder, selectedZaposleni, selectedVrsteLekarskog, dateFrom, dateTo, initialData, showAktivni]);

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

  const handleCheckboxClick = () => {
    setModalDate(new Date()); // Reset to today's date when opening
    openModal();
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving lekarski pregled with date:", modalDate);
    closeModal();
  };

  const handleDateChange = (value: Date | null) => {
    if (value) {
      setModalDate(value);
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

          <div className="flex flex-col lg:flex-row gap-4">
            <FilterDropdown
              label="Zaposleni"
              options={uniqueZaposleni}
              selectedOptions={selectedZaposleni}
              onSelectionChange={setSelectedZaposleni}
            />
            <FilterDropdown
              label="Vrsta lekarskog"
              options={uniqueVrsteLekarskog}
              selectedOptions={selectedVrsteLekarskog}
              onSelectionChange={setSelectedVrsteLekarskog}
            />
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
            <div className="flex items-center gap-2">
              <Checkbox
                checked={showAktivni}
                onChange={(checked) => setShowAktivni(checked)}
                className="w-4 h-4"
                id="aktivniZaposleni"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer" htmlFor="aktivniZaposleni">
                Aktivni zaposleni
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
                      ) : key === 'povecanRizik' || key === 'nocniRad' ? (
                        item[key] ? 'DA' : 'NE'
                      ) : key === 'datumLekarskog' || key === 'datumNarednogLekarskog' ? (
                        formatDate(item[key])
                      ) : (
                        item[key]
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap border-r-0">
                    <div className="flex items-center w-full gap-2">
                      <button 
                        className="text-gray-500 hover:text-success-500 dark:text-gray-400 dark:hover:text-success-500"
                        onClick={handleCheckboxClick}
                      >
                        <svg
                          className="size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="12"
                            height="12"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <path
                            d="M6 8L8 10L10 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </button>
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

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-5 lg:p-8"
      >
        <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
          Da li je izvršen novi lekarski pregled?
        </h4>
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Datum izvršenog pregleda:
          </p>
          <CustomDatePicker
            value={modalDate}
            onChange={handleDateChange}
          />
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
