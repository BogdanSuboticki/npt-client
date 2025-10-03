import React from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import CustomDatePicker from "../../components/form/input/DatePicker";
import Slider from "../../components/ui/Slider";
import Checkbox from "../../components/form/input/Checkbox";

interface IspitivanjeRadneSredineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface TipIspitivanjaData {
  key: string;
  naziv: string;
  selected: boolean;
  ispravno: boolean;
  datumIspitivanja: Date | null;
}

export default function IspitivanjeRadneSredineForm({ isOpen, onClose, onSave }: IspitivanjeRadneSredineFormProps) {
  const [formData, setFormData] = React.useState({
    nazivLokacije: "",
    brojMernihMesta: "",
    intervalIspitivanja: "36",
  });

  const [isLokacijaDropdownOpen, setIsLokacijaDropdownOpen] = React.useState(false);
  const lokacijaDropdownRef = React.useRef<HTMLDivElement>(null);

  // Environmental testing types with individual data
  const [tipoviIspitivanja, setTipoviIspitivanja] = React.useState<TipIspitivanjaData[]>([
    {
      key: 'mikroklimaLetnja',
      naziv: 'Ispitivanje Mikroklime letnje',
      selected: false,
      ispravno: true,
      datumIspitivanja: null
    },
    {
      key: 'mikroklimaZimska',
      naziv: 'Ispitivanje Mikroklime zimske',
      selected: false,
      ispravno: true,
      datumIspitivanja: null
    },
    {
      key: 'fizickeStetnosti',
      naziv: 'Ispitivanje Fizičkih štetnosti',
      selected: false,
      ispravno: true,
      datumIspitivanja: null
    },
    {
      key: 'hemijskeStetnosti',
      naziv: 'Ispitivanje Hemijskih štetnosti',
      selected: false,
      ispravno: true,
      datumIspitivanja: null
    },
    {
      key: 'osvetljenje',
      naziv: 'Ispitivanje Osvetljenja',
      selected: false,
      ispravno: true,
      datumIspitivanja: null
    }
  ]);

  // Location options with their corresponding measurement point counts
  const lokacijaOptions = [
    { naziv: 'Fabrika Novi Sad', brojMernihMesta: 8 },
    { naziv: 'Skladište Beograd', brojMernihMesta: 4 },
    { naziv: 'Upravna zgrada Niš', brojMernihMesta: 6 },
    { naziv: 'Pogon Subotica', brojMernihMesta: 12 },
    { naziv: 'Distributivni centar Kragujevac', brojMernihMesta: 5 },
    { naziv: 'Tehnički centar Zrenjanin', brojMernihMesta: 7 },
    { naziv: 'Logistički centar Čačak', brojMernihMesta: 9 },
    { naziv: 'Proizvodni kompleks Pančevo', brojMernihMesta: 15 },
    { naziv: 'Poslovni centar Valjevo', brojMernihMesta: 3 },
    { naziv: 'Industrijska zona Šabac', brojMernihMesta: 6 },
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (lokacijaDropdownRef.current && !lokacijaDropdownRef.current.contains(event.target as Node)) {
        setIsLokacijaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLokacijaChange = (selectedLokacija: string) => {
    const lokacija = lokacijaOptions.find(opt => opt.naziv === selectedLokacija);
    setFormData(prev => ({
      ...prev,
      nazivLokacije: selectedLokacija,
      brojMernihMesta: lokacija ? lokacija.brojMernihMesta.toString() : ""
    }));
    setIsLokacijaDropdownOpen(false);
  };

  const handleTipIspitivanjaToggle = (key: string) => {
    setTipoviIspitivanja(prev => prev.map(tip => 
      tip.key === key ? { ...tip, selected: !tip.selected } : tip
    ));
  };

  const handleTipIspitivanjaStatusChange = (key: string, ispravno: boolean) => {
    setTipoviIspitivanja(prev => prev.map(tip => 
      tip.key === key ? { ...tip, ispravno } : tip
    ));
  };

  const handleTipIspitivanjaDateChange = (key: string, datum: Date | null) => {
    setTipoviIspitivanja(prev => prev.map(tip => 
      tip.key === key ? { ...tip, datumIspitivanja: datum } : tip
    ));
  };

  const handleSelectAll = () => {
    setTipoviIspitivanja(prev => prev.map(tip => ({ ...tip, selected: true })));
  };

  const handleSelectNone = () => {
    setTipoviIspitivanja(prev => prev.map(tip => ({ ...tip, selected: false })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nazivLokacije) {
      alert('Molimo izaberite lokaciju');
      return;
    }

    const selectedTipovi = tipoviIspitivanja.filter(tip => tip.selected);
    if (selectedTipovi.length === 0) {
      alert('Molimo izaberite bar jedan tip ispitivanja');
      return;
    }

    // Validate that all selected types have dates
    const invalidTipovi = selectedTipovi.filter(tip => !tip.datumIspitivanja);
    if (invalidTipovi.length > 0) {
      alert('Molimo unesite datum ispitivanja za sve izabrane tipove ispitivanja');
      return;
    }
    
    const dataToSave = {
      ...formData,
      tipoviIspitivanja: selectedTipovi
    };
    
    onSave(dataToSave);
  };

  const selectedTipovi = tipoviIspitivanja.filter(tip => tip.selected);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[900px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 lg:p-5 lg:pt-10 lg:pl-10 pb-0">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Novo Ispitivanje Radne Sredine</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <Label>Lokacija *</Label>
            <div className="relative w-full" ref={lokacijaDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLokacijaDropdownOpen(!isLokacijaDropdownOpen)}
                className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <span>{formData.nazivLokacije || "Izaberite lokaciju"}</span>
                <svg
                  className={`w-4 h-4 transition-transform ml-2 ${isLokacijaDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLokacijaDropdownOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                    {lokacijaOptions.map((item, index) => (
                      <div
                        key={item.naziv}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                          formData.nazivLokacije === item.naziv ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${index === lokacijaOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                        onClick={() => handleLokacijaChange(item.naziv)}
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.naziv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <Label>Broj mernih mesta *</Label>
            <Input
              type="text"
              value={formData.brojMernihMesta}
              disabled
              className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="col-span-1">
            <Label>Interval ispitivanja (meseci)</Label>
            <Input
              type="text"
              value="36"
              disabled
              className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Tipovi ispitivanja selection */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-medium text-gray-800 dark:text-white">
              Tipovi ispitivanja *
            </h5>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-[13px] px-3 py-1"
              >
                Izaberi sve
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectNone}
                className="text-[13px] px-3 py-1"
              >
                Poništi sve
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tipoviIspitivanja.map((tip) => (
              <div
                key={tip.key}
                className={`flex items-center p-3 border rounded-lg transition-colors cursor-pointer ${
                  tip.selected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleTipIspitivanjaToggle(tip.key)}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={tip.selected}
                    onChange={() => handleTipIspitivanjaToggle(tip.key)}
                    className="mr-10"
                  />
                </div>
                <div className="flex-1 ml-2">
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {tip.naziv}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Individual testing type configurations */}
        {selectedTipovi.length > 0 && (
          <div className="mt-6">
            <h5 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Rezultati ispitivanja
            </h5>
            <div className="space-y-4">
              {selectedTipovi.map((tip) => (
                <div
                  key={tip.key}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <h6 className="font-medium text-gray-800 dark:text-white mb-3">
                    {tip.naziv}
                  </h6>
                  <div className="space-y-4">
                                         <div>
                       <Slider
                         label="Status ispitivanja"
                         optionOne="Ispravno"
                         optionTwo="Neispravno"
                         value={tip.ispravno}
                         onChange={(value) => handleTipIspitivanjaStatusChange(tip.key, value)}
                         size="full"
                         name={`slider-${tip.key.replace(/[^a-zA-Z0-9]/g, '')}`}
                         showRedWhenFalse={true}
                       />
                     </div>

                    <div>
                      <Label>Datum ispitivanja *</Label>
                      <CustomDatePicker
                        value={tip.datumIspitivanja}
                        onChange={(date) => handleTipIspitivanjaDateChange(tip.key, date)}
                        placeholder="Izaberi datum ispitivanja"
                        required
                        className="!bg-white dark:!bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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