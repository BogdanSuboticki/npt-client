"use client";

import React, { useState } from "react";
    import PovredeDataTable from "./PovredeDataTable";
    import PovredeForm from "./PovredeForm";
    import Button from "../../components/ui/button/Button";

// Sample data for the table
const lekarskiPreglediData = [
  {
    id: 1,
    redniBroj: 1,
    zaposleni: "Zaposleni 1",
    datumPovrede: new Date("2024-01-01"),
    datumObaveštavanjaInspekcije: new Date("2024-01-01"),
    datumOtvaranjaListe: new Date("2024-01-01"),
    datumOvereLekara: new Date("2024-01-01"),
    datumPreuzimanjaIzFonda: new Date("2024-01-01"),
    datumPredavanjaPoslodavcu: new Date("2024-01-01"),
    tezinaPovrede: "Težina povrede 1",
    napomena: "Napomena 1",
  },
  {
    id: 2,
    redniBroj: 2,
    zaposleni: "Zaposleni 2",
    datumPovrede: new Date("2024-02-01"),
    datumObaveštavanjaInspekcije: new Date("2024-02-01"),
    datumOtvaranjaListe: new Date("2024-02-01"),
    datumOvereLekara: new Date("2024-02-01"),
    datumPreuzimanjaIzFonda: new Date("2024-02-01"),
    datumPredavanjaPoslodavcu: new Date("2024-02-01"),
    tezinaPovrede: "Težina povrede 2",
    napomena: "Napomena 2",
  },
  {
    id: 3,
    redniBroj: 3,
    zaposleni: "Zaposleni 3",
    datumPovrede: new Date("2024-03-01"),
    datumObaveštavanjaInspekcije: new Date("2024-03-01"),
    datumOtvaranjaListe: new Date("2024-03-01"),
    datumOvereLekara: new Date("2024-03-01"),
    datumPreuzimanjaIzFonda: new Date("2024-03-01"),
    datumPredavanjaPoslodavcu: new Date("2024-03-01"),
    tezinaPovrede: "Težina povrede 3",
    napomena: "Napomena 3",
  },
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "zaposleni", label: "Zaposleni", sortable: true },
  { key: "datumPovrede", label: "Datum povrede", sortable: true },
  { key: "datumObaveštavanjaInspekcije", label: "Datum obaveštavanja inspekcije", sortable: true },
  { key: "datumOtvaranjaListe", label: "Datum otvaranja liste", sortable: true },
  { key: "datumOvereLekara", label: "Datum overe lekara", sortable: true },
  { key: "datumPreuzimanjaIzFonda", label: "Datum preuzimanja iz fonda", sortable: true },
  { key: "datumPredavanjaPoslodavcu", label: "Datum predavanja poslodavcu", sortable: true },
  { key: "tezinaPovrede", label: "Težina povrede", sortable: true },
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
    console.error('Error in LekarskiPregledi component:', error);
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

const LekarskiPreglediPage: React.FC = () => {
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
        <div className="mb-6 flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
           Povrede
          </h1>
          <Button
            onClick={() => setShowForm(true)}
            size="sm"
            className="ml-5"
          >
            <svg
              className="w-5 h-5"
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
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)]">
          <PovredeDataTable 
            data={lekarskiPreglediData}
            columns={columns}
          />
        </div>

        <PovredeForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default LekarskiPreglediPage; 