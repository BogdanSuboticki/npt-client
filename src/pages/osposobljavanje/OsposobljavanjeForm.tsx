import React, { useEffect, useRef } from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import CustomDatePicker from "../../components/form/input/DatePicker";
import Slider from "../../components/ui/Slider";

interface OsposobljavanjeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function OsposobljavanjeForm({ isOpen, onClose, onSave }: OsposobljavanjeFormProps) {
  const [formData, setFormData] = React.useState({
    zaposleni: "",
    radnoMesto: "",
    lokacija: "",
    povecanRizik: false, // false = "Ne", true = "Da"
    osposobljavanjeBZR: new Date(),
    datumNarednogBZR: new Date(),
    osposobljavanjeZOP: new Date(),
    datumNarednogZOP: new Date(),
    prikaziUPodsetniku: false,
    bzrOdradjeno: false
  });

  // Add state for dropdowns
  const [isZaposleniOpen, setIsZaposleniOpen] = React.useState(false);
  const zaposleniRef = useRef<HTMLDivElement>(null);

  // Employee data with their job positions
  const zaposleniData: Record<string, {
    radnoMesto: string;
    povecanRizik: boolean;
  }> = {
    "Petar Petrović": {
      radnoMesto: "Viljuškari",
      povecanRizik: true, // Viljuškari has increased risk
    },
    "Ana Anić": {
      radnoMesto: "Kranista",
      povecanRizik: true, // Kranista has increased risk
    },
    "Marko Marković": {
      radnoMesto: "Mehaničar",
      povecanRizik: true, // Mehaničar has increased risk
    },
    "Jovana Jovanović": {
      radnoMesto: "Električar",
      povecanRizik: true, // Električar has increased risk
    },
    "Stefan Stefanović": {
      radnoMesto: "Viljuškari",
      povecanRizik: true, // Viljuškari has increased risk
    },
    "Marija Marić": {
      radnoMesto: "Kontrolor kvaliteta",
      povecanRizik: false, // Kontrolor kvaliteta typically has lower risk
    }
  };

  const zaposleniOptions = Object.keys(zaposleniData);

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdowns
      if (zaposleniRef.current && !zaposleniRef.current.contains(target)) {
        setIsZaposleniOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Automatically calculate next BZR date when risk level or BZR training date changes
  useEffect(() => {
    if (formData.osposobljavanjeBZR) {
      const nextBZRDate = new Date(formData.osposobljavanjeBZR);
      if (formData.povecanRizik) {
        // High risk: next BZR in 12 months
        nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 1);
      } else {
        // Low risk: next BZR in 36 months (3 years)
        nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 3);
      }
      setFormData(prev => ({ ...prev, datumNarednogBZR: nextBZRDate }));
    }
  }, [formData.povecanRizik, formData.osposobljavanjeBZR]);

  // Automatically calculate next ZOP date when ZOP training date changes
  useEffect(() => {
    if (formData.osposobljavanjeZOP) {
      const nextZOPDate = new Date(formData.osposobljavanjeZOP);
      // ZOP is always 36 months (3 years) from training date
      nextZOPDate.setFullYear(nextZOPDate.getFullYear() + 3);
      setFormData(prev => ({ ...prev, datumNarednogZOP: nextZOPDate }));
    }
  }, [formData.osposobljavanjeZOP]);

  // Initialize next BZR date on component mount
  useEffect(() => {
    const nextBZRDate = new Date(formData.osposobljavanjeBZR);
    if (formData.povecanRizik) {
      // High risk: next BZR in 12 months
      nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 1);
    } else {
      // Low risk: next BZR in 36 months (3 years)
      nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 3);
    }
    setFormData(prev => ({ ...prev, datumNarednogBZR: nextBZRDate }));

    // Initialize next ZOP date on component mount
    const nextZOPDate = new Date(formData.osposobljavanjeZOP);
    // ZOP is always 36 months (3 years) from training date
    nextZOPDate.setFullYear(nextZOPDate.getFullYear() + 3);
    setFormData(prev => ({ ...prev, datumNarednogZOP: nextZOPDate }));
  }, []); // Empty dependency array means this runs only once on mount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zaposleni || !formData.radnoMesto || !formData.lokacija || !formData.osposobljavanjeBZR) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleDateChange = (field: string, value: Date | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // If BZR training date changes, automatically calculate next BZR date
      if (field === 'osposobljavanjeBZR') {
        const nextBZRDate = new Date(value);
        if (formData.povecanRizik) {
          // High risk: next BZR in 12 months
          nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 1);
        } else {
          // Low risk: next BZR in 36 months (3 years)
          nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 3);
        }
        setFormData(prev => ({ ...prev, datumNarednogBZR: nextBZRDate }));
      }
      
      // If ZOP training date changes, automatically calculate next ZOP date
      if (field === 'osposobljavanjeZOP') {
        const nextZOPDate = new Date(value);
        // ZOP is always 36 months (3 years) from training date
        nextZOPDate.setFullYear(nextZOPDate.getFullYear() + 3);
        setFormData(prev => ({ ...prev, datumNarednogZOP: nextZOPDate }));
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 pt-10">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
            Novo Osposobljavanje/Provera BZR
          </h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              <div className="w-full">
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
                              const selectedEmployeeData = zaposleniData[option];
                              const newFormData = {
                                ...formData,
                                zaposleni: option,
                                radnoMesto: selectedEmployeeData.radnoMesto,
                                povecanRizik: selectedEmployeeData.povecanRizik,
                              };
                              
                              // Automatically calculate next BZR date based on risk level
                              if (formData.osposobljavanjeBZR) {
                                const nextBZRDate = new Date(formData.osposobljavanjeBZR);
                                if (selectedEmployeeData.povecanRizik) {
                                  // High risk: next BZR in 12 months
                                  nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 1);
                                } else {
                                  // Low risk: next BZR in 36 months (3 years)
                                  nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 3);
                                }
                                newFormData.datumNarednogBZR = nextBZRDate;
                              }
                              
                              setFormData(newFormData);
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
                <Label>Radno Mesto *</Label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={formData.radnoMesto || ""}
                    placeholder="Izaberite zaposlenog"
                    readOnly
                    className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="w-full">
                <Label>Lokacija *</Label>
                <Input 
                  type="text" 
                  value={formData.lokacija}
                  onChange={(e) => setFormData({...formData, lokacija: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828] w-full"
                />
              </div>

                             <div className="w-full">
                 <Label>Osposobljavanje BZR *</Label>
                 <CustomDatePicker
                   value={formData.osposobljavanjeBZR}
                   onChange={(newValue) => handleDateChange('osposobljavanjeBZR', newValue)}
                 />
               </div>

                             <div className="w-full">
                 <Label>Datum Narednog BZR</Label>
                 <div className="relative">
                   <input
                     type="text"
                     value={formData.datumNarednogBZR ? formData.datumNarednogBZR.toLocaleDateString('sr-RS') : ''}
                     readOnly
                     disabled
                     className="w-full h-11 px-4 py-2.5 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg shadow-theme-xs dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 pr-10 cursor-default focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-700"
                   />
                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 dark:text-gray-400">
                       <path d="M18 2V4M6 2V4M11.996 13H12.004M11.996 17H12.004M15.991 13H16M8 13H8.009M8 17H8.009M3.5 8H20.5M3 8H21M2.5 12.243C2.5 7.886 2.5 5.707 3.752 4.353C5.004 3 7.02 3 11.05 3H12.95C16.98 3 18.996 3 20.248 4.354C21.5 5.707 21.5 7.886 21.5 12.244V12.757C21.5 17.114 21.5 19.293 20.248 20.647C18.996 22 16.98 22 12.95 22H11.05C7.02 22 5.004 22 3.752 20.646C2.5 19.293 2.5 17.114 2.5 12.756V12.243Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </div>
                 </div>
               </div>

              <div className="w-full">
                <Label>Osposobljavanje ZOP</Label>
                <CustomDatePicker
                  value={formData.osposobljavanjeZOP}
                  onChange={(newValue) => handleDateChange('osposobljavanjeZOP', newValue)}
                />
              </div>

              <div className="w-full">
                <Label>Datum Narednog ZOP</Label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.datumNarednogZOP ? formData.datumNarednogZOP.toLocaleDateString('sr-RS') : ''}
                    readOnly
                    disabled
                    className="w-full h-11 px-4 py-2.5 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg shadow-theme-xs dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 pr-10 cursor-default focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-700"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 dark:text-gray-400">
                      <path d="M18 2V4M6 2V4M11.996 13H12.004M11.996 17H12.004M15.991 13H16M8 13H8.009M8 17H8.009M3.5 8H20.5M3 8H21M2.5 12.243C2.5 7.886 2.5 5.707 3.752 4.353C5.004 3 7.02 3 11.05 3H12.95C16.98 3 18.996 3 20.248 4.354C21.5 5.707 21.5 7.886 21.5 12.244V12.757C21.5 17.114 21.5 19.293 20.248 20.647C18.996 22 16.98 22 12.95 22H11.05C7.02 22 5.004 22 3.752 20.646C2.5 19.293 2.5 17.114 2.5 12.756V12.243Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full lg:col-span-2">
                <Slider
                  label="Povećan Rizik"
                  optionOne="Da"
                  optionTwo="Ne"
                  value={formData.povecanRizik}
                  onChange={(value) => setFormData({...formData, povecanRizik: value})}
                  size="full"
                />
              </div>
            </div>
          </div>

          <div className="pb-5 pt-2 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Otkaži
              </Button>
              <Button type="submit">
                Sačuvaj
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

