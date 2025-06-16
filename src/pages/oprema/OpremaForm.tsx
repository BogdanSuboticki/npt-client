import React from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";

interface OpremaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function OpremaForm({ isOpen, onClose, onSave }: OpremaFormProps) {
  const [formData, setFormData] = React.useState({
    nazivOpreme: "",
    fabrickBroj: "",
    inventarniBroj: "",
    godinaProizvodnje: new Date().getFullYear(),
    intervalPregleda: 12,
    zop: false,
    napomena: "",
    iskljucenaIzPracenja: false
  });

  // Generate years for dropdown (from 1950 to current year)
  const years = Array.from(
    { length: new Date().getFullYear() - 1949 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nazivOpreme || !formData.intervalPregleda) {
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
          Nova Oprema
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
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
            <select
              value={formData.godinaProizvodnje}
              onChange={(e) => setFormData({...formData, godinaProizvodnje: parseInt(e.target.value)})}
              className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 px-5 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <Label>Interval pregleda (meseci) *</Label>
            <Input 
              type="number" 
              value={formData.intervalPregleda}
              onChange={(e) => setFormData({...formData, intervalPregleda: parseInt(e.target.value)})}
              className="bg-[#F9FAFB] dark:bg-[#101828]"
              required
              min="1"
            />
          </div>

          <div className="col-span-2">
            <Label>Napomena</Label>
            <textarea
              value={formData.napomena}
              onChange={(e) => setFormData({...formData, napomena: e.target.value})}
              className="w-full rounded border-[1.5px] border-gray-300 bg-[#F9FAFB] py-2 px-5 font-medium outline-none transition focus:border-brand-300 active:border-brand-300 disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-[#101828] dark:text-white/90 dark:focus:border-brand-800"
              rows={4}
            />
          </div>

          <div className="col-span-1">
            <Label>ZOP</Label>
            <div className="mt-2">
              <Checkbox
                checked={formData.zop}
                onChange={(checked) => setFormData({...formData, zop: checked})}
                className="w-4 h-4"
              />
            </div>
          </div>

          <div className="col-span-1">
            <Label>Isključiti iz praćenja</Label>
            <div className="mt-2">
              <Checkbox
                checked={formData.iskljucenaIzPracenja}
                onChange={(checked) => setFormData({...formData, iskljucenaIzPracenja: checked})}
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