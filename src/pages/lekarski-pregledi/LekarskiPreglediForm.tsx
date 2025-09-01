"use client";

import React, { useEffect, useRef } from "react";
import CustomDatePicker from "../../components/form/input/DatePicker";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";

interface LekarskiPreglediFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function LekarskiPreglediForm({ isOpen, onClose, onSave }: LekarskiPreglediFormProps) {
  const [formData, setFormData] = React.useState({
    zaposleni: "",
    radnoMesto: "",
    povecanRizik: false,
    vrstaLekarskog: "",
    datumLekarskog: new Date(),
    intervalLekarskog: "",
    datumNarednogLekarskog: new Date(),
  });

  // Add state for dropdowns
  const [isZaposleniOpen, setIsZaposleniOpen] = React.useState(false);
  const [isVrstaLekarskogOpen, setIsVrstaLekarskogOpen] = React.useState(false);
  const [isIntervalOpen, setIsIntervalOpen] = React.useState(false);
  const zaposleniRef = useRef<HTMLDivElement>(null);
  const vrstaLekarskogRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<HTMLDivElement>(null);

  // Employee data with their job positions
  const zaposleniData: Record<string, {
    radnoMesto: string;
    povecanRizik: boolean;
  }> = {
    "Petar Petrović": {
      radnoMesto: "Viljuškari",
      povecanRizik: true,
    },
    "Ana Anić": {
      radnoMesto: "Kranista",
      povecanRizik: true,
    },
    "Marko Marković": {
      radnoMesto: "Mehaničar",
      povecanRizik: false,
    },
    "Jovana Jovanović": {
      radnoMesto: "Električar",
      povecanRizik: true,
    },
    "Stefan Stefanović": {
      radnoMesto: "Viljuškari",
      povecanRizik: true,
    },
    "Marija Marić": {
      radnoMesto: "Kontrolor kvaliteta",
      povecanRizik: false,
    }
  };

  const zaposleniOptions = Object.keys(zaposleniData);
  const vrstaLekarskogOptions = ["Prethodni", "Periodični", "Vanredni"];
  const intervalOptions = ["12", "36", "60"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (isZaposleniOpen && zaposleniRef.current && !zaposleniRef.current.contains(target)) {
        setIsZaposleniOpen(false);
      }
      if (isVrstaLekarskogOpen && vrstaLekarskogRef.current && !vrstaLekarskogRef.current.contains(target)) {
        setIsVrstaLekarskogOpen(false);
      }
      if (isIntervalOpen && intervalRef.current && !intervalRef.current.contains(target)) {
        setIsIntervalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isZaposleniOpen, isVrstaLekarskogOpen, isIntervalOpen]);

  // Auto-calculate next medical exam date when interval or exam date changes
  useEffect(() => {
    if (formData.intervalLekarskog && formData.datumLekarskog) {
      const nextDate = new Date(formData.datumLekarskog);
      nextDate.setMonth(nextDate.getMonth() + parseInt(formData.intervalLekarskog));
      setFormData(prev => ({ ...prev, datumNarednogLekarskog: nextDate }));
    }
  }, [formData.intervalLekarskog, formData.datumLekarskog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zaposleni || !formData.radnoMesto || !formData.vrstaLekarskog || !formData.datumLekarskog || !formData.intervalLekarskog || !formData.datumNarednogLekarskog) {
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
      className="max-w-[800px] p-5 lg:p-10 dark:bg-[#11181E]"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Novi Lekarski Pregled</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="w-full">
                <Label>Angažovani *</Label>
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
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-[#11181E] dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {zaposleniOptions.map((option: string, index: number) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.zaposleni === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === zaposleniOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                                                         onClick={() => {
                               const selectedEmployeeData = zaposleniData[option];
                               setFormData({
                                 ...formData,
                                 zaposleni: option,
                                 radnoMesto: selectedEmployeeData.radnoMesto,
                                 povecanRizik: selectedEmployeeData.povecanRizik,
                               });
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

                             <div className="w-full">
                 <div className="flex items-center gap-2">
                   <Label>Radno mesto *</Label>
                   {formData.radnoMesto && (
                     <span className={`text-sm font-medium ${
                       formData.povecanRizik 
                         ? 'text-red-600 dark:text-red-400 mb-1.5' 
                         : 'text-blue-600 dark:text-blue-400 mb-1.5'
                     }`}>
                       {formData.povecanRizik ? 'Povećan rizik' : 'Nije povećan rizik'}
                     </span>
                   )}
                 </div>
                 <div className="relative w-full">
                   <input
                     type="text"
                     value={formData.radnoMesto || ""}
                     placeholder="Izaberite angazovanog"
                     readOnly
                     className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                   />
                 </div>
               </div>

              <div className="w-full">
                <Label>Vrsta lekarskog *</Label>
                <div className="relative w-full" ref={vrstaLekarskogRef}>
                  <button
                    type="button"
                    onClick={() => setIsVrstaLekarskogOpen(!isVrstaLekarskogOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <span>{formData.vrstaLekarskog || "Izaberi vrstu lekarskog"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isVrstaLekarskogOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isVrstaLekarskogOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-[#11181E] dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {vrstaLekarskogOptions.map((option, index) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.vrstaLekarskog === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === vrstaLekarskogOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, vrstaLekarskog: option });
                              setIsVrstaLekarskogOpen(false);
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

              <div className="w-full">
                <Label>Datum lekarskog pregleda *</Label>
                <CustomDatePicker
                  value={formData.datumLekarskog}
                  onChange={(date) => {
                    if (date) {
                      setFormData(prev => ({ ...prev, datumLekarskog: date }));
                    }
                  }}
                  required
                />
              </div>

              <div className="w-full">
                <Label>Interval lekarskog pregleda *</Label>
                <div className="relative w-full" ref={intervalRef}>
                  <button
                    type="button"
                    onClick={() => setIsIntervalOpen(!isIntervalOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <span>{formData.intervalLekarskog ? `${formData.intervalLekarskog} meseci` : "Izaberi interval"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isIntervalOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isIntervalOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-[#11181E] dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {intervalOptions.map((option, index) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.intervalLekarskog === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === intervalOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, intervalLekarskog: option });
                              setIsIntervalOpen(false);
                            }}
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{option} meseci</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full">
                <Label>Datum narednog lekarskog pregleda *</Label>
                <CustomDatePicker
                  value={formData.datumNarednogLekarskog}
                  onChange={(date) => {
                    if (date) {
                      setFormData(prev => ({ ...prev, datumNarednogLekarskog: date }));
                    }
                  }}
                  required
                  disabled
                />
              </div>


                    </div>

        <div className="flex justify-end gap-2 mt-6">
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