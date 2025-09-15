"use client";

import React, { useState } from "react";
import LokacijeDataTable from "./LokacijeDataTable";
import LokacijeForm from "./LokacijeForm";
import Button from "../../components/ui/button/Button";
import TableExportButtons from "../../components/ui/table/TableExportButtons";

// Sample data
const sampleData = [
  {
    id: 1,
    redniBroj: 1,
    nazivLokacije: "Glavna zgrada",
    brojMernihMesta: 15,
    organizacionaJedinica: "Proizvodnja"  },
  {
    id: 2,
    redniBroj: 2,
    nazivLokacije: "Skladište A",
    brojMernihMesta: 8,
    organizacionaJedinica: "Logistika"  },
];

// Column definitions
const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "nazivLokacije", label: "Naziv lokacije", sortable: true },
  { key: "brojMernihMesta", label: "Broj mernih mesta", sortable: true },
  { key: "organizacionaJedinica", label: "Organizaciona jedinica", sortable: true }
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
    console.error('Error in Lokacije component:', error);
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

export default function Lokacije() {
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: any) => {
    console.log("Saving data:", data);
    setShowForm(false);
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Lokacije
          </h1>
          <div className="flex items-center gap-4">
            <TableExportButtons
              data={sampleData}
              columns={columns}
              title="Lokacije"
              filename="lokacije"
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
          <LokacijeDataTable data={sampleData} columns={columns} />
        </div>

        <LokacijeForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
} 