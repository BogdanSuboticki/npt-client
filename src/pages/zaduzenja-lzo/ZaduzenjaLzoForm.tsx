"use client";

import React, { useEffect, useRef } from "react";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import DatePicker from "../../components/form/input/DatePicker";

interface ZaduzenjaLzoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function ZaduzenjaLzoForm({ isOpen, onClose, onSave }: ZaduzenjaLzoFormProps) {
  const [formData, setFormData] = React.useState({
    zaposleni: "",
    radnoMesto: "",
    povecanRizik: false,
    oprema: [] as Array<{
      id: number;
      vrstaLzs: string;
      standard: string;
      datumZaduzenja: Date | null;
      rok: string;
      narednoZaduzenje: Date | null;
    }>,
  });

  // Add state for dropdowns
  const [isZaposleniOpen, setIsZaposleniOpen] = React.useState(false);
  const zaposleniRef = useRef<HTMLDivElement>(null);

  // Employee data with their job positions and equipment
  const zaposleniData: Record<string, {
    radnoMesto: string;
    povecanRizik: boolean;
    oprema: Array<{
      id: number;
      vrstaLzs: string;
      standard: string;
      datumZaduzenja: Date | null;
      rok: string;
      narednoZaduzenje: Date | null;
    }>;
  }> = {
    "Petar Petrović": {
      radnoMesto: "Viljuškari",
      povecanRizik: true,
      oprema: [
        {
          id: 1,
          vrstaLzs: "Zaštitna kaciga",
          standard: "EN 397",
          datumZaduzenja: null,
          rok: "24",
          narednoZaduzenje: null
        },
        {
          id: 2,
          vrstaLzs: "Zaštitne rukavice",
          standard: "EN 388",
          datumZaduzenja: null,
          rok: "6",
          narednoZaduzenje: null
        },
        {
          id: 3,
          vrstaLzs: "Sigurnosne obuće",
          standard: "EN ISO 20345",
          datumZaduzenja: null,
          rok: "12",
          narednoZaduzenje: null
        }
      ]
    },
    "Ana Anić": {
      radnoMesto: "Kranista",
      povecanRizik: true,
      oprema: [
        {
          id: 1,
          vrstaLzs: "Zaštitna kaciga",
          standard: "EN 397",
          datumZaduzenja: null,
          rok: "24",
          narednoZaduzenje: null
        },
        {
          id: 2,
          vrstaLzs: "Zaštitne rukavice",
          standard: "EN 388",
          datumZaduzenja: null,
          rok: "6",
          narednoZaduzenje: null
        },
        {
          id: 3,
          vrstaLzs: "Sigurnosna obuća",
          standard: "EN ISO 20345",
          datumZaduzenja: null,
          rok: "12",
          narednoZaduzenje: null
        },
        {
          id: 4,
          vrstaLzs: "Zaštitni pojas",
          standard: "EN 361",
          datumZaduzenja: null,
          rok: "36",
          narednoZaduzenje: null
        }
      ]
    },
    "Marko Marković": {
      radnoMesto: "Mehaničar",
      povecanRizik: false,
      oprema: [
        {
          id: 1,
          vrstaLzs: "Zaštitna kaciga",
          standard: "EN 397",
          datumZaduzenja: null,
          rok: "24",
          narednoZaduzenje: null
        },
        {
          id: 2,
          vrstaLzs: "Zaštitne rukavice",
          standard: "EN 388",
          datumZaduzenja: null,
          rok: "6",
          narednoZaduzenje: null
        },
        {
          id: 3,
          vrstaLzs: "Sigurnosna obuća",
          standard: "EN ISO 20345",
          datumZaduzenja: null,
          rok: "12",
          narednoZaduzenje: null
        },
        {
          id: 4,
          vrstaLzs: "Zaštitne naočare",
          standard: "EN 166",
          datumZaduzenja: null,
          rok: "24",
          narednoZaduzenje: null
        },
        {
          id: 5,
          vrstaLzs: "Zaštitna odela",
          standard: "EN 11612",
          datumZaduzenja: null,
          rok: "24",
          narednoZaduzenje: null
        }
      ]
    }
  };

  const zaposleniOptions = Object.keys(zaposleniData);

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdowns
      if (zaposleniRef.current && !zaposleniRef.current.contains(target)) {
        setIsZaposleniOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zaposleni || !formData.radnoMesto) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    onSave(formData);
    onClose();
  };




  const handleOpremaChange = (id: number, field: string, value: string | Date | null) => {
    setFormData(prevData => {
      const updatedOprema = prevData.oprema.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Auto-calculate naredno zaduzenje when datum zaduzenja or rok changes
          if (field === 'datumZaduzenja' || field === 'rok') {
            if (updatedItem.datumZaduzenja && updatedItem.rok) {
              const datumZaduzenja = new Date(updatedItem.datumZaduzenja);
              const rokMonths = parseInt(updatedItem.rok) || 0;
              const narednoZaduzenje = new Date(datumZaduzenja);
              narednoZaduzenje.setMonth(narednoZaduzenje.getMonth() + rokMonths);
              updatedItem.narednoZaduzenje = narednoZaduzenje;
            } else {
              updatedItem.narednoZaduzenje = null;
            }
          }
          
          return updatedItem;
        }
        return item;
      });
      
      return {
        ...prevData,
        oprema: updatedOprema
      };
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[1200px] w-full mx-4 p-4 lg:p-10 dark:bg-gray-800"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Novo Zaduženje LZS</h2>
      <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="col-span-1">
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
                    {zaposleniOptions.map((option: string, index: number) => (
                      <div
                        key={option}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.zaposleni === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${index === zaposleniOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          const selectedEmployeeData = zaposleniData[option];
                          setFormData({
                            ...formData,
                            zaposleni: option,
                            radnoMesto: selectedEmployeeData.radnoMesto,
                            povecanRizik: selectedEmployeeData.povecanRizik,
                            oprema: selectedEmployeeData.oprema.map((item, index) => ({
                              ...item,
                              id: Date.now() + index // Generate new IDs to avoid conflicts
                            }))
                          });
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
            <div className="flex items-center gap-2">
              <Label>Radno mesto</Label>
              {formData.radnoMesto && (
                <span className={`text-sm font-medium ${
                  formData.povecanRizik 
                    ? 'text-red-600 dark:text-red-400 mb-1.5' 
                    : 'text-blue-600 dark:text-blue-400 mb-1.5'
                }`}>
                  {formData.povecanRizik ? 'Povećan rizik' : 'Nije povećan rizik'}
                </span>
              )}
            </div>
            <div className="relative w-full">
              <input
                type="text"
                value={formData.radnoMesto || ""}
                placeholder="Izaberite zaposlenog"
                readOnly
                className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <Label>Oprema</Label>
            </div>
            
            {formData.oprema.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700 overflow-x-auto">
                {/* Header */}
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                                     <div className="grid grid-cols-5 gap-4 text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[800px]">
                     <div>Naziv LZS *</div>
                     <div>Standard</div>
                     <div>Datum zaduženja *</div>
                     <div>Rok (m) *</div>
                     <div>Naredno zaduženje</div>
                   </div>
                </div>
                
                                 <div className="divide-y divide-gray-200 dark:divide-gray-700">
                   {formData.oprema.map((item) => (
                     <div key={item.id} className="px-4 py-3">
                                               <div className="grid grid-cols-5 gap-4 min-w-[800px] items-start">
                         {/* Naziv LZS */}
                         <div>
                           <input
                             type="text"
                             value={item.vrstaLzs}
                             readOnly
                             className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                           />
                         </div>
                       
                        {/* Standard */}
                        <div>
                          <input
                            type="text"
                            value={item.standard}
                            readOnly
                            className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                          />
                        </div>
                       
                       
                                                                                                   {/* Datum zaduženja */}
                          <div>
                            <DatePicker
                              value={item.datumZaduzenja}
                              onChange={(date) => handleOpremaChange(item.id, 'datumZaduzenja', date)}
                              placeholder="Izaberi datum"
                              className="h-11 text-sm"
                              minDate={new Date()}
                            />
                          </div>
                       
                        {/* Rok */}
                        <div>
                          <input
                            type="number"
                            value={item.rok}
                            onChange={(e) => handleOpremaChange(item.id, 'rok', e.target.value)}
                            min="1"
                            className="w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                        </div>
                       
                        {/* Naredno zaduženje */}
                        <div>
                          <DatePicker
                            value={item.narednoZaduzenje}
                            onChange={() => {}} // No-op function since it's disabled
                            placeholder=""
                            disabled={true}
                            className="h-11 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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