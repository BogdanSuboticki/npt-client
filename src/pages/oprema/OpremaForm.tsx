import React, { useRef, useEffect } from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";

interface OpremaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
  initialData?: any;
  firme?: Array<{pib: string, naziv: string}>;
  lokacije?: Array<{id: number, naziv: string, firma_pib: string}>;
}

export default function OpremaForm({ isOpen, onClose, onSave, initialData, firme = [], lokacije = [] }: OpremaFormProps) {
  const [formData, setFormData] = React.useState({
    firmaPib: "",
    lokacijaId: "",
    nazivOpreme: "",
    vrstaOpreme: "",
    fabrickBroj: "",
    inventarniBroj: "",
    godinaProizvodnje: new Date().getFullYear(),
    intervalPregleda: 36,
    napomena: ""
  });

  const [formError, setFormError] = React.useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firmaPib: initialData.firmaPib || "",
        lokacijaId: initialData.lokacijaId?.toString() || "",
        nazivOpreme: initialData.nazivOpreme || "",
        vrstaOpreme: initialData.vrstaOpreme || "",
        fabrickBroj: initialData.fabrickBroj || "",
        inventarniBroj: initialData.inventarniBroj || "",
        godinaProizvodnje: initialData.godinaProizvodnje || new Date().getFullYear(),
        intervalPregleda: 36,
        napomena: initialData.napomena || ""
      });
    } else {
      setFormData({
        firmaPib: "",
        lokacijaId: "",
        nazivOpreme: "",
        vrstaOpreme: "",
        fabrickBroj: "",
        inventarniBroj: "",
        godinaProizvodnje: new Date().getFullYear(),
        intervalPregleda: 36,
        napomena: ""
      });
    }
    setFormError(null);
  }, [initialData]);

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isVrstaDropdownOpen, setIsVrstaDropdownOpen] = React.useState(false);
  const [isFirmaDropdownOpen, setIsFirmaDropdownOpen] = React.useState(false);
  const [isLokacijaDropdownOpen, setIsLokacijaDropdownOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const vrstaDropdownRef = useRef<HTMLDivElement>(null);
  const firmaDropdownRef = useRef<HTMLDivElement>(null);
  const lokacijaDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (vrstaDropdownRef.current && !vrstaDropdownRef.current.contains(event.target as Node)) {
        setIsVrstaDropdownOpen(false);
      }
      if (firmaDropdownRef.current && !firmaDropdownRef.current.contains(event.target as Node)) {
        setIsFirmaDropdownOpen(false);
      }
      if (lokacijaDropdownRef.current && !lokacijaDropdownRef.current.contains(event.target as Node)) {
        setIsLokacijaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const years = Array.from(
    { length: new Date().getFullYear() - 1949 },
    (_, i) => new Date().getFullYear() - i
  );

  const vrstaOpremeOptions = [
    "Oprema za rad",
    "Elektro i gromobranska instalacija"
  ];

  const filteredLokacije = lokacije.filter(l => l.firma_pib === formData.firmaPib);

  const selectedFirmaLabel = firme.find(f => f.pib === formData.firmaPib);
  const selectedLokacijaLabel = filteredLokacije.find(l => l.id === Number(formData.lokacijaId));

  const handleFirmaChange = (pib: string) => {
    setFormData({ ...formData, firmaPib: pib, lokacijaId: "" });
    setIsFirmaDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.firmaPib || !formData.lokacijaId || !formData.nazivOpreme || !formData.vrstaOpreme) {
      setFormError('Molimo popunite sva obavezna polja');
      return;
    }
    try {
      await onSave(formData);
    } catch (err: any) {
      setFormError(err?.message || "Greška pri čuvanju.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 lg:p-5 lg:pt-10 lg:pl-10 pb-0">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {initialData ? "Izmeni Opremu" : "Nova Oprema"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              <div className="col-span-1">
                <Label>Firma *</Label>
                <div className="relative w-full" ref={firmaDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsFirmaDropdownOpen(!isFirmaDropdownOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <span>{selectedFirmaLabel ? `${selectedFirmaLabel.naziv} (${selectedFirmaLabel.pib})` : "Izaberite..."}</span>
                    <svg className={`w-4 h-4 transition-transform ${isFirmaDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isFirmaDropdownOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {firme.map((firma, index) => (
                          <div
                            key={firma.pib}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${formData.firmaPib === firma.pib ? 'bg-gray-100 dark:bg-gray-700' : ''} ${index === firme.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => handleFirmaChange(firma.pib)}
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{firma.naziv} ({firma.pib})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <Label>Lokacija *</Label>
                <div className="relative w-full" ref={lokacijaDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsLokacijaDropdownOpen(!isLokacijaDropdownOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <span>{selectedLokacijaLabel ? selectedLokacijaLabel.naziv : "Izaberite..."}</span>
                    <svg className={`w-4 h-4 transition-transform ${isLokacijaDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isLokacijaDropdownOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {filteredLokacije.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500">
                            {formData.firmaPib ? "Nema lokacija za izabranu firmu" : "Prvo izaberite firmu"}
                          </div>
                        ) : (
                          filteredLokacije.map((lok, index) => (
                            <div
                              key={lok.id}
                              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${formData.lokacijaId === String(lok.id) ? 'bg-gray-100 dark:bg-gray-700' : ''} ${index === filteredLokacije.length - 1 ? 'rounded-b-lg' : ''}`}
                              onClick={() => {
                                setFormData({ ...formData, lokacijaId: String(lok.id) });
                                setIsLokacijaDropdownOpen(false);
                              }}
                            >
                              <span className="text-sm text-gray-700 dark:text-gray-300">{lok.naziv}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <Label>Naziv opreme *</Label>
                <Input 
                  type="text" 
                  value={formData.nazivOpreme}
                  onChange={(e) => setFormData({...formData, nazivOpreme: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828]"
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Vrsta opreme *</Label>
                <div className="relative w-full" ref={vrstaDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsVrstaDropdownOpen(!isVrstaDropdownOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <span>{formData.vrstaOpreme || "Izaberite vrste opreme"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ml-2 ${isVrstaDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isVrstaDropdownOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {vrstaOpremeOptions.map((item, index) => (
                          <div
                            key={item}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.vrstaOpreme === item ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === vrstaOpremeOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, vrstaOpreme: item });
                              setIsVrstaDropdownOpen(false);
                            }}
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <Label>Fabrički broj</Label>
                <Input 
                  type="text" 
                  value={formData.fabrickBroj}
                  onChange={(e) => setFormData({...formData, fabrickBroj: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828]"
                />
              </div>

              <div className="col-span-1">
                <Label>Inventarni broj</Label>
                <Input 
                  type="text" 
                  value={formData.inventarniBroj}
                  onChange={(e) => setFormData({...formData, inventarniBroj: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828]"
                />
              </div>

              <div className="col-span-1">
                <Label>Godina proizvodnje</Label>
                <div className="relative w-full" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <span>{formData.godinaProizvodnje}</span>
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
                        {years.map((year, index) => (
                          <div
                            key={year}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.godinaProizvodnje === year ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === years.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, godinaProizvodnje: year });
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <Label>Interval pregleda (meseci) *</Label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={formData.intervalPregleda}
                    readOnly
                    disabled
                    className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
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
          </div>

          <div className="pt-3 pb-5 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
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