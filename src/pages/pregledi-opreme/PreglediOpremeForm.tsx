"use client";

import React, { useEffect, useRef } from "react";
import CustomDatePicker from "../../components/form/input/DatePicker";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import Slider from "../../components/ui/Slider";

interface PreglediOpremeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function PreglediOpremeForm({ isOpen, onClose, onSave }: PreglediOpremeFormProps) {
  const [formData, setFormData] = React.useState({
    nazivOpreme: "",
    lokacija: "",
    intervalPregleda: "",
    datumPregleda: new Date(),
    status: "",
    datumNarednogPregleda: new Date(),
    napomena: "",
    pratiSe: true, // true = "Da", false = "Ne"
  });

  // Add state for dropdowns
  const [isLokacijaOpen, setIsLokacijaOpen] = React.useState(false);
  const [isIntervalOpen, setIsIntervalOpen] = React.useState(false);
  const [isStatusOpen, setIsStatusOpen] = React.useState(false);
  const lokacijaRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Example options - replace with actual data
  const lokacijaOptions = ["Lokacija 1", "Lokacija 2", "Lokacija 3"];
  const intervalOptions = ["1", "3", "6", "12", "24", "36"];
  const statusOptions = ["Ispravno", "Neispravno"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (lokacijaRef.current && !lokacijaRef.current.contains(target)) {
        setIsLokacijaOpen(false);
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
    if (!formData.nazivOpreme || !formData.lokacija || !formData.intervalPregleda || !formData.datumPregleda || !formData.status) {
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
        <div className="p-5 lg:p-10 pb-0">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Novi Pregled Opreme</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            <div className="flex flex-col space-y-4 pb-4">
              <div className="w-full">
                <Label>Naziv opreme *</Label>
                <Input
                  type="text"
                  name="nazivOpreme"
                  value={formData.nazivOpreme}
                  onChange={(e) => setFormData({...formData, nazivOpreme: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828] w-full"
                  required
                />
              </div>

              <div className="w-full">
                <Label>Lokacija *</Label>
                <div className="relative w-full" ref={lokacijaRef}>
                  <button
                    type="button"
                    onClick={() => setIsLokacijaOpen(!isLokacijaOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <span>{formData.lokacija || "Izaberi lokaciju"}</span>
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
                        {lokacijaOptions.map((option, index) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.lokacija === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === lokacijaOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, lokacija: option });
                              setIsLokacijaOpen(false);
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
                    className="w-full px-4 h-11 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                      <path d="M18 2V4M6 2V4M11.996 13H12.004M11.996 17H12.004M15.991 13H16M8 13H8.009M8 17H8.009M3.5 8H20.5M3 8H21M2.5 12.243C2.5 7.886 2.5 5.707 3.752 4.353C5.004 3 7.02 3 11.05 3H12.95C16.98 3 18.996 3 20.248 4.354C21.5 5.707 21.5 7.886 21.5 12.244V12.757C21.5 17.114 21.5 19.293 20.248 20.647C18.996 22 16.98 22 12.95 22H11.05C7.02 22 5.004 22 3.752 20.646C2.5 19.293 2.5 17.114 2.5 12.756V12.243Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <Label>Napomena</Label>
                <TextArea
                  value={formData.napomena}
                  onChange={(value) => setFormData({...formData, napomena: value})}
                  placeholder="Unesite napomenu..."
                  rows={4}
                  className="bg-[#F9FAFB] dark:bg-[#101828] w-full"
                />
              </div>

              <div className="w-full">
                <Slider
                  label="Pratiti"
                  optionOne="Da"
                  optionTwo="Ne"
                  value={formData.pratiSe}
                  onChange={(value) => setFormData(prev => ({ ...prev, pratiSe: value }))}
                  size="full"
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