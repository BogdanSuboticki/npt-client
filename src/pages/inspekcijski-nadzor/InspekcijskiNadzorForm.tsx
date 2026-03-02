"use client";

import React, { useEffect } from "react";
import CustomDatePicker from "../../components/form/input/DatePicker";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { DeleteButtonIcon } from "../../icons";

interface InspekcijskiNadzorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
  initialData?: any;
  firme: Array<{ pib: string; naziv: string }>;
}

export default function InspekcijskiNadzorForm({ isOpen, onClose, onSave, initialData, firme }: InspekcijskiNadzorFormProps) {
  const [formData, setFormData] = React.useState({
    firmaPib: "",
    brojResenja: "",
    datumNadzora: new Date(),
    napomena: "",
    mere: [] as Array<{
      id: number;
      nazivMere: string;
      rokIzvrsenja: Date | null;
      datumRealizacije: Date | null;
      datumObavestavanja: Date | null;
    }>,
  });

  const [formError, setFormError] = React.useState("");
  const [isFirmaOpen, setIsFirmaOpen] = React.useState(false);
  const firmaRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (firmaRef.current && !firmaRef.current.contains(event.target as HTMLElement)) {
        setIsFirmaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormError("");
      if (initialData) {
        setFormData({
          firmaPib: initialData.firmaPib || "",
          brojResenja: initialData.brojResenja || "",
          datumNadzora: initialData.datumNadzora ? new Date(initialData.datumNadzora) : new Date(),
          napomena: initialData.napomena || "",
          mere: initialData.mere || [],
        });
      } else {
        setFormData({
          firmaPib: "",
          brojResenja: "",
          datumNadzora: new Date(),
          napomena: "",
          mere: [],
        });
      }
    }
  }, [initialData, isOpen]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firmaPib || !formData.brojResenja || !formData.datumNadzora) {
      setFormError('Molimo popunite sva obavezna polja (Firma, Broj rešenja, Datum nadzora)');
      return;
    }
    try {
      await onSave(formData);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Greška pri čuvanju.");
    }
  };

  const addMera = () => {
    const newMera = {
      id: Date.now(),
      nazivMere: "",
      rokIzvrsenja: null as Date | null,
      datumRealizacije: null as Date | null,
      datumObavestavanja: null as Date | null,
    };
    setFormData(prev => ({
      ...prev,
      mere: [...prev.mere, newMera]
    }));
  };

  const removeMera = (id: number) => {
    setFormData(prev => ({
      ...prev,
      mere: prev.mere.filter(mera => mera.id !== id)
    }));
  };

  const handleMeraChange = (id: number, field: string, value: string | Date | null) => {
    setFormData(prevData => {
      const updatedMere = prevData.mere.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      
      return {
        ...prevData,
        mere: updatedMere
      };
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] max-h-[90vh] dark:bg-[#11181E] overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 lg:p-10 pb-0">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">{initialData ? "Izmeni Inspekcijski Nadzor" : "Novi Inspekcijski Nadzor"}</h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-sm text-red-600 dark:text-red-400">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              <div className="w-full">
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
                    <svg className={`w-4 h-4 transition-transform ${isFirmaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isFirmaOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto">
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

              <div className="w-full lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <Label>Mere</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addMera}
                    className="text-sm"
                  >
                    + Dodaj meru
                  </Button>
                </div>
                
                {formData.mere.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700 overflow-x-auto">
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-gray-800 px-2 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 !w-full">
                      <div className="grid grid-cols-[180px_160px_160px_160px_60px] gap-3 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                        <div>Naziv mere *</div>
                        <div>Rok izvršenja *</div>
                        <div>Datum realizacije mere</div>
                        <div>Datum obaveštavanja inspekcije</div>
                        <div className="text-center"></div>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {formData.mere.map((mera) => (
                        <div key={mera.id} className="px-2 py-3">
                          <div className="grid grid-cols-[180px_160px_160px_160px_60px] gap-3 min-w-[700px] items-start">
                            {/* Naziv mere */}
                            <div className="w-full">
                              <Input
                                type="text"
                                value={mera.nazivMere}
                                onChange={(e) => handleMeraChange(mera.id, 'nazivMere', e.target.value)}
                                placeholder="Unesite naziv mere"
                                className="h-11 text-sm w-full"
                                required
                              />
                            </div>
                          
                            {/* Rok izvršenja */}
                            <div className="w-full">
                              <CustomDatePicker
                                value={mera.rokIzvrsenja}
                                onChange={(date) => handleMeraChange(mera.id, 'rokIzvrsenja', date)}
                                placeholder="Izaberi datum"
                                className="h-11 text-sm w-full"
                                required
                              />
                            </div>
                          
                            {/* Datum realizacije mere */}
                            <div className="w-full">
                              <CustomDatePicker
                                value={mera.datumRealizacije}
                                onChange={(date) => handleMeraChange(mera.id, 'datumRealizacije', date)}
                                placeholder="Izaberi datum"
                                className="h-11 text-sm w-full"
                              />
                            </div>
                          
                            {/* Datum obaveštavanja inspekcije */}
                            <div className="w-full">
                              <CustomDatePicker
                                value={mera.datumObavestavanja}
                                onChange={(date) => handleMeraChange(mera.id, 'datumObavestavanja', date)}
                                placeholder="Izaberi datum"
                                className="h-11 text-sm w-full"
                              />
                            </div>
                          
                            {/* Delete button */}
                            <div className="flex items-center justify-center h-11">
                              <button
                                type="button"
                                onClick={() => removeMera(mera.id)}
                                className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                                title="Obriši meru"
                              >
                                <DeleteButtonIcon className="size-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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


