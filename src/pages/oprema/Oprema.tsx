import React, { useState } from 'react';
import OpremaDataTable from './OpremaDataTable';
import OpremaForm from './OpremaForm';
import Button from '../../components/ui/button/Button';
import ExportPopoverButton from '../../components/ui/table/ExportPopoverButton';
import ConfirmModal from '../../components/ui/modal/ConfirmModal';

// Sample data for the table
const opremaData = [
  {
    id: 1,
    redniBroj: 1,
    nazivOpreme: "Viljuškar",
    vrstaOpreme: "Oprema za rad",
    fabrickBroj: "FB123456",
    inventarniBroj: "INV789",
    lokacija: "Skladište A",
    godinaProizvodnje: 2020,
    intervalPregleda: 36,
    napomena: "Redovno održavanje"
  },
  {
    id: 2,
    redniBroj: 2,
    nazivOpreme: "Kran",
    vrstaOpreme: "Oprema za rad",
    fabrickBroj: "FB789012",
    inventarniBroj: "INV456",
    lokacija: "Proizvodna hala 1",
    godinaProizvodnje: 2019,
    intervalPregleda: 36,
    napomena: "Potrebno zamena delova"
  },
  {
    id: 3,
    redniBroj: 3,
    nazivOpreme: "Transformator",
    vrstaOpreme: "Elektro i gromobranska instalacija",
    fabrickBroj: "FB345678",
    inventarniBroj: "INV123",
    lokacija: "Lokacija 1",
    godinaProizvodnje: 2021,
    intervalPregleda: 36,
    napomena: "Godišnji pregled"
  }
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "nazivOpreme", label: "Naziv opreme", sortable: true },
  { key: "vrstaOpreme", label: "Vrsta opreme", sortable: true },
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
  const [data, setData] = useState(opremaData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSave = (newData: any) => {
    console.log(`Saving ${editingItem ? 'updated' : 'new'} entry:`, newData);
    
    if (editingItem) {
      // Update existing item
      const updatedItem = {
        ...editingItem,
        nazivOpreme: newData.nazivOpreme,
        vrstaOpreme: newData.vrstaOpreme,
        fabrickBroj: newData.fabrickBroj,
        inventarniBroj: newData.inventarniBroj,
        lokacija: newData.lokacija,
        godinaProizvodnje: newData.godinaProizvodnje,
        napomena: newData.napomena
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
        nazivOpreme: newData.nazivOpreme,
        vrstaOpreme: newData.vrstaOpreme,
        fabrickBroj: newData.fabrickBroj,
        inventarniBroj: newData.inventarniBroj,
        lokacija: newData.lokacija,
        godinaProizvodnje: newData.godinaProizvodnje,
        intervalPregleda: 36,
        napomena: newData.napomena
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

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Oprema
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
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
                  data={data}
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
            data={data}
            columns={columns}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        </div>

        <OpremaForm 
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

export default Oprema; 