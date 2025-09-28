"use client";

import React, { useState } from "react";
import ZaduzenjaLzoDataTable from "./ZaduzenjaLzoDataTable";
import ZaduzenjaLzoForm from "./ZaduzenjaLzoForm";
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";

// Sample data for the table
const zaduzenjaLzoData = [
  {
    id: 1,
    redniBroj: 1,
    zaposleni: "Petar Petrović",
    radnoMesto: "Viljuškari",
    povecanRizik: true,
    zaduzenaOprema: [
      { naziv: "Zaštitna kaciga", datumOd: new Date("2024-01-15"), datumDo: new Date("2024-12-31") },
      { naziv: "Zaštitne rukavice", datumOd: new Date("2024-01-15"), datumDo: new Date("2024-12-31") },
      { naziv: "Zaštitne naočare", datumOd: new Date("2024-01-15"), datumDo: new Date("2024-12-31") }
    ],
  },
  {
    id: 2,
    redniBroj: 2,
    zaposleni: "Ana Anić",
    radnoMesto: "Kranista",
    povecanRizik: false,
    zaduzenaOprema: [
      { naziv: "Zaštitna kaciga", datumOd: new Date("2024-02-01"), datumDo: new Date("2024-11-30") },
      { naziv: "Zaštitne rukavice", datumOd: new Date("2024-02-01"), datumDo: new Date("2024-11-30") }
    ],
  },
  {
    id: 3,
    redniBroj: 3,
    zaposleni: "Marko Marković",
    radnoMesto: "Mehaničar",
    povecanRizik: true,
    zaduzenaOprema: [
      { naziv: "Zaštitna kaciga", datumOd: new Date("2024-03-01"), datumDo: new Date("2025-02-28") },
      { naziv: "Zaštitne rukavice", datumOd: new Date("2024-03-01"), datumDo: new Date("2025-02-28") },
      { naziv: "Zaštitne naočare", datumOd: new Date("2024-03-01"), datumDo: new Date("2025-02-28") },
      { naziv: "Zaštitna obuća", datumOd: new Date("2024-03-01"), datumDo: new Date("2025-02-28") }
    ],
  },
];

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
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: any) => {
    // Here you would typically save the data to your backend
    console.log('Saving new entry:', data);
    // For now, we'll just close the form
    setShowForm(false);
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
                data={zaduzenjaLzoData}
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
                  data={zaduzenjaLzoData}
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
          <ZaduzenjaLzoDataTable 
            data={zaduzenjaLzoData}
            columns={columns}
          />
        </div>

        <ZaduzenjaLzoForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ZaduzenjaLzoPage; 