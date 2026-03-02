"use client";

import React, { useState, useEffect } from "react";
import PovredeDataTable from "./PovredeDataTable";
import PovredeForm from "./PovredeForm";
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { api } from "../../api/client";
import { usePageContext } from "../../hooks/usePageContext";
import { fromIsoDate, toIsoDate } from "../../utils/date";

// Backend stores ASCII enum values; frontend displays diacritical (Serbian) versions
const TEZINA_POVREDE_API_TO_DISPLAY: Record<string, string> = {
  'Teska': 'Teška',
};
const TEZINA_POVREDE_DISPLAY_TO_API: Record<string, string> = {
  'Teška': 'Teska',
};

const mapPovredaFromApi = (item: any, index: number) => ({
  id: item.id,
  redniBroj: index + 1,
  zaposleni: item.angazovanje?.zaposleni?.ime_prezime ?? "",
  datumPovrede: fromIsoDate(item.datum_povrede) ?? new Date(),
  tezinaPovrede: TEZINA_POVREDE_API_TO_DISPLAY[item.tezina_povrede] ?? item.tezina_povrede,
  brojPovredneListe: item.broj_povredne_liste ?? "",
  datumObavestenjaInspekcije: fromIsoDate(item.datum_obavestenja_inspekcije),
  datumPredajeFondu: fromIsoDate(item.datum_predaje_fondu),
  datumPreuzimanjaIzFonda: fromIsoDate(item.datum_preuzimanja_iz_fonda),
  datumDostavjanjaUpravi: fromIsoDate(item.datum_dostavljanja_upravi),
  napomena: item.napomena ?? "",
  angazovanjeId: item.angazovanje_id,
  firmaPib: item.firma_pib,
});

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "zaposleni", label: "Zaposleni", sortable: true },
  { key: "datumPovrede", label: "Datum povrede", sortable: true },
  { key: "tezinaPovrede", label: "Težina povrede", sortable: true },
  { key: "brojPovredneListe", label: "Broj povredne liste", sortable: true },
  { key: "datumObavestenjaInspekcije", label: "Datum obaveštenja inspekcije", sortable: true },
  { key: "datumPredajeFondu", label: "Datum predaje u fondu", sortable: true },
  { key: "datumPreuzimanjaIzFonda", label: "Datum preuzimanja iz fonda", sortable: true },
  { key: "datumDostavjanjaUpravi", label: "Datum dostavjanja upravi za BZR", sortable: true },
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
    console.error('Error in Povrede component:', error);
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

const PovredePage: React.FC = () => {
  const context = usePageContext();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPovrede = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get<any[]>(`povrede?context=${context}`);
      setData(response.map(mapPovredaFromApi));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri učitavanju povreda.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPovrede();
  }, [context]);

  const handleSave = async (newData: any) => {
    const payload = {
      angazovanje_id: Number(newData.angazovanjeId),
      firma_pib: newData.firmaPib,
      tezina_povrede: TEZINA_POVREDE_DISPLAY_TO_API[newData.tezinaPovrede] ?? newData.tezinaPovrede,
      datum_povrede: toIsoDate(newData.datumPovrede),
      broj_povredne_liste: newData.brojPovredneListe || null,
      datum_obavestenja_inspekcije: newData.datumObavestenjaInspekcije ? toIsoDate(newData.datumObavestenjaInspekcije) : null,
      datum_predaje_fondu: newData.datumPredajeFondu ? toIsoDate(newData.datumPredajeFondu) : null,
      datum_preuzimanja_iz_fonda: newData.datumPreuzimanjaIzFonda ? toIsoDate(newData.datumPreuzimanjaIzFonda) : null,
      datum_dostavljanja_upravi: newData.datumDostavjanjaUpravi ? toIsoDate(newData.datumDostavjanjaUpravi) : null,
      napomena: newData.napomena || null,
    };

    if (editingItem) {
      await api.put(`povrede/${editingItem.id}`, payload);
      setEditingItem(null);
    } else {
      await api.post<{ id: number }>("povrede", payload);
    }
    await loadPovrede();
    setShowForm(false);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await api.del(`povrede/${itemToDelete.id}`);
        await loadPovrede();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Greška pri brisanju povrede.");
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
             Povrede
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Povrede"
                filename="povrede"
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
                  title="Povrede"
                  filename="povrede"
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
            <PovredeDataTable 
              data={data}
              columns={columns}
              onDeleteClick={handleDeleteClick}
              onEditClick={handleEditClick}
              onUpdateData={setData}
            />
          )}
        </div>

        <PovredeForm 
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

export default PovredePage; 