import React from 'react';
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import CustomDatePicker from "../../components/form/input/DatePicker";
import Button from "../../components/ui/button/Button";
import Slider from "../../components/ui/Slider";

interface NovoIspitivanjeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  title?: string;
}

export default function NovoIspitivanjeForm({ isOpen, onClose, onSave, title = "Novo ispitivanje" }: NovoIspitivanjeFormProps) {
  const [formData, setFormData] = React.useState({
    ispravno: true,
    datumIspitivanja: null as Date | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[500px] p-5 lg:p-8"
    >
      <h4 className="font-semibold text-gray-800 mb-4 text-xl dark:text-white/90">
        {title}
      </h4>
      <form onSubmit={handleSubmit}>
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

        <div className="mt-6 flex justify-end gap-3">
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