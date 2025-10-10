import React, { useEffect } from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";

interface LZSFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function LZSForm({ isOpen, onClose, onSave, initialData }: LZSFormProps) {
  const [formData, setFormData] = React.useState({
    nazivLZS: "",
    standard: "",
    napomena: ""
  });

  // Populate form with initialData when provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nazivLZS: initialData.nazivLZS || "",
        standard: initialData.standard || "",
        napomena: initialData.napomena || ""
      });
    } else {
      // Reset form when no initial data
      setFormData({
        nazivLZS: "",
        standard: "",
        napomena: ""
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nazivLZS || !formData.standard) {
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
      className="max-w-[800px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 lg:p-5 lg:pt-10 lg:pl-10 pb-0">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {initialData ? "Izmeni LZS" : "Novi LZS"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
              <div className="col-span-1">
                <Label>Naziv LZS *</Label>
                <Input 
                  type="text" 
                  value={formData.nazivLZS}
                  onChange={(e) => setFormData({...formData, nazivLZS: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828]"
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Standard *</Label>
                <Input 
                  type="text" 
                  value={formData.standard}
                  onChange={(e) => setFormData({...formData, standard: e.target.value})}
                  className="bg-[#F9FAFB] dark:bg-[#101828]"
                  required
                />
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

