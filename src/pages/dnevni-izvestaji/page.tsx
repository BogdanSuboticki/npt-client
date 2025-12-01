"use client";

import React, { useState } from "react";
import DnevniIzvestajiDataTable, {
  DnevniIzvestajiData,
} from "./DnevniIzvestajiDataTable";
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { useCompanySelection } from "../../context/CompanyContext";

// Sample data for the table
const dnevniIzvestajiData: DnevniIzvestajiData[] = [
  {
    id: 1,
    firma: "MR ENGINES BEOGRAD",
    datum: new Date("2025-09-29"),
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
  const [data, setData] = useState<DnevniIzvestajiData[]>(dnevniIzvestajiData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DnevniIzvestajiData | null>(
    null
  );

  const handleDeleteClick = (item: DnevniIzvestajiData) => {
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
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Dnevni izveštaji"
                filename="dnevni-izvestaji"
              />
              <Button
                size="sm"
                onClick={() => console.log("Open Dnevni izveštaji form")}
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
                Novi unos
              </Button>
            </div>
          </div>

          <div className="sm:hidden mt-4">
            <div className="flex gap-4 w-full">
              <div className="flex-1">
                <ExportPopoverButton
                  data={data}
                  columns={columns}
                  title="Dnevni izveštaji"
                  filename="dnevni-izvestaji"
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <Button
                  onClick={() => console.log("Open Dnevni izveštaji form")}
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
                  Novi unos
                </Button>
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

