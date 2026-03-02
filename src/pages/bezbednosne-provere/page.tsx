"use client";

import React, { useEffect, useState } from "react";
    import BezbednosneProvereDataTable from "./BezbednosneProvereDataTable";
    import BezbednosneProvereForm from "./BezbednosneProvereForm";
    import Button from "../../components/ui/button/Button";
    import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
    import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { api } from "../../api/client";
import { usePageContext } from "../../hooks/usePageContext";
import { fromIsoDate, toIsoDate } from "../../utils/date";

const mapProveraFromApi = (item: any, index: number) => ({
  id: item.id,
  redniBroj: index + 1,
  lokacija: item.lokacija?.naziv ?? `#${item.lokacija_id}`,
  datumProvere: fromIsoDate(item.datum_provere) ?? new Date(),
  intervalProvere: item.interval_provere?.toString() ?? "",
  sledecaProvera: fromIsoDate(item.sledeca_provera) ?? new Date(),
  napomena: item.napomena ?? "",
  primalacZapisnika: "",
  firmaPib: item.firma_pib,
  lokacijaId: item.lokacija_id,
});

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "lokacija", label: "Lokacija", sortable: true },
  { key: "datumProvere", label: "Datum provere", sortable: true },
  { key: "intervalProvere", label: "Interval provere", sortable: true },
  { key: "sledecaProvera", label: "Naredna provera", sortable: true },
  { key: "napomena", label: "Napomena", sortable: true },
  { key: "primalacZapisnika", label: "Primalac zapisnika", sortable: true },
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
    console.error('Error in LekarskiPregledi component:', error);
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

const LekarskiPreglediPage: React.FC = () => {
  const context = usePageContext();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [firme, setFirme] = useState<Array<{ pib: string; naziv: string }>>([]);
  const [lokacije, setLokacije] = useState<Array<{ id: number; naziv: string; firma_pib: string }>>([]);

  const loadProvere = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get<{ data: any[] }>(`bezbednosne-provere?context=${context}`);
      setData(response.data.map(mapProveraFromApi));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri učitavanju provera.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFirmeAndLokacije = async () => {
    try {
      const [firmeRes, lokacijeRes] = await Promise.all([
        api.get<{ data: any[] }>(`firme?context=${context}`),
        api.get<{ data: any[] }>(`lokacije?context=${context}`),
      ]);
      setFirme(firmeRes.data.map((f: any) => ({ pib: f.pib, naziv: f.naziv })));
      setLokacije(lokacijeRes.data.map((l: any) => ({ id: l.id, naziv: l.naziv, firma_pib: l.firma_pib })));
    } catch (error) {
      console.error("Failed to load firme/lokacije:", error);
    }
  };

  useEffect(() => {
    loadProvere();
    loadFirmeAndLokacije();
  }, [context]);

  const handleSave = async (newData: any) => {
    const payload = {
      firma_pib: newData.firmaPib,
      lokacija_id: Number(newData.lokacijaId),
      datum_provere: toIsoDate(newData.datumProvere),
      interval_provere: Number(newData.periodProvere),
      sledeca_provera: toIsoDate(newData.sledecaProvera),
      napomena: newData.napomena || null,
    };

    await api.post("bezbednosne-provere", payload);
    await loadProvere();
    setShowForm(false);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await api.del(`bezbednosne-provere/${itemToDelete.id}`);
        await loadProvere();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Greška pri brisanju provere.");
      }
      setItemToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Kontrola Radnih Mesta
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Kontrola Radnih Mesta"
                filename="bezbednosne-provere"
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
                  title="Kontrola Radnih Mesta"
                  filename="bezbednosne-provere"
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
            <BezbednosneProvereDataTable 
              data={data}
              columns={columns}
              onDeleteClick={handleDeleteClick}
            />
          )}
        </div>

        <BezbednosneProvereForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          firme={firme}
          lokacije={lokacije}
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

export default LekarskiPreglediPage; 