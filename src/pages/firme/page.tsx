"use client";

import React, { useState } from "react";
import FirmeDataTable from "./FirmeDataTable";
import FirmeForm from "./FirmeForm";
import Button from "../../components/ui/button/Button";
import { usePageContext } from "../../hooks/usePageContext";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";

// Sample data for Moje Preduzeće context
const mojaFirmaData = [
  {
    id: 1,
    redniBroj: 1,
    naziv: "Moje Preduzeće 1",
    adresa: "Adresa Moje Preduzeće 1",
    mesto: "Beograd",
    pib: "1234567890",
    maticniBroj: "1234567890",
    delatnost: "IT delatnost",
    datumIstekaUgovora: new Date("2024-12-31"),
    aktivan: true,
  },
  {
    id: 2,
    redniBroj: 2,
    naziv: "Moje Preduzeće 2",
    adresa: "Adresa Moje Preduzeće 2",
    mesto: "Novi Sad",
    pib: "0987654321",
    maticniBroj: "0987654321",
    delatnost: "Proizvodnja",
    datumIstekaUgovora: new Date("2024-06-30"),
    aktivan: true,
  },
];

// Sample data for Komitenti context
const komitentiData = [
  {
    id: 1,
    redniBroj: 1,
    naziv: "Komitent Preduzeće 1",
    adresa: "Adresa Komitent 1",
    mesto: "Niš",
    pib: "1122334455",
    maticniBroj: "1122334455",
    delatnost: "Uslužne delatnosti",
    datumIstekaUgovora: new Date("2024-03-15"),
    aktivan: true,
  },
  {
    id: 2,
    redniBroj: 2,
    naziv: "Komitent Preduzeće 2",
    adresa: "Adresa Komitent 2",
    mesto: "Kragujevac",
    pib: "5566778899",
    maticniBroj: "5566778899",
    delatnost: "Trgovina",
    datumIstekaUgovora: new Date("2024-09-20"),
    aktivan: true,
  },
  {
    id: 3,
    redniBroj: 3,
    naziv: "Komitent Preduzeće 3",
    adresa: "Adresa Komitent 3",
    mesto: "Subotica",
    pib: "9988776655",
    maticniBroj: "9988776655",
    delatnost: "Poljoprivreda",
    datumIstekaUgovora: new Date("2024-11-10"),
    aktivan: false,
  },
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "naziv", label: "Naziv preduzeća/radnje", sortable: true },
  { key: "adresa", label: "Adresa", sortable: true },
  { key: "mesto", label: "Mesto", sortable: true },
  { key: "pib", label: "PIB", sortable: true },
  { key: "maticniBroj", label: "Matični broj", sortable: true },
  { key: "delatnost", label: "Delatnost", sortable: true },
  { key: "datumIstekaUgovora", label: "Datum isteka ugovora", sortable: true },
];

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in Preduzeće component:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <div className="text-red-500 mb-2">Došlo je do greške pri učitavanju stranice.</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {this.state.error?.message}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Firme: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const context = usePageContext();

  // State for data management
  const [mojaFirmaState, setMojaFirmaState] = useState(mojaFirmaData);
  const [komitentiState, setKomitentiState] = useState(komitentiData);

  // Get data based on context
  const getDataForContext = () => {
    switch (context) {
      case 'komitenti':
        return komitentiState;
      case 'moja-firma':
      default:
        return mojaFirmaState;
    }
  };

  const getDataSetter = () => {
    switch (context) {
      case 'komitenti':
        return setKomitentiState;
      case 'moja-firma':
      default:
        return setMojaFirmaState;
    }
  };

  const handleSave = (data: any) => {
    // Here you would typically save the data to your backend
    console.log(`Saving ${editingItem ? 'updated' : 'new'} entry for ${context}:`, data);
    
    const setter = getDataSetter();
    
    if (editingItem) {
      // Update existing item
      setter((prev: any[]) => 
        prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, ...data, id: editingItem.id }
            : item
        )
      );
      setEditingItem(null);
    } else {
      // Add new item to the appropriate data array
      const newItem = {
        id: getDataForContext().length + 1,
        ...data,
      };
      setter((prev: any[]) => [...prev, newItem]);
    }
    setShowForm(false);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      const setter = getDataSetter();
      setter((prev: any[]) => prev.filter(d => d.id !== itemToDelete.id));
      setItemToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Preduzeća/Radnje
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={getDataForContext()}
                columns={columns}
                title="Preduzeća"
                filename={`preduzeca-${context}`}
              />
              <Button
                onClick={() => setShowForm(true)}
                size="sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Novi Unos
              </Button>
            </div>
          </div>
          
          {/* Mobile buttons div with same width as table */}
          <div className="sm:hidden mt-4">
            <div className="flex gap-4 w-full">
              <div className="flex-1">
                <ExportPopoverButton
                  data={getDataForContext()}
                  columns={columns}
                  title="Preduzeća"
                  filename={`preduzeca-${context}`}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <Button
                  onClick={() => setShowForm(true)}
                  size="sm"
                  className="w-full"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Novi Unos
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)]">
          <FirmeDataTable 
            data={getDataForContext()}
            columns={columns}
            onDeleteClick={handleDeleteClick}
            onEditClick={handleEditClick}
          />
        </div>

        <FirmeForm 
          isOpen={showForm}
          onClose={handleFormClose}
          onSave={handleSave}
          initialData={editingItem}
        />

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Potvrda brisanja"
          message="Da li ste sigurni da želite da obrišete ovaj zapis?"
          confirmText="Obriši"
          cancelText="Otkaži"
          type="danger"
        />
      </div>
    </ErrorBoundary>
  );
};

export default Firme; 