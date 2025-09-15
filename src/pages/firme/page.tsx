"use client";

import React, { useState } from "react";
import FirmeDataTable from "./FirmeDataTable";
import FirmeForm from "./FirmeForm";
import Button from "../../components/ui/button/Button";
import { usePageContext } from "../../hooks/usePageContext";
import TableExportButtons from "../../components/ui/table/TableExportButtons";

// Sample data for Moja Firma context
const mojaFirmaData = [
  {
    id: 1,
    redniBroj: 1,
    naziv: "Moja Firma 1",
    adresa: "Adresa Moja Firma 1",
    mesto: "Beograd",
    pib: "1234567890",
    maticniBroj: "1234567890",
    delatnost: "IT delatnost",
    datumIstekaUgovora: new Date("2024-12-31"),
    aktivan: true,
  },
  {
    id: 2,
    redniBroj: 2,
    naziv: "Moja Firma 2",
    adresa: "Adresa Moja Firma 2",
    mesto: "Novi Sad",
    pib: "0987654321",
    maticniBroj: "0987654321",
    delatnost: "Proizvodnja",
    datumIstekaUgovora: new Date("2024-06-30"),
    aktivan: true,
  },
];

// Sample data for Komitenti context
const komitentiData = [
  {
    id: 1,
    redniBroj: 1,
    naziv: "Komitent Firma 1",
    adresa: "Adresa Komitent 1",
    mesto: "Niš",
    pib: "1122334455",
    maticniBroj: "1122334455",
    delatnost: "Uslužne delatnosti",
    datumIstekaUgovora: new Date("2024-03-15"),
    aktivan: true,
  },
  {
    id: 2,
    redniBroj: 2,
    naziv: "Komitent Firma 2",
    adresa: "Adresa Komitent 2",
    mesto: "Kragujevac",
    pib: "5566778899",
    maticniBroj: "5566778899",
    delatnost: "Trgovina",
    datumIstekaUgovora: new Date("2024-09-20"),
    aktivan: true,
  },
  {
    id: 3,
    redniBroj: 3,
    naziv: "Komitent Firma 3",
    adresa: "Adresa Komitent 3",
    mesto: "Subotica",
    pib: "9988776655",
    maticniBroj: "9988776655",
    delatnost: "Poljoprivreda",
    datumIstekaUgovora: new Date("2024-11-10"),
    aktivan: false,
  },
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "naziv", label: "Naziv", sortable: true },
  { key: "adresa", label: "Adresa", sortable: true },
  { key: "mesto", label: "Mesto", sortable: true },
  { key: "pib", label: "PIB", sortable: true },
  { key: "maticniBroj", label: "Matični broj", sortable: true },
  { key: "delatnost", label: "Delatnost", sortable: true },
  { key: "datumIstekaUgovora", label: "Datum isteka ugovora", sortable: true },
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
    console.error('Error in Firma component:', error);
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

const Firme: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const context = usePageContext();

  // Get data based on context
  const getDataForContext = () => {
    switch (context) {
      case 'komitenti':
        return komitentiData;
      case 'moja-firma':
      default:
        return mojaFirmaData;
    }
  };

  const handleSave = (data: any) => {
    // Here you would typically save the data to your backend
    console.log(`Saving new entry for ${context}:`, data);
    // For now, we'll just close the form
    setShowForm(false);
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Firme
          </h1>
          <div className="flex items-center gap-4">
            <TableExportButtons
              data={getDataForContext()}
              columns={columns}
              title="Firme"
              filename={`firme-${context}`}
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
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)]">
          <FirmeDataTable 
            data={getDataForContext()}
            columns={columns}
          />
        </div>

        <FirmeForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Firme; 