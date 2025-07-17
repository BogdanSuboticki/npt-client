"use client";

import React, { useEffect, useRef } from "react";
import CustomDatePicker from "../../components/form/input/DatePicker";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

interface FirmeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function FirmeForm({ isOpen, onClose, onSave }: FirmeFormProps) {
  const [formData, setFormData] = React.useState({
    nazivFirme: "",
    adresaFirme: "",
    drzava: "",
    mesto: "",
    pib: "",
    maticniBroj: "",
    sifraDelatnosti: "",
    emailFirme: "",
    imePrezimeDirektora: "",
    telefonDirektora: "",
    emailDirektora: "",
    imePrezimeOsobeZaSaradnju: "",
    telefonOsobeZaSaradnju: "",
    emailOsobeZaSaradnju: "",
    datumPocetkaUgovora: new Date(),
    datumIstekaUgovora: new Date(),
    obaveznaObukaPrvePomoci: false,
  });

  // Add state for dropdowns
  const [isDrzavaOpen, setIsDrzavaOpen] = React.useState(false);
  const drzavaRef = useRef<HTMLDivElement>(null);

  // Example options - replace with actual data
  const drzavaOptions = ["Srbija", "Crna Gora", "Bosna i Hercegovina", "Hrvatska", "Slovenija", "Makedonija", "Albanija", "Bugarska", "Rumunija", "Mađarska", "Austrija", "Nemačka", "Italija", "Francuska", "Španija", "Portugal", "Belgija", "Holandija", "Danska", "Švedska", "Norveška", "Finska", "Poljska", "Češka", "Slovačka", "Ukrajina", "Rusija", "Turska", "Grčka", "Kipar", "Malta", "Irska", "Velika Britanija", "Švajcarska", "Luksemburg", "Lihtenštajn", "Monako", "Andora", "San Marino", "Vatikan", "Island", "Estonija", "Letonija", "Litvanija", "Moldavija", "Belorusija", "Armenija", "Azerbejdžan", "Gruzija", "Kazahstan", "Kirgistan", "Tadžikistan", "Turkmenistan", "Uzbekistan", "Mongolija", "Kina", "Japan", "Južna Koreja", "Severna Koreja", "Vijetnam", "Laos", "Kambodža", "Tajland", "Mjanmar", "Bangladeš", "Nepal", "Butan", "Šri Lanka", "Maldivi", "Indija", "Pakistan", "Avganistan", "Iran", "Irak", "Kuvajt", "Saudijska Arabija", "Jemen", "Oman", "UAE", "Katar", "Bahrein", "Jordan", "Libanon", "Sirija", "Izrael", "Palestina", "Egipat", "Libija", "Tunis", "Alžir", "Maroko", "Mauritanija", "Senegal", "Gambija", "Gvineja Bisau", "Gvineja", "Sijera Leone", "Liberija", "Obala Slonovače", "Gana", "Togo", "Benin", "Nigerija", "Kamerun", "Čad", "Centralnoafrička Republika", "Gabon", "Kongo", "DR Kongo", "Angola", "Zambija", "Zimbabve", "Mozambik", "Malavi", "Tanzanija", "Kenija", "Uganda", "Ruanda", "Burundi", "Etiopija", "Eritreja", "Džibuti", "Somalija", "Sudan", "Južni Sudan", "Ekvatorijalna Gvineja", "Sao Tome i Principe", "Komori", "Sejšeli", "Mauricijus", "Madagaskar", "Južnoafrička Republika", "Namibija", "Bocvana", "Lesoto", "Esvatini", "Kanada", "SAD", "Meksiko", "Gvatemala", "Belize", "Honduras", "El Salvador", "Nikaragva", "Kosta Rika", "Panama", "Kolumbija", "Venezuela", "Gvajana", "Surinam", "Francuska Gvajana", "Brazil", "Ekvador", "Peru", "Bolivija", "Paragvaj", "Urugvaj", "Argentina", "Čile", "Australija", "Novi Zeland", "Fidži", "Papua Nova Gvineja", "Solomonova Ostrva", "Vanuatu", "Nova Kaledonija", "Tonga", "Samoa", "Kiribati", "Tuvalu", "Nauru", "Mikronezija", "Palau", "Maršalova Ostrva"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (drzavaRef.current && !drzavaRef.current.contains(target)) {
        setIsDrzavaOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);





  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nazivFirme || !formData.adresaFirme || !formData.drzava || !formData.mesto || 
        !formData.pib || !formData.maticniBroj || !formData.sifraDelatnosti || 
        !formData.imePrezimeOsobeZaSaradnju || !formData.telefonOsobeZaSaradnju || 
        !formData.emailOsobeZaSaradnju || !formData.datumPocetkaUgovora || !formData.datumIstekaUgovora) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };



  return (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
      className="max-w-[800px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
    >
          <div className="flex flex-col h-full">
            <div className="p-5 lg:p-10 pb-0">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Nova Firma</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              <div className="col-span-1">
                <Label>Naziv firme *</Label>
                <Input
                  type="text"
                  name="nazivFirme"
                  value={formData.nazivFirme}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Adresa firme *</Label>
                <Input
                  type="text"
                  name="adresaFirme"
                  value={formData.adresaFirme}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Država *</Label>
                <div className="relative w-full" ref={drzavaRef}>
                  <button
                    type="button"
                    onClick={() => setIsDrzavaOpen(!isDrzavaOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <div className="flex items-center gap-2">

                      <span>{formData.drzava || "Izaberi državu"}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isDrzavaOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isDrzavaOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {drzavaOptions.map((option: string, index: number) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.drzava === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === drzavaOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, drzava: option });
                              setIsDrzavaOpen(false);
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
                <Label>Mesto *</Label>
                <Input
                  type="text"
                  name="mesto"
                  value={formData.mesto}
                  onChange={handleInputChange}
                  required
                />
                    </div>

              <div className="col-span-1">
                <Label>PIB (poreski identifikacioni broj) *</Label>
                <Input
                  type="text"
                  name="pib"
                  value={formData.pib}
                  onChange={handleInputChange}
                  required
                />
                          </div>

              <div className="col-span-1">
                <Label>Matični broj firme *</Label>
                <Input
                  type="text"
                  name="maticniBroj"
                  value={formData.maticniBroj}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Šifra delatnosti *</Label>
                <Input
                  type="text"
                  name="sifraDelatnosti"
                  value={formData.sifraDelatnosti}
                  onChange={handleInputChange}
                    required
                  />
              </div>

              <div className="col-span-1">
                <Label>Email adresa firme *</Label>
                <Input
                  type="email"
                  name="emailFirme"
                  value={formData.emailFirme}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <Label>Ime i prezime direktora firme</Label>
                <Input
                  type="text"
                  name="imePrezimeDirektora"
                  value={formData.imePrezimeDirektora}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <Label>Broj telefona direktora</Label>
                <Input
                  type="tel"
                  name="telefonDirektora"
                  value={formData.telefonDirektora}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <Label>Email adresa direktora</Label>
                <Input
                  type="email"
                  name="emailDirektora"
                  value={formData.emailDirektora}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <Label>Ime i prezime osobe za saradnju *</Label>
                <Input
                  type="text"
                  name="imePrezimeOsobeZaSaradnju"
                  value={formData.imePrezimeOsobeZaSaradnju}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Broj telefona osobe za saradnju *</Label>
                <Input
                  type="tel"
                  name="telefonOsobeZaSaradnju"
                  value={formData.telefonOsobeZaSaradnju}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Email adresa osobe za saradnju *</Label>
                <Input
                  type="email"
                  name="emailOsobeZaSaradnju"
                  value={formData.emailOsobeZaSaradnju}
                  onChange={handleInputChange}
                    required
                  />
              </div>

              <div className="col-span-1">
                <Label>Datum početka ugovora *</Label>
                <CustomDatePicker
                  value={formData.datumPocetkaUgovora}
                    onChange={(newValue) => {
                      if (newValue) {
                      setFormData(prev => ({ ...prev, datumPocetkaUgovora: newValue }));
                    }
                  }}
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Datum isteka ugovora *</Label>
                <CustomDatePicker
                  value={formData.datumIstekaUgovora}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFormData(prev => ({ ...prev, datumIstekaUgovora: newValue }));
                    }
                  }}
                  required
                />
              </div>
              </div>
            </div>

          <div className="pb-5 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">

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