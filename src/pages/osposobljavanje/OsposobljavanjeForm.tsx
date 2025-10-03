import React, { useEffect, useRef } from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import CustomDatePicker from "../../components/form/input/DatePicker";

interface OsposobljavanjeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function OsposobljavanjeForm({ isOpen, onClose, onSave, initialData }: OsposobljavanjeFormProps) {
  const [formData, setFormData] = React.useState({
    angazovani: "",
    radnoMesto: "",
    povecanRizik: false,
    lokacija: "",
    osposobljavanjeBZR: new Date(),
    datumNarednogBZR: new Date(),
    osposobljavanjeZOP: new Date(),
    datumNarednogZOP: new Date(),
    prikaziUPodsetniku: false,
    bzrOdradjeno: false
  });

  // Add state for dropdowns
  const [isAngazovaniOpen, setIsAngazovaniOpen] = React.useState(false);
  const angazovaniRef = useRef<HTMLDivElement>(null);

  // Employee data with their job positions and locations
  const angazovaniData: Record<string, {
    radnoMesto: string;
    povecanRizik: boolean;
    lokacija: string;
  }> = {
    "Petar Petrović": {
      radnoMesto: "Viljuškari",
      povecanRizik: true,
      lokacija: "Beograd",
    },
    "Ana Anić": {
      radnoMesto: "Kranista",
      povecanRizik: true,
      lokacija: "Novi Sad",
    },
    "Marko Marković": {
      radnoMesto: "Mehaničar",
      povecanRizik: false,
      lokacija: "Niš",
    },
    "Jovana Jovanović": {
      radnoMesto: "Električar",
      povecanRizik: true,
      lokacija: "Kragujevac",
    },
    "Stefan Stefanović": {
      radnoMesto: "Viljuškari",
      povecanRizik: true,
      lokacija: "Subotica",
    },
    "Marija Marić": {
      radnoMesto: "Kontrolor kvaliteta",
      povecanRizik: false,
      lokacija: "Zrenjanin",
    }
  };

  const angazovaniOptions = Object.keys(angazovaniData);

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (angazovaniRef.current && !angazovaniRef.current.contains(event.target as Node)) {
        setIsAngazovaniOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Automatically calculate next BZR date when BZR training date changes
  useEffect(() => {
    if (formData.osposobljavanjeBZR) {
      const nextBZRDate = new Date(formData.osposobljavanjeBZR);
      // BZR is always 36 months (3 years) from training date
      nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 3);
      setFormData(prev => ({ ...prev, datumNarednogBZR: nextBZRDate }));
    }
  }, [formData.osposobljavanjeBZR]);

  // Automatically calculate next ZOP date when ZOP training date changes
  useEffect(() => {
    if (formData.osposobljavanjeZOP) {
      const nextZOPDate = new Date(formData.osposobljavanjeZOP);
      // ZOP is always 36 months (3 years) from training date
      nextZOPDate.setFullYear(nextZOPDate.getFullYear() + 3);
      setFormData(prev => ({ ...prev, datumNarednogZOP: nextZOPDate }));
    }
  }, [formData.osposobljavanjeZOP]);

  // Populate form with initialData when provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        angazovani: initialData.zaposleni || "",
        radnoMesto: initialData.radnoMesto || "",
        povecanRizik: initialData.povecanRizik || false,
        lokacija: initialData.lokacija || "",
        osposobljavanjeBZR: initialData.osposobljavanjeBZR ? new Date(initialData.osposobljavanjeBZR) : new Date(),
        datumNarednogBZR: initialData.datumNarednogBZR ? new Date(initialData.datumNarednogBZR) : new Date(),
        osposobljavanjeZOP: initialData.osposobljavanjeZOP ? new Date(initialData.osposobljavanjeZOP) : new Date(),
        datumNarednogZOP: initialData.datumNarednogZOP ? new Date(initialData.datumNarednogZOP) : new Date(),
        prikaziUPodsetniku: initialData.prikaziUPodsetniku || false,
        bzrOdradjeno: initialData.bzrOdradjeno || false
      });
    } else {
      // Initialize next BZR date on component mount (for new entries)
      const nextBZRDate = new Date(formData.osposobljavanjeBZR);
      // BZR is always 36 months (3 years) from training date
      nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 3);
      setFormData(prev => ({ ...prev, datumNarednogBZR: nextBZRDate }));

      // Initialize next ZOP date on component mount (for new entries)
      const nextZOPDate = new Date(formData.osposobljavanjeZOP);
      // ZOP is always 36 months (3 years) from training date
      nextZOPDate.setFullYear(nextZOPDate.getFullYear() + 3);
      setFormData(prev => ({ ...prev, datumNarednogZOP: nextZOPDate }));
    }
  }, [initialData]); // Depend on initialData

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.angazovani || !formData.radnoMesto || !formData.lokacija || !formData.osposobljavanjeBZR) {
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
        // BZR is always 36 months (3 years) from training date
        nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 3);
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
      className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {initialData ? "Izmeni Osposobljavanje/Provera BZR" : "Novo Osposobljavanje/Provera BZR"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="w-full">
                <Label>Zaposleni *</Label>
                {initialData ? (
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={formData.angazovani || ""}
                      readOnly
                      className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                ) : (
                  <div className="relative w-full" ref={angazovaniRef}>
                    <button
                      type="button"
                      onClick={() => setIsAngazovaniOpen(!isAngazovaniOpen)}
                      className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                      <span>{formData.angazovani || "Izaberi zaposlenog"}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ml-2 ${isAngazovaniOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isAngazovaniOpen && (
                     <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {angazovaniOptions.map((option: string, index: number) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.angazovani === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === angazovaniOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                                                         onClick={() => {
                               const selectedEmployeeData = angazovaniData[option];
                               const newFormData = {
                                 ...formData,
                                 angazovani: option,
                                 radnoMesto: selectedEmployeeData.radnoMesto,
                                 povecanRizik: selectedEmployeeData.povecanRizik,
                                 lokacija: selectedEmployeeData.lokacija,
                               };
                               
                               // Automatically calculate next BZR date
                               if (formData.osposobljavanjeBZR) {
                                 const nextBZRDate = new Date(formData.osposobljavanjeBZR);
                                 // BZR is always 36 months (3 years) from training date
                                 nextBZRDate.setFullYear(nextBZRDate.getFullYear() + 3);
                                 newFormData.datumNarednogBZR = nextBZRDate;
                               }
                               
                               setFormData(newFormData);
                               setIsAngazovaniOpen(false);
                             }}
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>
                )}
              </div>

                             <div className="w-full">
                 <div className="flex items-center gap-2">
                   <Label>Radno Mesto</Label>
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
                     placeholder="Izaberite zaposlenog"
                     readOnly
                     className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                   />
                 </div>
               </div>

              <div className="w-full">
                <Label>Lokacija</Label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={formData.lokacija || ""}
                     placeholder="Izaberite zaposlenog"
                    readOnly
                    className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

                             <div className="w-full">
                 <Label>Datum Provere BZR *</Label>
                 <CustomDatePicker
                   value={formData.osposobljavanjeBZR}
                   onChange={(newValue) => handleDateChange('osposobljavanjeBZR', newValue)}
                 />
               </div>

                             <div className="w-full">
                 <Label>Datum Naredne Provere BZR</Label>
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
                <Label>Datum Provere ZOP</Label>
                <CustomDatePicker
                  value={formData.osposobljavanjeZOP}
                  onChange={(newValue) => handleDateChange('osposobljavanjeZOP', newValue)}
                />
              </div>

              <div className="w-full">
                <Label>Datum Naredne Provere ZOP</Label>
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


                    </div>

        <div className="flex justify-end gap-2 mt-6">
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

