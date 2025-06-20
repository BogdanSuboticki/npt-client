"use client";

import React, { useState, useRef, useEffect } from "react";
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
  
  // Add state for dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          Nova Lokacija
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
            <div className="relative w-full" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>{formData.organizacionaJedinica || "Izaberite organizacionu jedinicu"}</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {organizacioneJedinice.map((jedinica, index) => (
                      <div
                        key={jedinica}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.organizacionaJedinica === jedinica ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${index === organizacioneJedinice.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, organizacionaJedinica: jedinica });
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{jedinica}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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