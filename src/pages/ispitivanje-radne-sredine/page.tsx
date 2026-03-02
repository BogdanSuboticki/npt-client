import React, { useState, useEffect } from 'react';
import IspitivanjeRadneSredineDataTable from './IspitivanjeRadneSredineDataTable';
import IspitivanjeRadneSredineForm from './IspitivanjeRadneSredineForm';
import Button from '../../components/ui/button/Button';
import ExportPopoverButton from '../../components/ui/table/ExportPopoverButton';
import ConfirmModal from '../../components/ui/modal/ConfirmModal';
import { api } from '../../api/client';
import { usePageContext } from '../../hooks/usePageContext';
import { fromIsoDate, toIsoDate } from '../../utils/date';

const computeNarednoIspitivanje = (datumIspitivanja: string | null, intervalMeseci: number): string => {
  const date = fromIsoDate(datumIspitivanja);
  if (!date) return '';
  const naredno = new Date(date);
  naredno.setMonth(naredno.getMonth() + intervalMeseci);
  return naredno.toLocaleDateString('sr-Latn-RS');
};

const tipKeyToNaziv: Record<string, string> = {
  mikroklimaLetnja: 'Ispitivanje Mikroklime letnje',
  mikroklimaZimska: 'Ispitivanje Mikroklime zimske',
  fizickeStetnosti: 'Ispitivanje Fizičkih štetnosti',
  hemijskeStetnosti: 'Ispitivanje Hemijskih štetnosti',
  osvetljenje: 'Ispitivanje Osvetljenja',
};

const mapIspitivanjeFromApi = (item: any, index: number) => {
  const rezultati = item.rezultati || [];
  const intervalMeseci = item.interval_ispitivanja_meseci ?? 36;
  const result: any = {
    id: item.id,
    redniBroj: index + 1,
    nazivLokacije: item.lokacija?.naziv ?? '',
    brojMernihMesta: item.broj_mernih_mesta,
    intervalIspitivanja: `${item.interval_ispitivanja_meseci} meseci`,
    intervalIspitivanjaMeseci: item.interval_ispitivanja_meseci,
    lokacijaId: item.lokacija_id,
    firmaPib: item.firma_pib,
    _rawRezultati: rezultati,
  };

  rezultati.forEach((rez: any) => {
    const tip = rez.tip;
    const prethodno = fromIsoDate(rez.datum_ispitivanja)?.toLocaleDateString('sr-Latn-RS') ?? '';
    const naredno = computeNarednoIspitivanje(rez.datum_ispitivanja, intervalMeseci);

    if (tip.includes('Mikroklima letnja')) {
      result.mikroklimaLetnja = { prethodnoIspitivanje: prethodno, narednoIspitivanje: naredno };
    } else if (tip.includes('Mikroklima zimska')) {
      result.mikroklimaZimska = { prethodnoIspitivanje: prethodno, narednoIspitivanje: naredno };
    } else if (tip.includes('Fizičk')) {
      result.fizickeStetnosti = { prethodnoIspitivanje: prethodno, narednoIspitivanje: naredno };
    } else if (tip.includes('Hemijsk')) {
      result.hemijskeStetnosti = { prethodnoIspitivanje: prethodno, narednoIspitivanje: naredno };
    } else if (tip.includes('Osvetljenj')) {
      result.osvetljenje = { prethodnoIspitivanje: prethodno, narednoIspitivanje: naredno };
    }
  });

  return result;
};

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
  const context = usePageContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadIspitivanja = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get<{ data: any[] }>(`ispitivanja-radne-sredine?context=${context}`);
      setData(response.data.map(mapIspitivanjeFromApi));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Greška pri učitavanju ispitivanja radne sredine.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIspitivanja();
  }, [context]);

  const handleSave = async (newData: any) => {
    // The form sends tipoviIspitivanja as an array of selected types with:
    //   { key, naziv, selected, ispravno (boolean), datumIspitivanja (Date) }
    // Map to the backend expected format with tip (string) and status ('ispravno'/'neispravno')
    const rezultati = (newData.tipoviIspitivanja || []).map((tip: any) => ({
      tip: tip.naziv,
      status: tip.ispravno ? 'ispravno' : 'neispravno',
      datum_ispitivanja: toIsoDate(tip.datumIspitivanja),
    }));

    const payload = {
      firma_pib: newData.firmaPib,
      lokacija_id: Number(newData.lokacijaId),
      broj_mernih_mesta: Number(newData.brojMernihMesta),
      interval_ispitivanja_meseci: Number(newData.intervalIspitivanja),
      rezultati,
    };

    if (editingItem) {
      await api.put(`ispitivanja-radne-sredine/${editingItem.id}`, payload);
      setEditingItem(null);
    } else {
      await api.post('ispitivanja-radne-sredine', payload);
    }
    await loadIspitivanja();
    setIsFormOpen(false);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await api.del(`ispitivanja-radne-sredine/${itemToDelete.id}`);
        await loadIspitivanja();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Greška pri brisanju ispitivanja radne sredine.');
      }
      setItemToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const handleIzvrsiIspitivanje = async (item: any, columnKey: string, formData: { ispravno: boolean; datumIspitivanja: Date }) => {
    const tipNaziv = tipKeyToNaziv[columnKey];
    if (!tipNaziv) return;

    const rawRezultati: any[] = item._rawRezultati || [];
    const updatedRezultati = rawRezultati
      .filter((r: any) => r.tip !== tipNaziv)
      .map((r: any) => ({
        tip: r.tip,
        status: r.status,
        datum_ispitivanja: r.datum_ispitivanja,
      }));

    updatedRezultati.push({
      tip: tipNaziv,
      status: formData.ispravno ? 'ispravno' : 'neispravno',
      datum_ispitivanja: toIsoDate(formData.datumIspitivanja),
    });

    await api.put(`ispitivanja-radne-sredine/${item.id}`, {
      firma_pib: item.firmaPib,
      lokacija_id: Number(item.lokacijaId),
      broj_mernih_mesta: Number(item.brojMernihMesta),
      interval_ispitivanja_meseci: Number(item.intervalIspitivanjaMeseci),
      rezultati: updatedRezultati,
    });
    await loadIspitivanja();
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
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
          {isLoading ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Učitavanje...</div>
          ) : errorMessage ? (
            <div className="p-4 text-sm text-error-500">{errorMessage}</div>
          ) : (
            <IspitivanjeRadneSredineDataTable
              data={data}
              columns={columns}
              onDeleteClick={handleDeleteClick}
              onEditClick={handleEditClick}
              onIzvrsiIspitivanje={handleIzvrsiIspitivanje}
            />
          )}
        </div>

        <IspitivanjeRadneSredineForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSave={handleSave}
          initialData={editingItem}
        />

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Potvrda brisanja"
          message="Da li ste sigurni da želite da obrišete ovaj zapis?"
          confirmText="Obriši"
          cancelText="Otkaži"
          type="danger"
        />
      </div>
    </ErrorBoundary>
  );
};

export default IspitivanjeRadneSredine; 