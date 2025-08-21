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
}

export default function RadnoMestoForm({ isOpen, onClose, onSave }: RadnoMestoFormProps) {
  const [formData, setFormData] = React.useState({
    nazivRadnogMesta: "",
    povecanRizik: false,
    obavezanOftamoloskiPregled: false,
    obavezanPregledPoDrugomOsnovu: false,
    lekarskiPregledPovecanRizik: ""
  });

  // Add state for dropdowns
  const [isLekarskiPregledOpen, setIsLekarskiPregledOpen] = React.useState(false);
  const lekarskiPregledRef = useRef<HTMLDivElement>(null);

  // Lekarski pregled options
  const lekarskiPregledOptions = ["Da", "Ne"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdowns
      if (lekarskiPregledRef.current && !lekarskiPregledRef.current.contains(target)) {
        setIsLekarskiPregledOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nazivRadnogMesta) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
    >
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
          Novo Radno Mesto
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
            <Label>Lekarski pregled za radna mesta sa povećanim rizikom</Label>
            <div className="relative w-full" ref={lekarskiPregledRef}>
              <button
                type="button"
                onClick={() => setIsLekarskiPregledOpen(!isLekarskiPregledOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <span>{formData.lekarskiPregledPovecanRizik || "Izaberi opciju"}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isLekarskiPregledOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLekarskiPregledOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {lekarskiPregledOptions.map((option: string, index: number) => (
                      <div
                        key={option}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.lekarskiPregledPovecanRizik === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${index === lekarskiPregledOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            lekarskiPregledPovecanRizik: option,
                          });
                          setIsLekarskiPregledOpen(false);
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