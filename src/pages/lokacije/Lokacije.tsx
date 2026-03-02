"use client";

import React, { useEffect, useState } from "react";
import LokacijeDataTable from "./LokacijeDataTable";
import LokacijeForm from "./LokacijeForm";
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { api } from "../../api/client";
import { usePageContext } from "../../hooks/usePageContext";

const mapLokacijaFromApi = (lokacija: any, index: number) => ({
  id: lokacija.id,
  redniBroj: index + 1,
  nazivLokacije: lokacija.naziv,
  brojMernihMesta: lokacija.broj_mernih_mesta,
  firmaPib: lokacija.firma_pib,
});

// Column definitions
const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "nazivLokacije", label: "Naziv lokacije", sortable: true },
  { key: "brojMernihMesta", label: "Broj mernih mesta", sortable: true },
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
    console.error('Error in Lokacije component:', error);
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

export default function Lokacije() {
  const context = usePageContext();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [firme, setFirme] = useState<any[]>([]);

  const loadLokacije = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get<{ data: any[] }>(`lokacije?context=${context}`);
      setData(response.data.map(mapLokacijaFromApi));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri učitavanju lokacija.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFirme = async () => {
    try {
      const response = await api.get<{ data: any[] }>(`firme?context=${context}`);
      setFirme(response.data.map((f: any) => ({ pib: f.pib, naziv: f.naziv })));
    } catch (error) {
      console.error("Greška pri učitavanju firmi:", error);
    }
  };

  useEffect(() => {
    loadLokacije();
    loadFirme();
  }, [context]);

  const handleSave = async (newData: any) => {
    const payload = {
      naziv: newData.nazivLokacije,
      broj_mernih_mesta: parseInt(newData.brojMernihMesta),
      firma_pib: newData.firmaPib,
    };

    if (editingItem) {
      await api.put(`lokacije/${editingItem.id}`, payload);
      setEditingItem(null);
    } else {
      await api.post("lokacije", payload);
    }
    await loadLokacije();
    setShowForm(false);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await api.del(`lokacije/${itemToDelete.id}`);
        await loadLokacije();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Greška pri brisanju lokacije.");
      }
      setItemToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
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
              Lokacije
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Lokacije"
                filename="lokacije"
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
                  data={data}
                  columns={columns}
                  title="Lokacije"
                  filename="lokacije"
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
          {isLoading ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Učitavanje...</div>
          ) : errorMessage ? (
            <div className="p-4 text-sm text-error-500">{errorMessage}</div>
          ) : (
            <LokacijeDataTable 
              data={data} 
              columns={columns} 
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          )}
        </div>

        <LokacijeForm
          isOpen={showForm}
          onClose={handleFormClose}
          onSave={handleSave}
          initialData={editingItem}
          firme={firme}
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
} 