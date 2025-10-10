import React, { useState } from 'react';
import LZSDataTable from './LZSDataTable';
import LZSForm from './LZSForm';
import Button from '../../components/ui/button/Button';
import ExportPopoverButton from '../../components/ui/table/ExportPopoverButton';
import ConfirmModal from '../../components/ui/modal/ConfirmModal';

// Sample data for the table
const lzsData = [
  {
    id: 1,
    redniBroj: 1,
    nazivLZS: "Zaštitna kaciga",
    standard: "EN 397",
    napomena: "Redovno održavanje"
  },
  {
    id: 2,
    redniBroj: 2,
    nazivLZS: "Zaštitne rukavice",
    standard: "EN 388",
    napomena: ""
  },
  {
    id: 3,
    redniBroj: 3,
    nazivLZS: "Sigurnosna obuća",
    standard: "EN ISO 20345",
    napomena: "Godišnji pregled"
  }
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "nazivLZS", label: "Naziv LZS", sortable: true },
  { key: "standard", label: "Standard", sortable: true },
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
    console.error('Error in LZS component:', error);
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

const LZS: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(lzsData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSave = (newData: any) => {
    console.log(`Saving ${editingItem ? 'updated' : 'new'} entry:`, newData);
    
    if (editingItem) {
      // Update existing item
      const updatedItem = {
        ...editingItem,
        nazivLZS: newData.nazivLZS,
        standard: newData.standard,
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
        nazivLZS: newData.nazivLZS,
        standard: newData.standard,
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
              LZS
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="LZS"
                filename="lzs"
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
                  title="LZS"
                  filename="lzs"
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
          <LZSDataTable 
            data={data}
            columns={columns}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        </div>

        <LZSForm 
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

export default LZS;

