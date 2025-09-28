import React, { useState } from 'react';
import OpremaDataTable from './OpremaDataTable';
import OpremaForm from './OpremaForm';
import Button from '../../components/ui/button/Button';
import ExportPopoverButton from '../../components/ui/table/ExportPopoverButton';

// Sample data for the table
const opremaData = [
  {
    id: 1,
    redniBroj: 1,
    nazivLZS: "Viljuškar",
    vrstaOpreme: "Oprema za rad",
    fabrickBroj: "FB123456",
    inventarniBroj: "INV789",
    lokacija: "Skladište A",
    godinaProizvodnje: 2020,
    intervalPregleda: 6,
    napomena: "Redovno održavanje",
    iskljucenaIzPracenja: false,
    standard: "EN ISO 3691-1"
  },
  {
    id: 2,
    redniBroj: 2,
    nazivLZS: "Kran",
    vrstaOpreme: "Oprema za rad",
    fabrickBroj: "FB789012",
    inventarniBroj: "INV456",
    lokacija: "Proizvodna hala 1",
    godinaProizvodnje: 2019,
    intervalPregleda: 12,
    napomena: "Potrebno zamena delova",
    iskljucenaIzPracenja: false,
    standard: "EN 13001"
  },
  {
    id: 3,
    redniBroj: 3,
    nazivLZS: "Transformator",
    vrstaOpreme: "Elektro i gromobranska instalacija",
    fabrickBroj: "FB345678",
    inventarniBroj: "INV123",
    lokacija: "Lokacija 1",
    godinaProizvodnje: 2021,
    intervalPregleda: 24,
    napomena: "Godišnji pregled",
    iskljucenaIzPracenja: false,
    standard: "IEC 60076"
  }
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "nazivLZS", label: "Naziv LZS", sortable: true },
  { key: "vrstaOpreme", label: "Vrsta opreme", sortable: true },
  { key: "standard", label: "Standard", sortable: true },
  { key: "lokacija", label: "Lokacija", sortable: true },
  { key: "fabrickInventarniBroj", label: "Fabrički/Inventarni broj", sortable: true },
  { key: "godinaProizvodnje", label: "Godina proizvodnje", sortable: true },
  { key: "intervalPregleda", label: "Interval pregleda (meseci)", sortable: true },
  { key: "napomena", label: "Napomena", sortable: true }
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
    console.error('Error in Oprema component:', error);
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

const Oprema: React.FC = () => {
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
              Oprema - LZS
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={opremaData}
                columns={columns}
                title="Oprema"
                filename="oprema"
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
                  data={opremaData}
                  columns={columns}
                  title="Oprema"
                  filename="oprema"
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
          <OpremaDataTable 
            data={opremaData}
            columns={columns}
          />
        </div>

        <OpremaForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Oprema; 