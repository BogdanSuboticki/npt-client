"use client";

import React, { useEffect, useState } from "react";
import RokoviDataTable, { RokoviData } from "./RokoviDataTable";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { useCompanySelection } from "../../context/CompanyContext";
import { api } from "../../api/client";
import { usePageContext } from "../../hooks/usePageContext";

const columns = [
  { key: "preduzece", label: "Preduzeće", sortable: true },
  { key: "oblast", label: "Oblast", sortable: true },
  { key: "vrstaObaveze", label: "Vrsta obaveze", sortable: true },
  { key: "detalji", label: "Detalji", sortable: true },
  { key: "rok", label: "Rok", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "napomena", label: "Napomena", sortable: true },
];

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in Rokovi component:", error);
    console.error("Error info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <div className="text-red-500 mb-2">
            Došlo je do greške pri učitavanju stranice.
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {this.state.error?.message}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const RokoviPage: React.FC = () => {
  const context = usePageContext();
  const { selectedCompany } = useCompanySelection();
  const [data, setData] = useState<RokoviData[]>([]);
  const [, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RokoviData | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api.get<{ data: any[] }>(`rokovi?context=${context}`)
      .then((res) => {
        const mapped: RokoviData[] = res.data.map((item: any) => ({
          id: item.id,
          oblast: item.oblast,
          vrstaObaveze: item.vrstaObaveze,
          rok: new Date(item.rok),
          status: "",
          napomena: item.napomena ?? "",
          detalji: item.detalji ?? "",
          preduzece: item.preduzece ?? "",
          firma_pib: item.firma_pib,
          source_type: item.source_type,
          source_id: item.source_id,
        }));

        if (selectedCompany) {
          setData(mapped.filter((r) => r.firma_pib === selectedCompany.pib));
        } else {
          setData(mapped);
        }
      })
      .catch(() => setData([]))
      .finally(() => setIsLoading(false));
  }, [selectedCompany, context]);

  const handleDeleteClick = (item: RokoviData) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setData(data.filter((record) => record.id !== itemToDelete.id));
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
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Rokovi
              </h1>
              {selectedCompany && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Prikaz rokova za <span className="font-medium text-gray-900 dark:text-white">{selectedCompany.naziv}</span>
                </p>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Rokovi"
                filename="rokovi"
              />
            </div>
          </div>

          <div className="sm:hidden mt-4">
            <ExportPopoverButton
              data={data}
              columns={columns}
              title="Rokovi"
              filename="rokovi"
              className="w-full"
            />
          </div>
        </div>

        {!selectedCompany && (
          <div className="mb-4 rounded-lg border border-dashed border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 text-center text-gray-600 dark:text-gray-300">
            Odaberite Firmu preko pretrage u zaglavlju kako bi se prikazali rokovi.
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)]">
          <RokoviDataTable
            data={data}
            columns={columns}
            onDeleteClick={handleDeleteClick}
          />
        </div>

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Potvrda brisanja"
          message="Da li ste sigurni da želite da obrišete ovaj rok?"
          confirmText="Obriši"
          cancelText="Otkaži"
          type="danger"
        />
      </div>
    </ErrorBoundary>
  );
};

export default RokoviPage;

