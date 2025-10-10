import React, { useState } from 'react';
import OsposobljavanjeDataTable from './OsposobljavanjeDataTable';
import OsposobljavanjeForm from './OsposobljavanjeForm';
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";

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
  { key: "povecanRizik", label: "Povećan rizik", sortable: true },
  { key: "osposobljavanjeBZR", label: "Poslednji BZR", sortable: true },
  { key: "datumNarednogBZR", label: "Naredni BZR", sortable: true },
  { key: "osposobljavanjeZOP", label: "Poslednji ZOP", sortable: true },
  { key: "datumNarednogZOP", label: "Naredni ZOP", sortable: true }
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
  const [data, setData] = useState(osposobljavanjeData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSave = (newData: any) => {
    console.log(`Saving ${editingItem ? 'updated' : 'new'} entry:`, newData);
    
    if (editingItem) {
      // Update existing item - only update the date fields
      const updatedItem = {
        ...editingItem,
        osposobljavanjeBZR: newData.osposobljavanjeBZR?.toISOString().split('T')[0] || editingItem.osposobljavanjeBZR,
        datumNarednogBZR: newData.datumNarednogBZR?.toISOString().split('T')[0] || editingItem.datumNarednogBZR,
        osposobljavanjeZOP: newData.osposobljavanjeZOP?.toISOString().split('T')[0] || editingItem.osposobljavanjeZOP,
        datumNarednogZOP: newData.datumNarednogZOP?.toISOString().split('T')[0] || editingItem.datumNarednogZOP,
      };
      
      setData(data.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
      setEditingItem(null);
    } else {
      // Add new item
      const newItem = {
        id: data.length + 1,
        redniBroj: data.length + 1,
        zaposleni: newData.angazovani,
        radnoMesto: newData.radnoMesto,
        lokacija: newData.lokacija,
        povecanRizik: newData.povecanRizik,
        osposobljavanjeBZR: newData.osposobljavanjeBZR?.toISOString().split('T')[0],
        datumNarednogBZR: newData.datumNarednogBZR?.toISOString().split('T')[0],
        osposobljavanjeZOP: newData.osposobljavanjeZOP?.toISOString().split('T')[0],
        datumNarednogZOP: newData.datumNarednogZOP?.toISOString().split('T')[0],
        prikaziUPodsetniku: newData.prikaziUPodsetniku || false,
        bzrOdradjeno: newData.bzrOdradjeno || false
      };
      setData([...data, newItem]);
    }
    setShowForm(false);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setData(data.filter(d => d.id !== itemToDelete.id));
      setItemToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleCheckboxChange = (id: number, field: 'prikaziUPodsetniku' | 'bzrOdradjeno') => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, [field]: !item[field] }
          : item
      )
    );
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              <span className="block lg:inline">Osposobljavanje/</span>
              <span className="block lg:inline">Provera BZR</span>
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Osposobljavanje/Provera BZR"
                filename="osposobljavanje"
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
                  data={data}
                  columns={columns}
                  title="Osposobljavanje/Provera BZR"
                  filename="osposobljavanje"
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
          <OsposobljavanjeDataTable 
            data={data}
            columns={columns}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onCheckboxChange={handleCheckboxChange}
          />
        </div>

        <OsposobljavanjeForm 
          isOpen={showForm}
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

export default Osposobljavanje;
