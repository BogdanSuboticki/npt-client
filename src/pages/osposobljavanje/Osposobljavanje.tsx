import React, { useState } from 'react';
import OsposobljavanjeDataTable from './OsposobljavanjeDataTable';
import OsposobljavanjeForm from './OsposobljavanjeForm';

// Sample data for the table
const osposobljavanjeData = [
  {
    id: 1,
    redniBroj: 1,
    zaposleni: "Petar Petrović",
    radnoMesto: "Operater viljuškara",
    lokacija: "Magacin Novi Sad",
    povecanRizik: true,
    osposobljavanjeBZR: "2024-01-15",
    datumNarednogBZR: "2025-01-15",
    osposobljavanjeZOP: "2024-02-01",
    datumNarednogZOP: "2025-02-01",
    prikaziUPodsetniku: true,
    bzrOdradjeno: true
  },
  {
    id: 2,
    redniBroj: 2,
    zaposleni: "Ana Anić",
    radnoMesto: "Administrativni radnik",
    lokacija: "Kancelarija Beograd",
    povecanRizik: false,
    osposobljavanjeBZR: "2024-03-01",
    datumNarednogBZR: "2025-03-01",
    osposobljavanjeZOP: "2024-03-15",
    datumNarednogZOP: "2025-03-15",
    prikaziUPodsetniku: false,
    bzrOdradjeno: false
  },
  {
    id: 3,
    redniBroj: 3,
    zaposleni: "Marko Marković",
    radnoMesto: "Zavarivač",
    lokacija: "Proizvodna hala Niš",
    povecanRizik: true,
    osposobljavanjeBZR: "2024-02-15",
    datumNarednogBZR: "2025-02-15",
    osposobljavanjeZOP: "2024-03-01",
    datumNarednogZOP: "2025-03-01",
    prikaziUPodsetniku: true,
    bzrOdradjeno: true
  },
  {
    id: 4,
    redniBroj: 4,
    zaposleni: "Jovan Jovanović",
    radnoMesto: "Električar održavanja",
    lokacija: "Pogon Subotica",
    povecanRizik: true,
    osposobljavanjeBZR: "2024-04-01",
    datumNarednogBZR: "2025-04-01",
    osposobljavanjeZOP: "2024-04-15",
    datumNarednogZOP: "2025-04-15",
    prikaziUPodsetniku: true,
    bzrOdradjeno: false
  },
  {
    id: 5,
    redniBroj: 5,
    zaposleni: "Milan Milanković",
    radnoMesto: "Magacioner",
    lokacija: "Magacin Kragujevac",
    povecanRizik: true,
    osposobljavanjeBZR: "2024-05-01",
    datumNarednogBZR: "2025-05-01",
    osposobljavanjeZOP: "2024-05-15",
    datumNarednogZOP: "2025-05-15",
    prikaziUPodsetniku: false,
    bzrOdradjeno: false
  }
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "zaposleni", label: "Zaposleni", sortable: true },
  { key: "radnoMesto", label: "Radno mesto", sortable: true },
  { key: "lokacija", label: "Lokacija", sortable: true },
  { key: "povecanRizik", label: "Povećani rizik", sortable: true },
  { key: "osposobljavanjeBZR", label: "Osposobljavanje BZR", sortable: true },
  { key: "datumNarednogBZR", label: "Datum narednog osposobljavanja", sortable: true },
  { key: "osposobljavanjeZOP", label: "Osposobljavanje ZOP", sortable: true },
  { key: "datumNarednogZOP", label: "Datum narednog ZOP", sortable: true }
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
    console.error('Error in Osposobljavanje component:', error);
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

const Osposobljavanje: React.FC = () => {
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
            Osposobljavanje
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 ml-5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
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
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)]">
          <OsposobljavanjeDataTable 
            data={osposobljavanjeData}
            columns={columns}
          />
        </div>

        <OsposobljavanjeForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Osposobljavanje;
