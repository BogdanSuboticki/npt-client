"use client";

import React, { useEffect, useRef } from "react";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Checkbox from "../../components/form/input/Checkbox";

interface ZaposleniFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
  initialData?: any;
  firme: Array<{ pib: string; naziv: string }>;
}

export default function ZaposleniForm({ isOpen, onClose, onSave, initialData, firme }: ZaposleniFormProps) {
  const [formData, setFormData] = React.useState({
    firmaPib: "",
    imePrezime: "",
    prvaPomoc: "",
    osiguranje: false,
  });
  const [formError, setFormError] = React.useState<string | null>(null);

  const [isPrvaPomocOpen, setIsPrvaPomocOpen] = React.useState(false);
  const [isFirmaOpen, setIsFirmaOpen] = React.useState(false);
  const prvaPomocRef = useRef<HTMLDivElement>(null);
  const firmaRef = useRef<HTMLDivElement>(null);

  // Example options - replace with actual data
  const prvaPomocOptions = ["Osnovni kurs", "Napredni kurs", "Ne"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdowns
      if (prvaPomocRef.current && !prvaPomocRef.current.contains(target)) {
        setIsPrvaPomocOpen(false);
      }
      if (firmaRef.current && !firmaRef.current.contains(target)) {
        setIsFirmaOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setFormError(null);
    if (initialData) {
      setFormData({
        firmaPib: initialData.firmaPib || "",
        imePrezime: initialData.imePrezime || "",
        prvaPomoc: initialData.prvaPomoc || "",
        osiguranje: initialData.osiguranje || false,
      });
    } else {
      setFormData({
        firmaPib: "",
        imePrezime: "",
        prvaPomoc: "",
        osiguranje: false,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.firmaPib || !formData.imePrezime || !formData.prvaPomoc) {
      setFormError('Molimo popunite sva obavezna polja');
      return;
    }
    setFormError(null);
    try {
      await onSave(formData);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Greška pri čuvanju zaposlenog.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] p-5 lg:p-10 dark:bg-gray-800"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {initialData ? "Izmeni Zaposleni" : "Novi Zaposleni"}
      </h2>
      <form onSubmit={handleSubmit}>
        {formError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4">
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
                    ? firme.find(f => f.pib === formData.firmaPib)
                      ? `${firme.find(f => f.pib === formData.firmaPib)!.naziv} (${formData.firmaPib})`
                      : formData.firmaPib
                    : "Izaberite firmu"}
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
                          setFormData({ ...formData, firmaPib: firma.pib });
                          setIsFirmaOpen(false);
                        }}
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{firma.naziv} ({firma.pib})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1">
            <Label>Ime i prezime zaposlenog *</Label>
            <Input
              type="text"
              name="imePrezime"
              value={formData.imePrezime}
              onChange={(e) => setFormData(prev => ({ ...prev, imePrezime: e.target.value }))}
              placeholder="Unesite ime i prezime"
              className="bg-[#F9FAFB] dark:bg-[#101828]"
              required
            />
          </div>

          <div className="col-span-1">
            <Label>Prva pomoć *</Label>
            <div className="relative w-full" ref={prvaPomocRef}>
              <button
                type="button"
                onClick={() => setIsPrvaPomocOpen(!isPrvaPomocOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <span>{formData.prvaPomoc || "Izaberite opciju"}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isPrvaPomocOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isPrvaPomocOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {prvaPomocOptions.map((option: string, index: number) => (
                      <div
                        key={option}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.prvaPomoc === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === prvaPomocOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, prvaPomoc: option });
                          setIsPrvaPomocOpen(false);
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
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                checked={formData.osiguranje}
                onChange={(checked) => setFormData({ ...formData, osiguranje: checked })}
                className="w-4 h-4"
                id="osiguranje"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer" htmlFor="osiguranje">
                Osiguranje od posledica povrede na radu i prof. bolesti
              </label>
            </div>
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