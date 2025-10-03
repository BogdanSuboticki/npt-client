"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { EditButtonIcon, DeleteButtonIcon } from "../../icons";
import PaginationWithTextAndIcon from "../../components/ui/pagination/PaginationWithTextAndIcon";
import Checkbox from "../../components/form/input/Checkbox";
import FilterDropdown from "../../components/ui/dropdown/FilterDropdown";
import ItemsPerPageDropdown from "../../components/ui/dropdown/ItemsPerPageDropdown";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface OpremaData {
  id: number;
  redniBroj: number;
  nazivLZS: string;
  vrstaOpreme: string;
  fabrickBroj: string;
  inventarniBroj: string;
  lokacija: string;
  godinaProizvodnje: number;
  intervalPregleda: number;
  napomena: string;
  iskljucenaIzPracenja: boolean;
  standard?: string;
  [key: string]: any;
}

interface DataTableTwoProps {
  data: OpremaData[];
  columns: Column[];
  onEditClick?: (item: OpremaData) => void;
  onDeleteClick?: (item: OpremaData) => void;
}

export default function OpremaDataTable({ data: initialData, columns, onEditClick, onDeleteClick }: DataTableTwoProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const effectiveColumns = useMemo(() => {
    const hasStandard = columns?.some(col => col.key === 'standard');
    if (hasStandard) return columns;
    return [
      ...columns,
      { key: 'standard', label: 'Standard', sortable: true } as Column,
    ];
  }, [columns]);
  const [sortKey, setSortKey] = useState<string>(effectiveColumns[0]?.key || 'redniBroj');
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [data, setData] = useState<OpremaData[]>(initialData);

  // Seed mock data when none provided
  useEffect(() => {
    if (!initialData || initialData.length === 0) {
      setData([
        {
          id: 1,
          redniBroj: 1,
          nazivOpreme: 'Zaštitna kaciga',
          nazivLZS: 'Zaštitna kaciga',
          vrstaOpreme: 'LZS',
          fabrickBroj: 'FK-001',
          inventarniBroj: 'INV-001',
          lokacija: 'Magacin',
          godinaProizvodnje: 2023,
          intervalPregleda: 24,
          napomena: '',
          iskljucenaIzPracenja: false,
          standard: 'EN 397',
        },
        {
          id: 2,
          redniBroj: 2,
          nazivOpreme: 'Zaštitne rukavice',
          nazivLZS: 'Zaštitne rukavice',
          vrstaOpreme: 'LZS',
          fabrickBroj: 'FK-002',
          inventarniBroj: 'INV-002',
          lokacija: 'Skladište 1',
          godinaProizvodnje: 2024,
          intervalPregleda: 6,
          napomena: '',
          iskljucenaIzPracenja: false,
          standard: 'EN 388',
        },
        {
          id: 3,
          redniBroj: 3,
          nazivOpreme: 'Sigurnosna obuća',
          nazivLZS: 'Sigurnosna obuća',
          vrstaOpreme: 'LZS',
          fabrickBroj: 'FK-003',
          inventarniBroj: 'INV-003',
          lokacija: 'Magacin',
          godinaProizvodnje: 2022,
          intervalPregleda: 12,
          napomena: '',
          iskljucenaIzPracenja: false,
          standard: 'EN ISO 20345',
        },
      ]);
    }
  }, [initialData]);
  
  // Get unique values for dropdowns
  const uniqueNaziviOpreme = useMemo(() => {
    try {
      return Array.from(new Set(data?.map(item => item.nazivOpreme) || []));
    } catch (error) {
      console.error('Error getting unique equipment names:', error);
      return [];
    }
  }, [data]);

  const uniqueVrsteOpreme = useMemo(() => {
    try {
      return Array.from(new Set(data?.map(item => item.vrstaOpreme) || []));
    } catch (error) {
      console.error('Error getting unique equipment types:', error);
      return [];
    }
  }, [data]);

  const uniqueLokacije = useMemo(() => {
    try {
      return Array.from(new Set(data?.map(item => item.lokacija) || []));
    } catch (error) {
      console.error('Error getting unique locations:', error);
      return [];
    }
  }, [data]);

  const uniqueYears = useMemo(() => {
    try {
      return Array.from(new Set(data?.map(item => item.godinaProizvodnje) || [])).map(String);
    } catch (error) {
      console.error('Error getting unique years:', error);
      return [];
    }
  }, [data]);

  // Set all as selected by default
  const [selectedNazivOpreme, setSelectedNazivOpreme] = useState<string[]>(uniqueNaziviOpreme);
  const [selectedVrstaOpreme, setSelectedVrstaOpreme] = useState<string[]>(uniqueVrsteOpreme);
  const [selectedLokacije, setSelectedLokacije] = useState<string[]>(uniqueLokacije);
  const [selectedYears, setSelectedYears] = useState<string[]>(uniqueYears);

  // Update selected options if unique values change
  useEffect(() => {
    setSelectedNazivOpreme(uniqueNaziviOpreme);
  }, [uniqueNaziviOpreme]);
  useEffect(() => {
    setSelectedVrstaOpreme(uniqueVrsteOpreme);
  }, [uniqueVrsteOpreme]);
  useEffect(() => {
    setSelectedLokacije(uniqueLokacije);
  }, [uniqueLokacije]);
  useEffect(() => {
    setSelectedYears(uniqueYears);
  }, [uniqueYears]);

  // Safe data processing
  const filteredAndSortedData = useMemo(() => {
    try {
      if (!data) return [];

      return data
        .filter((item) => {
          try {
            const matchesNaziv = selectedNazivOpreme.length === 0 || selectedNazivOpreme.includes(item.nazivOpreme);
            const matchesVrsta = selectedVrstaOpreme.length === 0 || selectedVrstaOpreme.includes(item.vrstaOpreme);
            const matchesLokacija = selectedLokacije.length === 0 || selectedLokacije.includes(item.lokacija);
            const matchesGodina = selectedYears.length === 0 || selectedYears.includes(String(item.godinaProizvodnje));

            return matchesNaziv && matchesVrsta && matchesLokacija && matchesGodina;
          } catch (error) {
            console.error('Error filtering item:', error);
            return false;
          }
        })
        .sort((a, b) => {
          try {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            
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
  }, [data, sortKey, sortOrder, selectedNazivOpreme, selectedVrstaOpreme, selectedLokacije, selectedYears]);

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

  const handleCheckboxChange = (id: number, field: 'iskljucenaIzPracenja') => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, [field]: !item[field] }
          : item
      )
    );
  };

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
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-2">
              <FilterDropdown
                label="Naziv opreme"
                options={uniqueNaziviOpreme}
                selectedOptions={selectedNazivOpreme}
                onSelectionChange={setSelectedNazivOpreme}
              />
              <FilterDropdown
                label="Vrsta opreme"
                options={uniqueVrsteOpreme}
                selectedOptions={selectedVrstaOpreme}
                onSelectionChange={setSelectedVrstaOpreme}
              />
              <FilterDropdown
                label="Lokacija"
                options={uniqueLokacije}
                selectedOptions={selectedLokacije}
                onSelectionChange={setSelectedLokacije}
              />
              <FilterDropdown
                label="Godina proizvodnje"
                options={uniqueYears}
                selectedOptions={selectedYears}
                onSelectionChange={setSelectedYears}
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
                {effectiveColumns.map(({ key, label, sortable }, index) => (
                  <TableCell
                    key={key}
                    isHeader
                    className={`px-4 py-3 border border-gray-100 dark:border-white/[0.05] ${
                      index === 0 ? 'border-l-0' : index === effectiveColumns.length - 1 ? 'border-r-0' : ''
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
                  {effectiveColumns.map(({ key }, index) => (
                    <TableCell
                      key={key}
                      className={`px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 ${
                        index === 0 ? 'border-l-0' : index === effectiveColumns.length - 1 ? 'border-r-0' : ''
                      }`}
                    >
                      {key === 'fabrickInventarniBroj' ? (
                        <span>{item.fabrickBroj}<strong className="font-bold">/</strong>{item.inventarniBroj}</span>
                      ) : key === 'iskljucenaIzPracenja' ? (
                        <Checkbox
                          checked={item[key]}
                          onChange={() => handleCheckboxChange(item.id, key)}
                          className="w-4 h-4"
                        />
                      ) : (
                        item[key]
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap border-r-0">
                    <div className="flex items-center w-full gap-2">
                      <button 
                        onClick={() => onEditClick?.(item)}
                        className="text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF]"
                      >
                        <EditButtonIcon className="size-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteClick?.(item)}
                        className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                      >
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
  );
} 