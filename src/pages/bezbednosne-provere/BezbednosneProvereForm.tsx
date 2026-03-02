"use client";

import React, { useEffect, useMemo } from "react";
import CustomDatePicker from "../../components/form/input/DatePicker";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";

interface BezbednosneProvereFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
  firme: Array<{ pib: string; naziv: string }>;
  lokacije: Array<{ id: number; naziv: string; firma_pib: string }>;
}

export default function BezbednosneProvereForm({ isOpen, onClose, onSave, firme, lokacije }: BezbednosneProvereFormProps) {
  const [formData, setFormData] = React.useState({
    firmaPib: "",
    lokacijaId: "",
    datumProvere: new Date(),
    periodProvere: "",
    sledecaProvera: new Date(),
    napomena: "",
  });
  const [formError, setFormError] = React.useState<string | null>(null);

  const filteredLokacije = useMemo(
    () => lokacije.filter((l) => l.firma_pib === formData.firmaPib),
    [lokacije, formData.firmaPib]
  );

  useEffect(() => {
    if (formData.periodProvere && formData.datumProvere) {
      const days = parseInt(formData.periodProvere);
      if (days >= 1) {
        const nextDate = new Date(formData.datumProvere);
        nextDate.setDate(nextDate.getDate() + days);
        setFormData(prev => ({ ...prev, sledecaProvera: nextDate }));
      }
    }
  }, [formData.datumProvere, formData.periodProvere]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.firmaPib || !formData.lokacijaId || !formData.datumProvere || !formData.periodProvere) {
      setFormError("Molimo popunite sva obavezna polja");
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Greška pri čuvanju provere.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Nova Kontrola Radnih Mesta</h2>
      <form onSubmit={handleSubmit}>
        {formError && (
          <div className="mb-4 rounded-lg bg-error-50 p-3 text-sm text-error-500 dark:bg-error-500/10">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="col-span-1">
            <Label>Firma *</Label>
            <select
              value={formData.firmaPib}
              onChange={(e) => setFormData({ ...formData, firmaPib: e.target.value, lokacijaId: "" })}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-[#F9FAFB] px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
              required
            >
              <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                Izaberite firmu
              </option>
              {firme.map((f) => (
                <option key={f.pib} value={f.pib} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  {f.naziv} ({f.pib})
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <Label>Lokacija *</Label>
            <select
              value={formData.lokacijaId}
              onChange={(e) => setFormData({ ...formData, lokacijaId: e.target.value })}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-[#F9FAFB] px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
              required
              disabled={!formData.firmaPib}
            >
              <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                {formData.firmaPib ? "Izaberite lokaciju" : "Prvo izaberite firmu"}
              </option>
              {filteredLokacije.map((l) => (
                <option key={l.id} value={l.id} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  {l.naziv}
                </option>
              ))}
            </select>
          </div>



          <div className="col-span-1">
            <Label>Interval kontrole (u danima) *</Label>
            <div className="relative w-full">
              <input
                type="number"
                value={formData.periodProvere}
                onChange={(e) => setFormData({ ...formData, periodProvere: e.target.value })}
                placeholder="Unesite broj dana"
                min="1"
                className="w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
              />
            </div>
          </div>


          <div className="col-span-1">
            <Label>Datum kontrole *</Label>
            <CustomDatePicker
              value={formData.datumProvere}
              onChange={(date) => {
                if (date) {
                  setFormData(prev => ({ ...prev, datumProvere: date }));
                }
              }}
              required
            />
          </div>

          <div className="col-span-1">
            <Label>Naredna kontrola</Label>
            <div className="relative w-full">
              <input
                type="text"
                value={formData.sledecaProvera ? formData.sledecaProvera.toLocaleDateString('sr-RS') : ''}
                placeholder="Izaberite datum kontrole"
                readOnly
                className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 dark:text-gray-400">
                  <path d="M18 2V4M6 2V4M11.996 13H12.004M11.996 17H12.004M15.991 13H16M8 13H8.009M8 17H8.009M3.5 8H20.5M3 8H21M2.5 12.243C2.5 7.886 2.5 5.707 3.752 4.353C5.004 3 7.02 3 11.05 3H12.95C16.98 3 18.996 3 20.248 4.354C21.5 5.707 21.5 7.886 21.5 12.244V12.757C21.5 17.114 21.5 19.293 20.248 20.647C18.996 22 16.98 22 12.95 22H11.05C7.02 22 5.004 22 3.752 20.646C2.5 19.293 2.5 17.114 2.5 12.756V12.243Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 mt-4">
                <Label>Napomena</Label>
                <textarea
                  value={formData.napomena}
                  onChange={(e) => setFormData({...formData, napomena: e.target.value})}
                  className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 px-5 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
                  rows={4}
                />
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