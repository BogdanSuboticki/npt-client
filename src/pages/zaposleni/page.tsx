"use client";

import React, { useState } from "react";
import ZaposleniDataTable from "./ZaposleniDataTable";
import ZaposleniForm from "./ZaposleniForm";
import Button from "../../components/ui/button/Button";

// Sample data for the table
const zaposleniData = [
  {
    id: 1,
    redniBroj: 1,
    imePrezime: "Petar Petrović",
    prvaPomoc: "Da",
  },
  {
    id: 2,
    redniBroj: 2,
    imePrezime: "Ana Anić",
    prvaPomoc: "Ne",
  },
  {
    id: 3,
    redniBroj: 3,
    imePrezime: "Marko Marković",
    prvaPomoc: "Da",
  },
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "imePrezime", label: "Ime i prezime zaposlenog", sortable: true },
  { key: "prvaPomoc", label: "Prva pomoć", sortable: true },
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
    console.error('Error in Zaposleni component:', error);
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

const ZaposleniPage: React.FC = () => {
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
           Zaposleni
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
          <ZaposleniDataTable 
            data={zaposleniData}
            columns={columns}
          />
        </div>

        <ZaposleniForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ZaposleniPage; 