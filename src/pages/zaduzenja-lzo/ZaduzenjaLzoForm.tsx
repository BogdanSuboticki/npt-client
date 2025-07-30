"use client";

import React, { useEffect, useRef } from "react";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import DatePicker from "../../components/form/input/DatePicker";

interface ZaduzenjaLzoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function ZaduzenjaLzoForm({ isOpen, onClose, onSave }: ZaduzenjaLzoFormProps) {
  const [formData, setFormData] = React.useState({
    zaposleni: "",
    radnoMesto: "",
    oprema: [] as Array<{
      id: number;
      vrstaLzs: string;
      standard: string;
      dodatniOpis: string;
      datumZaduzenja: Date | null;
      rok: string;
      narednoZaduzenje: Date | null;
    }>,
  });

  // Add state for dropdowns
  const [isZaposleniOpen, setIsZaposleniOpen] = React.useState(false);
  const [isRadnoMestoOpen, setIsRadnoMestoOpen] = React.useState(false);
  const zaposleniRef = useRef<HTMLDivElement>(null);
  const radnoMestoRef = useRef<HTMLDivElement>(null);

  // Example options - replace with actual data
  const zaposleniOptions = ["Petar Petrović", "Ana Anić", "Marko Marković"];
  const radnoMestoOptions = ["Viljuškari", "Kranista", "Mehaničar", "Električar", "Vozac"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdowns
      if (zaposleniRef.current && !zaposleniRef.current.contains(target)) {
        setIsZaposleniOpen(false);
      }
      if (radnoMestoRef.current && !radnoMestoRef.current.contains(target)) {
        setIsRadnoMestoOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zaposleni || !formData.radnoMesto) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleAddOprema = () => {
    const newId = Math.max(...formData.oprema.map(item => item.id), 0) + 1;
    const newOprema = {
      id: newId,
      vrstaLzs: "",
      standard: "",
      dodatniOpis: "",
      datumZaduzenja: null,
      rok: "12",
      narednoZaduzenje: null
    };
    setFormData({
      ...formData,
      oprema: [...formData.oprema, newOprema]
    });
  };

  const handleRemoveOprema = (idToRemove: number) => {
    setFormData({
      ...formData,
      oprema: formData.oprema.filter(item => item.id !== idToRemove)
    });
  };

  const handleOpremaChange = (id: number, field: string, value: string | Date | null) => {
    setFormData({
      ...formData,
      oprema: formData.oprema.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[1200px] w-full mx-4 p-4 lg:p-10 dark:bg-gray-800"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Novo Zaduženje LZO</h2>
      <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            <Label>Zaposleni *</Label>
            <div className="relative w-full" ref={zaposleniRef}>
              <button
                type="button"
                onClick={() => setIsZaposleniOpen(!isZaposleniOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <span>{formData.zaposleni || "Izaberi zaposlenog"}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isZaposleniOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isZaposleniOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {zaposleniOptions.map((option: string, index: number) => (
                      <div
                        key={option}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.zaposleni === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${index === zaposleniOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, zaposleni: option });
                          setIsZaposleniOpen(false);
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
            <Label>Radno mesto *</Label>
            <div className="relative w-full" ref={radnoMestoRef}>
              <button
                type="button"
                onClick={() => setIsRadnoMestoOpen(!isRadnoMestoOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <span>{formData.radnoMesto || "Izaberi radno mesto"}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isRadnoMestoOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isRadnoMestoOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {radnoMestoOptions.map((option: string, index: number) => (
                      <div
                        key={option}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.radnoMesto === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${index === radnoMestoOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, radnoMesto: option });
                          setIsRadnoMestoOpen(false);
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
            <div className="flex items-center justify-between mb-4">
              <Label>Oprema</Label>
              <Button
                size="sm"
                onClick={handleAddOprema}
                className="text-xs"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Dodaj opremu
              </Button>
            </div>
            
            {formData.oprema.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700 overflow-x-auto">
                {/* Header */}
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                  <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[800px]">
                    <div>Vrsta LZS *</div>
                    <div>Standard</div>
                    <div>Dodatni opis</div>
                    <div>Datum zaduženja *</div>
                    <div>Rok (m) *</div>
                    <div>Naredno zaduženje</div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.oprema.map((item) => (
                    <div key={item.id} className="px-4 py-3">
                      <div className="grid grid-cols-6 gap-4 min-w-[800px]">
                        {/* Vrsta LZS */}
                        <div>
                          <input
                            type="text"
                            value={item.vrstaLzs}
                            onChange={(e) => handleOpremaChange(item.id, 'vrstaLzs', e.target.value)}
                            placeholder="Unesite vrstu LZS"
                            className="w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                        </div>
                       
                        {/* Standard */}
                        <div>
                          <input
                            type="text"
                            value={item.standard}
                            onChange={(e) => handleOpremaChange(item.id, 'standard', e.target.value)}
                            placeholder="Unesite standard"
                            className="w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                        </div>
                       
                        {/* Dodatni opis */}
                        <div>
                          <textarea
                            value={item.dodatniOpis}
                            onChange={(e) => handleOpremaChange(item.id, 'dodatniOpis', e.target.value)}
                            placeholder="Unesite opis"
                            rows={1}
                            className="w-full min-h-[44px] px-4 py-2 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none overflow-hidden"
                            style={{
                              height: 'auto',
                              minHeight: '44px'
                            }}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = Math.max(44, target.scrollHeight) + 'px';
                            }}
                          />
                        </div>
                       
                        {/* Datum zaduženja */}
                        <div>
                          <DatePicker
                            value={item.datumZaduzenja}
                            onChange={(date) => handleOpremaChange(item.id, 'datumZaduzenja', date)}
                            placeholder="Izaberi datum"
                            className="h-11 text-sm"
                          />
                        </div>
                       
                        {/* Rok */}
                        <div>
                          <input
                            type="number"
                            value={item.rok}
                            onChange={(e) => handleOpremaChange(item.id, 'rok', e.target.value)}
                            min="1"
                            className="w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                        </div>
                       
                        {/* Naredno zaduženje */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <DatePicker
                              value={item.narednoZaduzenje}
                              onChange={(date) => handleOpremaChange(item.id, 'narednoZaduzenje', date)}
                              placeholder="Izaberi datum"
                              className="h-11 text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOprema(item.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Otkaži
          </Button>
          <Button
            type="submit"
          >
            Sačuvaj
          </Button>
        </div>
      </form>
    </Modal>
  );
} 