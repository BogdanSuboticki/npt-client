import React, { useState } from 'react';
import IspitivanjeRadneSredineDataTable from './IspitivanjeRadneSredineDataTable';
import IspitivanjeRadneSredineForm from './IspitivanjeRadneSredineForm';
import Button from '../../components/ui/button/Button';

// Sample data for the table
const sampleData = [
  {
    id: 1,
    redniBroj: 1,
    nazivLokacije: 'Fabrika Novi Sad',
    nazivObjekta: 'Proizvodni pogon A',
    brojMernihMesta: 8,
    intervalIspitivanja: '6 meseci',
    napomena: 'Redovno ispitivanje - prioritet',
    mikroklimaLetnja: 'Da',
    mikroklimaZimska: 'Da',
    fizickeStetnosti: 'Ne',
    hemijskeStetnosti: 'Da',
    osvetljenje: 'Da'
  },
  {
    id: 2,
    redniBroj: 2,
    nazivLokacije: 'Skladište Beograd',
    nazivObjekta: 'Magacin 1',
    brojMernihMesta: 4,
    intervalIspitivanja: '12 meseci',
    napomena: 'Periodično ispitivanje',
    mikroklimaLetnja: 'Ne',
    mikroklimaZimska: 'Ne',
    fizickeStetnosti: 'Da',
    hemijskeStetnosti: 'Ne',
    osvetljenje: 'Da'
  },
  {
    id: 3,
    redniBroj: 3,
    nazivLokacije: 'Upravna zgrada Niš',
    nazivObjekta: 'Administrativni centar',
    brojMernihMesta: 6,
    intervalIspitivanja: '6 meseci',
    napomena: 'Kontrolno merenje',
    mikroklimaLetnja: 'Da',
    mikroklimaZimska: 'Da',
    fizickeStetnosti: 'Ne',
    hemijskeStetnosti: 'Ne',
    osvetljenje: 'Da'
  },
  {
    id: 4,
    redniBroj: 4,
    nazivLokacije: 'Pogon Subotica',
    nazivObjekta: 'Proizvodna hala B',
    brojMernihMesta: 12,
    intervalIspitivanja: '3 meseca',
    napomena: 'Vanredno ispitivanje',
    mikroklimaLetnja: 'Da',
    mikroklimaZimska: 'Da',
    fizickeStetnosti: 'Da',
    hemijskeStetnosti: 'Da',
    osvetljenje: 'Da'
  },
  {
    id: 5,
    redniBroj: 5,
    nazivLokacije: 'Distributivni centar Kragujevac',
    nazivObjekta: 'Skladišna hala',
    brojMernihMesta: 5,
    intervalIspitivanja: '12 meseci',
    napomena: 'Standardno ispitivanje',
    mikroklimaLetnja: 'Ne',
    mikroklimaZimska: 'Ne',
    fizickeStetnosti: 'Da',
    hemijskeStetnosti: 'Ne',
    osvetljenje: 'Da'
  },
  {
    id: 6,
    redniBroj: 6,
    nazivLokacije: 'Tehnički centar Zrenjanin',
    nazivObjekta: 'Servisni objekat',
    brojMernihMesta: 7,
    intervalIspitivanja: '6 meseci',
    napomena: 'Redovna kontrola',
    mikroklimaLetnja: 'Da',
    mikroklimaZimska: 'Da',
    fizickeStetnosti: 'Da',
    hemijskeStetnosti: 'Da',
    osvetljenje: 'Da'
  },
  {
    id: 7,
    redniBroj: 7,
    nazivLokacije: 'Logistički centar Čačak',
    nazivObjekta: 'Magacinski prostor C',
    brojMernihMesta: 9,
    intervalIspitivanja: '6 meseci',
    napomena: 'Godišnje ispitivanje',
    mikroklimaLetnja: 'Ne',
    mikroklimaZimska: 'Ne',
    fizickeStetnosti: 'Da',
    hemijskeStetnosti: 'Ne',
    osvetljenje: 'Da'
  },
  {
    id: 8,
    redniBroj: 8,
    nazivLokacije: 'Proizvodni kompleks Pančevo',
    nazivObjekta: 'Proizvodna linija 2',
    brojMernihMesta: 15,
    intervalIspitivanja: '3 meseca',
    napomena: 'Hitno ispitivanje',
    mikroklimaLetnja: 'Da',
    mikroklimaZimska: 'Da',
    fizickeStetnosti: 'Da',
    hemijskeStetnosti: 'Da',
    osvetljenje: 'Da'
  },
  {
    id: 9,
    redniBroj: 9,
    nazivLokacije: 'Poslovni centar Valjevo',
    nazivObjekta: 'Kancelarijski prostor',
    brojMernihMesta: 3,
    intervalIspitivanja: '12 meseci',
    napomena: 'Standardna provera',
    mikroklimaLetnja: 'Da',
    mikroklimaZimska: 'Da',
    fizickeStetnosti: 'Ne',
    hemijskeStetnosti: 'Ne',
    osvetljenje: 'Da'
  },
  {
    id: 10,
    redniBroj: 10,
    nazivLokacije: 'Industrijska zona Šabac',
    nazivObjekta: 'Montažni objekat D',
    brojMernihMesta: 6,
    intervalIspitivanja: '6 meseci',
    napomena: 'Kvartalno ispitivanje',
    mikroklimaLetnja: 'Da',
    mikroklimaZimska: 'Da',
    fizickeStetnosti: 'Da',
    hemijskeStetnosti: 'Da',
    osvetljenje: 'Da'
  }
];

// Column definitions for the table
const columns = [
  { key: 'redniBroj', label: '', sortable: true },
  { key: 'nazivLokacije', label: 'Naziv lokacije', sortable: true },
  { key: 'brojMernihMesta', label: 'Broj mernih mesta', sortable: true },
  { key: 'intervalIspitivanja', label: 'Interval ispitivanja', sortable: true },
  { key: 'napomena', label: 'Napomena', sortable: true },
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
        <div className="mb-6 flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Ispitivanje radne sredine
          </h1>
          <Button
            onClick={() => setIsFormOpen(true)}
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