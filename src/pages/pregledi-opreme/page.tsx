"use client";

import React, { useState } from "react";
import PreglediOpremeDataTable from "./PreglediOpremeDataTable";
import PreglediOpremeForm from "./PreglediOpremeForm";
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";

// Sample data for the table
const preglediOpremeData = [
  {
    id: 1,
    redniBroj: 1,
    nazivOpreme: "Kompresor vazduha",
    vrstaOpreme: "Oprema za rad",
    inventarniBroj: "INV-001",
    lokacija: "Proizvodna hala A",
    datumPregleda: new Date("2024-01-01"),
    intervalPregleda: "1",
    status: "Ispravno",
    datumNarednogPregleda: new Date("2024-07-01"),
    napomena: "Redovna kontrola",
    standard: "EN 1012-1",
  },
  {
    id: 2,
    redniBroj: 2,
    nazivOpreme: "Kran mostni",
    vrstaOpreme: "Oprema za rad",
    inventarniBroj: "INV-002",
    lokacija: "Skladište B",
    datumPregleda: new Date("2024-02-15"),
    intervalPregleda: "3",
    status: "Ispravno",
    datumNarednogPregleda: new Date("2024-08-15"),
    napomena: "Redovna kontrola",
    standard: "EN 13001-1",
  },
  {
    id: 3,
    redniBroj: 3,
    nazivOpreme: "Ventilator industrijski",
    vrstaOpreme: "Oprema za rad",
    inventarniBroj: "INV-003",
    lokacija: "Proizvodna hala B",
    datumPregleda: new Date("2024-03-10"),
    intervalPregleda: "6",
    status: "Neispravno",
    datumNarednogPregleda: new Date("2024-06-10"),
    napomena: "Potrebna je zamena motora, oprema trenutno neispravna",
    standard: "EN 60335-2-80",
  },
  {
    id: 4,
    redniBroj: 4,
    nazivOpreme: "Pumpa za vodu",
    vrstaOpreme: "Oprema za rad",
    inventarniBroj: "INV-004",
    lokacija: "Tehnička prostorija",
    datumPregleda: new Date("2024-01-30"),
    intervalPregleda: "24",
    status: "Ispravno",
    datumNarednogPregleda: new Date("2026-01-30"),
    napomena: "Oprema u odličnom stanju, nema potrebe za intervencijom",
    standard: "EN 809",
  },
  {
    id: 5,
    redniBroj: 5,
    nazivOpreme: "Generator električni",
    vrstaOpreme: "Elektro i gromobranska instalacija",
    inventarniBroj: "INV-005",
    lokacija: "Energetski centar",
    datumPregleda: new Date("2024-02-05"),
    intervalPregleda: "12",
    status: "Ispravno",
    datumNarednogPregleda: new Date("2025-02-05"),
    napomena: "Redovna kontrola, potrebna je zamena ulja",
    standard: "EN 60034-1",
  },
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "nazivOpreme", label: "Naziv opreme", sortable: true },
  { key: "vrstaOpreme", label: "Vrsta opreme", sortable: true },
  { key: "inventarniBroj", label: "Inventarni broj", sortable: true },
  { key: "lokacija", label: "Lokacija", sortable: true },
  { key: "standard", label: "Standard", sortable: true },
  { key: "datumPregleda", label: "Poslednji pregled", sortable: true },
  { key: "status", label: "Status pregleda", sortable: true },
  { key: "naredniPregled", label: "Naredni pregled", sortable: true },
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
    console.error('Error in PreglediOpreme component:', error);
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

const PreglediOpremePage: React.FC = () => {
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
              Pregledi opreme
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={preglediOpremeData}
                columns={columns}
                title="Pregledi opreme"
                filename="pregledi-opreme"
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
                  data={preglediOpremeData}
                  columns={columns}
                  title="Pregledi opreme"
                  filename="pregledi-opreme"
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
          <PreglediOpremeDataTable 
            data={preglediOpremeData}
            columns={columns}
          />
        </div>

        <PreglediOpremeForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default PreglediOpremePage; 