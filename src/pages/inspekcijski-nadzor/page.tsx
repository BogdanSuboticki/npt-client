"use client";

import React, { useState } from "react";
import InspekcijskiNadzorDataTable from "./InspekcijskiNadzorDataTable";
import InspekcijskiNadzorForm from "./InspekcijskiNadzorForm";
import Button from "../../components/ui/button/Button";
import ExportPopoverButton from "../../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";

// Sample data for the table
const inspekcijskiNadzorData = [
  {
    id: 1,
    brojResenja: "123-45/2024",
    datumNadzora: new Date("2024-01-12"),
    datumObavestavanjaInspekcije: new Date("2024-01-10"),
    napomena: "Uočene nepravilnosti u skladištu hemikalija",
    mere: [
      {
        id: 1,
        nazivMere: "Sanacija opasnosti",
        rokIzvrsenja: new Date("2024-02-15"),
        datumRealizacije: new Date("2024-02-10"),
      },
      {
        id: 2,
        nazivMere: "Obuka zaposlenih",
        rokIzvrsenja: new Date("2024-02-20"),
        datumRealizacije: new Date("2024-02-18"),
      },
      {
        id: 3,
        nazivMere: "Zabrana rada",
        rokIzvrsenja: new Date("2024-02-25"),
        datumRealizacije: null,
      }
    ],
  },
  {
    id: 2,
    brojResenja: "678-90/2024",
    datumNadzora: new Date("2024-02-05"),
    datumObavestavanjaInspekcije: new Date("2024-02-03"),
    napomena: "Potrebna obuka zaposlenih za rad na visini",
    mere: [
      {
        id: 2,
        nazivMere: "Obuka zaposlenih",
        rokIzvrsenja: new Date("2024-03-01"),
        datumRealizacije: null,
      }
    ],
  },
  {
    id: 3,
    brojResenja: "555-11/2024",
    datumNadzora: new Date("2024-03-18"),
    datumObavestavanjaInspekcije: new Date("2024-03-16"),
    napomena: "Zabrana upotrebe neispravne opreme",
    mere: [
      {
        id: 3,
        nazivMere: "Zabrana rada",
        rokIzvrsenja: new Date("2024-03-25"),
        datumRealizacije: new Date("2024-03-22"),
      }
    ],
  },
];

const columns = [
  { key: "redniBroj", label: "Redni broj", sortable: true },
  { key: "brojResenja", label: "Broj rešenja", sortable: true },
  { key: "datumNadzora", label: "Datum nadzora", sortable: true },
  { key: "napomena", label: "Napomena", sortable: true },
  { key: "nazivMere", label: "Naziv mere", sortable: true },
  { key: "rokIzvrsenja", label: "Rok izvršenja", sortable: true },
  { key: "datumRealizacije", label: "Datum realizacije mere", sortable: true },
  { key: "datumObavestavanjaInspekcije", label: "Datum obaveštavanja inspekcije", sortable: true },
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
    console.error('Error in InspekcijskiNadzor component:', error);
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

const InspekcijskiNadzorPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(inspekcijskiNadzorData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const handleSave = (newData: any) => {
    console.log('Saving new inspekcijski nadzor entry:', newData);
    // Add new item to the data array
    const newItem = {
      id: data.length + 1,
      ...newData,
    };
    setData([...data, newItem]);
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
              Inspekcijski nadzor
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Inspekcijski nadzor"
                filename="inspekcijski-nadzor"
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
                  title="Inspekcijski nadzor"
                  filename="inspekcijski-nadzor"
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
          <InspekcijskiNadzorDataTable 
            data={data}
            columns={columns}
            onDeleteClick={handleDeleteClick}
          />
        </div>

        <InspekcijskiNadzorForm 
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

export default InspekcijskiNadzorPage;


