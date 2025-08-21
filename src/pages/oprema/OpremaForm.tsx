import React, { useRef, useEffect } from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";
import Slider from "../../components/ui/Slider";

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
    napomena: ""
  });

  // Add state for dropdown
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      className="max-w-[800px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 lg:p-10 pb-0">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Nova Oprema</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-280px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
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
                <Input 
                  type="number" 
                  value={formData.intervalPregleda}
                  onChange={(e) => setFormData({...formData, intervalPregleda: parseInt(e.target.value)})}
                  className="bg-[#F9FAFB] dark:bg-[#101828]"
                  required
                  min="1"
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