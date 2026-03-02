"use client";

import React, { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import DnevniIzvestajiDataTable, {
  DnevniIzvestajiData,
  DataTableHandle,
} from "./DnevniIzvestajiDataTable";
import DnevniIzvestajiList from "./DnevniIzvestajiList";
import Button from "../../components/ui/button/Button";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { useCompanySelection } from "../../context/CompanyContext";
import { useUser } from "../../context/UserContext";
import { api } from "../../api/client";
import { usePageContext } from "../../hooks/usePageContext";
import { useEffect } from "react";
import { ReactComponent as PrintIcon } from '../../icons/Print.svg?react';
import { ReactComponent as DownloadIcon } from '../../icons/download.svg?react';

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
  const context = usePageContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedCompany } = useCompanySelection();
  const { userType } = useUser();
  const [data, setData] = useState<DnevniIzvestajiData[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DnevniIzvestajiData | null>(
    null
  );
  const [selectedReport, setSelectedReport] = useState<DnevniIzvestajiData | null>(null);
  const dataTableRef = useRef<DataTableHandle>(null);

  const isAdmin = userType === 'admin' || userType === 'super-admin';
  const isKomitent = userType === 'komitent';

  const mapFromApi = (item: any): DnevniIzvestajiData => ({
    id: item.id,
    firma: item.firma?.naziv ?? '',
    datum: new Date(item.datum),
    osobaZaSaradnju: item.osoba_za_saradnju ?? '',
    pregledan: item.pregledan ?? false,
    napomenaBZR: item.napomena_bzr ?? '',
    firmaPib: item.firma_pib,
    ...(item.podaci ?? {}),
  });

  const loadData = () => {
    api.get<{ data: any[] }>(`dnevni-izvestaji?context=${context}`)
      .then((res) => {
        const mapped = res.data.map(mapFromApi);
        setData(mapped);
      })
      .catch(() => setData([]));
  };

  useEffect(() => {
    loadData();
  }, [selectedCompany, context]);

  useEffect(() => {
    const reportIdParam = searchParams.get('reportId');
    if (reportIdParam) {
      const reportId = parseInt(reportIdParam, 10);
      const report = data.find(r => r.id === reportId);
      if (report) {
        setSelectedReport(report);
        setSearchParams({});
      }
    }
  }, [searchParams, data, setSearchParams]);

  const handlePrint = () => {
    dataTableRef.current?.handlePrint();
  };

  const handleDownloadPDF = async () => {
    await dataTableRef.current?.handleDownloadPDF();
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await api.del(`dnevni-izvestaji/${itemToDelete.id}`);
        loadData();
      } catch { /* ignore */ }
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
    if (isKomitent) {
      // For komitent, navigate to home page
      navigate("/");
    } else {
      // For admin, just go back to list
      setSelectedReport(null);
    }
  };

  const handlePregledanChange = async (reportId: number, pregledan: boolean) => {
    try {
      await api.put(`dnevni-izvestaji/${reportId}`, { pregledan });
      setData(data.map(report =>
        report.id === reportId ? { ...report, pregledan } : report
      ));
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport({ ...selectedReport, pregledan });
      }
    } catch { /* ignore */ }
  };

  const handleNapomenaBZRChange = async (reportId: number, napomena: string) => {
    try {
      await api.put(`dnevni-izvestaji/${reportId}`, { napomena_bzr: napomena });
      setData(data.map(report =>
        report.id === reportId ? { ...report, napomenaBZR: napomena } : report
      ));
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport({ ...selectedReport, napomenaBZR: napomena });
      }
    } catch { /* ignore */ }
  };

  const handleSaveReport = async (reportData: DnevniIzvestajiData) => {
    if (!selectedCompany) return;

    const { id, firma, datum, osobaZaSaradnju, pregledan, napomenaBZR, firmaPib, ...podaci } = reportData;
    try {
      await api.post("dnevni-izvestaji", {
        firma_pib: selectedCompany.pib,
        datum: datum instanceof Date ? datum.toISOString().split('T')[0] : datum,
        osoba_za_saradnju: osobaZaSaradnju || null,
        podaci,
        pregledan: false,
      });
      loadData();
      setSelectedReport(reportData);
    } catch { /* ignore */ }
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
                onNapomenaBZRChange={handleNapomenaBZRChange}
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

  // Komitent view: Show list of previous reports or selected report in read-only, or form for creating new
  if (isKomitent) {
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

          {selectedReport ? (
            // Show selected report in read-only mode
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)] overflow-hidden">
              <DnevniIzvestajiDataTable
                ref={dataTableRef}
                data={data}
                columns={columns}
                selectedCompany={selectedCompany}
                readOnly={true}
                selectedReport={selectedReport}
              />
            </div>
          ) : (
            // Show form for creating new report only
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Novi izveštaj
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Popunite formu za kreiranje novog dnevnog izveštaja
                </p>
              </div>
              <DnevniIzvestajiDataTable
                ref={dataTableRef}
                data={data}
                columns={columns}
                selectedCompany={selectedCompany}
                onSave={handleSaveReport}
              />
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }

  // User view: Show form for creating/editing
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

