"use client";

import React, { useState } from "react";
    import BezbednosneProvereDataTable from "./BezbednosneProvereDataTable";
    import BezbednosneProvereForm from "./BezbednosneProvereForm";
    import Button from "../../components/ui/button/Button";

// Sample data for the table
const lekarskiPreglediData = [
  {
    id: 1,
    redniBroj: 1,
    lokacija: "Lokacija 1",
    datumObilaska: new Date("2024-01-01"),
    periodObilaska: "Period 1",
    sledeciObilazak: "Sledeći obilazak 1",
    napomena: "Napomena 1",
  },
  {
    id: 2,
    redniBroj: 2,
    lokacija: "Lokacija 2",
    datumObilaska: new Date("2024-02-01"),
    periodObilaska: "Period 2",
    sledeciObilazak: "Sledeći obilazak 2",
    napomena: "Napomena 2",
  },
  {
    id: 3,
    redniBroj: 3,
    lokacija: "Lokacija 3",
    datumObilaska: new Date("2024-03-01"),
    periodObilaska: "Period 3",
    sledeciObilazak: "Sledeći obilazak 3",
    napomena: "Napomena 3",
  },
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "lokacija", label: "Lokacija", sortable: true },
  { key: "datumProvere", label: "Datum provere", sortable: true },
  { key: "intervalProvere", label: "Interval provere", sortable: true },
  { key: "sledecaProvera", label: "Sledeća provera", sortable: true },
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
            Bezbednosne provere
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
          <BezbednosneProvereDataTable 
            data={lekarskiPreglediData}
            columns={columns}
          />
        </div>

        <BezbednosneProvereForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default LekarskiPreglediPage; 