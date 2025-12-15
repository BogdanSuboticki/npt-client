"use client";

import React, { useState, useMemo } from "react";
import NotesForm from "./NotesForm";
import Button from "../../components/ui/button/Button";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { EditButtonIcon, DeleteButtonIcon } from "../../icons";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sample data
const initialNotesData: Note[] = [
  {
    id: 1,
    title: "Važna beleška",
    content: "Ovo je primer beleške sa nekim važnim informacijama koje treba zapamtiti. Može sadržati više redova teksta i različite informacije.",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T10:30:00"),
  },
  {
    id: 2,
    title: "Sastanak sa timom",
    content: "Sastanak zakazan za sledeću nedelju. Pripremiti materijale za prezentaciju i proveriti dostupnost svih članova tima.",
    createdAt: new Date("2024-01-20T14:00:00"),
    updatedAt: new Date("2024-01-20T14:00:00"),
  },
  {
    id: 3,
    title: "Ideje za projekat",
    content: "Lista ideja koje treba razmotriti:\n- Nova funkcionalnost\n- Poboljšanje korisničkog iskustva\n- Optimizacija performansi",
    createdAt: new Date("2024-01-22T09:15:00"),
    updatedAt: new Date("2024-01-22T09:15:00"),
  },
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
    console.error('Error in Notes component:', error);
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

const NotesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<Note[]>(initialNotesData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Note | null>(null);
  const [editingItem, setEditingItem] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNote, setHoveredNote] = useState<number | null>(null);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(
      note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  const handleSave = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    if (editingItem) {
      const updatedData = data.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...noteData, updatedAt: new Date() }
          : item
      );
      setData(updatedData);
      setEditingItem(null);
    } else {
      const newNote: Note = {
        id: data.length > 0 ? Math.max(...data.map(n => n.id)) + 1 : 1,
        ...noteData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setData([newNote, ...data]);
    }
    setShowForm(false);
  };

  const handleEditClick = (item: Note, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = (item: Note, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Danas";
    } else if (diffDays === 1) {
      return "Juče";
    } else if (diffDays < 7) {
      return `Pre ${diffDays} dana`;
    } else {
      return date.toLocaleDateString('sr-Latn-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const truncateContent = (content: string, maxLength: number = 150): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <ErrorBoundary>
      <PageMeta
        title="Beleške | NPT"
        description="Stranica za upravljanje beleškama"
      />
      <PageBreadcrumb pageTitle="" />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Beleške
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'beleška' : 'beleški'}
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              size="md"
              className="shadow-lg"
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
              Nova beleška
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <svg
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Pretraži beleške..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1D2939] px-4 py-2.5 pl-12 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="group relative bg-white dark:bg-[#1D2939] rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-brand-300 dark:hover:border-brand-600"
                onMouseEnter={() => setHoveredNote(note.id)}
                onMouseLeave={() => setHoveredNote(null)}
                onClick={() => handleEditClick(note)}
              >
                {/* Action Buttons - Show on Hover */}
                <div
                  className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-200 ${
                    hoveredNote === note.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <button
                    onClick={(e) => handleEditClick(note, e)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-brand-100 dark:hover:bg-brand-900 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    title="Izmeni"
                  >
                    <EditButtonIcon className="size-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(note, e)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-error-100 dark:hover:bg-error-900 text-gray-600 dark:text-gray-400 hover:text-error-600 dark:hover:text-error-400 transition-colors"
                    title="Obriši"
                  >
                    <DeleteButtonIcon className="size-4" />
                  </button>
                </div>

                {/* Note Content */}
                <div className="pr-12">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {note.title || "Bez naslova"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-4 leading-relaxed">
                    {note.content ? truncateContent(note.content) : "Bez sadržaja"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span>{formatDate(note.updatedAt)}</span>
                    {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                      <span className="text-gray-400 dark:text-gray-600">Izmenjeno</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'Nema rezultata pretrage' : 'Nema beleški'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">
              {searchQuery
                ? 'Pokušajte sa drugim pojmom pretrage'
                : 'Kreirajte svoju prvu belešku klikom na dugme "Nova beleška"'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setShowForm(true);
                }}
                size="md"
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
                Kreiraj prvu belešku
              </Button>
            )}
          </div>
        )}

        {/* Modals */}
        <NotesForm 
          isOpen={showForm}
          onClose={handleFormClose}
          onSave={handleSave}
          initialData={editingItem || undefined}
        />

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Potvrda brisanja"
          message="Da li ste sigurni da želite da obrišete ovu belešku?"
          confirmText="Obriši"
          cancelText="Otkaži"
          type="danger"
        />
      </div>
    </ErrorBoundary>
  );
};

export default NotesPage;
