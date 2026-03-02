"use client";

import React, { useState, useEffect } from "react";
import InspekcijskiNadzorDataTable from "./InspekcijskiNadzorDataTable";
import InspekcijskiNadzorForm from "./InspekcijskiNadzorForm";
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { api } from "../../api/client";
import { usePageContext } from "../../hooks/usePageContext";
import { fromIsoDate, toIsoDate } from "../../utils/date";

const mapInspekcijskiNadzorFromApi = (item: any, index: number) => {
  const flattened: any[] = [];
  if (item.mere && item.mere.length > 0) {
    item.mere.forEach((mera: any, meraIndex: number) => {
      flattened.push({
        id: item.id,
        redniBroj: index + 1,
        brojResenja: item.broj_resenja,
        datumNadzora: fromIsoDate(item.datum_nadzora) ?? new Date(),
        napomena: item.napomena ?? "",
        nazivMere: mera.naziv_mere,
        rokIzvrsenja: fromIsoDate(mera.rok_izvrsenja) ?? new Date(),
        datumRealizacije: fromIsoDate(mera.datum_realizacije_mere),
        datumObavestavanjaInspekcije: fromIsoDate(mera.datum_obavestavanja_inspekcije),
        meraId: mera.id,
        isFirstRow: meraIndex === 0,
        totalRows: item.mere.length,
        firmaPib: item.firma_pib,
      });
    });
  } else {
    flattened.push({
      id: item.id,
      redniBroj: index + 1,
      brojResenja: item.broj_resenja,
      datumNadzora: fromIsoDate(item.datum_nadzora) ?? new Date(),
      napomena: item.napomena ?? "",
      nazivMere: "",
      rokIzvrsenja: null,
      datumRealizacije: null,
      datumObavestavanjaInspekcije: null,
      isFirstRow: true,
      totalRows: 1,
      firmaPib: item.firma_pib,
    });
  }
  return flattened;
};

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "brojResenja", label: "Broj rešenja", sortable: true },
  { key: "datumNadzora", label: "Datum nadzora", sortable: true },
  { key: "napomena", label: "Napomena", sortable: true },
  { key: "nazivMere", label: "Naziv mere", sortable: true },
  { key: "rokIzvrsenja", label: "Rok izvršenja", sortable: true },
  { key: "datumRealizacije", label: "Datum realizacije mere", sortable: true },
  { key: "datumObavestavanjaInspekcije", label: "Datum obaveštavanja inspekcije", sortable: true },
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
    console.error('Error in InspekcijskiNadzor component:', error);
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

const InspekcijskiNadzorPage: React.FC = () => {
  const context = usePageContext();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [firme, setFirme] = useState<any[]>([]);

  const loadInspekcijskiNadzor = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get<{ data: any[] }>(`inspekcijski-nadzori?context=${context}`);
      const flattened = response.data.flatMap(mapInspekcijskiNadzorFromApi);
      setData(flattened);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri učitavanju inspekcijskih nadzora.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFirme = async () => {
    try {
      const response = await api.get<{ data: any[] }>(`firme?context=${context}`);
      setFirme(response.data.map((f: any) => ({ pib: f.pib, naziv: f.naziv })));
    } catch {
      // Non-critical
    }
  };

  useEffect(() => {
    loadInspekcijskiNadzor();
    loadFirme();
  }, [context]);

  const handleSave = async (newData: any) => {
    const payload = {
      firma_pib: newData.firmaPib,
      broj_resenja: newData.brojResenja,
      datum_nadzora: toIsoDate(newData.datumNadzora),
      napomena: newData.napomena || null,
      mere: newData.mere?.map((m: any) => ({
        naziv_mere: m.nazivMere,
        rok_izvrsenja: toIsoDate(m.rokIzvrsenja),
        datum_realizacije_mere: m.datumRealizacije ? toIsoDate(m.datumRealizacije) : null,
        datum_obavestavanja_inspekcije: m.datumObavestavanjaInspekcije ? toIsoDate(m.datumObavestavanjaInspekcije) : null,
      })) || [],
    };

    if (editingItem) {
      await api.put(`inspekcijski-nadzori/${editingItem.id}`, payload);
      setEditingItem(null);
    } else {
      await api.post("inspekcijski-nadzori", payload);
    }
    await loadInspekcijskiNadzor();
    setShowForm(false);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await api.del(`inspekcijski-nadzori/${itemToDelete.id}`);
        await loadInspekcijskiNadzor();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Greška pri brisanju inspekcijskog nadzora.");
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
              Inspekcijski nadzor
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Inspekcijski nadzor"
                filename="inspekcijski-nadzor"
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
                  title="Inspekcijski nadzor"
                  filename="inspekcijski-nadzor"
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
            <InspekcijskiNadzorDataTable 
              data={data}
              columns={columns}
              onDeleteClick={handleDeleteClick}
              onEditClick={handleEditClick}
            />
          )}
        </div>

        <InspekcijskiNadzorForm 
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
};

export default InspekcijskiNadzorPage;


