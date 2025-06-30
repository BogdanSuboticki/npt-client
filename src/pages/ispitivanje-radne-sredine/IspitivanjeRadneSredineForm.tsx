import React from 'react';
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

          <div className="col-span-1">
            <Label>Napomena</Label>
            <Input
              type="text"
              value={formData.napomena}
              onChange={(e) => setFormData(prev => ({ ...prev, napomena: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Otkaži
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700"
          >
            Sačuvaj
          </button>
        </div>
      </form>
    </Modal>
  );
} 