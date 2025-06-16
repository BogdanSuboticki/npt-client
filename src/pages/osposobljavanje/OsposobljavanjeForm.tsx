import React from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "../../components/form/input/Checkbox";

interface OsposobljavanjeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function OsposobljavanjeForm({ isOpen, onClose, onSave }: OsposobljavanjeFormProps) {
  const [formData, setFormData] = React.useState({
    zaposleni: "",
    radnoMesto: "",
    lokacija: "",
    povecanRizik: false,
    osposobljavanjeBZR: new Date(),
    datumNarednogBZR: new Date(),
    osposobljavanjeZOP: new Date(),
    datumNarednogZOP: new Date(),
    prikaziUPodsetniku: false,
    bzrOdradjeno: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zaposleni || !formData.radnoMesto || !formData.lokacija) {
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
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Novo Osposobljavanje
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label>Zaposleni *</Label>
            <Input 
              type="text" 
              value={formData.zaposleni}
              onChange={(e) => setFormData({...formData, zaposleni: e.target.value})}
              className="bg-[#F9FAFB] dark:bg-[#101828]"
            />
          </div>

          <div className="col-span-1">
            <Label>Radno Mesto *</Label>
            <Input 
              type="text" 
              value={formData.radnoMesto}
              onChange={(e) => setFormData({...formData, radnoMesto: e.target.value})}
              className="bg-[#F9FAFB] dark:bg-[#101828]"
            />
          </div>

          <div className="col-span-1">
            <Label>Osposobljavanje BZR</Label>
            <DatePicker
              selected={formData.osposobljavanjeBZR}
              onChange={(date) => date && setFormData({...formData, osposobljavanjeBZR: date})}
              className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 px-5 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
              dateFormat="dd.MM.yyyy"
              required
              customInput={
                <input
                  className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 pl-5 pr-8 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1rem'
                  }}
                />
              }
            />
          </div>

          <div className="col-span-1">
            <Label>Datum Narednog BZR</Label>
            <DatePicker
              selected={formData.datumNarednogBZR}
              onChange={(date) => date && setFormData({...formData, datumNarednogBZR: date})}
              className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 px-5 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
              dateFormat="dd.MM.yyyy"
              required
              customInput={
                <input
                  className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 pl-5 pr-8 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1rem'
                  }}
                />
              }
            />
          </div>

          <div className="col-span-1">
            <Label>Osposobljavanje ZOP</Label>
            <DatePicker
              selected={formData.osposobljavanjeZOP}
              onChange={(date) => date && setFormData({...formData, osposobljavanjeZOP: date})}
              className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 px-5 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
              dateFormat="dd.MM.yyyy"
              required
              customInput={
                <input
                  className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 pl-5 pr-8 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1rem'
                  }}
                />
              }
            />
          </div>

          <div className="col-span-1">
            <Label>Datum Narednog ZOP</Label>
            <DatePicker
              selected={formData.datumNarednogZOP}
              onChange={(date) => date && setFormData({...formData, datumNarednogZOP: date})}
              className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 px-5 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
              dateFormat="dd.MM.yyyy"
              required
              customInput={
                <input
                  className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 pl-5 pr-8 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1rem'
                  }}
                />
              }
            />
          </div>

          <div className="col-span-1">
            <Label>Povećani Rizik</Label>
            <div className="mt-2">
              <Checkbox
                checked={formData.povecanRizik}
                onChange={(checked) => setFormData({...formData, povecanRizik: checked})}
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose}>
            Otkaži
          </Button>
          <Button size="sm" onClick={() => handleSubmit(new Event('submit') as any)}>
            Sačuvaj
          </Button>
        </div>
      </form>
    </Modal>
  );
}
