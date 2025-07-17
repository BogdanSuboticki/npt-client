"use client";

import React, { useState } from "react";
import LekarskiPreglediDataTable from "./LekarskiPreglediDataTable";
import LekarskiPreglediForm from "./LekarskiPreglediForm";
import Button from "../../components/ui/button/Button";

// Sample data for the table
const lekarskiPreglediData = [
  {
    id: 1,
    zaposleni: "Marko Petrović",
    radnoMesto: "Inženjer proizvodnje",
    povecanRizik: true,
    nocniRad: false,
    vrstaLekarskog: "Predhodni",
    datumLekarskog: new Date("2024-01-15"),
    datumNarednogLekarskog: new Date("2024-07-15"),
    aktivan: true,
  },
  {
    id: 2,
    zaposleni: "Ana Jovanović",
    radnoMesto: "Tehničar održavanja",
    povecanRizik: false,
    nocniRad: true,
    vrstaLekarskog: "Periodični",
    datumLekarskog: new Date("2024-02-20"),
    datumNarednogLekarskog: new Date("2024-08-20"),
    aktivan: true,
  },
  {
    id: 3,
    zaposleni: "Stefan Nikolić",
    radnoMesto: "Električar",
    povecanRizik: true,
    nocniRad: false,
    vrstaLekarskog: "Vanredni",
    datumLekarskog: new Date("2024-03-10"),
    datumNarednogLekarskog: new Date("2024-09-10"),
    aktivan: true,
  },
  {
    id: 4,
    zaposleni: "Marija Đorđević",
    radnoMesto: "Hemijski tehničar",
    povecanRizik: true,
    nocniRad: false,
    vrstaLekarskog: "Periodični",
    datumLekarskog: new Date("2024-01-05"),
    datumNarednogLekarskog: new Date("2024-07-05"),
    aktivan: false,
  },
  {
    id: 5,
    zaposleni: "Dragan Simić",
    radnoMesto: "Mehaničar",
    povecanRizik: false,
    nocniRad: true,
    vrstaLekarskog: "Predhodni",
    datumLekarskog: new Date("2024-02-28"),
    datumNarednogLekarskog: new Date("2024-08-28"),
    aktivan: true,
  },
  {
    id: 6,
    zaposleni: "Jelena Popović",
    radnoMesto: "Laborant",
    povecanRizik: true,
    nocniRad: false,
    vrstaLekarskog: "Vanredni",
    datumLekarskog: new Date("2024-03-15"),
    datumNarednogLekarskog: new Date("2024-09-15"),
    aktivan: true,
  },
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "zaposleni", label: "Zaposleni", sortable: true },
  { key: "radnoMesto", label: "Radno mesto", sortable: true },
  { key: "povecanRizik", label: "Povećan rizik", sortable: true },
  { key: "nocniRad", label: "Noćni rad", sortable: true },
  { key: "vrstaLekarskog", label: "Vrsta lekarskog", sortable: true },
  { key: "datumLekarskog", label: "Datum lekarskog pregleda", sortable: true },
  { key: "datumNarednogLekarskog", label: "Datum narednog lekarskog pregleda", sortable: true },
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
            Lekarski pregledi
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
          <LekarskiPreglediDataTable 
            data={lekarskiPreglediData}
            columns={columns}
          />
        </div>

        <LekarskiPreglediForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default LekarskiPreglediPage; 