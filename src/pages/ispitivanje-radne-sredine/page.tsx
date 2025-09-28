import React, { useState } from 'react';
import IspitivanjeRadneSredineDataTable from './IspitivanjeRadneSredineDataTable';
import IspitivanjeRadneSredineForm from './IspitivanjeRadneSredineForm';
import Button from '../../components/ui/button/Button';
import ExportPopoverButton from '../../components/ui/table/ExportPopoverButton';

// Sample data for the table
const sampleData = [
  {
    id: 1,
    redniBroj: 1,
    nazivLokacije: 'Fabrika Novi Sad',
    brojMernihMesta: 8,
    intervalIspitivanja: '6 meseci',
    mikroklimaLetnja: {
      prethodnoIspitivanje: '15.06.2023',
      narednoIspitivanje: '15.12.2023'
    },
    mikroklimaZimska: {
      prethodnoIspitivanje: '10.01.2023',
      narednoIspitivanje: '10.07.2023'
    },
    fizickeStetnosti: {
      prethodnoIspitivanje: '22.03.2023',
      narednoIspitivanje: '22.09.2023'
    },
    hemijskeStetnosti: {
      prethodnoIspitivanje: '05.05.2023',
      narednoIspitivanje: '05.11.2023'
    },
    osvetljenje: {
      prethodnoIspitivanje: '18.04.2023',
      narednoIspitivanje: '18.10.2023'
    }
  },
  {
    id: 2,
    redniBroj: 2,
    nazivLokacije: 'Skladište Beograd',
    brojMernihMesta: 4,
    intervalIspitivanja: '12 meseci',
    mikroklimaLetnja: {
      prethodnoIspitivanje: '12.07.2022',
      narednoIspitivanje: '12.07.2023'
    },
    mikroklimaZimska: {
      prethodnoIspitivanje: '08.02.2022',
      narednoIspitivanje: '08.02.2023'
    },
    fizickeStetnosti: {
      prethodnoIspitivanje: '25.09.2022',
      narednoIspitivanje: '25.09.2023'
    },
    hemijskeStetnosti: {
      prethodnoIspitivanje: '14.11.2022',
      narednoIspitivanje: '14.11.2023'
    },
    osvetljenje: {
      prethodnoIspitivanje: '03.08.2022',
      narednoIspitivanje: '03.08.2023'
    }
  },
  {
    id: 3,
    redniBroj: 3,
    nazivLokacije: 'Upravna zgrada Niš',
    brojMernihMesta: 6,
    intervalIspitivanja: '6 meseci',
    mikroklimaLetnja: {
      prethodnoIspitivanje: '20.05.2023',
      narednoIspitivanje: '20.11.2023'
    },
    mikroklimaZimska: {
      prethodnoIspitivanje: '15.12.2022',
      narednoIspitivanje: '15.06.2023'
    },
    fizickeStetnosti: {
      prethodnoIspitivanje: '28.02.2023',
      narednoIspitivanje: '28.08.2023'
    },
    hemijskeStetnosti: {
      prethodnoIspitivanje: '10.04.2023',
      narednoIspitivanje: '10.10.2023'
    },
    osvetljenje: {
      prethodnoIspitivanje: '07.03.2023',
      narednoIspitivanje: '07.09.2023'
    }
  },
  {
    id: 4,
    redniBroj: 4,
    nazivLokacije: 'Pogon Subotica',
    brojMernihMesta: 12,
    intervalIspitivanja: '3 meseca',
    mikroklimaLetnja: {
      prethodnoIspitivanje: '30.06.2023',
      narednoIspitivanje: '30.09.2023'
    },
    mikroklimaZimska: {
      prethodnoIspitivanje: '25.03.2023',
      narednoIspitivanje: '25.06.2023'
    },
    fizickeStetnosti: {
      prethodnoIspitivanje: '12.05.2023',
      narednoIspitivanje: '12.08.2023'
    },
    hemijskeStetnosti: {
      prethodnoIspitivanje: '18.07.2023',
      narednoIspitivanje: '18.10.2023'
    },
    osvetljenje: {
      prethodnoIspitivanje: '05.04.2023',
      narednoIspitivanje: '05.07.2023'
    }
  },
  {
    id: 5,
    redniBroj: 5,
    nazivLokacije: 'Distributivni centar Kragujevac',
    brojMernihMesta: 5,
    intervalIspitivanja: '12 meseci',
    mikroklimaLetnja: {
      prethodnoIspitivanje: '22.08.2022',
      narednoIspitivanje: '22.08.2023'
    },
    mikroklimaZimska: {
      prethodnoIspitivanje: '14.01.2022',
      narednoIspitivanje: '14.01.2023'
    },
    fizickeStetnosti: {
      prethodnoIspitivanje: '09.10.2022',
      narednoIspitivanje: '09.10.2023'
    },
    hemijskeStetnosti: {
      prethodnoIspitivanje: '17.12.2022',
      narednoIspitivanje: '17.12.2023'
    },
    osvetljenje: {
      prethodnoIspitivanje: '31.07.2022',
      narednoIspitivanje: '31.07.2023'
    }
  },
  {
    id: 6,
    redniBroj: 6,
    nazivLokacije: 'Tehnički centar Zrenjanin',
    brojMernihMesta: 7,
    intervalIspitivanja: '6 meseci',
    mikroklimaLetnja: {
      prethodnoIspitivanje: '11.04.2023',
      narednoIspitivanje: '11.10.2023'
    },
    mikroklimaZimska: {
      prethodnoIspitivanje: '06.11.2022',
      narednoIspitivanje: '06.05.2023'
    },
    fizickeStetnosti: {
      prethodnoIspitivanje: '24.01.2023',
      narednoIspitivanje: '24.07.2023'
    },
    hemijskeStetnosti: {
      prethodnoIspitivanje: '13.03.2023',
      narednoIspitivanje: '13.09.2023'
    },
    osvetljenje: {
      prethodnoIspitivanje: '29.02.2023',
      narednoIspitivanje: '29.08.2023'
    }
  },
  {
    id: 7,
    redniBroj: 7,
    nazivLokacije: 'Logistički centar Čačak',
    brojMernihMesta: 9,
    intervalIspitivanja: '6 meseci',
    mikroklimaLetnja: {
      prethodnoIspitivanje: '16.09.2022',
      narednoIspitivanje: '16.03.2023'
    },
    mikroklimaZimska: {
      prethodnoIspitivanje: '21.12.2022',
      narednoIspitivanje: '21.06.2023'
    },
    fizickeStetnosti: {
      prethodnoIspitivanje: '08.05.2023',
      narednoIspitivanje: '08.11.2023'
    },
    hemijskeStetnosti: {
      prethodnoIspitivanje: '26.07.2022',
      narednoIspitivanje: '26.01.2023'
    },
    osvetljenje: {
      prethodnoIspitivanje: '19.10.2022',
      narednoIspitivanje: '19.04.2023'
    }
  },
  {
    id: 8,
    redniBroj: 8,
    nazivLokacije: 'Proizvodni kompleks Pančevo',
    brojMernihMesta: 15,
    intervalIspitivanja: '3 meseca',
    mikroklimaLetnja: {
      prethodnoIspitivanje: '02.08.2023',
      narednoIspitivanje: '02.11.2023'
    },
    mikroklimaZimska: {
      prethodnoIspitivanje: '27.05.2023',
      narednoIspitivanje: '27.08.2023'
    },
    fizickeStetnosti: {
      prethodnoIspitivanje: '14.06.2023',
      narednoIspitivanje: '14.09.2023'
    },
    hemijskeStetnosti: {
      prethodnoIspitivanje: '01.09.2023',
      narednoIspitivanje: '01.12.2023'
    },
    osvetljenje: {
      prethodnoIspitivanje: '23.07.2023',
      narednoIspitivanje: '23.10.2023'
    }
  },
  {
    id: 9,
    redniBroj: 9,
    nazivLokacije: 'Poslovni centar Valjevo',
    brojMernihMesta: 3,
    intervalIspitivanja: '12 meseci',
    mikroklimaLetnja: {
      prethodnoIspitivanje: '09.12.2022',
      narednoIspitivanje: '09.12.2023'
    },
    mikroklimaZimska: {
      prethodnoIspitivanje: '03.03.2022',
      narednoIspitivanje: '03.03.2023'
    },
    fizickeStetnosti: {
      prethodnoIspitivanje: '18.06.2022',
      narednoIspitivanje: '18.06.2023'
    },
    hemijskeStetnosti: {
      prethodnoIspitivanje: '30.09.2022',
      narednoIspitivanje: '30.09.2023'
    },
    osvetljenje: {
      prethodnoIspitivanje: '12.04.2022',
      narednoIspitivanje: '12.04.2023'
    }
  },
  {
    id: 10,
    redniBroj: 10,
    nazivLokacije: 'Industrijska zona Šabac',
    brojMernihMesta: 6,
    intervalIspitivanja: '6 meseci',
    mikroklimaLetnja: {
      prethodnoIspitivanje: '25.03.2023',
      narednoIspitivanje: '25.09.2023'
    },
    mikroklimaZimska: {
      prethodnoIspitivanje: '17.10.2022',
      narednoIspitivanje: '17.04.2023'
    },
    fizickeStetnosti: {
      prethodnoIspitivanje: '04.01.2023',
      narednoIspitivanje: '04.07.2023'
    },
    hemijskeStetnosti: {
      prethodnoIspitivanje: '22.05.2023',
      narednoIspitivanje: '22.11.2023'
    },
    osvetljenje: {
      prethodnoIspitivanje: '11.02.2023',
      narednoIspitivanje: '11.08.2023'
    }
  }
];

// Column definitions for the table
const columns = [
  { key: 'redniBroj', label: '', sortable: true },
  { key: 'nazivLokacije', label: 'Lokacija', sortable: true },
  { key: 'brojMernihMesta', label: 'Broj mernih mesta', sortable: true },
  { key: 'intervalIspitivanja', label: 'Interval ispitivanja', sortable: true },
  { key: 'mikroklimaLetnja', label: 'Mikroklima letnja', sortable: true },
  { key: 'mikroklimaZimska', label: 'Mikroklima zimska', sortable: true },
  { key: 'fizickeStetnosti', label: 'Fizičke štetnosti', sortable: true },
  { key: 'hemijskeStetnosti', label: 'Hemijske štetnosti', sortable: true },
  { key: 'osvetljenje', label: 'Osvetljenje', sortable: true },
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
    console.error('Error in IspitivanjeRadneSredine component:', error);
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

const IspitivanjeRadneSredine: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [data, setData] = useState(sampleData);

  const handleSave = (newData: any) => {
    setData(prev => [
      ...prev,
      {
        ...newData,
        id: prev.length + 1,
        redniBroj: prev.length + 1,
      }
    ]);
    setIsFormOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Ispitivanje Radne Sredine
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Ispitivanje radne sredine"
                filename="ispitivanje-radne-sredine"
              />
              <Button
                onClick={() => setIsFormOpen(true)}
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
                  data={data}
                  columns={columns}
                  title="Ispitivanje radne sredine"
                  filename="ispitivanje-radne-sredine"
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <Button
                  onClick={() => setIsFormOpen(true)}
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
          <IspitivanjeRadneSredineDataTable
            data={data}
            columns={columns}
          />
        </div>

        <IspitivanjeRadneSredineForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default IspitivanjeRadneSredine; 