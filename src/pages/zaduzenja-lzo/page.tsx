"use client";

import React, { useState, useEffect } from "react";
import ZaduzenjaLzoDataTable from "./ZaduzenjaLzoDataTable";
import ZaduzenjaLzoForm from "./ZaduzenjaLzoForm";
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import { usePreduzeceScope } from "../../hooks/usePreduzeceScope";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { api } from "../../api/client";
import { usePageContext } from "../../hooks/usePageContext";
import { fromIsoDate, toIsoDate } from "../../utils/date";

const mapZaduzenjeLzsFromApi = (item: any, index: number) => ({
  id: item.id,
  redniBroj: index + 1,
  zaposleni: item.angazovanje?.zaposleni?.ime_prezime ?? "",
  radnoMesto: item.radnoMesto?.naziv ?? "",
  povecanRizik: item.radnoMesto?.povecan_rizik ?? false,
  zaduzenaOprema: item.zaduzenaLzs?.map((z: any) => ({
    naziv: z.naziv_lzs,
    datumOd: fromIsoDate(z.datum_zaduzenja) ?? new Date(),
    datumDo: fromIsoDate(z.datum_narednog_zaduzenja),
  })) || [],
  angazovanjeId: item.angazovanje_id,
  firmaPib: item.firma_pib,
});

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "zaposleni", label: "Zaposleni", sortable: true },
  { key: "radnoMesto", label: "Radno mesto", sortable: true },
  { key: "povecanRizik", label: "Povećan rizik", sortable: true },
  { key: "nazivLzs", label: "Naziv LZS", sortable: true },
  { key: "datumZaduzenja", label: "Datum zaduženja", sortable: true },
  { key: "narednoZaduzenje", label: "Naredno zaduženje", sortable: true },
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
    console.error('Error in ZaduzenjaLzo component:', error);
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

const ZaduzenjaLzoPage: React.FC = () => {
  const context = usePageContext();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const { data: tableData, withPreduzeceColumn } = usePreduzeceScope(context, data);
  const tableColumns = withPreduzeceColumn(columns);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [angazovanja, setAngazovanja] = useState<any[]>([]);

  const loadZaduzenja = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get<{ data: any[] }>(`zaduzenja-lzs?context=${context}`);
      setData(response.data.map(mapZaduzenjeLzsFromApi));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri učitavanju zaduženja LZS.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAngazovanja = async () => {
    try {
      const response = await api.get<{ data: any[] }>(`angazovanja?context=${context}`);
      setAngazovanja(response.data);
    } catch {
      // non-critical
    }
  };

  useEffect(() => {
    loadZaduzenja();
    loadAngazovanja();
  }, [context]);

  const handleSave = async (newData: any) => {
    const stavke = (newData.oprema || newData.zaduzenaOprema || []).map((oprema: any) => ({
      lzs_id: Number(oprema.lzsId || oprema.id),
      naziv_lzs: oprema.vrstaLzs || oprema.naziv,
      standard: oprema.standard || null,
      datum_zaduzenja: toIsoDate(oprema.datumZaduzenja || oprema.datumOd),
      rok_meseci: oprema.rok ? Number(oprema.rok) : null,
    }));

    const payload = {
      firma_pib: newData.firmaPib,
      angazovanje_id: Number(newData.angazovanjeId),
      stavke,
    };

    if (editingItem) {
      await api.put(`zaduzenja-lzs/${editingItem.id}`, payload);
      setEditingItem(null);
    } else {
      await api.post("zaduzenja-lzs", payload);
    }
    await loadZaduzenja();
    setShowForm(false);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await api.del(`zaduzenja-lzs/${itemToDelete.id}`);
        await loadZaduzenja();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Greška pri brisanju zaduženja LZS.");
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
             Zaduženja LZS
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Zaduženja LZS"
                filename="zaduzenja-lzo"
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
                  title="Zaduženja LZS"
                  filename="zaduzenja-lzo"
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
            <ZaduzenjaLzoDataTable
              data={tableData}
              columns={tableColumns}
              onDeleteClick={handleDeleteClick}
              onEditClick={handleEditClick}
              onUpdateData={setData}
            />
          )}
        </div>

        <ZaduzenjaLzoForm 
          isOpen={showForm}
          onClose={handleFormClose}
          onSave={handleSave}
          angazovanja={angazovanja.map((a: any) => ({
            id: a.id,
            zaposleniName: a.zaposleni?.ime_prezime ?? "",
            radnoMesto: a.radnoMesto?.naziv ?? "",
            povecanRizik: a.radnoMesto?.povecan_rizik ?? false,
            firmaPib: a.firma_pib ?? "",
            lzsItems: (a.radnoMesto?.lzs ?? []).map((l: any) => ({
              id: l.id,
              naziv: l.naziv,
              standard: l.standard ?? "",
              rokMeseci: l.pivot?.rok_meseci ?? null,
            })),
          }))}
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

export default ZaduzenjaLzoPage; 