import React from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import CustomDatePicker from "../../components/form/input/DatePicker";
import Slider from "../../components/ui/Slider";

interface OsposobljavanjeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function OsposobljavanjeForm({ isOpen, onClose, onSave }: OsposobljavanjeFormProps) {
  const [formData, setFormData] = React.useState({
    zaposleni: "",
    radnoMesto: "",
    lokacija: "",
    povecanRizik: false, // false = "Ne", true = "Da"
    osposobljavanjeBZR: new Date(),
    datumNarednogBZR: new Date(),
    osposobljavanjeZOP: new Date(),
    datumNarednogZOP: new Date(),
    prikaziUPodsetniku: false,
    bzrOdradjeno: false
  });





  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zaposleni || !formData.radnoMesto || !formData.lokacija) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    onSave(formData);
    onClose();
  };



  const handleDateChange = (field: string, value: Date | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 pt-10">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
            Novo Osposobljavanje
          </h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              <div className="w-full">
                <Label>Zaposleni *</Label>
                <Input 
                  type="text" 
                  value={formData.zaposleni}
                  onChange={(e) => setFormData({...formData, zaposleni: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828] w-full"
                />
              </div>

              <div className="w-full">
                <Label>Radno Mesto *</Label>
                <Input 
                  type="text" 
                  value={formData.radnoMesto}
                  onChange={(e) => setFormData({...formData, radnoMesto: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828] w-full"
                />
              </div>

              <div className="w-full">
                <Label>Osposobljavanje BZR</Label>
                <CustomDatePicker
                  value={formData.osposobljavanjeBZR}
                  onChange={(newValue) => handleDateChange('osposobljavanjeBZR', newValue)}
                />
              </div>

              <div className="w-full">
                <Label>Datum Narednog BZR</Label>
                <CustomDatePicker
                  value={formData.datumNarednogBZR}
                  onChange={(newValue) => handleDateChange('datumNarednogBZR', newValue)}
                />
              </div>

              <div className="w-full">
                <Label>Osposobljavanje ZOP</Label>
                <CustomDatePicker
                  value={formData.osposobljavanjeZOP}
                  onChange={(newValue) => handleDateChange('osposobljavanjeZOP', newValue)}
                />
              </div>

              <div className="w-full">
                <Label>Datum Narednog ZOP</Label>
                <CustomDatePicker
                  value={formData.datumNarednogZOP}
                  onChange={(newValue) => handleDateChange('datumNarednogZOP', newValue)}
                />
              </div>

              <div className="w-full lg:col-span-2">
                <Slider
                  label="Povećan Rizik"
                  optionOne="Da"
                  optionTwo="Ne"
                  value={formData.povecanRizik}
                  onChange={(value) => setFormData({...formData, povecanRizik: value})}
                  size="full"
                />
              </div>
            </div>
          </div>

          <div className="pb-5 pt-2 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
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

