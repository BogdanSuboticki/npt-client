import React, { useEffect, useRef } from 'react';
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Checkbox from "../components/form/input/Checkbox";

interface RadnoMestoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function RadnoMestoForm({ isOpen, onClose, onSave, initialData }: RadnoMestoFormProps) {
  const [formData, setFormData] = React.useState({
    nazivRadnogMesta: "",
    povecanRizik: false,
    obavezanOftamoloskiPregled: false,
    obavezanPregledPoDrugomOsnovu: false,
    lekarskiPregledPovecanRizik: "",
    oprema: [] as Array<{lzs: string, rok: number, standard: string}>
  });

  // Add state for dropdowns
  const [isOpremaOpen, setIsOpremaOpen] = React.useState(false);
  const opremaRef = useRef<HTMLDivElement>(null);

  // Lekarski pregled options

  // Equipment options
  const opremaOptions = [
    { lzs: "Viljuškara", rok: 12, standard: "ISO-2023-001" },
    { lzs: "Zaštitna kaciga", rok: 6, standard: "ISO-2023-002" },
    { lzs: "Zaštitne rukavice", rok: 6, standard: "ISO-2023-003" },
    { lzs: "Sigurnosna obuća", rok: 12, standard: "ISO-2023-004" },
    { lzs: "Zaštitni pojas", rok: 6, standard: "ISO-2023-005" },
    { lzs: "Zaštitne naočare", rok: 6, standard: "ISO-2023-006" },
    { lzs: "Zaštitna odela", rok: 6, standard: "ISO-2023-007" },
    { lzs: "Multimetar", rok: 24, standard: "ISO-2023-008" },
    { lzs: "Alat za održavanje", rok: 24, standard: "ISO-2023-009" },
    { lzs: "Laboratorijski pribor", rok: 12, standard: "ISO-2023-010" },
    { lzs: "Mikroskop", rok: 60, standard: "ISO-2023-011" },
    { lzs: "Računar", rok: 36, standard: "ISO-2023-012" },
    { lzs: "Mobilni telefon", rok: 24, standard: "ISO-2023-013" },
    { lzs: "Stolica", rok: 60, standard: "ISO-2023-014" },
    { lzs: "Zavarivačka maska", rok: 12, standard: "ISO-2023-015" },
    { lzs: "Zavarivački aparat", rok: 48, standard: "ISO-2023-016" },
    { lzs: "Alat za električne radove", rok: 36, standard: "ISO-2023-017" },
    { lzs: "Alat za bravarske radove", rok: 24, standard: "ISO-2023-018" },
    { lzs: "Proizvodna mašina", rok: 48, standard: "ISO-2023-019" }
  ];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdowns

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
        nazivRadnogMesta: initialData.nazivRadnogMesta || "",
        povecanRizik: initialData.povecanRizik === "Da",
        obavezanOftamoloskiPregled: initialData.obavezanOftamoloskiPregled === "Da",
        obavezanPregledPoDrugomOsnovu: initialData.obavezanPregledPoDrugomOsnovu === "Da",
        lekarskiPregledPovecanRizik: initialData.lekarskiPregledPovecanRizik || "",
        oprema: initialData.oprema || []
      });
    } else {
      // Reset form when no initial data
      setFormData({
        nazivRadnogMesta: "",
        povecanRizik: false,
        obavezanOftamoloskiPregled: false,
        obavezanPregledPoDrugomOsnovu: false,
        lekarskiPregledPovecanRizik: "",
        oprema: []
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nazivRadnogMesta) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    onSave(formData);
    onClose();
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

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
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