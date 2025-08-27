import React from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import CustomDatePicker from "../../components/form/input/DatePicker";
import Slider from "../../components/ui/Slider";

interface IspitivanjeRadneSredineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function IspitivanjeRadneSredineForm({ isOpen, onClose, onSave }: IspitivanjeRadneSredineFormProps) {
  const [formData, setFormData] = React.useState({
    nazivLokacije: "",
    brojMernihMesta: "",
    intervalIspitivanja: "36",
    tipIspitivanja: "",
    // Fields from NovoIspitivanjeForm
    ispravno: true,
    datumIspitivanja: null as Date | null,
  });

  const [isLokacijaDropdownOpen, setIsLokacijaDropdownOpen] = React.useState(false);
  const [isTipIspitivanjaDropdownOpen, setIsTipIspitivanjaDropdownOpen] = React.useState(false);
  const lokacijaDropdownRef = React.useRef<HTMLDivElement>(null);
  const tipIspitivanjaDropdownRef = React.useRef<HTMLDivElement>(null);

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

  // Environmental testing types based on the data table structure
  const tipoviIspitivanja = [
    {
      key: 'mikroklimaLetnja',
      naziv: 'Ispitivanje Mikroklime letnje',
      description: 'Ispitivanje mikroklime u letnjem periodu'
    },
    {
      key: 'mikroklimaZimska',
      naziv: 'Ispitivanje Mikroklime zimske',
      description: 'Ispitivanje mikroklime u zimskom periodu'
    },
    {
      key: 'fizickeStetnosti',
      naziv: 'Ispitivanje Fizičkih štetnosti',
      description: 'Ispitivanje fizičkih faktora radne sredine'
    },
    {
      key: 'hemijskeStetnosti',
      naziv: 'Ispitivanje Hemijskih štetnosti',
      description: 'Ispitivanje hemijskih faktora radne sredine'
    },
    {
      key: 'osvetljenje',
      naziv: 'Ispitivanje Osvetljenja',
      description: 'Ispitivanje osvetljenja radne sredine'
    }
  ];



  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (lokacijaDropdownRef.current && !lokacijaDropdownRef.current.contains(event.target as Node)) {
        setIsLokacijaDropdownOpen(false);
      }
      if (tipIspitivanjaDropdownRef.current && !tipIspitivanjaDropdownRef.current.contains(event.target as Node)) {
        setIsTipIspitivanjaDropdownOpen(false);
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

  const handleTipIspitivanjaChange = (selectedTip: string) => {
    setFormData(prev => ({
      ...prev,
      tipIspitivanja: selectedTip
    }));
    setIsTipIspitivanjaDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nazivLokacije || !formData.tipIspitivanja) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    
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
             <Label>Tip ispitivanja *</Label>
             <div className="relative w-full" ref={tipIspitivanjaDropdownRef}>
               <button
                 type="button"
                 onClick={() => setIsTipIspitivanjaDropdownOpen(!isTipIspitivanjaDropdownOpen)}
                 className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
               >
                 <span>{formData.tipIspitivanja || "Izaberite tip ispitivanja"}</span>
                 <svg
                   className={`w-4 h-4 transition-transform ml-2 ${isTipIspitivanjaDropdownOpen ? 'rotate-180' : ''}`}
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                 >
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
               {isTipIspitivanjaDropdownOpen && (
                 <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                   <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                     {tipoviIspitivanja.map((tip, index) => (
                       <div
                         key={tip.key}
                         className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                           formData.tipIspitivanja === tip.naziv ? 'bg-gray-100 dark:bg-gray-700' : ''
                         } ${index === tipoviIspitivanja.length - 1 ? 'rounded-b-lg' : ''}`}
                         onClick={() => handleTipIspitivanjaChange(tip.naziv)}
                       >
                         <span className="text-sm text-gray-700 dark:text-gray-300">{tip.naziv}</span>
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

        

                 {/* Fields from NovoIspitivanjeForm - exactly as they appear in the Izvrši ispitivanje modal */}
         <div className="mt-6">
           <h5 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
             Status ispitivanja
           </h5>
           <div className="space-y-4">
             <div>
               <Slider
                 label="Status ispitivanja"
                 optionOne="Ispravno"
                 optionTwo="Neispravno"
                 value={formData.ispravno}
                 onChange={(value) => setFormData(prev => ({ ...prev, ispravno: value }))}
                 size="full"
               />
             </div>

             <div>
               <Label>Datum ispitivanja *</Label>
               <CustomDatePicker
                 value={formData.datumIspitivanja}
                 onChange={(date) => setFormData(prev => ({ ...prev, datumIspitivanja: date }))}
                 placeholder="Izaberi datum ispitivanja"
                 required
               />
             </div>
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