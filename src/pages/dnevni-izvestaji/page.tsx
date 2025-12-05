"use client";

import React, { useState, useRef } from "react";
import DnevniIzvestajiDataTable, {
  DnevniIzvestajiData,
  DataTableHandle,
} from "./DnevniIzvestajiDataTable";
import DnevniIzvestajiList from "./DnevniIzvestajiList";
import Button from "../../components/ui/button/Button";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { useCompanySelection } from "../../context/CompanyContext";
import { useUser } from "../../context/UserContext";
import { ReactComponent as PrintIcon } from '../../icons/Print.svg?react';
import { ReactComponent as DownloadIcon } from '../../icons/download.svg?react';

// Sample data for the table
const dnevniIzvestajiData: DnevniIzvestajiData[] = [
  {
    id: 1,
    firma: "Universal Logistics",
    datum: new Date("2025-01-15"),
    svakodnevnaKontrolaBZR: true,
    osobaZaSaradnju: "Marko Petrović",
    promeneAPR: false,
    napomenaPromeneAPR: "",
    promenaPoslovaRadnihZadataka: false,
    napomenaPromenaPoslova: "",
    promenaRadnihMestaZaposlenih: false,
    formaPromenaRadnihMesta: null,
    promenaRadneSnage: false,
    formaPromenaRadneSnage: null,
    novaSredstvaZaRad: false,
    formaNovaSredstvaZaRad: null,
    stazeZaKomunikacijuBezbedne: true,
    napomenaStazeZaKomunikaciju: "Sve staze su prohodne i bezbedne.",
    planiranePopravkeRemont: false,
    napomenaPlaniranePopravke: "",
    koriscenjeLZS: false,
    napomenaKoriscenjeLZS: "",
    novaGradilistaNoviPogoni: false,
    napomenaNovaGradilista: "",
    povredaNaRadu: false,
    formaPovredaNaRadu: null,
    potencijalniRizici: false,
    napomenaPotencijalniRizici: "",
    napomena: "",
    napomenaBZR: "",
    pregledan: false,
    napomenaAdmin: "",
  },
  {
    id: 2,
    firma: "Universal Logistics",
    datum: new Date("2025-01-16"),
    svakodnevnaKontrolaBZR: true,
    osobaZaSaradnju: "Marko Petrović",
    promeneAPR: true,
    napomenaPromeneAPR: "Izmena u APR-u za novi projekat.",
    promenaPoslovaRadnihZadataka: false,
    napomenaPromenaPoslova: "",
    promenaRadnihMestaZaposlenih: false,
    formaPromenaRadnihMesta: null,
    promenaRadneSnage: false,
    formaPromenaRadneSnage: null,
    novaSredstvaZaRad: false,
    formaNovaSredstvaZaRad: null,
    stazeZaKomunikacijuBezbedne: true,
    napomenaStazeZaKomunikaciju: "",
    planiranePopravkeRemont: false,
    napomenaPlaniranePopravke: "",
    koriscenjeLZS: false,
    napomenaKoriscenjeLZS: "",
    novaGradilistaNoviPogoni: false,
    napomenaNovaGradilista: "",
    povredaNaRadu: false,
    formaPovredaNaRadu: null,
    potencijalniRizici: false,
    napomenaPotencijalniRizici: "",
    napomena: "",
    napomenaBZR: "",
    pregledan: true,
    napomenaAdmin: "Sve u redu.",
  },
];

const columns = [
  { key: "firma", label: "Firma", sortable: true },
  { key: "datum", label: "Datum", sortable: true },
  {
    key: "izmenePodatakaAPR",
    label: "Da li je bilo izmena podataka u APR-u",
    sortable: true,
  },
  {
    key: "izmeneSistematizacije",
    label: "Postoje izmene u sistematizaciji",
    sortable: true,
  },
  {
    key: "premestanjeZaposlenih",
    label: "Premeštanje zaposlenih na druge poslove",
    sortable: true,
  },
  {
    key: "noviRadnici",
    label: "Novi radnici (Ime i prezime, naziv radnog mesta)",
    sortable: true,
  },
  {
    key: "novaOprema",
    label: "Uvođenje nove opreme za rad",
    sortable: true,
  },
  {
    key: "prohodniProlazi",
    label: "Prolazi za rad su prohodni i bezbedni",
    sortable: true,
  },
  {
    key: "planiranePopravke",
    label: "Planirane popravke ili remont opreme za rad",
    sortable: true,
  },
  {
    key: "upotrebaZastitnihSredstava",
    label: "Upotreba ličnih zaštitnih sredstava",
    sortable: true,
  },
  {
    key: "novaLokacija",
    label: "Nova lokacija radne jedinice ili novo gradilište",
    sortable: true,
  },
  {
    key: "evidentiranaPovreda",
    label: "Evidentirana povreda na radu",
    sortable: true,
  },
  {
    key: "uoceniRizici",
    label: "Uočeni rizici na radnom mestu i u radnoj okolini",
    sortable: true,
  },
  { key: "napomena", label: "Napomena", sortable: true },
  { key: "napomenaBZR", label: "Napomena BZR", sortable: true },
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
    console.error("Error in DnevniIzvestaji component:", error);
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

const DnevniIzvestajiPage: React.FC = () => {
  const { selectedCompany } = useCompanySelection();
  const { userType } = useUser();
  const [data, setData] = useState<DnevniIzvestajiData[]>(dnevniIzvestajiData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DnevniIzvestajiData | null>(
    null
  );
  const [selectedReport, setSelectedReport] = useState<DnevniIzvestajiData | null>(null);
  const dataTableRef = useRef<DataTableHandle>(null);

  const isAdmin = userType === 'admin' || userType === 'super-admin';

  const handlePrint = () => {
    dataTableRef.current?.handlePrint();
  };

  const handleDownloadPDF = async () => {
    await dataTableRef.current?.handleDownloadPDF();
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

  const handleReportSelect = (report: DnevniIzvestajiData) => {
    setSelectedReport(report);
  };

  const handleBackToList = () => {
    setSelectedReport(null);
  };

  const handlePregledanChange = (reportId: number, pregledan: boolean) => {
    setData(data.map(report => 
      report.id === reportId ? { ...report, pregledan } : report
    ));
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ ...selectedReport, pregledan });
    }
  };

  const handleNapomenaAdminChange = (reportId: number, napomena: string) => {
    setData(data.map(report => 
      report.id === reportId ? { ...report, napomenaAdmin: napomena } : report
    ));
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ ...selectedReport, napomenaAdmin: napomena });
    }
  };

  // Admin view: Show list or selected report
  if (isAdmin) {
    return (
      <ErrorBoundary>
        <div className="container mx-auto py-8">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Dnevni izveštaji
                </h1>
                {selectedCompany && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Prikaz izveštaja za{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedCompany.naziv}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                {selectedReport && (
                  <Button
                    size="sm"
                    onClick={handleBackToList}
                    className="bg-gray-600 hover:bg-gray-700"
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
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Nazad na listu
                  </Button>
                )}
                {selectedReport && (
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 bg-[#F9FAFB] dark:border-gray-700 dark:bg-[#101828] dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center gap-2 border border-gray-200"
                    >
                      <PrintIcon className="w-5 h-5" />
                      Štampaj
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="px-4 py-2 bg-[#F9FAFB] dark:border-gray-700 dark:bg-[#101828] dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center gap-2 border border-gray-200"
                    >
                      <DownloadIcon className="w-5 h-5" />
                      Preuzmi PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!selectedCompany && (
            <div className="mb-4 rounded-lg border border-dashed border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 text-center text-gray-600 dark:text-gray-300">
              Odaberite Preduzeće preko pretrage u zaglavlju kako bi se prikazali
              izveštaji.
            </div>
          )}

          {selectedReport ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)] overflow-hidden">
              <DnevniIzvestajiDataTable
                ref={dataTableRef}
                data={data}
                columns={columns}
                selectedCompany={selectedCompany}
                readOnly={true}
                selectedReport={selectedReport}
                onPregledanChange={handlePregledanChange}
                onNapomenaAdminChange={handleNapomenaAdminChange}
              />
            </div>
          ) : (
            <DnevniIzvestajiList
              reports={data}
              selectedCompany={selectedCompany}
              onReportSelect={handleReportSelect}
            />
          )}
        </div>
      </ErrorBoundary>
    );
  }

  // Komitent/User view: Show form for creating/editing
  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Dnevni izveštaji
              </h1>
              {selectedCompany && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Prikaz izveštaja za{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedCompany.naziv}
                  </span>
                </p>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#F9FAFB] dark:border-gray-700 dark:bg-[#101828] dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center gap-2 border border-gray-200"
                >
                  <PrintIcon className="w-5 h-5" />
                  Štampaj
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-[#F9FAFB] dark:border-gray-700 dark:bg-[#101828] dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center gap-2 border border-gray-200"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Preuzmi PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {!selectedCompany && (
          <div className="mb-4 rounded-lg border border-dashed border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 text-center text-gray-600 dark:text-gray-300">
            Odaberite Firmu preko pretrage u zaglavlju kako bi se prikazali
            izveštaji.
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)] overflow-hidden">
          <DnevniIzvestajiDataTable
            ref={dataTableRef}
            data={data}
            columns={columns}
            selectedCompany={selectedCompany}
          />
        </div>

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Potvrda brisanja"
          message="Da li ste sigurni da želite da obrišete ovaj izveštaj?"
          confirmText="Obriši"
          cancelText="Otkaži"
          type="danger"
        />
      </div>
    </ErrorBoundary>
  );
};

export default DnevniIzvestajiPage;

