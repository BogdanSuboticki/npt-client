"use client";

import React, { useEffect, useRef } from "react";
import CustomDatePicker from "../../components/form/input/DatePicker";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { api } from "../../api/client";
import { usePageContext } from "../../hooks/usePageContext";

interface PovredeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
  initialData?: any;
}

export default function PovredeForm({ isOpen, onClose, onSave, initialData }: PovredeFormProps) {
  const context = usePageContext();
  const [formData, setFormData] = React.useState({
    zaposleni: "",
    datumPovrede: new Date(),
    tezinaPovrede: "",
    brojPovredneListe: "",
    datumObavestenjaInspekcije: null as Date | null,
    datumPredajeFondu: null as Date | null,
    datumPreuzimanjaIzFonda: null as Date | null,
    datumDostavjanjaUpravi: null as Date | null,
    napomena: "",
    angazovanjeId: "",
    firmaPib: "",
  });

  const [angazovanjaList, setAngazovanjaList] = React.useState<any[]>([]);

  const [brojListeNumber, setBrojListeNumber] = React.useState("");
  const currentYear = new Date().getFullYear();

  // Update brojPovredneListe when number changes
  useEffect(() => {
    if (brojListeNumber) {
      setFormData(prev => ({
        ...prev,
        brojPovredneListe: `PL-${brojListeNumber}/${currentYear}`
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        brojPovredneListe: ""
      }));
    }
  }, [brojListeNumber, currentYear]);

  // Add state for dropdowns
  const [isZaposleniOpen, setIsZaposleniOpen] = React.useState(false);
  const [isTezinaPovredeOpen, setIsTezinaPovredeOpen] = React.useState(false);
  const zaposleniRef = useRef<HTMLDivElement>(null);
  const tezinaPovredeRef = useRef<HTMLDivElement>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.get<{ data: any[] }>(`angazovanja?context=${context}`)
        .then(res => setAngazovanjaList(res.data))
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        zaposleni: initialData.zaposleni ?? "",
        datumPovrede: initialData.datumPovrede ?? new Date(),
        tezinaPovrede: initialData.tezinaPovrede ?? "",
        brojPovredneListe: initialData.brojPovredneListe ?? "",
        datumObavestenjaInspekcije: initialData.datumObavestenjaInspekcije ?? null,
        datumPredajeFondu: initialData.datumPredajeFondu ?? null,
        datumPreuzimanjaIzFonda: initialData.datumPreuzimanjaIzFonda ?? null,
        datumDostavjanjaUpravi: initialData.datumDostavjanjaUpravi ?? null,
        napomena: initialData.napomena ?? "",
        angazovanjeId: initialData.angazovanjeId ?? "",
        firmaPib: initialData.firmaPib ?? "",
      });
      const match = initialData.brojPovredneListe?.match(/^PL-(\d+)\//);
      if (match) setBrojListeNumber(match[1]);
    }
  }, [isOpen, initialData]);

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

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        zaposleni: "",
        datumPovrede: new Date(),
        tezinaPovrede: "",
        brojPovredneListe: "",
        datumObavestenjaInspekcije: null,
        datumPredajeFondu: null,
        datumPreuzimanjaIzFonda: null,
        datumDostavjanjaUpravi: null,
        napomena: "",
        angazovanjeId: "",
        firmaPib: "",
      });
      setBrojListeNumber("");
      setFormError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zaposleni || !formData.datumPovrede || !formData.tezinaPovrede) {
      setFormError('Molimo popunite sva obavezna polja');
      return;
    }
    try {
      await onSave(formData);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Greška pri čuvanju.');
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
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white">Nova Povreda</h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-sm text-red-600 dark:text-red-400">
                {formError}
              </div>
            )}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 pb-4">
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
                    {angazovanjaList.map((item: any, index: number) => (
                      <div
                        key={item.id}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.angazovanjeId === item.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === angazovanjaList.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, zaposleni: item.zaposleni?.ime_prezime, angazovanjeId: item.id, firmaPib: item.firma_pib });
                          setIsZaposleniOpen(false);
                        }}
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.zaposleni?.ime_prezime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>


          <div className="w-full">
            <Label>Težina povrede *</Label>
            <div className="relative w-full" ref={tezinaPovredeRef}>
              <button
                type="button"
                onClick={() => setIsTezinaPovredeOpen(!isTezinaPovredeOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <span>{formData.tezinaPovrede || "Izaberi težinu povrede"}</span>
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

          <div className="w-full">
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

          <div className="w-full">
            <Label>Broj povredne liste</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-800 dark:text-white/90 font-medium">PL-</span>
              <input
                type="number"
                value={brojListeNumber}
                onChange={(e) => setBrojListeNumber(e.target.value)}
                className="flex-1 h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="001"
                min="1"
              />
              <span className="text-sm text-gray-800 dark:text-white/90 font-medium">/{currentYear}</span>
            </div>
          </div>

          <div className="w-full">
            <Label>Datum obaveštenja inspekcije</Label>
            <CustomDatePicker
              value={formData.datumObavestenjaInspekcije}
              onChange={(date) => {
                setFormData(prev => ({ ...prev, datumObavestenjaInspekcije: date || null }));
              }}
            />
          </div>

          <div className="w-full">
            <Label>Datum predaje fondu</Label>
            <CustomDatePicker
              value={formData.datumPredajeFondu}
              onChange={(date) => {
                setFormData(prev => ({ ...prev, datumPredajeFondu: date || null }));
              }}
            />
          </div>

          <div className="w-full">
            <Label>Datum preuzimanja iz fonda</Label>
            <CustomDatePicker
              value={formData.datumPreuzimanjaIzFonda}
              onChange={(date) => {
                setFormData(prev => ({ ...prev, datumPreuzimanjaIzFonda: date || null }));
              }}
            />
          </div>

          <div className="w-full">
            <Label>Datum dostavljanja upravi</Label>
            <CustomDatePicker
              value={formData.datumDostavjanjaUpravi}
              onChange={(date) => {
                setFormData(prev => ({ ...prev, datumDostavjanjaUpravi: date || null }));
              }}
            />
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