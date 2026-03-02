"use client";

import React, { useState, useEffect } from "react";
import PreglediOpremeDataTable from "./PreglediOpremeDataTable";
import PreglediOpremeForm from "./PreglediOpremeForm";
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { api } from "../../api/client";
import { usePageContext } from "../../hooks/usePageContext";
import { fromIsoDate, toIsoDate } from "../../utils/date";

const mapPregledOpremeFromApi = (item: any, index: number) => ({
  id: item.id,
  redniBroj: index + 1,
  nazivOpreme: item.naziv_opreme ?? item.oprema?.naziv ?? "",
  vrstaOpreme: item.vrsta_opreme ?? item.oprema?.vrsta_opreme ?? "",
  inventarniBroj: item.oprema?.inventarni_broj ?? "",
  lokacija: item.lokacija?.naziv ?? "",
  datumPregleda: fromIsoDate(item.datum_pregleda) ?? new Date(),
  intervalPregleda: item.interval_pregleda?.toString() ?? "",
  status: item.status === "ispravno" ? "Ispravno" : "Neispravno",
  datumNarednogPregleda: fromIsoDate(item.datum_narednog_pregleda) ?? new Date(),
  napomena: item.napomena ?? "",
  standard: item.standard ?? item.oprema?.standard ?? "",
  opremaId: item.oprema_id,
  firmaPib: item.firma_pib,
});

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "nazivOpreme", label: "Naziv opreme", sortable: true },
  { key: "vrstaOpreme", label: "Vrsta opreme", sortable: true },
  { key: "inventarniBroj", label: "Inventarni broj", sortable: true },
  { key: "lokacija", label: "Lokacija", sortable: true },
  { key: "standard", label: "Standard", sortable: true },
  { key: "datumPregleda", label: "Poslednji pregled", sortable: true },
  { key: "status", label: "Status pregleda", sortable: true },
  { key: "naredniPregled", label: "Naredni pregled", sortable: true },
  { key: "napomena", label: "Napomena", sortable: true },
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
    console.error('Error in PreglediOpreme component:', error);
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

const PreglediOpremePage: React.FC = () => {
  const context = usePageContext();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPreglediOpreme = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get<{ data: any[] }>(`pregledi-opreme?context=${context}`);
      setData(response.data.map(mapPregledOpremeFromApi));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri učitavanju pregleda opreme.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPreglediOpreme();
  }, [context]);

  const handleSave = async (newData: any) => {
    const payload = {
      firma_pib: newData.firmaPib,
      oprema_id: Number(newData.opremaId),
      interval_pregleda: Number(newData.intervalPregleda),
      datum_pregleda: toIsoDate(newData.datumPregleda),
      status: newData.status.toLowerCase(),
      napomena: newData.napomena || null,
    };

    if (editingItem) {
      await api.put(`pregledi-opreme/${editingItem.id}`, payload);
      setEditingItem(null);
    } else {
      await api.post("pregledi-opreme", payload);
    }
    await loadPreglediOpreme();
    setShowForm(false);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await api.del(`pregledi-opreme/${itemToDelete.id}`);
        await loadPreglediOpreme();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Greška pri brisanju pregleda opreme.");
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
              Pregledi opreme
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Pregledi opreme"
                filename="pregledi-opreme"
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
                  title="Pregledi opreme"
                  filename="pregledi-opreme"
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
            <PreglediOpremeDataTable 
              data={data}
              columns={columns}
              onDeleteClick={handleDeleteClick}
              onEditClick={handleEditClick}
            />
          )}
        </div>

        <PreglediOpremeForm 
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

export default PreglediOpremePage; 