import React from 'react';
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Checkbox from "../components/form/input/Checkbox";

interface RadnoMestoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function RadnoMestoForm({ isOpen, onClose, onSave }: RadnoMestoFormProps) {
  const [formData, setFormData] = React.useState({
    nazivRadnogMesta: "",
    nazivLokacije: "",
    povecanRizik: false,
    obaveznaObuka: false,
    obavezanOftamoloskiPregled: false,
    obavezanPregledPoDrugomOsnovu: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nazivRadnogMesta || !formData.nazivLokacije) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
    >
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Novo Radno Mesto
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label>Naziv radnog mesta *</Label>
            <Input 
              type="text" 
              value={formData.nazivRadnogMesta}
              onChange={(e) => setFormData({...formData, nazivRadnogMesta: e.target.value})}
              className="bg-[#F9FAFB] dark:bg-[#101828]"
            />
          </div>

          <div className="col-span-1">
            <Label>Naziv lokacije *</Label>
            <Input 
              type="text" 
              value={formData.nazivLokacije}
              onChange={(e) => setFormData({...formData, nazivLokacije: e.target.value})}
              className="bg-[#F9FAFB] dark:bg-[#101828]"
            />
          </div>

          <div className="col-span-1">
            <Label>Povećan rizik</Label>
            <div className="mt-2">
              <Checkbox
                checked={formData.povecanRizik}
                onChange={(checked) => setFormData({...formData, povecanRizik: checked})}
                className="w-4 h-4"
              />
            </div>
          </div>

          <div className="col-span-1">
            <Label>Obavezna obuka</Label>
            <div className="mt-2">
              <Checkbox
                checked={formData.obaveznaObuka}
                onChange={(checked) => setFormData({...formData, obaveznaObuka: checked})}
                className="w-4 h-4"
              />
            </div>
          </div>

          <div className="col-span-1">
            <Label>Obavezan oftamološki pregled</Label>
            <div className="mt-2">
              <Checkbox
                checked={formData.obavezanOftamoloskiPregled}
                onChange={(checked) => setFormData({...formData, obavezanOftamoloskiPregled: checked})}
                className="w-4 h-4"
              />
            </div>
          </div>

          <div className="col-span-1">
            <Label>Obavezan pregled po drugom osnovu</Label>
            <div className="mt-2">
              <Checkbox
                checked={formData.obavezanPregledPoDrugomOsnovu}
                onChange={(checked) => setFormData({...formData, obavezanPregledPoDrugomOsnovu: checked})}
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