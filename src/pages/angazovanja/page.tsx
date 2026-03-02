"use client";

import React, { useState, useEffect } from "react";
import AngazovanjaDataTable from "./AngazovanjaDataTable";
import AngazovanjaForm from "./AngazovanjaForm";
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { api } from "../../api/client";
import { usePageContext } from "../../hooks/usePageContext";
import { fromIsoDate, toIsoDate } from "../../utils/date";

// Backend stores ASCII enum values; frontend displays diacritical (Serbian) versions
const VRSTA_ANGAZOVANJA_API_TO_DISPLAY: Record<string, string> = {
  'Redovno angazovanje': 'Redovno angažovanje',
  'Strucna praksa': 'Stručna praksa',
};
const VRSTA_ANGAZOVANJA_DISPLAY_TO_API: Record<string, string> = {
  'Redovno angažovanje': 'Redovno angazovanje',
  'Stručna praksa': 'Strucna praksa',
};

const mapAngazovanjeFromApi = (item: any, index: number) => ({
  id: item.id,
  redniBroj: index + 1,
  imePrezime: item.zaposleni?.ime_prezime ?? "",
  radnoMesto: item.radnoMesto?.naziv ?? "",
  vrstaAngazovanja: VRSTA_ANGAZOVANJA_API_TO_DISPLAY[item.vrsta_angazovanja] ?? item.vrsta_angazovanja,
  lokacija: item.lokacija?.naziv ?? "",
  pocetakAngazovanja: fromIsoDate(item.datum_pocetka_angazovanja) ?? new Date(),
  prestanakAngazovanja: fromIsoDate(item.datum_prestanka_angazovanja),
  zaposleniId: item.zaposleni_id,
  radnoMestoId: item.radno_mesto_id,
  lokacijaId: item.lokacija_id,
  firmaPib: item.firma_pib,
});

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "imePrezime", label: "Zaposleni", sortable: true },
  { key: "radnoMesto", label: "Radno mesto", sortable: true },
  { key: "vrstaAngazovanja", label: "Vrsta angažovanja", sortable: true },
  { key: "lokacija", label: "Lokacija", sortable: true },
  { key: "pocetakAngazovanja", label: "Početak angažovanja", sortable: true },
  { key: "prestanakAngazovanja", label: "Prestanak angažovanja", sortable: true },
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
    console.error('Error in Angazovanja component:', error);
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

const AngazovanjaPage: React.FC = () => {
  const context = usePageContext();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [zaposleniList, setZaposleniList] = useState<any[]>([]);
  const [radnaMestaList, setRadnaMestaList] = useState<any[]>([]);
  const [lokacijeList, setLokacijeList] = useState<any[]>([]);

  const loadAngazovanja = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get<{ data: any[] }>(`angazovanja?context=${context}`);
      setData(response.data.map(mapAngazovanjeFromApi));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri učitavanju angažovanja.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      const [zapRes, rmRes, lokRes] = await Promise.all([
        api.get<{ data: any[] }>(`zaposleni?context=${context}`),
        api.get<{ data: any[] }>(`radna-mesta?context=${context}`),
        api.get<{ data: any[] }>(`lokacije?context=${context}`),
      ]);
      setZaposleniList(zapRes.data.map((z: any) => ({ id: z.id, ime_prezime: z.ime_prezime, firma_pib: z.firma_pib })));
      setRadnaMestaList(rmRes.data.map((rm: any) => ({ id: rm.id, naziv: rm.naziv, firma_pib: rm.firma_pib, lokacija_id: rm.lokacija_id })));
      setLokacijeList(lokRes.data.map((l: any) => ({ id: l.id, naziv: l.naziv, firma_pib: l.firma_pib })));
    } catch {
      // Form data loading failures are non-critical
    }
  };

  useEffect(() => {
    loadAngazovanja();
    loadFormData();
  }, [context]);

  const handleSave = async (newData: any) => {
    const payload: any = {
      zaposleni_id: Number(newData.zaposleniId),
      firma_pib: newData.firmaPib,
      radno_mesto_id: Number(newData.radnoMestoId),
      lokacija_id: Number(newData.lokacijaId),
      vrsta_angazovanja: VRSTA_ANGAZOVANJA_DISPLAY_TO_API[newData.vrstaAngazovanja] ?? newData.vrstaAngazovanja,
      datum_pocetka_angazovanja: toIsoDate(newData.datumPocetka),
      datum_prestanka_angazovanja: newData.datumPrestanka ? toIsoDate(newData.datumPrestanka) : null,
    };

    if (newData.kreirajKorisnika) {
      payload.kreiraj_korisnika = true;
      payload.email = newData.email;
      payload.password = newData.password;
    } else {
      payload.kreiraj_korisnika = false;
    }

    if (editingItem) {
      await api.put(`angazovanja/${editingItem.id}`, payload);
      setEditingItem(null);
    } else {
      await api.post("angazovanja", payload);
    }
    await loadAngazovanja();
    setShowForm(false);
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await api.del(`angazovanja/${itemToDelete.id}`);
        await loadAngazovanja();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Greška pri brisanju angažovanja.");
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
             Angažovanja
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Angažovanja"
                filename="angazovanja"
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
                  title="Angažovanja"
                  filename="angazovanja"
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
            <AngazovanjaDataTable 
              data={data}
              columns={columns}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          )}
        </div>

        <AngazovanjaForm 
          isOpen={showForm}
          onClose={handleFormClose}
          onSave={handleSave}
          initialData={editingItem}
          zaposleniList={zaposleniList}
          radnaMestaList={radnaMestaList}
          lokacijeList={lokacijeList}
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

export default AngazovanjaPage;
