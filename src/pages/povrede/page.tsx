"use client";

import React, { useState } from "react";
    import PovredeDataTable from "./PovredeDataTable";
    import PovredeForm from "./PovredeForm";
    import Button from "../../components/ui/button/Button";
    import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
    import ConfirmModal from "../../components/ui/modal/ConfirmModal";
    import { useCompanySelection } from "../../context/CompanyContext";
    import { createPovredaInspekcijaRok } from "../../data/rokovi";

// Sample data for the table
const povredeData = [
  {
    id: 1,
    redniBroj: 1,
    zaposleni: "Zaposleni 1",
    datumPovrede: new Date("2024-01-15"),
    tezinaPovrede: "Laka",
    brojPovredneListe: "PL-001/2024",
    datumObavestenjaInspekcije: new Date("2024-01-16"),
    datumPredajeFondu: new Date("2024-01-20"),
    datumPreuzimanjaIzFonda: new Date("2024-02-05"),
    datumDostavjanjaUpravi: new Date("2024-02-10"),
    napomena: "Povreda na radu - udarac u glavu",
  },
  {
    id: 2,
    redniBroj: 2,
    zaposleni: "Zaposleni 2",
    datumPovrede: new Date("2024-02-10"),
    tezinaPovrede: "Srednja",
    brojPovredneListe: "PL-002/2024",
    datumObavestenjaInspekcije: new Date("2024-02-11"),
    datumPredajeFondu: new Date("2024-02-15"),
    datumPreuzimanjaIzFonda: new Date("2024-03-01"),
    datumDostavjanjaUpravi: new Date("2024-03-05"),
    napomena: "Povreda na radu - prelom noge",
  },
  {
    id: 3,
    redniBroj: 3,
    zaposleni: "Zaposleni 3",
    datumPovrede: new Date("2024-03-05"),
    tezinaPovrede: "Teška",
    brojPovredneListe: "PL-003/2024",
    datumObavestenjaInspekcije: null as Date | null, // Not yet set - this will create a deadline
    datumPredajeFondu: null as Date | null,
    datumPreuzimanjaIzFonda: null as Date | null,
    datumDostavjanjaUpravi: null as Date | null,
    napomena: "Povreda na radu - opekotine",
  },
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "zaposleni", label: "Zaposleni", sortable: true },
  { key: "datumPovrede", label: "Datum povrede", sortable: true },
  { key: "tezinaPovrede", label: "Težina povrede", sortable: true },
  { key: "brojPovredneListe", label: "Broj povredne liste", sortable: true },
  { key: "datumObavestenjaInspekcije", label: "Datum obaveštenja inspekcije", sortable: true },
  { key: "datumPredajeFondu", label: "Datum predaje u fondu", sortable: true },
  { key: "datumPreuzimanjaIzFonda", label: "Datum preuzimanja iz fonda", sortable: true },
  { key: "datumDostavjanjaUpravi", label: "Datum dostavjanja upravi za BZR", sortable: true },
  { key: "napomena", label: "Napomena", sortable: true },
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
  const { selectedCompany } = useCompanySelection();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(povredeData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const handleSave = (newData: any) => {
    // Here you would typically save the data to your backend
    console.log('Saving new entry:', newData);
    // Add new item to the data array
    const newItem = {
      id: data.length + 1,
      ...newData,
    };
    setData([...data, newItem]);
    
    // Create a 24-hour deadline in Rokovi if datumPovrede is set and company is selected
    if (newData.datumPovrede && selectedCompany && !newData.datumObavestenjaInspekcije) {
      try {
        createPovredaInspekcijaRok(
          newItem.id,
          newData.datumPovrede,
          newData.zaposleni || 'Nepoznato',
          selectedCompany
        );
      } catch (error) {
        console.error('Error creating rok for povreda:', error);
      }
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

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
             Povrede
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Povrede"
                filename="povrede"
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
                  title="Povrede"
                  filename="povrede"
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
           <PovredeDataTable 
             data={data}
             columns={columns}
             onDeleteClick={handleDeleteClick}
             onUpdateData={setData}
           />
        </div>

        <PovredeForm 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
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

export default LekarskiPreglediPage; 