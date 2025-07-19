"use client";

import React, { useEffect, useRef } from "react";
import CustomDatePicker from "../../components/form/input/DatePicker";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Slider from "../../components/ui/Slider";

interface LekarskiPreglediFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function LekarskiPreglediForm({ isOpen, onClose, onSave }: LekarskiPreglediFormProps) {
  const [formData, setFormData] = React.useState({
    zaposleni: "",
    radnoMesto: "",
    povecanRizik: false, // false = "Ne", true = "Da"
    vrstaLekarskog: "",
    datumLekarskog: new Date(),
    intervalLekarskog: "",
    datumNarednogLekarskog: new Date(),
  });

  // Add state for dropdowns
  const [isRadnoMestoOpen, setIsRadnoMestoOpen] = React.useState(false);
  const [isVrstaLekarskogOpen, setIsVrstaLekarskogOpen] = React.useState(false);
  const radnoMestoRef = useRef<HTMLDivElement>(null);
  const vrstaLekarskogRef = useRef<HTMLDivElement>(null);

  // Example options - replace with actual data
  const radnoMestoOptions = ["Radno mesto 1", "Radno mesto 2", "Radno mesto 3"];
  const vrstaLekarskogOptions = ["Prethodni", "Periodični", "Vanredni"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (radnoMestoRef.current && !radnoMestoRef.current.contains(target)) {
        setIsRadnoMestoOpen(false);
      }
      if (vrstaLekarskogRef.current && !vrstaLekarskogRef.current.contains(target)) {
        setIsVrstaLekarskogOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zaposleni || !formData.datumLekarskog || !formData.intervalLekarskog || !formData.datumNarednogLekarskog) {
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
      className="max-w-[800px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 pt-10">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white">Novi Lekarski Pregled</h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              <div className="w-full">
                <Label>Zaposleni *</Label>
                <Input
                  type="text"
                  name="zaposleni"
                  value={formData.zaposleni}
                  onChange={(e) => setFormData({...formData, zaposleni: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828] w-full"
                  required
                />
              </div>

              <div className="w-full">
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
                        {radnoMestoOptions.map((option, index) => (
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
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
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
                <Input
                  type="text"
                  name="intervalLekarskog"
                  value={formData.intervalLekarskog}
                  onChange={(e) => setFormData({...formData, intervalLekarskog: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828] w-full"
                  required
                />
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
                />
              </div>

              <div className="w-full lg:col-span-2">
                <Slider
                  label="Povećan rizik"
                  optionOne="Da"
                  optionTwo="Ne"
                  value={formData.povecanRizik}
                  onChange={(value) => setFormData(prev => ({ ...prev, povecanRizik: value }))}
                  size="full"
                />
              </div>
            </div>
          </div>

          <div className="pb-5 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
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