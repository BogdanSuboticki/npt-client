"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import CustomDatePicker from "../../components/form/input/DatePicker";
import Slider from "../../components/ui/Slider";
import { useUser } from "../../context/UserContext";

interface AngazovanjaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
  initialData?: any;
  fromAdminDashboard?: boolean;
  zaposleniList?: Array<{ id: number; ime_prezime: string; firma_pib: string }>;
  radnaMestaList?: Array<{ id: number; naziv: string; firma_pib: string; lokacija_id: number }>;
  lokacijeList?: Array<{ id: number; naziv: string; firma_pib: string }>;
}

export default function AngazovanjaForm({ isOpen, onClose, onSave, initialData, fromAdminDashboard = false, zaposleniList = [], radnaMestaList = [], lokacijeList = [] }: AngazovanjaFormProps) {
  const { userType } = useUser();
  const isAdmin = userType === 'admin';
  
  const [formData, setFormData] = React.useState({
    zaposleniId: "",
    zaposleniLabel: "",
    radnoMestoId: "",
    radnoMestoLabel: "",
    lokacijaId: "",
    lokacijaLabel: "",
    firmaPib: "",
    vrstaAngazovanja: "Redovno angažovanje",
    datumPocetka: new Date(),
    datumPrestanka: null as Date | null,
  });

  const [createKorisnik, setCreateKorisnik] = React.useState(fromAdminDashboard);
  const [korisnikData, setKorisnikData] = React.useState({
    email: "",
    sifra: "",
  });
  const [formError, setFormError] = React.useState<string | null>(null);

  const [isZaposleniOpen, setIsZaposleniOpen] = React.useState(false);
  const [isRadnoMestoOpen, setIsRadnoMestoOpen] = React.useState(false);
  const [isLokacijaOpen, setIsLokacijaOpen] = React.useState(false);
  
  const zaposleniRef = useRef<HTMLDivElement>(null);
  const radnoMestoRef = useRef<HTMLDivElement>(null);
  const lokacijaRef = useRef<HTMLDivElement>(null);

  const vrstaAngazovanjaOptions = ["Redovno angažovanje", "Stručna praksa"];

  const firmaPib = useMemo(() => {
    if (formData.zaposleniId) {
      const z = zaposleniList.find(z => z.id === Number(formData.zaposleniId));
      return z?.firma_pib ?? "";
    }
    return "";
  }, [formData.zaposleniId, zaposleniList]);

  const filteredRadnaMesta = useMemo(() => {
    if (!firmaPib) return [];
    return radnaMestaList.filter(rm => rm.firma_pib === firmaPib);
  }, [firmaPib, radnaMestaList]);

  const filteredLokacije = useMemo(() => {
    if (!firmaPib) return [];
    return lokacijeList.filter(l => l.firma_pib === firmaPib);
  }, [firmaPib, lokacijeList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (zaposleniRef.current && !zaposleniRef.current.contains(target)) setIsZaposleniOpen(false);
      if (radnoMestoRef.current && !radnoMestoRef.current.contains(target)) setIsRadnoMestoOpen(false);
      if (lokacijaRef.current && !lokacijaRef.current.contains(target)) setIsLokacijaOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setFormError(null);
    
    if (initialData) {
      setFormData({
        zaposleniId: initialData.zaposleniId?.toString() ?? "",
        zaposleniLabel: initialData.imePrezime || "",
        radnoMestoId: initialData.radnoMestoId?.toString() ?? "",
        radnoMestoLabel: initialData.radnoMesto || "",
        lokacijaId: initialData.lokacijaId?.toString() ?? "",
        lokacijaLabel: initialData.lokacija || "",
        firmaPib: initialData.firmaPib || "",
        vrstaAngazovanja: initialData.vrstaAngazovanja || "Redovno angažovanje",
        datumPocetka: initialData.pocetakAngazovanja ? new Date(initialData.pocetakAngazovanja) : new Date(),
        datumPrestanka: initialData.prestanakAngazovanja ? new Date(initialData.prestanakAngazovanja) : null,
      });
      setCreateKorisnik(fromAdminDashboard);
      setKorisnikData({ email: "", sifra: "" });
    } else {
      setFormData({
        zaposleniId: "",
        zaposleniLabel: "",
        radnoMestoId: "",
        radnoMestoLabel: "",
        lokacijaId: "",
        lokacijaLabel: "",
        firmaPib: "",
        vrstaAngazovanja: "Redovno angažovanje",
        datumPocetka: new Date(),
        datumPrestanka: null,
      });
      setCreateKorisnik(fromAdminDashboard);
      setKorisnikData({ email: "", sifra: "" });
    }
  }, [initialData, fromAdminDashboard, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.zaposleniId || !formData.radnoMestoId || !formData.lokacijaId || !formData.datumPocetka) {
      setFormError('Molimo popunite sva obavezna polja');
      return;
    }
    
    if (createKorisnik || fromAdminDashboard) {
      if (!korisnikData.email || !korisnikData.sifra) {
        setFormError('Molimo popunite email i šifru za kreiranje korisnika');
        return;
      }
    }
    
    const submitData = {
      zaposleniId: formData.zaposleniId,
      radnoMestoId: formData.radnoMestoId,
      lokacijaId: formData.lokacijaId,
      firmaPib: firmaPib,
      vrstaAngazovanja: formData.vrstaAngazovanja,
      datumPocetka: formData.datumPocetka,
      datumPrestanka: formData.datumPrestanka,
      ...((createKorisnik || fromAdminDashboard) ? { 
        kreirajKorisnika: true,
        email: korisnikData.email,
        password: korisnikData.sifra,
      } : {}),
    };
    
    try {
      await onSave(submitData);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Greška pri čuvanju.");
    }
  };

  const renderDropdown = (
    ref: React.RefObject<HTMLDivElement>,
    isOpen: boolean,
    setIsOpen: (v: boolean) => void,
    label: string,
    options: Array<{ value: string; label: string }>,
    selected: string,
    onSelect: (value: string, label: string) => void,
    disabled?: boolean,
    placeholder?: string,
  ) => (
    <div className="relative w-full" ref={ref as React.RefObject<HTMLDivElement>}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full h-11 px-4 text-sm border rounded-lg ${
          disabled
            ? 'text-gray-400 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500 cursor-not-allowed'
            : 'text-gray-800 bg-[#F9FAFB] border-gray-300 dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-white/[0.03]'
        }`}
      >
        <span>{selected ? options.find(o => o.value === selected)?.label ?? selected : (placeholder || `Izaberite ${label.toLowerCase()}`)}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && !disabled && (
        <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-[#11181E] dark:border-gray-700">
          <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
            {options.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500">Nema dostupnih opcija</div>
            ) : options.map((option, index) => (
              <div
                key={option.value}
                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                  selected === option.value ? 'bg-gray-100 dark:bg-gray-700' : ''
                } ${index === options.length - 1 ? 'rounded-b-lg' : ''}`}
                onClick={() => {
                  onSelect(option.value, option.label);
                  setIsOpen(false);
                }}
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] max-h-[90vh] dark:bg-[#11181E] overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 lg:p-5 lg:pt-10 lg:pl-10 pb-0">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {fromAdminDashboard 
              ? (initialData ? "Izmeni korisnika" : "Dodaj korisnika")
              : (initialData ? "Izmeni Angažovanje" : "Novo Angažovanje")
            }
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-sm text-red-600 dark:text-red-400">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 pb-4">
          {isAdmin && !initialData && !fromAdminDashboard && (
            <div className="col-span-1">
              <Slider
                label="Kreiranje korisnika"
                optionOne="Kreiraj Profil Korisnika"
                optionTwo="Ne kreiraj profil Korisnika"
                value={createKorisnik}
                onChange={(value) => {
                  setCreateKorisnik(value);
                  if (!value) setKorisnikData({ email: "", sifra: "" });
                }}
                size="full"
                name="slider-create-korisnik"
                showRedWhenFalse={true}
              />
            </div>
          )}

          {(fromAdminDashboard || (createKorisnik && isAdmin && !initialData)) && (
            <>
              <div className="col-span-1">
                <Label className="text-brand-500 dark:text-[#60a5fa]">Email korisnika *</Label>
                <input
                  type="email"
                  value={korisnikData.email}
                  onChange={(e) => setKorisnikData({ ...korisnikData, email: e.target.value })}
                  className="w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-[#60a5fa] focus:border-transparent"
                />
              </div>
              <div className="col-span-1">
                <Label className="text-brand-500 dark:text-[#60a5fa]">Šifra korisnika *</Label>
                <input
                  type="password"
                  value={korisnikData.sifra}
                  onChange={(e) => setKorisnikData({ ...korisnikData, sifra: e.target.value })}
                  className="w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-[#60a5fa] focus:border-transparent"
                />
              </div>
            </>
          )}

          <div className="col-span-1">
            <Label>Zaposleni *</Label>
            {initialData ? (
              <div className="w-full h-11 px-4 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 flex items-center">
                {formData.zaposleniLabel}
              </div>
            ) : (
              renderDropdown(
                zaposleniRef, isZaposleniOpen, setIsZaposleniOpen, "zaposlenog",
                zaposleniList.map(z => ({ value: z.id.toString(), label: z.ime_prezime })),
                formData.zaposleniId,
                (value, label) => {
                  setFormData(prev => ({
                    ...prev,
                    zaposleniId: value,
                    zaposleniLabel: label,
                    radnoMestoId: "",
                    radnoMestoLabel: "",
                    lokacijaId: "",
                    lokacijaLabel: "",
                  }));
                }
              )
            )}
          </div>

          <div className="col-span-1">
            <Label>Radno mesto *</Label>
            {renderDropdown(
              radnoMestoRef, isRadnoMestoOpen, setIsRadnoMestoOpen, "radno mesto",
              filteredRadnaMesta.map(rm => ({ value: rm.id.toString(), label: rm.naziv })),
              formData.radnoMestoId,
              (value, label) => {
                const rm = filteredRadnaMesta.find(r => r.id === Number(value));
                setFormData(prev => ({
                  ...prev,
                  radnoMestoId: value,
                  radnoMestoLabel: label,
                  lokacijaId: rm?.lokacija_id?.toString() ?? prev.lokacijaId,
                  lokacijaLabel: rm ? (lokacijeList.find(l => l.id === rm.lokacija_id)?.naziv ?? prev.lokacijaLabel) : prev.lokacijaLabel,
                }));
              },
              !firmaPib,
              !firmaPib ? "Prvo izaberite zaposlenog" : "Izaberite radno mesto"
            )}
          </div>

          <div className="col-span-1">
            <Label>Lokacija *</Label>
            {renderDropdown(
              lokacijaRef, isLokacijaOpen, setIsLokacijaOpen, "lokaciju",
              filteredLokacije.map(l => ({ value: l.id.toString(), label: l.naziv })),
              formData.lokacijaId,
              (value, label) => setFormData(prev => ({ ...prev, lokacijaId: value, lokacijaLabel: label })),
              !firmaPib,
              !firmaPib ? "Prvo izaberite zaposlenog" : "Izaberite lokaciju"
            )}
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
              onChange={(newValue) => { if (newValue) setFormData(prev => ({ ...prev, datumPocetka: newValue })); }}
            />
          </div>

          <div className="col-span-1">
            <Label>Datum prestanka angažovanja</Label>
            <CustomDatePicker
              value={formData.datumPrestanka}
              onChange={(newValue) => setFormData(prev => ({ ...prev, datumPrestanka: newValue }))}
            />
          </div>
          </div>
          </div>

          <div className="pb-5 pt-2 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 flex-shrink-0">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Otkaži
              </Button>
              <Button type="submit">
                Sačuvaj
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
