"use client";

import React, { useState } from "react";
import AngazovanjaDataTable from "./AngazovanjaDataTable";
import AngazovanjaForm from "./AngazovanjaForm";
import Button from "../../components/ui/button/Button";

// Sample data for the table
const angazovanjaData = [
  {
    id: 1,
    redniBroj: 1,
    imePrezime: "Petar Petrović",
    radnoMesto: "Inženjer bezbednosti",
    vrstaAngazovanja: "Redovno angažovanje",
    lokacija: "Beograd",
    pocetakAngazovanja: "2023-01-15",
    prestanakAngazovanja: null,
  },
  {
    id: 2,
    redniBroj: 2,
    imePrezime: "Ana Anić",
    radnoMesto: "Tehničar za radnu zaštitu",
    vrstaAngazovanja: "Stručna praksa",
    lokacija: "Novi Sad",
    pocetakAngazovanja: "2023-03-01",
    prestanakAngazovanja: "2023-09-01",
  },
  {
    id: 3,
    redniBroj: 3,
    imePrezime: "Marko Marković",
    radnoMesto: "Koordinator bezbednosti",
    vrstaAngazovanja: "Redovno angažovanje",
    lokacija: "Niš",
    pocetakAngazovanja: "2022-11-10",
    prestanakAngazovanja: null,
  },
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "imePrezime", label: "Ime i prezime zaposlenog", sortable: true },
  { key: "radnoMesto", label: "Radno mesto", sortable: true },
  { key: "vrstaAngazovanja", label: "Vrsta angažovanja", sortable: true },
  { key: "lokacija", label: "Lokacija", sortable: true },
  { key: "pocetakAngazovanja", label: "Početak angažovanja", sortable: true },
  { key: "prestanakAngazovanja", label: "Prestanak angažovanja", sortable: true },
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
    console.error('Error in Angazovanja component:', error);
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

const AngazovanjaPage: React.FC = () => {
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
           Angažovanja
          </h1>
          <Button
            onClick={() => setShowForm(true)}
            size="sm"
            className="ml-5"
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
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)]">
          <AngazovanjaDataTable 
            data={angazovanjaData}
            columns={columns}
          />
        </div>

        <AngazovanjaForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default AngazovanjaPage;
