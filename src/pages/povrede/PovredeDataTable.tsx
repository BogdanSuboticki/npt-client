"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { EditButtonIcon, DeleteButtonIcon } from "../../icons";
import PaginationWithTextAndIcon from "../../components/ui/pagination/PaginationWithTextAndIcon";
import FilterDropdown from "../../components/ui/dropdown/FilterDropdown";
import ItemsPerPageDropdown from "../../components/ui/dropdown/ItemsPerPageDropdown";
import CustomDatePicker from "../../components/form/input/DatePicker";
import { useSidebar } from "../../context/SidebarContext";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { completePovredaInspekcijaRok } from "../../data/rokovi";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface PovredeData {
  id: number;
  redniBroj: number;
  zaposleni: string;
  datumPovrede: Date;
  tezinaPovrede: string;
  brojPovredneListe: string;
  datumObavestenjaInspekcije: Date | null;
  datumPredajeFondu: Date | null;
  datumPreuzimanjaIzFonda: Date | null;
  datumDostavjanjaUpravi: Date | null;
  napomena: string;
  [key: string]: any;
}

interface DataTableProps {
  data: PovredeData[];
  columns: Column[];
  onDeleteClick?: (item: PovredeData) => void;
  onUpdateData?: (updatedData: PovredeData[]) => void;
}

export default function PovredeDataTable({ data: initialData, columns, onDeleteClick, onUpdateData }: DataTableProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>(columns.find(col => col.sortable)?.key || columns[0].key);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const [editingItem, setEditingItem] = useState<PovredeData | null>(null);
  const [editTezinaPovrede, setEditTezinaPovrede] = useState<string>("");
  const [editDatumPovrede, setEditDatumPovrede] = useState<Date>(new Date());
  const [editBrojPovredneListe, setEditBrojPovredneListe] = useState<string>("");
  const [editDatumObavestenjaInspekcije, setEditDatumObavestenjaInspekcije] = useState<Date | null>(null);
  const [editDatumPredajeFondu, setEditDatumPredajeFondu] = useState<Date | null>(null);
  const [editDatumPreuzimanjaIzFonda, setEditDatumPreuzimanjaIzFonda] = useState<Date | null>(null);
  const [editDatumDostavjanjaUpravi, setEditDatumDostavjanjaUpravi] = useState<Date | null>(null);
  const [editNapomena, setEditNapomena] = useState<string>("");
  const [isTezinaPovredeOpen, setIsTezinaPovredeOpen] = useState(false);
  const tezinaPovredeRef = useRef<HTMLDivElement>(null);
  const [editBrojListeNumber, setEditBrojListeNumber] = useState<string>("");
  const currentYear = new Date().getFullYear();

  // Get unique values for dropdowns
  const uniqueZaposleni = useMemo(() => {
    return Array.from(new Set(initialData.map(item => item.zaposleni)));
  }, [initialData]);

  const tezinaPovredeOptions = ["Laka", "Srednja", "Teška", "Smrtna", "Kolektivna"];

  // Update editBrojPovredneListe when number changes
  useEffect(() => {
    if (editBrojListeNumber) {
      setEditBrojPovredneListe(`PL-${editBrojListeNumber}/${currentYear}`);
    } else {
      setEditBrojPovredneListe("");
    }
  }, [editBrojListeNumber, currentYear]);

  // Initialize with all items selected
  const [selectedZaposleni, setSelectedZaposleni] = useState<string[]>(uniqueZaposleni);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (isTezinaPovredeOpen && tezinaPovredeRef.current && !tezinaPovredeRef.current.contains(target)) {
        setIsTezinaPovredeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTezinaPovredeOpen]);

  const filteredAndSortedData = useMemo(() => {
    return initialData
      .filter((item) => {
        if (selectedZaposleni.length === 0) {
          return false;
        }
        const matchesZaposleni = selectedZaposleni.includes(item.zaposleni);
        const matchesDateRange = (!dateFrom || item.datumPovrede >= dateFrom) &&
                               (!dateTo || item.datumPovrede <= dateTo);
        return matchesZaposleni && matchesDateRange;
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
  }, [sortKey, sortOrder, selectedZaposleni, dateFrom, dateTo, initialData]);

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

  const handleEditClick = (item: PovredeData) => {
    setEditingItem(item);
    setEditTezinaPovrede(item.tezinaPovrede);
    setEditDatumPovrede(item.datumPovrede);
    setEditBrojPovredneListe(item.brojPovredneListe || "");
    
    // Extract number from format PL-XXX/YYYY
    const match = item.brojPovredneListe?.match(/PL-(\d+)\/\d+/);
    setEditBrojListeNumber(match ? match[1] : "");
    
    setEditDatumObavestenjaInspekcije(item.datumObavestenjaInspekcije || null);
    setEditDatumPredajeFondu(item.datumPredajeFondu || null);
    setEditDatumPreuzimanjaIzFonda(item.datumPreuzimanjaIzFonda || null);
    setEditDatumDostavjanjaUpravi(item.datumDostavjanjaUpravi || null);
    setEditNapomena(item.napomena || "");
    setIsTezinaPovredeOpen(false);
    openEditModal();
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const wasInspekcijaSet = !!editingItem.datumObavestenjaInspekcije;
      const isInspekcijaNowSet = !!editDatumObavestenjaInspekcije;
      
      // Check if datumObavestenjaInspekcije was just set (completed)
      if (!wasInspekcijaSet && isInspekcijaNowSet) {
        // Complete the related rok
        completePovredaInspekcijaRok(editingItem.id);
      }
      
      // Update the data
      const updatedData = initialData.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            tezinaPovrede: editTezinaPovrede,
            datumPovrede: editDatumPovrede,
            brojPovredneListe: editBrojPovredneListe,
            datumObavestenjaInspekcije: editDatumObavestenjaInspekcije,
            datumPredajeFondu: editDatumPredajeFondu,
            datumPreuzimanjaIzFonda: editDatumPreuzimanjaIzFonda,
            datumDostavjanjaUpravi: editDatumDostavjanjaUpravi,
            napomena: editNapomena
          };
        }
        return item;
      });
      
      // Notify parent component of the update
      if (onUpdateData) {
        onUpdateData(updatedData);
      }
      
      console.log("Updating item:", editingItem.id, "with data:", {
        tezinaPovrede: editTezinaPovrede,
        datumPovrede: editDatumPovrede,
        brojPovredneListe: editBrojPovredneListe,
        datumObavestenjaInspekcije: editDatumObavestenjaInspekcije,
        datumPredajeFondu: editDatumPredajeFondu,
        datumPreuzimanjaIzFonda: editDatumPreuzimanjaIzFonda,
        datumDostavjanjaUpravi: editDatumDostavjanjaUpravi,
        napomena: editNapomena
      });
    }
    closeEditModal();
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

          <div className="flex flex-col lg:flex-row gap-2">
            <FilterDropdown
              label="Zaposleni"
              options={uniqueZaposleni}
              selectedOptions={selectedZaposleni}
              onSelectionChange={setSelectedZaposleni}
            />
            <div className="relative w-full lg:w-42">
              <CustomDatePicker
                value={dateFrom}
                onChange={(date) => setDateFrom(date)}
                placeholder="Datum od"
                className="bg-[#F9FAFB] dark:bg-[#101828]"
              />
            </div>
            <div className="relative w-full lg:w-42">
              <CustomDatePicker
                value={dateTo}
                onChange={(date) => setDateTo(date)}
                placeholder="Datum do"
                className="bg-[#F9FAFB] dark:bg-[#101828]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className={`min-h-[200px] ${(isExpanded || isHovered || isMobileOpen) ? 'max-w-[100px]' : 'max-w-full'}`}>
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
                      ) : key === 'datumPovrede' || key === 'datumObavestenjaInspekcije' || key === 'datumPredajeFondu' || key === 'datumPreuzimanjaIzFonda' || key === 'datumDostavjanjaUpravi' ? (
                        item[key] ? formatDate(item[key]) : '-'
                      ) : (
                        item[key]
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap border-r-0">
                    <div className="flex items-center w-full gap-2">
                      <div className="relative inline-block group">
                        <button 
                          className="text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF]"
                          onClick={() => handleEditClick(item)}
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

      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        className="max-w-[800px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          <div className="p-5 pt-10">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white">Izmena Povrede</h4>
          </div>
          {editingItem && (
            <form onSubmit={handleEditSave} className="flex flex-col flex-1 min-h-0">
              <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 pb-4">
                  <div className="w-full">
                    <Label>Zaposleni *</Label>
                    <input
                      type="text"
                      value={editingItem.zaposleni}
                      readOnly
                      className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div className="w-full">
                    <Label>Težina povrede *</Label>
                    <div className="relative w-full" ref={tezinaPovredeRef}>
                      <button
                        type="button"
                        onClick={() => setIsTezinaPovredeOpen(!isTezinaPovredeOpen)}
                        className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                      >
                        <span>{editTezinaPovrede || "Izaberi težinu povrede"}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${isTezinaPovredeOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isTezinaPovredeOpen && (
                        <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                          <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                            {tezinaPovredeOptions.map((option: string, index: number) => (
                              <div
                                key={option}
                                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                                  editTezinaPovrede === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                                } ${index === tezinaPovredeOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                                onClick={() => {
                                  setEditTezinaPovrede(option);
                                  setIsTezinaPovredeOpen(false);
                                }}
                              >
                                <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <Label>Datum povrede *</Label>
                    <CustomDatePicker
                      value={editDatumPovrede}
                      onChange={(date) => {
                        if (date) {
                          setEditDatumPovrede(date);
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="w-full">
                    <Label>Broj povredne liste</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800 dark:text-white/90 font-medium">PL-</span>
                      <input
                        type="number"
                        value={editBrojListeNumber}
                        onChange={(e) => setEditBrojListeNumber(e.target.value)}
                        className="flex-1 h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        placeholder="001"
                        min="1"
                      />
                      <span className="text-sm text-gray-800 dark:text-white/90 font-medium">/{currentYear}</span>
                    </div>
                  </div>

                  <div className="w-full">
                    <Label>Datum obaveštenja inspekcije</Label>
                    <CustomDatePicker
                      value={editDatumObavestenjaInspekcije}
                      onChange={(date) => {
                        setEditDatumObavestenjaInspekcije(date || null);
                      }}
                    />
                  </div>

                  <div className="w-full">
                    <Label>Datum predaje fondu</Label>
                    <CustomDatePicker
                      value={editDatumPredajeFondu}
                      onChange={(date) => {
                        setEditDatumPredajeFondu(date || null);
                      }}
                    />
                  </div>

                  <div className="w-full">
                    <Label>Datum preuzimanja iz fonda</Label>
                    <CustomDatePicker
                      value={editDatumPreuzimanjaIzFonda}
                      onChange={(date) => {
                        setEditDatumPreuzimanjaIzFonda(date || null);
                      }}
                    />
                  </div>

                  <div className="w-full">
                    <Label>Datum dostavljanja upravi</Label>
                    <CustomDatePicker
                      value={editDatumDostavjanjaUpravi}
                      onChange={(date) => {
                        setEditDatumDostavjanjaUpravi(date || null);
                      }}
                    />
                  </div>

                  <div className="col-span-1 lg:col-span-2">
                    <Label>Napomena</Label>
                    <textarea
                      value={editNapomena}
                      onChange={(e) => setEditNapomena(e.target.value)}
                      className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 px-5 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="pb-5 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={closeEditModal}
                    type="button"
                  >
                    Otkaži
                  </Button>
                  <Button type="submit">
                    Sačuvaj
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
} 
