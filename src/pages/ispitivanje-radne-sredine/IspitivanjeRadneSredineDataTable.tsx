"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { LightbulbIcon, EditButtonIcon, DeleteButtonIcon } from "../../icons";
import PaginationWithTextAndIcon from "../../components/ui/pagination/PaginationWithTextAndIcon";
import CustomDatePicker from "../../components/form/input/DatePicker";
import NovoIspitivanjeForm from "./NovoIspitivanjeForm";
import FilterDropdown from "../../components/ui/dropdown/FilterDropdown";
import ItemsPerPageDropdown from "../../components/ui/dropdown/ItemsPerPageDropdown";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Slider from "../../components/ui/Slider";
import Checkbox from "../../components/form/input/Checkbox";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface IspitivanjeData {
  id: number;
  redniBroj: number;
  nazivLokacije: string;
  brojMernihMesta: number;
  intervalIspitivanja: string;
  [key: string]: any;
}

interface DataTableProps {
  data: IspitivanjeData[];
  columns: Column[];
  onDeleteClick?: (item: IspitivanjeData) => void;
}

interface TipIspitivanjaData {
  key: string;
  naziv: string;
  selected: boolean;
  ispravno: boolean;
  datumIspitivanja: Date | null;
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

export default function IspitivanjeRadneSredineDataTable({ data: initialData, columns, onDeleteClick }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>(columns[0]?.key || 'redniBroj');
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [data] = useState<IspitivanjeData[]>(initialData);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [isNovoFormOpen, setIsNovoFormOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const [editingItem, setEditingItem] = useState<IspitivanjeData | null>(null);
  const [editTipoviIspitivanja, setEditTipoviIspitivanja] = useState<TipIspitivanjaData[]>([]);
  
  // Get unique values for dropdowns
  const uniqueLokacije = useMemo(() => {
    return Array.from(new Set(data.map(item => item.nazivLokacije)));
  }, [data]);

  // Initialize with all items selected
  const [selectedLokacije, setSelectedLokacije] = useState<string[]>(uniqueLokacije);

  // Safe data processing
  const filteredAndSortedData = useMemo(() => {
    try {
      if (!data) return [];

      return data
        .filter((item) => {
          try {
            const matchesDateRange = (!dateFrom || new Date(item.datumIspitivanja) >= dateFrom) &&
                                   (!dateTo || new Date(item.datumIspitivanja) <= dateTo);
            
            const matchesLocation = selectedLokacije.includes(item.nazivLokacije);

            return matchesDateRange && matchesLocation;
          } catch (error) {
            console.error('Error filtering item:', error);
            return false;
          }
        })
        .sort((a, b) => {
          try {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            
            if (sortKey.includes('datum')) {
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
  }, [data, sortKey, sortOrder, dateFrom, dateTo, selectedLokacije]);

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

  // Function to render special cell content for specific columns
  const renderCellContent = (key: string, value: any) => {
    const specialColumns = ['mikroklimaLetnja', 'mikroklimaZimska', 'fizickeStetnosti', 'hemijskeStetnosti', 'osvetljenje'];
    
    if (specialColumns.includes(key)) {
      // Check if value is an object with dates
      if (value && typeof value === 'object' && value.prethodnoIspitivanje && value.narednoIspitivanje) {
        return (
          <div className="flex flex-col gap-2">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Prethodno ispitivanje: <span className="font-medium">{value.prethodnoIspitivanje}</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Naredno ispitivanje: <span className="font-medium">{value.narednoIspitivanje}</span>
            </div>
            <button 
              className="px-3 py-1 text-xs bg-brand-500 text-white rounded hover:bg-brand-600 transition-colors"
              onClick={() => handleIzvrsiIspitivanje(key)}
            >
              Izvrši ispitivanje
            </button>
          </div>
        );
      }
      
      // Fallback for old data structure
      return (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Prethodno ispitivanje: <span className="font-medium">-</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Naredno ispitivanje: <span className="font-medium">-</span>
          </div>
          <button 
            className="px-3 py-1 text-xs bg-brand-500 text-white rounded hover:bg-brand-600 transition-colors"
            onClick={() => handleIzvrsiIspitivanje(key)}
          >
            Izvrši ispitivanje
          </button>
        </div>
      );
    }
    
    return key.includes('datum') ? formatDate(value) : value;
  };

  const handleIzvrsiIspitivanje = (columnKey: string) => {
    setSelectedColumn(columnKey);
    setIsNovoFormOpen(true);
  };

  const handleNovoIspitivanjeSave = (formData: any) => {
    console.log('Novo ispitivanje data:', formData, 'for column:', selectedColumn);
    // Handle the form data here
    setIsNovoFormOpen(false);
  };

  const handleEditClick = (item: IspitivanjeData) => {
    setEditingItem(item);
    
    // Initialize the testing types based on the item data
    const tipoviIspitivanjaOptions = [
      {
        key: 'mikroklimaLetnja',
        naziv: 'Ispitivanje Mikroklime letnje',
      },
      {
        key: 'mikroklimaZimska',
        naziv: 'Ispitivanje Mikroklime zimske',
      },
      {
        key: 'fizickeStetnosti',
        naziv: 'Ispitivanje Fizičkih štetnosti',
      },
      {
        key: 'hemijskeStetnosti',
        naziv: 'Ispitivanje Hemijskih štetnosti',
      },
      {
        key: 'osvetljenje',
        naziv: 'Ispitivanje Osvetljenja',
      }
    ];

    const initializedTipovi = tipoviIspitivanjaOptions.map(tipOption => {
      const tipData = item[tipOption.key];
      if (tipData && typeof tipData === 'object' && tipData.prethodnoIspitivanje) {
        return {
          key: tipOption.key,
          naziv: tipOption.naziv,
          selected: true,
          ispravno: true, // Default to true, can be adjusted based on your data structure
          datumIspitivanja: tipData.prethodnoIspitivanje ? new Date(tipData.prethodnoIspitivanje) : null
        };
      }
      return {
        key: tipOption.key,
        naziv: tipOption.naziv,
        selected: false,
        ispravno: true,
        datumIspitivanja: null
      };
    });

    setEditTipoviIspitivanja(initializedTipovi);
    openEditModal();
  };

  const handleEditTipToggle = (key: string) => {
    setEditTipoviIspitivanja(prev => prev.map(tip => 
      tip.key === key ? { ...tip, selected: !tip.selected } : tip
    ));
  };

  const handleEditTipStatusChange = (key: string, ispravno: boolean) => {
    setEditTipoviIspitivanja(prev => prev.map(tip => 
      tip.key === key ? { ...tip, ispravno } : tip
    ));
  };

  const handleEditTipDateChange = (key: string, datum: Date | null) => {
    setEditTipoviIspitivanja(prev => prev.map(tip => 
      tip.key === key ? { ...tip, datumIspitivanja: datum } : tip
    ));
  };

  const handleEditSelectAll = () => {
    setEditTipoviIspitivanja(prev => prev.map(tip => ({ ...tip, selected: true })));
  };

  const handleEditSelectNone = () => {
    setEditTipoviIspitivanja(prev => prev.map(tip => ({ ...tip, selected: false })));
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      const selectedTipovi = editTipoviIspitivanja.filter(tip => tip.selected);
      console.log("Updating item:", editingItem.id, "with tipovi:", selectedTipovi);
      // You would typically update the data here
    }
    closeEditModal();
  };

  const getFormTitle = (columnKey: string) => {
    const titles: { [key: string]: string } = {
      'mikroklimaLetnja': 'Ispitivanje Mikroklime letnje',
      'mikroklimaZimska': 'Ispitivanje Mikroklime zimske',
      'fizickeStetnosti': 'Ispitivanje Fizičkih štetnosti',
      'hemijskeStetnosti': 'Ispitivanje Hemijskih štetnosti',
      'osvetljenje': 'Ispitivanje Osvetljenja'
    };
    return titles[columnKey] || 'Novo ispitivanje';
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-white dark:bg-[#1D2939] max-w-full">
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
                  label="Prikazane lokacije"
                  options={uniqueLokacije}
                  selectedOptions={selectedLokacije}
                  onSelectionChange={setSelectedLokacije}
                />

                {/* Date Range */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
                  <div className="relative w-full lg:w-42">
                    <CustomDatePicker
                      value={dateFrom}
                      onChange={(newValue: Date | null) => setDateFrom(newValue)}
                      placeholder="Datum od"
                    />
                  </div>
                  <div className="relative w-full lg:w-42">
                    <CustomDatePicker
                      value={dateTo}
                      onChange={(newValue: Date | null) => setDateTo(newValue)}
                      placeholder="Datum do"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive-container w-full overflow-x-auto custom-scrollbar">
            <div className="min-h-[200px] !max-w-[100px]">
              <Table className="">
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
                          className={`px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 ${
                            !['mikroklimaLetnja', 'mikroklimaZimska', 'fizickeStetnosti', 'hemijskeStetnosti', 'osvetljenje'].includes(key) ? 'whitespace-nowrap' : ''
                          } ${
                            index === 0 ? 'border-l-0' : index === columns.length - 1 ? 'border-r-0' : ''
                          }`}
                        >
                          {renderCellContent(key, item[key])}
                        </TableCell>
                      ))}
                      <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap border-r-0">
                        <div className="flex items-center w-full gap-2">
                          <div className="relative inline-block group">
                            <button className="text-gray-500 hover:text-[#FF9D00] dark:text-gray-400 dark:hover:text-[#FF9D00]">
                              <LightbulbIcon className="w-5 h-5" />
                            </button>
                            <div className="invisible absolute top-full left-1/2 mt-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100 z-50">
                              <div className="relative">
                                <div className="drop-shadow-4xl whitespace-nowrap rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white">
                                  Preporuke
                                </div>
                                <div className="absolute -top-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-brand-600"></div>
                              </div>
                            </div>
                          </div>
                          <div className="relative inline-block group">
                            <button 
                              className="text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF]"
                              onClick={() => handleEditClick(item)}
                            >
                              <EditButtonIcon className="w-4 h-4" />
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
                              <DeleteButtonIcon className="w-4 h-4" />
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
        
        <NovoIspitivanjeForm
          isOpen={isNovoFormOpen}
          onClose={() => setIsNovoFormOpen(false)}
          onSave={handleNovoIspitivanjeSave}
          title={getFormTitle(selectedColumn)}
        />

        <Modal
          isOpen={isEditOpen}
          onClose={closeEditModal}
          className="max-w-[900px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
        >
          <div className="flex flex-col h-full">
            <div className="p-5 lg:p-5 lg:pt-10 lg:pl-10 pb-0">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Izmena Ispitivanja Radne Sredine</h2>
            </div>
            {editingItem && (
              <form onSubmit={handleEditSave} className="flex flex-col flex-1 min-h-0">
                <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <Label>Lokacija *</Label>
                      <input
                        type="text"
                        value={editingItem.nazivLokacije}
                        readOnly
                        className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    <div className="col-span-1">
                      <Label>Broj mernih mesta *</Label>
                      <input
                        type="text"
                        value={editingItem.brojMernihMesta}
                        readOnly
                        className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    <div className="col-span-1">
                      <Label>Interval ispitivanja (meseci)</Label>
                      <input
                        type="text"
                        value="36"
                        readOnly
                        className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Tipovi ispitivanja selection */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-lg font-medium text-gray-800 dark:text-white">
                        Tipovi ispitivanja *
                      </h5>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleEditSelectAll}
                          className="text-[13px] px-3 py-1"
                        >
                          Izaberi sve
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleEditSelectNone}
                          className="text-[13px] px-3 py-1"
                        >
                          Poništi sve
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {editTipoviIspitivanja.map((tip) => (
                        <div
                          key={tip.key}
                          className={`flex items-center p-3 border rounded-lg transition-colors cursor-pointer ${
                            tip.selected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                          onClick={() => handleEditTipToggle(tip.key)}
                        >
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={tip.selected}
                              onChange={() => handleEditTipToggle(tip.key)}
                              className="mr-10"
                            />
                          </div>
                          <div className="flex-1 ml-2">
                            <div className="text-sm font-medium text-gray-800 dark:text-white">
                              {tip.naziv}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual testing type configurations */}
                  {editTipoviIspitivanja.filter(tip => tip.selected).length > 0 && (
                    <div className="mt-6">
                      <h5 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                        Rezultati ispitivanja
                      </h5>
                      <div className="space-y-4">
                        {editTipoviIspitivanja.filter(tip => tip.selected).map((tip) => (
                          <div
                            key={tip.key}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                          >
                            <h6 className="font-medium text-gray-800 dark:text-white mb-3">
                              {tip.naziv}
                            </h6>
                            <div className="space-y-4">
                              <div>
                                <Slider
                                  label="Status ispitivanja"
                                  optionOne="Ispravno"
                                  optionTwo="Neispravno"
                                  value={tip.ispravno}
                                  onChange={(value) => handleEditTipStatusChange(tip.key, value)}
                                  size="full"
                                  name={`slider-edit-${tip.key.replace(/[^a-zA-Z0-9]/g, '')}`}
                                  showRedWhenFalse={true}
                                />
                              </div>

                              <div>
                                <Label>Datum ispitivanja *</Label>
                                <CustomDatePicker
                                  value={tip.datumIspitivanja}
                                  onChange={(date) => handleEditTipDateChange(tip.key, date)}
                                  placeholder="Izaberi datum ispitivanja"
                                  required
                                  className="!bg-white dark:!bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 pb-5 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
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
      </>
    );
}