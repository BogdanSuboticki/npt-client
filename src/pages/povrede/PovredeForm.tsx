"use client";

import React, { useEffect, useRef } from "react";
import CustomDatePicker from "../../components/form/input/DatePicker";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";

interface PovredeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function PovredeForm({ isOpen, onClose, onSave }: PovredeFormProps) {
  const [formData, setFormData] = React.useState({
    zaposleni: "",
    datumPovrede: new Date(),
    datumObaveštavanjaInspekcije: new Date(),
    datumOtvaranjaListe: new Date(),
    datumOvereLekara: new Date(),
    datumPreuzimanjaIzFonda: new Date(),
    datumPredavanjaPoslodavcu: new Date(),
    tezinaPovrede: "",
    napomena: "",
  });

  // Add state for dropdowns
  const [isZaposleniOpen, setIsZaposleniOpen] = React.useState(false);
  const [isTezinaPovredeOpen, setIsTezinaPovredeOpen] = React.useState(false);
  const zaposleniRef = useRef<HTMLDivElement>(null);
  const tezinaPovredeRef = useRef<HTMLDivElement>(null);

  // Example options - replace with actual data
  const zaposleniOptions = ["Zaposleni 1", "Zaposleni 2", "Zaposleni 3"];
  const tezinaPovredeOptions = ["Laka", "Srednja", "Teška", "Smrtna", "Kolektivna"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdowns
      if (zaposleniRef.current && !zaposleniRef.current.contains(target)) {
        setIsZaposleniOpen(false);
      }
      if (tezinaPovredeRef.current && !tezinaPovredeRef.current.contains(target)) {
        setIsTezinaPovredeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zaposleni || !formData.datumPovrede || !formData.tezinaPovrede) {
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
      className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Nova Povreda</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="col-span-1">
            <Label>Zaposleni *</Label>
            <div className="relative w-full" ref={zaposleniRef}>
              <button
                type="button"
                onClick={() => setIsZaposleniOpen(!isZaposleniOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>{formData.zaposleni || "Izaberi zaposlenog"}</span>
                </div>
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
            <Label>Datum povrede *</Label>
            <CustomDatePicker
              value={formData.datumPovrede}
              onChange={(date) => {
                if (date) {
                  setFormData(prev => ({ ...prev, datumPovrede: date }));
                }
              }}
              required
            />
          </div>

          <div className="col-span-1">
            <Label>Datum obaveštavanja inspekcije</Label>
            <CustomDatePicker
              value={formData.datumObaveštavanjaInspekcije}
              onChange={(date) => {
                if (date) {
                  setFormData(prev => ({ ...prev, datumObaveštavanjaInspekcije: date }));
                }
              }}
            />
          </div>

          <div className="col-span-1">
            <Label>Datum otvaranja liste</Label>
            <CustomDatePicker
              value={formData.datumOtvaranjaListe}
              onChange={(date) => {
                if (date) {
                  setFormData(prev => ({ ...prev, datumOtvaranjaListe: date }));
                }
              }}
            />
          </div>

          <div className="col-span-1">
            <Label>Datum overe lekara</Label>
            <CustomDatePicker
              value={formData.datumOvereLekara}
              onChange={(date) => {
                if (date) {
                  setFormData(prev => ({ ...prev, datumOvereLekara: date }));
                }
              }}
            />
          </div>

          <div className="col-span-1">
            <Label>Datum preuzimanja iz fonda</Label>
            <CustomDatePicker
              value={formData.datumPreuzimanjaIzFonda}
              onChange={(date) => {
                if (date) {
                  setFormData(prev => ({ ...prev, datumPreuzimanjaIzFonda: date }));
                }
              }}
            />
          </div>

          <div className="col-span-1">
            <Label>Datum predavanja poslodavcu</Label>
            <CustomDatePicker
              value={formData.datumPredavanjaPoslodavcu}
              onChange={(date) => {
                if (date) {
                  setFormData(prev => ({ ...prev, datumPredavanjaPoslodavcu: date }));
                }
              }}
            />
          </div>

          <div className="col-span-1">
            <Label>Težina povrede *</Label>
            <div className="relative w-full" ref={tezinaPovredeRef}>
              <button
                type="button"
                onClick={() => setIsTezinaPovredeOpen(!isTezinaPovredeOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>{formData.tezinaPovrede || "Izaberi težinu povrede"}</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${isTezinaPovredeOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isTezinaPovredeOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {tezinaPovredeOptions.map((option: string, index: number) => (
                      <div
                        key={option}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.tezinaPovrede === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === tezinaPovredeOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, tezinaPovrede: option });
                          setIsTezinaPovredeOpen(false);
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
        </div>

        <div className="col-span-2 mt-4">
          <Label>Napomena</Label>
          <TextArea
            value={formData.napomena}
            onChange={(value) => setFormData({...formData, napomena: value})}
            placeholder="Unesite napomenu..."
            rows={3}
            className="bg-[#F9FAFB] dark:bg-[#101828]"
          />
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