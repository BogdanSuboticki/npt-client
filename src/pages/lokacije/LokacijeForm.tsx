"use client";

import React, { useState } from "react";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";
import Label from "../../components/form/Label";

interface LokacijeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

// Sample organizational units
const organizacioneJedinice = [
  "Proizvodnja",
  "Logistika",
  "Održavanje",
  "Kvalitet",
  "Administracija",
];

export default function LokacijeForm({ isOpen, onClose, onSave }: LokacijeFormProps) {
  const [formData, setFormData] = useState({
    nazivLokacije: "",
    brojMernihMesta: "",
    organizacionaJedinica: "",
    iskljucenaIzPracenja: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nazivLokacije || !formData.brojMernihMesta || !formData.organizacionaJedinica) {
      alert("Molimo popunite sva obavezna polja");
      return;
    }

    onSave(formData);
    setFormData({
      nazivLokacije: "",
      brojMernihMesta: "",
      organizacionaJedinica: "",
      iskljucenaIzPracenja: false,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
    >
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Nova lokacija
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label>Naziv lokacije *</Label>
            <Input
              value={formData.nazivLokacije}
              onChange={(e) =>
                setFormData({ ...formData, nazivLokacije: e.target.value })
              }
              className="bg-[#F9FAFB] dark:bg-[#101828]"
              required
            />
          </div>

          <div className="col-span-1">
            <Label>Broj mernih mesta *</Label>
            <Input
              type="number"
              value={formData.brojMernihMesta}
              onChange={(e) =>
                setFormData({ ...formData, brojMernihMesta: e.target.value })
              }
              className="bg-[#F9FAFB] dark:bg-[#101828]"
              required
            />
          </div>

          <div className="col-span-1">
            <Label>Organizaciona jedinica *</Label>
            <select
              value={formData.organizacionaJedinica}
              onChange={(e) =>
                setFormData({ ...formData, organizacionaJedinica: e.target.value })
              }
              className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 px-5 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
              required
            >
              <option value="">Izaberite organizacionu jedinicu</option>
              {organizacioneJedinice.map((jedinica) => (
                <option key={jedinica} value={jedinica}>
                  {jedinica}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <Label>Isključiti iz praćenja</Label>
            <div className="mt-2">
              <Checkbox
                checked={formData.iskljucenaIzPracenja}
                onChange={(checked) =>
                  setFormData({ ...formData, iskljucenaIzPracenja: checked })
                }
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