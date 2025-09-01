"use client";

import React, { useEffect, useRef } from "react";
import CustomDatePicker from "../../components/form/input/DatePicker";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";

interface InspekcijskiNadzorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function InspekcijskiNadzorForm({ isOpen, onClose, onSave }: InspekcijskiNadzorFormProps) {
  const [formData, setFormData] = React.useState({
    brojResenja: "",
    datumNadzora: new Date(),
    napomena: "",
    mera: "",
    rokIzvrsenja: new Date(),
    datumRealizacije: null as Date | null,
    datumObavestavanja: null as Date | null,
  });

  // Dropdown state for "mera"
  const [isMeraOpen, setIsMeraOpen] = React.useState(false);
  const meraRef = useRef<HTMLDivElement>(null);
  const meraOptions = ["Sanacija opasnosti", "Obuka zaposlenih", "Zabrana rada"];

  useEffect(() => {
    // Ensure dates are Date objects
    setFormData((prev) => ({
      ...prev,
      datumNadzora: prev.datumNadzora ? new Date(prev.datumNadzora) : new Date(),
      rokIzvrsenja: prev.rokIzvrsenja ? new Date(prev.rokIzvrsenja) : new Date(),
    }));
  }, []);

  // Close mera dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (meraRef.current && !meraRef.current.contains(target)) {
        setIsMeraOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brojResenja || !formData.datumNadzora || !formData.mera || !formData.rokIzvrsenja) {
      alert('Molimo popunite obavezna polja (Broj rešenja, Datum nadzora, Mera, Rok izvršenja)');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] max-h-[90vh] dark:bg-[#11181E] overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 lg:p-10 pb-0">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Novi zapis - Inspekcijski nadzor</h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              <div className="w-full">
                <Label>Broj rešenja *</Label>
                <Input
                  type="text"
                  name="brojResenja"
                  value={formData.brojResenja}
                  onChange={(e) => setFormData({ ...formData, brojResenja: e.target.value })}
                  className="bg-[#F9FAFB] dark:bg-[#101828] w-full"
                  required
                />
              </div>

              <div className="w-full">
                <Label>Datum nadzora *</Label>
                <CustomDatePicker
                  value={formData.datumNadzora}
                  onChange={(date) => date && setFormData({ ...formData, datumNadzora: date })}
                  required
                />
              </div>

              <div className="w-full lg:col-span-2">
                <Label>Napomena</Label>
                <TextArea
                  value={formData.napomena}
                  onChange={(e: any) => setFormData({ ...formData, napomena: e.target.value })}
                  placeholder="Unesite napomenu"
                  className="bg-[#F9FAFB] dark:bg-[#101828] w-full"
                  rows={3}
                />
              </div>

              <div className="w-full">
                <Label>Naziv mere *</Label>
                <div className="relative w-full" ref={meraRef}>
                  <button
                    type="button"
                    onClick={() => setIsMeraOpen(!isMeraOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <span>{formData.mera || "Izaberi meru"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isMeraOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isMeraOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-[#11181E] dark:border-gray-700 max-h-60">
                      <div className="overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {meraOptions.map((option, index) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.mera === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === meraOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, mera: option });
                              setIsMeraOpen(false);
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
                <Label>Rok izvršenja *</Label>
                <CustomDatePicker
                  value={formData.rokIzvrsenja}
                  onChange={(date) => date && setFormData({ ...formData, rokIzvrsenja: date })}
                  required
                />
              </div>

              <div className="w-full">
                <Label>Datum realizacije mere</Label>
                <CustomDatePicker
                  value={formData.datumRealizacije}
                  onChange={(date) => setFormData({ ...formData, datumRealizacije: date })}
                />
              </div>

              <div className="w-full">
                <Label>Datum obaveštavanja inspekcije</Label>
                <CustomDatePicker
                  value={formData.datumObavestavanja}
                  onChange={(date) => setFormData({ ...formData, datumObavestavanja: date })}
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


