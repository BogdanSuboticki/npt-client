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
  onSave: (data: any) => void;
}

export default function InspekcijskiNadzorForm({ isOpen, onClose, onSave }: InspekcijskiNadzorFormProps) {
  const [formData, setFormData] = React.useState({
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


  useEffect(() => {
    // Ensure dates are Date objects
    setFormData((prev) => ({
      ...prev,
      datumNadzora: prev.datumNadzora ? new Date(prev.datumNadzora) : new Date(),
    }));
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brojResenja || !formData.datumNadzora) {
      alert('Molimo popunite sva obavezna polja (Broj rešenja, Datum nadzora)');
      return;
    }
    onSave(formData);
    onClose();
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
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Novi Inspekcijski Nadzor</h4>
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
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 min-w-[900px] w-full">
                      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_80px] gap-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                        <div className="bg-gray-50 dark:bg-gray-800 -mx-1 px-1">Naziv mere *</div>
                        <div className="bg-gray-50 dark:bg-gray-800 -mx-1 px-1">Rok izvršenja *</div>
                        <div className="bg-gray-50 dark:bg-gray-800 -mx-1 px-1">Datum realizacije mere</div>
                        <div className="bg-gray-50 dark:bg-gray-800 -mx-1 px-1">Datum obaveštavanja inspekcije</div>
                        <div className="bg-gray-50 dark:bg-gray-800 -mx-1 px-1">Akcija</div>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {formData.mere.map((mera) => (
                        <div key={mera.id} className="px-4 py-3">
                          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_80px] gap-4 min-w-[900px] items-start">
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


