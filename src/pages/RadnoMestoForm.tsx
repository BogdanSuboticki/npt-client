import React, { useEffect, useRef } from 'react';
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Checkbox from "../components/form/input/Checkbox";

interface LzsOption {
  id: number;
  lzs: string;
  rok: number;
  standard: string;
}

interface RadnoMestoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
  initialData?: any;
  lzsOptions?: LzsOption[];
  firme: Array<{ pib: string; naziv: string }>;
  lokacije: Array<{ id: number; naziv: string; firma_pib: string }>;
}

export default function RadnoMestoForm({ isOpen, onClose, onSave, initialData, lzsOptions = [], firme, lokacije }: RadnoMestoFormProps) {
  const [formData, setFormData] = React.useState({
    firmaPib: "",
    lokacijaId: "",
    nazivRadnogMesta: "",
    povecanRizik: false,
    obavezanOftamoloskiPregled: false,
    obavezanPregledPoDrugomOsnovu: false,
    lekarskiPregledPovecanRizik: "",
    oprema: [] as Array<{lzs: string, rok: number, standard: string}>
  });

  const [isOpremaOpen, setIsOpremaOpen] = React.useState(false);
  const [isFirmaOpen, setIsFirmaOpen] = React.useState(false);
  const [isLokacijaOpen, setIsLokacijaOpen] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const opremaRef = useRef<HTMLDivElement>(null);
  const firmaRef = useRef<HTMLDivElement>(null);
  const lokacijaRef = useRef<HTMLDivElement>(null);

  const filteredLokacije = lokacije.filter(l => l.firma_pib === formData.firmaPib);

  const opremaOptions = lzsOptions;

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (firmaRef.current && !firmaRef.current.contains(target)) {
        setIsFirmaOpen(false);
      }
      if (lokacijaRef.current && !lokacijaRef.current.contains(target)) {
        setIsLokacijaOpen(false);
      }
      if (opremaRef.current && !opremaRef.current.contains(target)) {
        setIsOpremaOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Populate form with initialData when provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        firmaPib: initialData.firmaPib || "",
        lokacijaId: initialData.lokacijaId ? String(initialData.lokacijaId) : "",
        nazivRadnogMesta: initialData.nazivRadnogMesta || "",
        povecanRizik: initialData.povecanRizik === "Da",
        obavezanOftamoloskiPregled: initialData.obavezanOftamoloskiPregled === "Da",
        obavezanPregledPoDrugomOsnovu: initialData.obavezanPregledPoDrugomOsnovu === "Da",
        lekarskiPregledPovecanRizik: initialData.lekarskiPregledPovecanRizik || "",
        oprema: initialData.oprema || []
      });
    } else {
      setFormData({
        firmaPib: "",
        lokacijaId: "",
        nazivRadnogMesta: "",
        povecanRizik: false,
        obavezanOftamoloskiPregled: false,
        obavezanPregledPoDrugomOsnovu: false,
        lekarskiPregledPovecanRizik: "",
        oprema: []
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (isOpen) setFormError("");
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firmaPib || !formData.lokacijaId || !formData.nazivRadnogMesta) {
      setFormError('Molimo popunite sva obavezna polja');
      return;
    }
    try {
      await onSave(formData);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Greška pri čuvanju.");
    }
  };

  const handleOpremaSelectAll = () => {
    if (formData.oprema.length === opremaOptions.length) {
      // If all are selected, deselect all
      setFormData({...formData, oprema: []});
    } else {
      // If not all are selected, select all
      setFormData({...formData, oprema: [...opremaOptions]});
    }
  };

  const handleOpremaOptionChange = (option: {lzs: string, rok: number, standard: string}) => {
    const newSelection = formData.oprema.some(item => item.lzs === option.lzs)
      ? formData.oprema.filter(item => item.lzs !== option.lzs)
      : [...formData.oprema, option];
    
    setFormData({...formData, oprema: newSelection});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
    >
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
          {initialData ? "Izmeni Radno Mesto" : "Novo Radno Mesto"}
        </h4>

        {formError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-sm text-red-600 dark:text-red-400">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label>Firma *</Label>
            <div className="relative w-full" ref={firmaRef}>
              <button
                type="button"
                onClick={() => setIsFirmaOpen(!isFirmaOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <span>
                  {formData.firmaPib
                    ? firme.find(f => f.pib === formData.firmaPib)?.naziv || formData.firmaPib
                    : "Izaberi firmu"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isFirmaOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isFirmaOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {firme.map((firma, index) => (
                      <div
                        key={firma.pib}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.firmaPib === firma.pib ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${index === firme.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          setFormData({...formData, firmaPib: firma.pib, lokacijaId: ""});
                          setIsFirmaOpen(false);
                        }}
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{firma.naziv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <Label>Lokacija *</Label>
            <div className="relative w-full" ref={lokacijaRef}>
              <button
                type="button"
                onClick={() => setIsLokacijaOpen(!isLokacijaOpen)}
                disabled={!formData.firmaPib}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {formData.lokacijaId
                    ? lokacije.find(l => String(l.id) === formData.lokacijaId)?.naziv || formData.lokacijaId
                    : "Izaberi lokaciju"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isLokacijaOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLokacijaOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {filteredLokacije.map((lok, index) => (
                      <div
                        key={lok.id}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.lokacijaId === String(lok.id) ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${index === filteredLokacije.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          setFormData({...formData, lokacijaId: String(lok.id)});
                          setIsLokacijaOpen(false);
                        }}
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{lok.naziv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <Label>Naziv radnog mesta *</Label>
            <Input 
              type="text" 
              value={formData.nazivRadnogMesta}
              onChange={(e) => setFormData({...formData, nazivRadnogMesta: e.target.value})}
              className="bg-[#F9FAFB] dark:bg-[#101828]"
            />
          </div>

          <div className="col-span-1">
            <Label>Oprema (LZS)</Label>
            <div className="relative w-full" ref={opremaRef}>
              <button
                type="button"
                onClick={() => setIsOpremaOpen(!isOpremaOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <span>
                  {formData.oprema.length === 0 
                    ? "Izaberi opremu" 
                    : formData.oprema.length === 1 
                      ? formData.oprema[0].lzs
                      : `${formData.oprema.length} stavki izabrano`
                  }
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isOpremaOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpremaOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
                      <div
                        className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none"
                        onClick={handleOpremaSelectAll}
                      >
                        <Checkbox
                          checked={formData.oprema.length === opremaOptions.length}
                          onChange={handleOpremaSelectAll}
                          className="w-4 h-4 min-w-[16px] min-h-[16px] flex-shrink-0"
                          id="select-all-oprema"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Izaberi sve</span>
                      </div>
                    </div>
                    <div className="pt-1">
                      {opremaOptions.map((option, index) => (
                        <div
                          key={option.lzs}
                          className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                            index === opremaOptions.length - 1 ? 'rounded-bl-lg' : ''
                          }`}
                          onClick={() => handleOpremaOptionChange(option)}
                        >
                          <Checkbox
                            checked={formData.oprema.some(item => item.lzs === option.lzs)}
                            onChange={() => handleOpremaOptionChange(option)}
                            className="w-4 h-4 min-w-[16px] min-h-[16px] flex-shrink-0"
                            id={`oprema-${option.lzs}`}
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">{option.lzs}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                checked={formData.povecanRizik}
                onChange={(checked) => setFormData({...formData, povecanRizik: checked})}
                className="w-4 h-4"
                id="povecanRizik"
              />
              <Label className="mb-0 cursor-pointer" htmlFor="povecanRizik">
                Povećan rizik
              </Label>
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                checked={formData.obavezanOftamoloskiPregled}
                onChange={(checked) => setFormData({...formData, obavezanOftamoloskiPregled: checked})}
                className="w-4 h-4"
                id="obavezanOftamoloskiPregled"
              />
              <Label className="mb-0 cursor-pointer" htmlFor="obavezanOftamoloskiPregled">
                Obavezan oftamološki pregled
              </Label>
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                checked={formData.obavezanPregledPoDrugomOsnovu}
                onChange={(checked) => setFormData({...formData, obavezanPregledPoDrugomOsnovu: checked})}
                className="w-4 h-4"
                id="obavezanPregledPoDrugomOsnovu"
              />
              <Label className="mb-0 cursor-pointer" htmlFor="obavezanPregledPoDrugomOsnovu">
                Obavezan pregled po drugom osnovu
              </Label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Otkaži
          </Button>
          <Button type="submit">
            Sačuvaj
          </Button>
        </div>
      </form>
    </Modal>
  );
} 