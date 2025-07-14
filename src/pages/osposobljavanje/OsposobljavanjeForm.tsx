import React from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import CustomDatePicker from "../../components/form/input/DatePicker";
import Checkbox from "../../components/form/input/Checkbox";

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
    povecanRizik: false,
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
      className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
    >
          <form onSubmit={handleSubmit}>
            <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
              Novo Osposobljavanje
            </h4>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div className="col-span-1">
                <Label>Zaposleni *</Label>
                <Input 
                  type="text" 
                  value={formData.zaposleni}
                  onChange={(e) => setFormData({...formData, zaposleni: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828]"
                />
              </div>

              <div className="col-span-1">
                <Label>Radno Mesto *</Label>
                <Input 
                  type="text" 
                  value={formData.radnoMesto}
                  onChange={(e) => setFormData({...formData, radnoMesto: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828]"
                />
              </div>

              <div className="col-span-1">
                <Label>Osposobljavanje BZR</Label>
                <CustomDatePicker
                  value={formData.osposobljavanjeBZR}
                  onChange={(newValue) => handleDateChange('osposobljavanjeBZR', newValue)}
                />
              </div>

              <div className="col-span-1">
                <Label>Datum Narednog BZR</Label>
                <CustomDatePicker
                  value={formData.datumNarednogBZR}
                  onChange={(newValue) => handleDateChange('datumNarednogBZR', newValue)}
                />
              </div>

              <div className="col-span-1">
                <Label>Osposobljavanje ZOP</Label>
                <CustomDatePicker
                  value={formData.osposobljavanjeZOP}
                  onChange={(newValue) => handleDateChange('osposobljavanjeZOP', newValue)}
                />
              </div>

              <div className="col-span-1">
                <Label>Datum Narednog ZOP</Label>
                <CustomDatePicker
                  value={formData.datumNarednogZOP}
                  onChange={(newValue) => handleDateChange('datumNarednogZOP', newValue)}
                />
              </div>

              <div className="col-span-1">
                <div className="flex items-center gap-2 pt-4">
                  <Checkbox
                    checked={formData.povecanRizik}
                    onChange={(checked) => setFormData({...formData, povecanRizik: checked})}
                    className="w-4 h-4"
                    id="povecanRizik"
                  />
                  <Label className="mb-0 cursor-pointer" htmlFor="povecanRizik">
                    Povećani Rizik
                  </Label>
                </div>
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

