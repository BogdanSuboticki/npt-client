"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { CheckmarkIcon, DeleteButtonIcon, EditButtonIcon } from "../../icons";
import PaginationWithTextAndIcon from "../../components/ui/pagination/PaginationWithTextAndIcon";
import FilterDropdown from "../../components/ui/dropdown/FilterDropdown";
import ItemsPerPageDropdown from "../../components/ui/dropdown/ItemsPerPageDropdown";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Label from "../../components/form/Label";
import CustomDatePicker from "../../components/form/input/DatePicker";
import Button from "../../components/ui/button/Button";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getDaysUntilRok = (rok: Date) => {
  const today = new Date();
  const diff = rok.getTime() - today.setHours(0, 0, 0, 0);
  return Math.ceil(diff / MS_PER_DAY);
};

const getStatusLabel = (rok: Date) => {
  const daysUntil = getDaysUntilRok(rok);

  if (daysUntil < 0) {
    return "Isteklo";
  }

  if (daysUntil <= 3) {
    return "Ističe za 3 dana";
  }

  if (daysUntil <= 14) {
    return "Ističe za 14 dana";
  }

  return "U toku";
};

const getStatusClassNames = (status: string) => {
  switch (status) {
    case "U toku":
      return "bg-success-100 text-success-700 dark:bg-success-500/10 dark:text-success-300";
    case "Ističe za 14 dana":
      return "bg-warning-100 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300";
    case "Ističe za 3 dana":
      return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300";
    case "Isteklo":
      return "bg-error-100 text-error-700 dark:bg-error-500/10 dark:text-error-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

export interface RokoviData {
  id: number;
  oblast: string;
  vrstaObaveze: string;
  rok: Date;
  status: string;
  napomena: string;
  preduzece?: string;
  companyId?: string;
  povredaId?: number;
  isCompleted?: boolean;
  [key: string]: any;
}

interface RokoviDataTableProps {
  data: RokoviData[];
  columns: Column[];
  onDeleteClick?: (item: RokoviData) => void;
}

export default function RokoviDataTable({
  data: initialData,
  columns,
  onDeleteClick,
}: RokoviDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>(
    columns.find((col) => col.sortable)?.key || columns[0].key
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const [modalDate, setModalDate] = useState<Date>(new Date());
  const [editingItem, setEditingItem] = useState<RokoviData | null>(null);
  const [editRok, setEditRok] = useState<Date>(new Date());
  const [editNapomena, setEditNapomena] = useState<string>("");

  const uniqueOblasti = useMemo(() => {
    return Array.from(new Set(initialData.map((item) => item.oblast)));
  }, [initialData]);

  const uniqueVrsteObaveze = useMemo(() => {
    return Array.from(new Set(initialData.map((item) => item.vrstaObaveze)));
  }, [initialData]);

  const statusOptions = useMemo(() => {
    return Array.from(
      new Set(initialData.map((item) => getStatusLabel(item.rok)))
    );
  }, [initialData]);

  const [selectedOblasti, setSelectedOblasti] = useState<string[]>(uniqueOblasti);
  const [selectedVrsteObaveze, setSelectedVrsteObaveze] = useState<string[]>(uniqueVrsteObaveze);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(statusOptions);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  useEffect(() => {
    setSelectedOblasti(uniqueOblasti);
  }, [uniqueOblasti]);

  useEffect(() => {
    setSelectedVrsteObaveze(uniqueVrsteObaveze);
  }, [uniqueVrsteObaveze]);

  useEffect(() => {
    setSelectedStatus(statusOptions);
  }, [statusOptions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [initialData]);

  const filteredAndSortedData = useMemo(() => {
    return initialData
      .filter((item) => {
        if (
          selectedOblasti.length === 0 ||
          selectedVrsteObaveze.length === 0 ||
          selectedStatus.length === 0
        ) {
          return false;
        }

        const matchesOblast = selectedOblasti.includes(item.oblast);
        const matchesVrstaObaveze = selectedVrsteObaveze.includes(item.vrstaObaveze);
        const computedStatus = getStatusLabel(item.rok);
        const matchesStatus = selectedStatus.includes(computedStatus);
        const matchesDateRange =
          (!dateFrom || item.rok >= dateFrom) && (!dateTo || item.rok <= dateTo);

        return matchesOblast && matchesVrstaObaveze && matchesStatus && matchesDateRange;
      })
      .sort((a, b) => {
        if (sortKey === "rok") {
          const aDate = a[sortKey] instanceof Date ? a[sortKey] : new Date(a[sortKey]);
          const bDate = b[sortKey] instanceof Date ? b[sortKey] : new Date(b[sortKey]);
          return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
        }

        if (sortKey === "status") {
          const aDays = getDaysUntilRok(a.rok);
          const bDays = getDaysUntilRok(b.rok);
          return sortOrder === "asc" ? aDays - bDays : bDays - aDays;
        }

        if (typeof a[sortKey] === "number" && typeof b[sortKey] === "number") {
          return sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
        }

        return sortOrder === "asc"
          ? String(a[sortKey]).localeCompare(String(b[sortKey]))
          : String(b[sortKey]).localeCompare(String(a[sortKey]));
      });
  }, [
    sortKey,
    sortOrder,
    selectedOblasti,
    selectedVrsteObaveze,
    selectedStatus,
    dateFrom,
    dateTo,
    initialData,
  ]);

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const handleNewEntryClick = () => {
    setModalDate(new Date());
    openModal();
  };

  const handleSave = () => {
    console.log(
      "Saving rok with date:",
      modalDate,
      "status:",
      getStatusLabel(modalDate)
    );
    closeModal();
  };

  const handleDateChange = (value: Date | null) => {
    if (value) {
      setModalDate(value);
    }
  };

  const handleEditClick = (item: RokoviData) => {
    setEditingItem(item);
    setEditRok(item.rok);
    setEditNapomena(item.napomena || "");
    openEditModal();
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      console.log(
        "Updating item:",
        editingItem.id,
        "with status:",
        getStatusLabel(editRok),
        "rok:",
        editRok,
        "napomena:",
        editNapomena
      );
    }
    closeEditModal();
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const hasData = totalItems > 0;
  const displayStart = hasData ? startIndex + 1 : 0;
  const displayEnd = hasData ? endIndex : 0;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("sr-Latn-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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
            <div className="w-full lg:w-48">
              <FilterDropdown
                label="Oblast"
                options={uniqueOblasti}
                selectedOptions={selectedOblasti}
                onSelectionChange={setSelectedOblasti}
              />
            </div>
            <div className="w-full lg:w-48">
              <FilterDropdown
                label="Vrsta obaveze"
                options={uniqueVrsteObaveze}
                selectedOptions={selectedVrsteObaveze}
                onSelectionChange={setSelectedVrsteObaveze}
              />
            </div>
            <div className="w-full lg:w-40">
              <FilterDropdown
                label="Status"
                options={statusOptions}
                selectedOptions={selectedStatus}
                onSelectionChange={setSelectedStatus}
              />
            </div>
            <div className="relative w-full lg:w-42">
              <CustomDatePicker value={dateFrom} onChange={(date) => setDateFrom(date)} placeholder="Rok od" />
            </div>
            <div className="relative w-full lg:w-42">
              <CustomDatePicker value={dateTo} onChange={(date) => setDateTo(date)} placeholder="Rok do" />
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
                      index === 0
                        ? "border-l-0"
                        : index === columns.length - 1
                        ? "border-r-0"
                        : ""
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
                      <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400">{label}</p>
                    )}
                  </TableCell>
                ))}
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] border-r-0"
                >
                  <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400"></p>
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id}>
                  {columns.map(({ key }, colIndex) => (
                    <TableCell
                      key={key}
                      className={`px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 break-words ${
                        colIndex === 0
                          ? "border-l-0"
                          : colIndex === columns.length - 1
                          ? "border-r-0"
                          : ""
                      }`}
                    >
                      {key === "rok" ? (
                        formatDate(item[key])
                      ) : key === "status" ? (
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassNames(
                            getStatusLabel(item.rok)
                          )}`}
                        >
                          {getStatusLabel(item.rok)}
                        </span>
                      ) : (
                        item[key] || "-"
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 border-r-0">
                    <div className="flex items-center w-full gap-2">
                      <div className="relative inline-block group">
                        <button
                          className="text-gray-500 hover:text-success-500 dark:text-gray-400 dark:hover:text-success-500"
                          onClick={handleNewEntryClick}
                        >
                          <CheckmarkIcon className="size-4" />
                        </button>
                        <div className="invisible absolute top-full left-1/2 mt-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100 z-50">
                          <div className="relative">
                            <div className="drop-shadow-4xl whitespace-nowrap rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white">
                              Novi rok
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
              {currentData.length === 0 && (
                <TableRow>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    Nema dostupnih rokova za prikaz.
                  </td>
                </TableRow>
              )}
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
              Prikaz {displayStart} - {displayEnd} od {totalItems} zapisa
            </p>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] p-5 lg:p-8">
        <h4 className="font-semibold text-gray-800 mb-4 text-xl dark:text-white/90">Novi rok</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="space-y-4">
            <div>
              <Label>Datum roka *</Label>
              <CustomDatePicker value={modalDate} onChange={handleDateChange} />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Otkaži
            </Button>
            <Button size="sm" onClick={handleSave}>
              Sačuvaj
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        className="max-w-[800px] max-h-[90vh] dark:bg-gray-800"
      >
        <div className="flex flex-col h-full">
          <div className="p-5 lg:p-5 lg:pt-10 lg:pl-10 pb-0">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white">Izmena roka</h4>
          </div>
          {editingItem && (
            <form onSubmit={handleEditSave} className="flex flex-col flex-1 min-h-0">
              <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
                  <div className="w-full">
                    <Label>Oblast *</Label>
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={editingItem.oblast}
                        readOnly
                        className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <Label>Vrsta obaveze *</Label>
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={editingItem.vrstaObaveze}
                        readOnly
                        className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <Label>Status roka</Label>
                    <div className="flex items-center h-11">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassNames(
                          getStatusLabel(editRok)
                        )}`}
                      >
                        {getStatusLabel(editRok)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full">
                    <Label>Rok *</Label>
                    <CustomDatePicker
                      value={editRok}
                      onChange={(date) => {
                        if (date) {
                          setEditRok(date);
                        }
                      }}
                      required
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

              <div className="pt-3 pb-5 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={closeEditModal} type="button">
                    Otkaži
                  </Button>
                  <Button type="submit">Sačuvaj</Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}

