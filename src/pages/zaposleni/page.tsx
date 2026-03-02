"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import ZaposleniDataTable from "./ZaposleniDataTable";
import ZaposleniForm from "./ZaposleniForm";
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { api } from "../../api/client";
import { usePageContext } from "../../hooks/usePageContext";

const mapPrvaPomoc = (value?: string) => {
  if (!value) return "";
  const lower = value.toLowerCase();
  if (lower.includes("osnovni")) return "Osnovni kurs";
  if (lower.includes("napredni")) return "Napredni kurs";
  return "Ne";
};

const mapZaposleniFromApi = (item: any, index: number) => ({
  id: item.id,
  redniBroj: index + 1,
  imePrezime: item.ime_prezime,
  prvaPomoc: mapPrvaPomoc(item.prva_pomoc),
  osiguranje: item.osiguranje_od_posledica_povrede_na_radu_prof_bolesti === "DA",
  preduzece: item.firma?.naziv ?? "",
  firmaPib: item.firma_pib,
});

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "imePrezime", label: "Ime i prezime zaposlenog", sortable: true },
  { key: "prvaPomoc", label: "Prva pomoć", sortable: true },
  { key: "osiguranje", label: "Osiguranje od posledica povrede na radu i prof. bolesti", sortable: true },
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
    console.error('Error in Zaposleni component:', error);
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

const ZaposleniPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const context = usePageContext();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [filteredPreduzece, setFilteredPreduzece] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [firme, setFirme] = useState<any[]>([]);

  // Read preduzece from URL params and filter data
  useEffect(() => {
    const preduzeceParam = searchParams.get('preduzece');
    if (preduzeceParam) {
      setFilteredPreduzece(decodeURIComponent(preduzeceParam));
    } else {
      setFilteredPreduzece(null);
    }
  }, [searchParams]);

  const loadZaposleni = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get<{ data: any[] }>(`zaposleni?context=${context}`);
      setData(response.data.map(mapZaposleniFromApi));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri učitavanju zaposlenih.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFirme = async () => {
    try {
      const response = await api.get<{ data: any[] }>(`firme?context=${context}`);
      setFirme(response.data);
    } catch (error) {
      console.error("Greška pri učitavanju firmi:", error);
    }
  };

  useEffect(() => {
    loadZaposleni();
    loadFirme();
  }, [context]);

  const handleSave = async (newData: any) => {
    const prvaPomoc = newData.prvaPomoc?.toLowerCase();
    const payload = {
      firma_pib: newData.firmaPib,
      ime_prezime: newData.imePrezime,
      prva_pomoc: prvaPomoc === "osnovni kurs" ? "osnovni kurs" : prvaPomoc === "napredni kurs" ? "napredni kurs" : "ne",
      osiguranje_od_posledica_povrede_na_radu_prof_bolesti: newData.osiguranje ? "DA" : "NE",
    };

    if (editingItem) {
      await api.put(`zaposleni/${editingItem.id}`, payload);
      setEditingItem(null);
    } else {
      await api.post("zaposleni", payload);
    }
    await loadZaposleni();
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

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await api.del(`zaposleni/${itemToDelete.id}`);
        await loadZaposleni();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Greška pri brisanju zaposlenog.");
      }
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
             Zaposleni
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Zaposleni"
                filename="zaposleni"
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
                  title="Zaposleni"
                  filename="zaposleni"
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
            <ZaposleniDataTable 
              data={filteredPreduzece ? data.filter(item => item.preduzece === filteredPreduzece) : data}
              columns={columns}
              onDeleteClick={handleDeleteClick}
              onEditClick={handleEditClick}
              preduzeceFilter={filteredPreduzece}
            />
          )}
        </div>

        <ZaposleniForm 
          isOpen={showForm}
          onClose={handleFormClose}
          onSave={handleSave}
          initialData={editingItem}
          firme={firme.map(f => ({ pib: f.pib, naziv: f.naziv }))}
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

export default ZaposleniPage; 