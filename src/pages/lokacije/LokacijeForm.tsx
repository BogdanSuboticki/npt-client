"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";

interface LokacijeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
  initialData?: any;
  firme: Array<{ pib: string; naziv: string }>;
}

export default function LokacijeForm({ isOpen, onClose, onSave, initialData, firme }: LokacijeFormProps) {
  const [formData, setFormData] = useState({
    firmaPib: "",
    nazivLokacije: "",
    brojMernihMesta: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isFirmaOpen, setIsFirmaOpen] = useState(false);
  const firmaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firmaPib: initialData.firmaPib || "",
        nazivLokacije: initialData.nazivLokacije || "",
        brojMernihMesta: initialData.brojMernihMesta?.toString() || "",
      });
    } else {
      setFormData({
        firmaPib: "",
        nazivLokacije: "",
        brojMernihMesta: "",
      });
    }
    setFormError(null);
  }, [initialData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (firmaRef.current && !firmaRef.current.contains(event.target as Node)) {
        setIsFirmaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.firmaPib || !formData.nazivLokacije || !formData.brojMernihMesta) {
      setFormError("Molimo popunite sva obavezna polja");
      return;
    }

    const brojMernihMesta = parseInt(formData.brojMernihMesta);
    if (brojMernihMesta < 0) {
      setFormError("Broj mernih mesta ne može biti negativan");
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Greška pri čuvanju podataka.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
    >
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
          {initialData ? "Izmeni Lokaciju" : "Nova Lokacija"}
        </h4>

        {formError && (
          <div className="mb-4 p-3 text-sm text-error-500 bg-error-50 dark:bg-error-500/10 rounded-lg">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label>Preduzeće *</Label>
            <div className="relative w-full" ref={firmaRef}>
              <button
                type="button"
                onClick={() => setIsFirmaOpen(!isFirmaOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <span>
                  {formData.firmaPib
                    ? firme.find((f) => f.pib === formData.firmaPib)
                        ? `${firme.find((f) => f.pib === formData.firmaPib)!.naziv} (${formData.firmaPib})`
                        : formData.firmaPib
                    : "Izaberite preduzeće"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isFirmaOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isFirmaOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto p-1">
                    {firme.map((firma) => (
                      <div
                        key={firma.pib}
                        onClick={() => {
                          setFormData({ ...formData, firmaPib: firma.pib });
                          setIsFirmaOpen(false);
                        }}
                        className={`px-4 py-2 text-sm rounded-md cursor-pointer ${
                          formData.firmaPib === firma.pib
                            ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                        }`}
                      >
                        {firma.naziv} ({firma.pib})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1">
            <Label>Naziv lokacije *</Label>
            <Input
              value={formData.nazivLokacije}
              onChange={(e) =>
                setFormData({ ...formData, nazivLokacije: e.target.value })
              }
              className="bg-[#F9FAFB] dark:bg-[#101828]"
              required
            />
          </div>

          <div className="col-span-1">
            <Label>Broj mernih mesta *</Label>
            <Input
              type="number"
              min="0"
              value={formData.brojMernihMesta}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (value >= 0) {
                  setFormData({ ...formData, brojMernihMesta: e.target.value });
                }
              }}
              className="bg-[#F9FAFB] dark:bg-[#101828]"
              required
            />
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