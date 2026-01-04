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
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import DatePicker from "../../components/form/input/DatePicker";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface ZaduzenaOprema {
  naziv: string;
  datumOd?: Date;
  datumDo?: Date;
}

interface ZaduzenjaLzoData {
  id: number;
  redniBroj: number;
  zaposleni: string;
  radnoMesto: string;
  povecanRizik: boolean;
  zaduzenaOprema: ZaduzenaOprema[];
  [key: string]: any;
}

interface DataTableProps {
  data: ZaduzenjaLzoData[];
  columns: Column[];
  onDeleteClick?: (item: ZaduzenjaLzoData) => void;
  onUpdateData?: (updatedData: ZaduzenjaLzoData[]) => void;
}

interface EditOprema {
  id: number;
  vrstaLzs: string;
  standard: string;
  datumZaduzenja: Date | null;
  rok: string;
  narednoZaduzenje: Date | null;
}

export default function ZaduzenjaLzoDataTable({ data: initialData, columns, onDeleteClick, onUpdateData }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>(columns.find(col => col.sortable)?.key || columns[0].key);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const [editingItem, setEditingItem] = useState<ZaduzenjaLzoData | null>(null);
  const [editOprema, setEditOprema] = useState<EditOprema[]>([]);

  // Flatten data to show each piece of equipment as a separate row
  const flattenedData = useMemo(() => {
    const flattened: Array<ZaduzenjaLzoData & { opremaIndex: number; isFirstRow: boolean; totalRows: number }> = [];
    
    initialData.forEach((item) => {
      if (item.zaduzenaOprema && item.zaduzenaOprema.length > 0) {
        item.zaduzenaOprema.forEach((oprema, index) => {
          flattened.push({
            ...item,
            opremaIndex: index,
            isFirstRow: index === 0,
            totalRows: item.zaduzenaOprema.length,
            // Override with oprema-specific data
            nazivLzs: oprema.naziv,
            datumZaduzenja: oprema.datumOd,
            narednoZaduzenje: oprema.datumDo,
          });
        });
      } else {
        // If no oprema, show as single row
        flattened.push({
          ...item,
          opremaIndex: 0,
          isFirstRow: true,
          totalRows: 1,
          nazivLzs: '',
          datumZaduzenja: undefined,
          narednoZaduzenje: undefined,
        });
      }
    });
    
    return flattened;
  }, [initialData]);

  const filteredAndSortedData = useMemo(() => {
    return flattenedData
      .sort((a, b) => {
        if (sortKey === 'povecanRizik') {
          return sortOrder === "asc" 
            ? (a[sortKey] === b[sortKey] ? 0 : a[sortKey] ? -1 : 1)
            : (a[sortKey] === b[sortKey] ? 0 : a[sortKey] ? 1 : -1);
        }
        
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
  }, [sortKey, sortOrder, flattenedData]);

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

  const handleEditClick = (item: ZaduzenjaLzoData) => {
    setEditingItem(item);
    // Convert zaduzenaOprema to EditOprema format
    const opremaToEdit: EditOprema[] = item.zaduzenaOprema.map((oprema, index) => ({
      id: Date.now() + index,
      vrstaLzs: oprema.naziv,
      standard: "", // Default empty since not in original data
      datumZaduzenja: oprema.datumOd || null,
      rok: "12", // Default value
      narednoZaduzenje: oprema.datumDo || null,
    }));
    setEditOprema(opremaToEdit);
    openEditModal();
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      console.log("Updating item:", editingItem.id, "with oprema:", editOprema);
      // You would typically update the data here
    }
    closeEditModal();
  };

  const handleEditOpremaChange = (id: number, field: string, value: string | Date | null) => {
    setEditOprema(prevOprema => {
      return prevOprema.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Auto-calculate naredno zaduzenje when datum zaduzenja or rok changes
          if (field === 'datumZaduzenja' || field === 'rok') {
            if (updatedItem.datumZaduzenja && updatedItem.rok) {
              const datumZaduzenja = new Date(updatedItem.datumZaduzenja);
              const rokMonths = parseInt(updatedItem.rok) || 0;
              const narednoZaduzenje = new Date(datumZaduzenja);
              narednoZaduzenje.setMonth(narednoZaduzenje.getMonth() + rokMonths);
              updatedItem.narednoZaduzenje = narednoZaduzenje;
            } else {
              updatedItem.narednoZaduzenje = null;
            }
          }
          
          return updatedItem;
        }
        return item;
      });
    });
  };

  const handleDeleteEquipment = (item: any) => {
    // Find the original employee record
    const employeeId = item.id;
    const equipmentIndex = item.opremaIndex;
    
    // Find the employee and check how many equipment items they have
    const employee = initialData.find(emp => emp.id === employeeId);
    if (!employee) return;
    
    // If this is the last equipment item, delete the entire employee record
    if (employee.zaduzenaOprema.length === 1) {
      if (onDeleteClick) {
        onDeleteClick(employee);
      }
      return;
    }
    
    // Otherwise, just remove this equipment item
    const updatedData = initialData.map(emp => {
      if (emp.id === employeeId) {
        const updatedOprema = emp.zaduzenaOprema.filter((_, index) => index !== equipmentIndex);
        return {
          ...emp,
          zaduzenaOprema: updatedOprema
        };
      }
      return emp;
    });
    
    // Update through parent
    if (onUpdateData) {
      onUpdateData(updatedData);
    } else {
      console.log("Delete equipment:", item.nazivLzs, "from employee:", item.zaposleni);
      console.log("Updated data:", updatedData);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const formatDate = (date: Date | undefined | null): string => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('sr-RS', {
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
        <div>
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
                <TableRow key={`${item.id}-${item.opremaIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  {columns.map(({ key }, colIndex) => {
                    // Only render spanning columns on the first row of each group
                    if ((key === 'zaposleni' || key === 'radnoMesto' || key === 'povecanRizik' || key === 'redniBroj') && !item.isFirstRow) {
                      return null;
                    }
                    
                    return (
                      <TableCell
                        key={key}
                        className={`px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap ${
                          colIndex === 0 ? 'border-l-0' : colIndex === columns.length - 1 ? 'border-r-0' : ''
                        }`}
                        rowSpan={key === 'zaposleni' || key === 'radnoMesto' || key === 'povecanRizik' || key === 'redniBroj' ? item.totalRows : undefined}
                      >
                        {key === 'redniBroj' ? (
                          startIndex + index + 1
                        ) : key === 'povecanRizik' ? (
                          item[key] ? 'DA' : 'NE'
                        ) : key === 'nazivLzs' ? (
                          item.nazivLzs
                        ) : key === 'datumZaduzenja' ? (
                          formatDate(item.datumZaduzenja)
                        ) : key === 'narednoZaduzenje' ? (
                          formatDate(item.narednoZaduzenje)
                        ) : (
                          item[key]
                        )}
                      </TableCell>
                    );
                  })}
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
                          onClick={() => handleDeleteEquipment(item)}
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
        className="max-w-[1200px] w-full mx-4 p-4 lg:p-10 dark:bg-gray-800"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Izmena Zaduženja LZS</h2>
        {editingItem && (
          <form onSubmit={handleEditSave} className="max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label>Zaposleni *</Label>
                <input
                  type="text"
                  value={editingItem.zaposleni}
                  readOnly
                  className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <Label>Radno mesto</Label>
                  {editingItem.radnoMesto && (
                    <span className={`text-sm font-medium ${
                      editingItem.povecanRizik 
                        ? 'text-red-600 dark:text-red-400 mb-1.5' 
                        : 'text-blue-600 dark:text-blue-400 mb-1.5'
                    }`}>
                      {editingItem.povecanRizik ? 'Povećan rizik' : 'Nije povećan rizik'}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={editingItem.radnoMesto}
                  readOnly
                  className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="col-span-1 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <Label>Oprema</Label>
                </div>
                
                {editOprema.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700 overflow-x-auto">
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                      <div className="grid grid-cols-5 gap-4 text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[800px]">
                        <div>Naziv LZS *</div>
                        <div>Standard</div>
                        <div>Datum zaduženja *</div>
                        <div>Rok (m) *</div>
                        <div>Naredno zaduženje</div>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {editOprema.map((item) => (
                        <div key={item.id} className="px-4 py-3">
                          <div className="grid grid-cols-5 gap-4 min-w-[800px] items-start">
                            {/* Naziv LZS */}
                            <div>
                              <input
                                type="text"
                                value={item.vrstaLzs}
                                readOnly
                                className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                              />
                            </div>
                          
                            {/* Standard */}
                            <div>
                              <input
                                type="text"
                                value={item.standard}
                                readOnly
                                className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                              />
                            </div>
                          
                            {/* Datum zaduženja */}
                            <div>
                              <DatePicker
                                value={item.datumZaduzenja}
                                onChange={(date) => handleEditOpremaChange(item.id, 'datumZaduzenja', date)}
                                placeholder="Izaberi datum"
                                className="h-11 text-sm"
                              />
                            </div>
                          
                            {/* Rok */}
                            <div>
                              <input
                                type="number"
                                value={item.rok}
                                onChange={(e) => handleEditOpremaChange(item.id, 'rok', e.target.value)}
                                min="1"
                                className="w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                              />
                            </div>
                          
                            {/* Naredno zaduženje */}
                            <div>
                              <DatePicker
                                value={item.narednoZaduzenje}
                                onChange={() => {}} // No-op function since it's disabled
                                placeholder=""
                                disabled={true}
                                className="h-11 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
          </form>
        )}
      </Modal>
    </div>
  );
} 
