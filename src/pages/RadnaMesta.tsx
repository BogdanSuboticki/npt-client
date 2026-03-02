import React, { useState, useRef, useEffect } from 'react';
import DataTableTwo from '../components/tables/DataTables/TableTwo/DataTableTwo';
import RadnoMestoForm from './RadnoMestoForm';
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import ExportPopoverButton from "../components/ui/table/ExportPopoverButton";
import ConfirmModal from "../components/ui/modal/ConfirmModal";
import { api } from "../api/client";
import { usePageContext } from "../hooks/usePageContext";

const mapRadnoMestoFromApi = (item: any, index: number) => ({
  id: item.id,
  nazivRadnogMesta: item.naziv,
  nazivLokacije: item.lokacija?.naziv ?? "",
  povecanRizik: item.povecan_rizik ? "Da" : "Ne",
  obavezanOftamoloskiPregled: item.oftamoloski_pregled,
  obavezanPregledPoDrugomOsnovu: item.drugi_pregled,
  oprema: item.lzs?.map((l: any) => ({
    lzs: l.naziv,
    rok: l.pivot?.rok_meseci ?? "",
    standard: l.standard ?? "",
    id: l.id,
  })) || [],
  lokacijaId: item.lokacija_id,
  firmaPib: item.firma_pib,
});

const radnaMestaData: any[] = [];

const lzsData: Record<string, any[]> = {};

const columns = [
  { key: "id", label: "", sortable: true },
  { key: "nazivRadnogMesta", label: "Naziv radnog mesta", sortable: true },
  { key: "povecanRizik", label: "Povećan rizik", sortable: true },
  { key: "obavezanOftamoloskiPregled", label: "Obavezan oftamološki pregled", sortable: true },
  { key: "obavezanPregledPoDrugomOsnovu", label: "Obavezan pregled po drugom osnovu", sortable: true },
  { key: "opremaNaziv", label: "Oprema (LZS)", sortable: true },
  { key: "opremaRok", label: "Rok (meseci)", sortable: true },
  { key: "opremaStandard", label: "Standard", sortable: true },
];

// Columns for the second table (LZS table)
const lzsColumns = [
  { key: "id", label: "", sortable: true },
  { key: "lzs", label: "Naziv LZS", sortable: true },
  { key: "rok", label: "Rok (meseci)", sortable: true },
  { key: "standard", label: "Standard", sortable: true },
];

const RadnaMesta: React.FC = () => {
  const context = usePageContext();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<any[]>(radnaMestaData);
  const [selectedRadnoMesto, setSelectedRadnoMesto] = useState<any>(null);
  const [showLZSModal, setShowLZSModal] = useState(false);
  const [lzsDataState, setLzsDataState] = useState(lzsData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allLzs, setAllLzs] = useState<any[]>([]);
  const [firme, setFirme] = useState<any[]>([]);
  const [lokacije, setLokacije] = useState<any[]>([]);

  const loadRadnaMesta = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get<{ data: any[] }>(`radna-mesta?context=${context}`);
      setData(response.data.map(mapRadnoMestoFromApi));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri učitavanju radnih mesta.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadLzs = async () => {
    try {
      const response = await api.get<{ data: any[] }>(`lzs?context=${context}`);
      setAllLzs(response.data);
    } catch {
      // LZS loading failure is non-critical
    }
  };

  const loadFirmeAndLokacije = async () => {
    try {
      const [firmeRes, lokacijeRes] = await Promise.all([
        api.get<{ data: any[] }>(`firme?context=${context}`),
        api.get<{ data: any[] }>(`lokacije?context=${context}`),
      ]);
      setFirme(firmeRes.data.map((f: any) => ({ pib: f.pib, naziv: f.naziv })));
      setLokacije(lokacijeRes.data.map((l: any) => ({ id: l.id, naziv: l.naziv, firma_pib: l.firma_pib })));
    } catch {
      // Non-critical
    }
  };

  useEffect(() => {
    loadRadnaMesta();
    loadLzs();
    loadFirmeAndLokacije();
  }, [context]);
  
  // Form state for new LZS entry
  const [newLZS, setNewLZS] = useState({
    lzs: "",
    rok: "",
    standard: ""
  });
  
  // Add state for dropdowns
  const [isLzsOpen, setIsLzsOpen] = useState(false);
  const lzsRef = useRef<HTMLDivElement>(null);

  const lzsOptions = (selectedRadnoMesto?.oprema || []) as Array<{ lzs: string; rok?: number; standard?: string; id?: number }>;

  const inferDefaults = (name: string): { rok: string; standard: string } => {
    const match = allLzs.find((l: any) => l.naziv === name);
    if (match) {
      return { rok: String(match.pivot?.rok_meseci ?? 12), standard: match.standard ?? '' };
    }
    const opremaMatch = lzsOptions.find(o => o.lzs === name);
    if (opremaMatch) {
      return { rok: String(opremaMatch.rok ?? 12), standard: opremaMatch.standard ?? '' };
    }
    return { rok: '12', standard: '' };
  };

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdowns
      if (lzsRef.current && !lzsRef.current.contains(target)) {
        setIsLzsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = async (newData: any) => {
    const payload: any = {
      naziv: newData.nazivRadnogMesta,
      lokacija_id: Number(newData.lokacijaId),
      firma_pib: newData.firmaPib,
      povecan_rizik: newData.povecanRizik || false,
      oftamoloski_pregled: newData.obavezanOftamoloskiPregled ? "DA" : "NE",
      drugi_pregled: newData.obavezanPregledPoDrugomOsnovu ? "DA" : "NE",
    };

    if (newData.oprema && newData.oprema.length > 0) {
      payload.lzs = newData.oprema.map((op: any) => ({
        id: Number(op.id || op.lzsId),
        rok_meseci: op.rok ? Number(op.rok) : null,
      }));
    }

    if (editingItem) {
      await api.put(`radna-mesta/${editingItem.id}`, payload);
      setEditingItem(null);
    } else {
      await api.post("radna-mesta", payload);
    }
    await loadRadnaMesta();
    setShowForm(false);
  };


  const closeLZSModal = () => {
    setShowLZSModal(false);
    setSelectedRadnoMesto(null);
    // Reset form state
    setNewLZS({ lzs: "", rok: "", standard: "" });
  };

  const handleAddLZS = () => {
    if (newLZS.lzs && newLZS.rok && newLZS.standard && selectedRadnoMesto) {
      const currentLZSData = lzsDataState[selectedRadnoMesto.id as keyof typeof lzsDataState] || [];

      const newId = Math.max(...currentLZSData.map((item: any) => item.id), 0) + 1;
      const newLZSEntry = {
        id: newId,
        lzs: newLZS.lzs,
        rok: parseInt(newLZS.rok),
        standard: newLZS.standard
      };

      setLzsDataState({
        ...lzsDataState,
        [selectedRadnoMesto.id]: [...currentLZSData, newLZSEntry]
      });

      // Reset form
      setNewLZS({ lzs: "", rok: "", standard: "" });
    }
  };

  

  const handleDeleteLZS = (lzsItem: any) => {
    if (selectedRadnoMesto) {
      const currentLZSData = lzsDataState[selectedRadnoMesto.id as keyof typeof lzsDataState] || [];
      const updatedLZSData = currentLZSData.filter((item: any) => item.id !== lzsItem.id);
      
      setLzsDataState({
        ...lzsDataState,
        [selectedRadnoMesto.id]: updatedLZSData
      });
    }
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await api.del(`radna-mesta/${itemToDelete.id}`);
        await loadRadnaMesta();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Greška pri brisanju radnog mesta.");
      }
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

  const handleUpdateData = (updatedData: any[]) => {
    setData(updatedData);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Radna mesta
          </h1>
          <div className="hidden sm:flex items-center gap-4">
            <ExportPopoverButton
              data={data}
              columns={columns}
              title="Radna mesta"
              filename="radna-mesta"
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
                title="Radna mesta"
                filename="radna-mesta"
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
        {isLoading ? (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Učitavanje...</div>
        ) : errorMessage ? (
          <div className="p-4 text-sm text-error-500">{errorMessage}</div>
        ) : (
          <DataTableTwo 
            data={data}
            columns={columns}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onUpdateData={handleUpdateData}
          />
        )}
      </div>

      <RadnoMestoForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSave={handleSave}
        initialData={editingItem}
        lzsOptions={allLzs.map((l: any) => ({
          id: l.id,
          lzs: l.naziv,
          rok: 12,
          standard: l.standard ?? '',
        }))}
        firme={firme}
        lokacije={lokacije}
      />

             {/* LZS Modal */}
               <Modal
          isOpen={showLZSModal}
          onClose={closeLZSModal}
          className="max-w-4xl w-full mx-4 p-4 lg:p-6"
        >
          <div className="flex flex-col">
           <div className="mb-6">
             <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
               Lična zaštititna sredstva za {selectedRadnoMesto?.nazivRadnogMesta}
             </h2>
           </div>
           
           <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)] mb-6">
              <DataTableTwo 
                data={(lzsDataState as any)[selectedRadnoMesto?.id] || []}
                columns={lzsColumns}
                showFilters={false}
                showPagination={false}
                showOpremaButton={false}
                showEditButton={false}
                showResultsText={false}
                showItemsPerPage={false}
                onDeleteClick={handleDeleteLZS}
              />
            </div>

            {/* Add new LZS form */}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)]">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Dodaj LZS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label>Oprema (LZS)</Label>
                  <div className="relative w-full" ref={lzsRef}>
                    <button
                      type="button"
                      onClick={() => setIsLzsOpen(!isLzsOpen)}
                      className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                      <span>{newLZS.lzs || "Izaberi opremu"}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isLzsOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isLzsOpen && (
                      <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                        <div className="pr-1">
                          {lzsOptions.map((option: string, index: number) => (
                            <div
                              key={option}
                              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                                newLZS.lzs === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                              } ${index === lzsOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                              onClick={() => {
                                const defaults = inferDefaults(option);
                                setNewLZS({ lzs: option, rok: defaults.rok, standard: defaults.standard });
                                setIsLzsOpen(false);
                              }}
                            >
                              <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interval pregleda (meseci)
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={newLZS.rok || ""}
                      placeholder="Automatski"
                      readOnly
                      className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <Label>Standard</Label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={newLZS.standard || ""}
                      placeholder="Automatski"
                      readOnly
                      className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              onClick={handleAddLZS}
              disabled={!newLZS.lzs || !newLZS.rok || !newLZS.standard}
            >
              <svg
                className="w-4 h-4 mr-1"
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
              Dodaj
            </Button>
          </div>
        </div>
      </Modal>

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
  );
};

export default RadnaMesta; 