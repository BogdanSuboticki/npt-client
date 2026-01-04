"use client";

import React, { useEffect, useRef } from "react";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import CustomDatePicker from "../../components/form/input/DatePicker";
import Slider from "../../components/ui/Slider";
import { useUser } from "../../context/UserContext";

interface AngazovanjaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function AngazovanjaForm({ isOpen, onClose, onSave, initialData }: AngazovanjaFormProps) {
  const { userType } = useUser();
  const isAdmin = userType === 'admin';
  
  const [formData, setFormData] = React.useState({
    zaposleni: "",
    radnoMesto: "",
    lokacija: "",
    vrstaAngazovanja: "Redovno angažovanje",
    datumPocetka: new Date(),
    datumPrestanka: null as Date | null,
  });

  // State for creating new korisnik
  const [createKorisnik, setCreateKorisnik] = React.useState(false);
  const [korisnikData, setKorisnikData] = React.useState({
    email: "",
    sifra: "",
  });

  // Add state for dropdowns
  const [isZaposleniOpen, setIsZaposleniOpen] = React.useState(false);
  const [isRadnoMestoOpen, setIsRadnoMestoOpen] = React.useState(false);
  const [isLokacijaOpen, setIsLokacijaOpen] = React.useState(false);
  
  const zaposleniRef = useRef<HTMLDivElement>(null);
  const radnoMestoRef = useRef<HTMLDivElement>(null);
  const lokacijaRef = useRef<HTMLDivElement>(null);

  // Example options - replace with actual data from your tables
  const zaposleniOptions = ["Petar Petrović", "Ana Anić", "Marko Marković", "Jovan Jovanović"];
  const radnoMestoOptions = ["Inženjer bezbednosti", "Tehničar za radnu zaštitu", "Koordinator bezbednosti", "Inspektor rada"];
  const lokacijaOptions = ["Beograd", "Novi Sad", "Niš", "Kragujevac", "Subotica"];
  const vrstaAngazovanjaOptions = ["Redovno angažovanje", "Stručna praksa"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdowns
      if (zaposleniRef.current && !zaposleniRef.current.contains(target)) {
        setIsZaposleniOpen(false);
      }
      if (radnoMestoRef.current && !radnoMestoRef.current.contains(target)) {
        setIsRadnoMestoOpen(false);
      }
      if (lokacijaRef.current && !lokacijaRef.current.contains(target)) {
        setIsLokacijaOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Populate form with initialData when provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        zaposleni: initialData.imePrezime || "",
        radnoMesto: initialData.radnoMesto || "",
        lokacija: initialData.lokacija || "",
        vrstaAngazovanja: initialData.vrstaAngazovanja || "Redovno angažovanje",
        datumPocetka: initialData.pocetakAngazovanja ? new Date(initialData.pocetakAngazovanja) : new Date(),
        datumPrestanka: initialData.prestanakAngazovanja ? new Date(initialData.prestanakAngazovanja) : null,
      });
      setCreateKorisnik(false);
      setKorisnikData({ email: "", sifra: "" });
    } else {
      // Reset form when no initial data
      setFormData({
        zaposleni: "",
        radnoMesto: "",
        lokacija: "",
        vrstaAngazovanja: "Redovno angažovanje",
        datumPocetka: new Date(),
        datumPrestanka: null,
      });
      setCreateKorisnik(false);
      setKorisnikData({ email: "", sifra: "" });
    }
  }, [initialData]);

  const handleDateChange = (value: Date | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, datumPocetka: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.zaposleni || !formData.radnoMesto || !formData.lokacija || !formData.datumPocetka) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    
    // Additional validation when creating new korisnik user
    if (createKorisnik) {
      if (!korisnikData.email || !korisnikData.sifra) {
        alert('Molimo popunite email i šifru za kreiranje korisnika');
        return;
      }
    }
    
    const submitData = {
      ...formData,
      ...(createKorisnik ? { 
        createKorisnik: true,
        korisnikData: {
          email: korisnikData.email,
          sifra: korisnikData.sifra,
        },
      } : {}),
    };
    
    onSave(submitData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] max-h-[90vh] dark:bg-[#11181E] overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 lg:p-5 lg:pt-10 lg:pl-10 pb-0">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {initialData ? "Izmeni Angažovanje" : "Novo Angažovanje"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            <div className="grid grid-cols-1 gap-4 pb-4">
          {isAdmin && !initialData && (
            <div className="col-span-1">
              <Slider
                label="Kreiranje korisnika"
                optionOne="Kreiraj korisnika"
                optionTwo="Ne kreiraj korisnika"
                value={createKorisnik}
                onChange={(value) => {
                  setCreateKorisnik(value);
                  if (!value) {
                    setKorisnikData({ email: "", sifra: "" });
                  }
                }}
                size="full"
                name="slider-create-korisnik"
              />
            </div>
          )}

          <div className="col-span-1">
            <Label>Zaposleni *</Label>
            {initialData ? (
              <div className="w-full h-11 px-4 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 flex items-center">
                {formData.zaposleni}
              </div>
            ) : (
              <div className="relative w-full" ref={zaposleniRef}>
                <button
                  type="button"
                  onClick={() => setIsZaposleniOpen(!isZaposleniOpen)}
                  className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <span>{formData.zaposleni || "Izaberite zaposlenog"}</span>
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
                  <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-[#11181E] dark:border-gray-700">
                    <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                      {zaposleniOptions.map((option: string, index: number) => (
                        <div
                          key={option}
                          className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                            formData.zaposleni === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } ${index === zaposleniOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                          onClick={() => {
                            setFormData({ ...formData, zaposleni: option });
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
            )}
          </div>

          {createKorisnik && isAdmin && !initialData && (
            <>
              <div className="col-span-1">
                <Label>Email *</Label>
                <input
                  type="email"
                  value={korisnikData.email}
                  onChange={(e) => setKorisnikData({ ...korisnikData, email: e.target.value })}
                  className="w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Unesite email adresu"
                />
              </div>
              <div className="col-span-1">
                <Label>Šifra *</Label>
                <input
                  type="password"
                  value={korisnikData.sifra}
                  onChange={(e) => setKorisnikData({ ...korisnikData, sifra: e.target.value })}
                  className="w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Unesite šifru"
                />
              </div>
            </>
          )}

          <div className="col-span-1">
            <Label>Radno mesto *</Label>
            <div className="relative w-full" ref={radnoMestoRef}>
              <button
                type="button"
                onClick={() => setIsRadnoMestoOpen(!isRadnoMestoOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <span>{formData.radnoMesto || "Izaberite radno mesto"}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isRadnoMestoOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isRadnoMestoOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-[#11181E] dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {radnoMestoOptions.map((option: string, index: number) => (
                      <div
                        key={option}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.radnoMesto === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${index === radnoMestoOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, radnoMesto: option });
                          setIsRadnoMestoOpen(false);
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
            <Label>Lokacija *</Label>
            <div className="relative w-full" ref={lokacijaRef}>
              <button
                type="button"
                onClick={() => setIsLokacijaOpen(!isLokacijaOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <span>{formData.lokacija || "Izaberite lokaciju"}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isLokacijaOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLokacijaOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-[#11181E] dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {lokacijaOptions.map((option: string, index: number) => (
                      <div
                        key={option}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.lokacija === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${index === lokacijaOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, lokacija: option });
                          setIsLokacijaOpen(false);
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
            <Label>Vrsta angažovanja *</Label>
            <div className="flex items-center space-x-4">
              {vrstaAngazovanjaOptions.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="vrstaAngazovanja"
                    value={option}
                    checked={formData.vrstaAngazovanja === option}
                    onChange={(e) => setFormData({ ...formData, vrstaAngazovanja: e.target.value })}
                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-900 dark:border-gray-600 focus:outline-none"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="col-span-1">
            <Label>Datum početka angažovanja *</Label>
            <CustomDatePicker
              value={formData.datumPocetka}
              onChange={(newValue) => handleDateChange(newValue)}
            />
          </div>

          <div className="col-span-1">
            <Label>Datum prestanka angažovanja</Label>
            <CustomDatePicker
              value={formData.datumPrestanka}
              onChange={(newValue) => {
                setFormData(prev => ({ ...prev, datumPrestanka: newValue }));
              }}
            />
          </div>
          </div>
          </div>

          <div className="pb-5 pt-2 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 flex-shrink-0">
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
