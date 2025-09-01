"use client";

import React, { useEffect, useRef } from "react";
import CustomDatePicker from "../../components/form/input/DatePicker";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";

interface PreglediOpremeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function PreglediOpremeForm({ isOpen, onClose, onSave }: PreglediOpremeFormProps) {
  const [formData, setFormData] = React.useState({
    nazivOpreme: "",
    vrstaOpreme: "",
    lokacija: "",
    intervalPregleda: "",
    datumPregleda: new Date(),
    status: "",
    datumNarednogPregleda: new Date(),
    napomena: ""
  });

  // Add state for dropdowns
  const [isNazivOpremeOpen, setIsNazivOpremeOpen] = React.useState(false);
  const [isIntervalOpen, setIsIntervalOpen] = React.useState(false);
  const [isStatusOpen, setIsStatusOpen] = React.useState(false);
  const nazivOpremeRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Equipment data with names and their corresponding types
  const opremaData = [
    { naziv: "Viljuškar", vrsta: "Oprema za rad", lokacija: "Lokacija 1" },
    { naziv: "Kran", vrsta: "Oprema za rad", lokacija: "Lokacija 2" },
    { naziv: "Transformator", vrsta: "Elektro i gromobranska instalacija", lokacija: "Lokacija 3" },
    { naziv: "Kompresor", vrsta: "Oprema za rad", lokacija: "Lokacija 1" },
    { naziv: "Generator", vrsta: "Elektro i gromobranska instalacija", lokacija: "Lokacija 2" },
    { naziv: "Pumpa", vrsta: "Oprema za rad", lokacija: "Lokacija 3" }
  ];

  // Example options - replace with actual data
  const intervalOptions = ["6", "36"];
  const statusOptions = ["Ispravno", "Neispravno"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (nazivOpremeRef.current && !nazivOpremeRef.current.contains(target)) {
        setIsNazivOpremeOpen(false);
      }
      if (intervalRef.current && !intervalRef.current.contains(target)) {
        setIsIntervalOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(target)) {
        setIsStatusOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-fill vrsta opreme when naziv opreme is selected
  const handleNazivOpremeChange = (naziv: string) => {
    const selectedOprema = opremaData.find(item => item.naziv === naziv);
    setFormData(prev => ({
      ...prev,
      nazivOpreme: naziv,
      vrstaOpreme: selectedOprema ? selectedOprema.vrsta : "",
      lokacija: selectedOprema ? selectedOprema.lokacija : ""
    }));
    setIsNazivOpremeOpen(false);
  };

  // Calculate next inspection date when interval or inspection date changes
  useEffect(() => {
    if (formData.intervalPregleda && formData.datumPregleda) {
      const intervalMonths = parseInt(formData.intervalPregleda);
      if (!isNaN(intervalMonths)) {
        const nextDate = new Date(formData.datumPregleda);
        nextDate.setMonth(nextDate.getMonth() + intervalMonths);
        setFormData(prev => ({ ...prev, datumNarednogPregleda: nextDate }));
      }
    }
  }, [formData.intervalPregleda, formData.datumPregleda]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nazivOpreme || !formData.vrstaOpreme || !formData.lokacija || !formData.intervalPregleda || !formData.datumPregleda || !formData.status) {
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
      className="max-w-[800px] max-h-[90vh] dark:bg-gray-800 "
    >
      <div className="flex flex-col h-full">
        <div className="p-5 pt-10">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white">Novi Pregled Opreme</h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              <div className="w-full">
                <Label>Naziv opreme *</Label>
                <div className="relative w-full" ref={nazivOpremeRef}>
                  <button
                    type="button"
                    onClick={() => setIsNazivOpremeOpen(!isNazivOpremeOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <span>{formData.nazivOpreme || "Izaberi opremu"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isNazivOpremeOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isNazivOpremeOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {opremaData.map((item, index) => (
                          <div
                            key={item.naziv}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.nazivOpreme === item.naziv ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === opremaData.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => handleNazivOpremeChange(item.naziv)}
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item.naziv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full">
                <Label>Vrsta opreme</Label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={formData.vrstaOpreme || ""}
                    placeholder="Izaberite opremu"
                    readOnly
                    className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="w-full">
                <Label>Lokacija *</Label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={formData.lokacija || ""}
                    placeholder="Izaberite opremu"
                    readOnly
                    className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="w-full">
                <Label>Interval pregleda (meseci) *</Label>
                <div className="relative w-full" ref={intervalRef}>
                  <button
                    type="button"
                    onClick={() => setIsIntervalOpen(!isIntervalOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <span>{formData.intervalPregleda ? `${formData.intervalPregleda} meseci` : "Izaberi interval"}</span>
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
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {intervalOptions.map((option, index) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.intervalPregleda === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === intervalOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, intervalPregleda: option });
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
                <Label>Datum pregleda opreme *</Label>
                <CustomDatePicker
                  value={formData.datumPregleda}
                  onChange={(date) => {
                    if (date) {
                      setFormData(prev => ({ ...prev, datumPregleda: date }));
                    }
                  }}
                  required
                />
              </div>

              <div className="w-full">
                <Label>Status *</Label>
                <div className="relative w-full" ref={statusRef}>
                  <button
                    type="button"
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <span>{formData.status || "Izaberi status"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isStatusOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {statusOptions.map((option, index) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.status === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === statusOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, status: option });
                              setIsStatusOpen(false);
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
                <Label>Datum narednog pregleda opreme</Label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.datumNarednogPregleda ? formData.datumNarednogPregleda.toLocaleDateString('sr-RS') : ''}
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

              <div className="col-span-1 lg:col-span-2">
                <Label>Napomena</Label>
                <textarea
                  value={formData.napomena}
                  onChange={(e) => setFormData({...formData, napomena: e.target.value})}
                  className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 px-5 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 pb-5 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
            <div className="flex justify-end gap-2">
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
          </div>
        </form>
      </div>
    </Modal>
  );
} 