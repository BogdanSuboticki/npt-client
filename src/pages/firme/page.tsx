"use client";

import React, { useEffect, useState } from "react";
import FirmeDataTable from "./FirmeDataTable";
import FirmeForm from "./FirmeForm";
import Button from "../../components/ui/button/Button";
import { usePageContext } from "../../hooks/usePageContext";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { api } from "../../api/client";
import { fromIsoDate, toIsoDate } from "../../utils/date";

const mapFirmaFromApi = (firma: any, index: number) => {
  const datumIsteka = fromIsoDate(firma.datum_isteka_ugovora) ?? new Date();
  return {
    id: index + 1,
    redniBroj: index + 1,
    naziv: firma.naziv,
    adresa: firma.adresa,
    mesto: firma.mesto,
    pib: firma.pib,
    maticniBroj: firma.maticni_broj,
    delatnost: firma.sifra_delatnosti,
    datumIstekaUgovora: datumIsteka,
    datumPocetkaUgovora: fromIsoDate(firma.datum_pocetka_ugovora) ?? new Date(),
    drzava: firma.drzava,
    emailFirme: firma.email,
    imePrezimeDirektora: firma.direktor_ime_prezime,
    telefonDirektora: firma.direktor_telefon,
    emailDirektora: firma.direktor_email,
    imePrezimeOsobeZaSaradnju: firma.saradnik_ime_prezime,
    telefonOsobeZaSaradnju: firma.saradnik_telefon,
    emailOsobeZaSaradnju: firma.saradnik_email,
    aktivan: datumIsteka >= new Date(),
  };
};

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "naziv", label: "Naziv preduzeća", sortable: true },
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
  const [firmeState, setFirmeState] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFirme = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get<{ data: any[] }>(`firme?context=${context}`);
      const mapped = response.data.map(mapFirmaFromApi);
      setFirmeState(mapped);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri učitavanju firmi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFirme();
  }, [context]);

  // Get data based on context
  const getDataForContext = () => {
    return firmeState;
  };

  const handleSave = async (data: any) => {
    const payload: Record<string, any> = {
      naziv: data.nazivFirme,
      adresa: data.adresaFirme,
      drzava: data.drzava,
      mesto: data.mesto,
      pib: data.pib,
      maticni_broj: data.maticniBroj,
      sifra_delatnosti: data.sifraDelatnosti,
      email: data.emailFirme,
      direktor_ime_prezime: data.imePrezimeDirektora || null,
      direktor_telefon: data.telefonDirektora || null,
      direktor_email: data.emailDirektora || null,
      saradnik_ime_prezime: data.imePrezimeOsobeZaSaradnju,
      saradnik_telefon: data.telefonOsobeZaSaradnju,
      saradnik_email: data.emailOsobeZaSaradnju,
      datum_pocetka_ugovora: toIsoDate(data.datumPocetkaUgovora),
      datum_isteka_ugovora: toIsoDate(data.datumIstekaUgovora),
      komitent: context === 'komitenti',
    };

    if (data.createKomitent) {
      payload.kreiraj_komitenta = true;
      payload.komitent_email = data.komitentData?.email;
      payload.komitent_password = data.komitentData?.sifra;
    }

    if (editingItem) {
      await api.put(`firme/${editingItem.pib}`, payload);
      setEditingItem(null);
    } else {
      await api.post("firme", payload);
    }
    await loadFirme();
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
        await api.del(`firme/${itemToDelete.pib}`);
        await loadFirme();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Greška pri brisanju firme.");
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
              Preduzeća
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
          {isLoading ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Učitavanje...</div>
          ) : errorMessage ? (
            <div className="p-4 text-sm text-error-500">{errorMessage}</div>
          ) : (
          <FirmeDataTable 
            data={getDataForContext()}
            columns={columns}
            onDeleteClick={handleDeleteClick}
            onEditClick={handleEditClick}
          />
          )}
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