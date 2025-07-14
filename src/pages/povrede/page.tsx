"use client";

import React, { useState } from "react";
    import PovredeDataTable from "./PovredeDataTable";
    import PovredeForm from "./PovredeForm";
    import Button from "../../components/ui/button/Button";

// Sample data for the table
const povredeData = [
  {
    id: 1,
    redniBroj: 1,
    zaposleni: "Zaposleni 1",
    datumPovrede: new Date("2024-01-15"),
    tezinaPovrede: "Laka",
    brojPovredneListe: "PL-001/2024",
    datumObavestenjaInspekcije: new Date("2024-01-16"),
    datumPredajeFondu: new Date("2024-01-20"),
    datumPreuzimanjaIzFonda: new Date("2024-02-05"),
    datumDostavjanjaUpravi: new Date("2024-02-10"),
    napomena: "Povreda na radu - udarac u glavu",
  },
  {
    id: 2,
    redniBroj: 2,
    zaposleni: "Zaposleni 2",
    datumPovrede: new Date("2024-02-10"),
    tezinaPovrede: "Srednja",
    brojPovredneListe: "PL-002/2024",
    datumObavestenjaInspekcije: new Date("2024-02-11"),
    datumPredajeFondu: new Date("2024-02-15"),
    datumPreuzimanjaIzFonda: new Date("2024-03-01"),
    datumDostavjanjaUpravi: new Date("2024-03-05"),
    napomena: "Povreda na radu - prelom noge",
  },
  {
    id: 3,
    redniBroj: 3,
    zaposleni: "Zaposleni 3",
    datumPovrede: new Date("2024-03-05"),
    tezinaPovrede: "Teška",
    brojPovredneListe: "PL-003/2024",
    datumObavestenjaInspekcije: new Date("2024-03-06"),
    datumPredajeFondu: new Date("2024-03-10"),
    datumPreuzimanjaIzFonda: new Date("2024-03-25"),
    datumDostavjanjaUpravi: new Date("2024-03-30"),
    napomena: "Povreda na radu - opekotine",
  },
];

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
            data={povredeData}
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