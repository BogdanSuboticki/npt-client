import React from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";

interface IspitivanjeRadneSredineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function IspitivanjeRadneSredineForm({ isOpen, onClose, onSave }: IspitivanjeRadneSredineFormProps) {
  const [formData, setFormData] = React.useState({
    nazivLokacije: "",
    nazivObjekta: "",
    brojMernihJedinica: "",
    intervalIspitivanja: "",
    napomena: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] p-5 lg:p-8"
    >
      <h4 className="font-semibold text-gray-800 mb-4 text-xl dark:text-white/90">
        Ispitivanje radne sredine
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <Label>Naziv lokacije *</Label>
            <Input
              type="text"
              value={formData.nazivLokacije}
              onChange={(e) => setFormData(prev => ({ ...prev, nazivLokacije: e.target.value }))}
              required
            />
          </div>

          <div className="col-span-1">
            <Label>Naziv objekta *</Label>
            <Input
              type="text"
              value={formData.nazivObjekta}
              onChange={(e) => setFormData(prev => ({ ...prev, nazivObjekta: e.target.value }))}
              required
            />
          </div>

          <div className="col-span-1">
            <Label>Broj mernih jedinica *</Label>
            <Input
              type="text"
              value={formData.brojMernihJedinica}
              onChange={(e) => setFormData(prev => ({ ...prev, brojMernihJedinica: e.target.value }))}
              required
            />
          </div>

          <div className="col-span-1">
            <Label>Interval ispitivanja (meseci) *</Label>
            <Input
              type="number"
              value={formData.intervalIspitivanja}
              onChange={(e) => setFormData(prev => ({ ...prev, intervalIspitivanja: e.target.value }))}
              required
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

        <div className="mt-6 flex justify-end gap-2">
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