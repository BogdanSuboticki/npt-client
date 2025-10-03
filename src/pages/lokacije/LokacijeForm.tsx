"use client";

import React, { useState, useEffect } from "react";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";

interface LokacijeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function LokacijeForm({ isOpen, onClose, onSave, initialData }: LokacijeFormProps) {
  const [formData, setFormData] = useState({
    nazivLokacije: "",
    brojMernihMesta: "",
    organizacionaJedinica: "",
  });

  // Populate form with initialData when provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nazivLokacije: initialData.nazivLokacije || "",
        brojMernihMesta: initialData.brojMernihMesta?.toString() || "",
        organizacionaJedinica: initialData.organizacionaJedinica || "",
      });
    } else {
      // Reset form when no initial data
      setFormData({
        nazivLokacije: "",
        brojMernihMesta: "",
        organizacionaJedinica: "",
      });
    }
  }, [initialData]);
  




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nazivLokacije || !formData.brojMernihMesta || !formData.organizacionaJedinica) {
      alert("Molimo popunite sva obavezna polja");
      return;
    }

    // Validate that broj mernih mesta is not negative
    const brojMernihMesta = parseInt(formData.brojMernihMesta);
    if (brojMernihMesta < 0) {
      alert("Broj mernih mesta ne može biti negativan");
      return;
    }

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
    >
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
          {initialData ? "Izmeni Lokaciju" : "Nova Lokacija"}
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
              min="0"
              value={formData.brojMernihMesta}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (value >= 0) {
                  setFormData({ ...formData, brojMernihMesta: e.target.value });
                }
              }}
              className="bg-[#F9FAFB] dark:bg-[#101828]"
              required
            />
          </div>

          <div className="col-span-1">
            <Label>Organizaciona jedinica *</Label>
            <Input
              value={formData.organizacionaJedinica}
              onChange={(e) =>
                setFormData({ ...formData, organizacionaJedinica: e.target.value })
              }
              className="bg-[#F9FAFB] dark:bg-[#101828]"
              required
            />
          </div>
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