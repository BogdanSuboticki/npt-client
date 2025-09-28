"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { EditButtonIcon } from "../../icons";
import PaginationWithTextAndIcon from "../../components/ui/pagination/PaginationWithTextAndIcon";
import FilterDropdown from "../../components/ui/dropdown/FilterDropdown";
import ItemsPerPageDropdown from "../../components/ui/dropdown/ItemsPerPageDropdown";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface AngazovanjaData {
  id: number;
  redniBroj: number;
  imePrezime: string;
  radnoMesto: string;
  vrstaAngazovanja: string;
  lokacija: string;
  pocetakAngazovanja: string;
  prestanakAngazovanja: string | null;
  [key: string]: any;
}

interface DataTableProps {
  data: AngazovanjaData[];
  columns: Column[];
}

export default function AngazovanjaDataTable({ data: initialData, columns }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>(columns.find(col => col.sortable)?.key || columns[0].key);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Get unique values for dropdowns
  const uniqueImePrezime = useMemo(() => {
    return Array.from(new Set(initialData.map(item => item.imePrezime)));
  }, [initialData]);

  const uniqueRadnoMesto = useMemo(() => {
    return Array.from(new Set(initialData.map(item => item.radnoMesto)));
  }, [initialData]);

  const uniqueVrstaAngazovanja = useMemo(() => {
    return Array.from(new Set(initialData.map(item => item.vrstaAngazovanja)));
  }, [initialData]);

  const uniqueLokacija = useMemo(() => {
    return Array.from(new Set(initialData.map(item => item.lokacija)));
  }, [initialData]);

  // Initialize with all items selected
  const [selectedImePrezime, setSelectedImePrezime] = useState<string[]>(uniqueImePrezime);
  const [selectedRadnoMesto, setSelectedRadnoMesto] = useState<string[]>(uniqueRadnoMesto);
  const [selectedVrstaAngazovanja, setSelectedVrstaAngazovanja] = useState<string[]>(uniqueVrstaAngazovanja);
  const [selectedLokacija, setSelectedLokacija] = useState<string[]>(uniqueLokacija);

  const filteredAndSortedData = useMemo(() => {
    return initialData
      .filter((item) => {
        if (selectedImePrezime.length === 0 || selectedRadnoMesto.length === 0 || 
            selectedVrstaAngazovanja.length === 0 || selectedLokacija.length === 0) {
          return false;
        }
        const matchesImePrezime = selectedImePrezime.includes(item.imePrezime);
        const matchesRadnoMesto = selectedRadnoMesto.includes(item.radnoMesto);
        const matchesVrstaAngazovanja = selectedVrstaAngazovanja.includes(item.vrstaAngazovanja);
        const matchesLokacija = selectedLokacija.includes(item.lokacija);
        return matchesImePrezime && matchesRadnoMesto && matchesVrstaAngazovanja && matchesLokacija;
      })
      .sort((a, b) => {
        if (typeof a[sortKey] === "number" && typeof b[sortKey] === "number") {
          return sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
        }
        
        return sortOrder === "asc"
          ? String(a[sortKey]).localeCompare(String(b[sortKey]))
          : String(b[sortKey]).localeCompare(String(a[sortKey]));
      });
  }, [sortKey, sortOrder, selectedImePrezime, selectedRadnoMesto, selectedVrstaAngazovanja, selectedLokacija, initialData]);

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

  const handleEdit = (item: AngazovanjaData) => {
    // Here you would typically open an edit modal or navigate to edit page
    console.log('Editing item:', item);
    // For now, we'll just show an alert with edit options
    const action = window.confirm(
      `Želite li da:\n1. OK - Editujete angažovanje\n2. Cancel - Prekinete angažovanje (današnji datum)`
    );
    
    if (action) {
      // Edit functionality - open edit modal
      alert('Edit modal would open here');
    } else {
      // Set prestanak to today's date
      const today = new Date().toISOString().split('T')[0];
      console.log(`Setting prestanak angažovanja to: ${today}`);
      alert(`Angažovanje je prekinuto. Datum prestanka: ${today}`);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Aktivan";
    return new Date(dateString).toLocaleDateString('sr-RS');
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

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
            <div className="w-full lg:w-50">
              <FilterDropdown
                label="Ime i prezime"
                options={uniqueImePrezime}
                selectedOptions={selectedImePrezime}
                onSelectionChange={setSelectedImePrezime}
              />
            </div>
            <div className="w-full lg:w-50">
              <FilterDropdown
                label="Radno mesto"
                options={uniqueRadnoMesto}
                selectedOptions={selectedRadnoMesto}
                onSelectionChange={setSelectedRadnoMesto}
              />
            </div>
            <div className="w-full lg:w-60">
              <FilterDropdown
                label="Vrsta angažovanja"
                options={uniqueVrstaAngazovanja}
                selectedOptions={selectedVrstaAngazovanja}
                onSelectionChange={setSelectedVrstaAngazovanja}
              />
            </div>
            <div className="w-full lg:w-45">
              <FilterDropdown
                label="Lokacija"
                options={uniqueLokacija}
                selectedOptions={selectedLokacija}
                onSelectionChange={setSelectedLokacija}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-h-[200px] ">
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
                      ) : key === 'pocetakAngazovanja' || key === 'prestanakAngazovanja' ? (
                        formatDate(item[key])
                      ) : (
                        item[key]
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap border-r-0">
                    <div className="flex items-center w-full gap-2">
                      <button 
                        className="text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF]"
                        onClick={() => handleEdit(item)}
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
