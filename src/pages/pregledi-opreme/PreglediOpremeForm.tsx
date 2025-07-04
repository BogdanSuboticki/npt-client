"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { sr } from "date-fns/locale";
import { CalenderIcon } from "../../icons";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Checkbox from "../../components/form/input/Checkbox";

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = /ipad|android(?=.*\b(?!.*\b(?:mobile|phone)\b))/.test(userAgent);
      setIsMobile(isMobileDevice || isTablet);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

interface PreglediOpremeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function PreglediOpremeForm({ isOpen, onClose, onSave }: PreglediOpremeFormProps) {
  const { theme: appTheme } = useTheme();
  const isMobile = useIsMobile();
  const [formData, setFormData] = React.useState({
    nazivOpreme: "",
    lokacija: "",
    intervalPregleda: "",
    datumPregleda: new Date(),
    status: "",
    datumNarednogPregleda: new Date(),
    napomena: "",
    iskljucenoIzPracenja: false,
  });

  // Add state for dropdowns
  const [isLokacijaOpen, setIsLokacijaOpen] = React.useState(false);
  const [isIntervalOpen, setIsIntervalOpen] = React.useState(false);
  const [isStatusOpen, setIsStatusOpen] = React.useState(false);
  const lokacijaRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Example options - replace with actual data
  const lokacijaOptions = ["Lokacija 1", "Lokacija 2", "Lokacija 3"];
  const intervalOptions = ["1", "3", "6", "12", "24", "36"];
  const statusOptions = ["Ispravno", "Neispravno"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (lokacijaRef.current && !lokacijaRef.current.contains(target)) {
        setIsLokacijaOpen(false);
      }
      if (intervalRef.current && !intervalRef.current.contains(target)) {
        setIsIntervalOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(target)) {
        setIsStatusOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add state for controlling calendar popups
  const [isDatumPregledaOpen, setIsDatumPregledaOpen] = React.useState(false);

  // Close all date pickers when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDatumPregledaOpen(false);
    }
  }, [isOpen]);

  // Calculate next inspection date when interval or inspection date changes
  useEffect(() => {
    if (formData.intervalPregleda && formData.datumPregleda) {
      const intervalMonths = parseInt(formData.intervalPregleda);
      if (!isNaN(intervalMonths)) {
        const nextDate = new Date(formData.datumPregleda);
        nextDate.setMonth(nextDate.getMonth() + intervalMonths);
        setFormData(prev => ({ ...prev, datumNarednogPregleda: nextDate }));
      }
    }
  }, [formData.intervalPregleda, formData.datumPregleda]);

  // Create theme based on app theme with high z-index for MUI Popper
  const muiTheme = createTheme({
    palette: {
      mode: appTheme,
    },
    components: {
      MuiPopper: {
        styleOverrides: {
          root: {
            zIndex: 999999
          }
        }
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nazivOpreme || !formData.lokacija || !formData.intervalPregleda || !formData.datumPregleda || !formData.status) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      iskljucenoIzPracenja: checked
    }));
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={sr}>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Novi Pregled Opreme</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label>Naziv opreme *</Label>
                <input
                  type="text"
                  name="nazivOpreme"
                  value={formData.nazivOpreme}
                  onChange={handleInputChange}
                  className="w-full px-4 h-11 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90"
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Lokacija *</Label>
                <div className="relative w-full" ref={lokacijaRef}>
                  <button
                    type="button"
                    onClick={() => setIsLokacijaOpen(!isLokacijaOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>{formData.lokacija || "Izaberi lokaciju"}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isLokacijaOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isLokacijaOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {lokacijaOptions.map((option, index) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.lokacija === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === lokacijaOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, lokacija: option });
                              setIsLokacijaOpen(false);
                            }}
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <Label>Interval pregleda (meseci) *</Label>
                <div className="relative w-full" ref={intervalRef}>
                  <button
                    type="button"
                    onClick={() => setIsIntervalOpen(!isIntervalOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>{formData.intervalPregleda ? `${formData.intervalPregleda} meseci` : "Izaberi interval"}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isIntervalOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isIntervalOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {intervalOptions.map((option, index) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.intervalPregleda === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === intervalOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, intervalPregleda: option });
                              setIsIntervalOpen(false);
                            }}
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{option} meseci</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  name="intervalPregleda"
                  value={formData.intervalPregleda}
                  onChange={handleInputChange}
                  placeholder="Ili unesite broj meseci"
                  className="w-full px-4 h-11 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 mt-2"
                />
              </div>

              <div className="col-span-1">
                <Label>Datum pregleda *</Label>
                {isMobile ? (
                  <input
                    type="date"
                    value={formData.datumPregleda ? formData.datumPregleda.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : new Date();
                      setFormData(prev => ({ ...prev, datumPregleda: date }));
                    }}
                    className="w-full px-4 h-11 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90"
                    required
                  />
                ) : (
                  <DatePicker
                    value={formData.datumPregleda}
                    onChange={(newValue) => {
                      if (newValue) {
                        setFormData(prev => ({ ...prev, datumPregleda: newValue }));
                        setIsDatumPregledaOpen(false);
                      }
                    }}
                    format="dd/MM/yyyy"
                    open={isDatumPregledaOpen}
                    onOpen={() => setIsDatumPregledaOpen(true)}
                    onClose={() => setIsDatumPregledaOpen(false)}
                    slots={{
                      toolbar: () => null
                    }}
                    slotProps={{
                      popper: {
                        sx: {
                          zIndex: 9999999
                        }
                      },
                      textField: {
                        size: "small",
                        fullWidth: true,
                        onClick: () => setIsDatumPregledaOpen(true),
                        onTouchStart: () => setIsDatumPregledaOpen(true),
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: '44px',
                            backgroundColor: appTheme === 'dark' ? '#101828' : '#F9FAFB',
                            borderColor: appTheme === 'dark' ? '#374151' : '#D1D5DB',
                            '&:hover': {
                              borderColor: appTheme === 'dark' ? '#4B5563' : '#9CA3AF',
                            },
                            '&.Mui-focused': {
                              borderColor: appTheme === 'dark' ? '#6366F1' : '#6366F1',
                            },
                          },
                          '& .MuiInputBase-input': {
                            padding: '12px 14px',
                            color: appTheme === 'dark' ? '#F9FAFB' : '#111827',
                            '&::placeholder': {
                              color: appTheme === 'dark' ? '#9CA3AF' : '#6B7280',
                              opacity: 1,
                            },
                          },
                        },
                        InputProps: {
                          style: {
                            borderRadius: 8,
                            height: 44,
                            backgroundColor: appTheme === 'dark' ? '#101828' : '#F9FAFB',
                          },
                          endAdornment: (
                            <CalenderIcon 
                              className="size-5 text-gray-500 dark:text-gray-400" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsDatumPregledaOpen(true);
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation();
                                setIsDatumPregledaOpen(true);
                              }}
                            />
                          ),
                        },
                      },
                    }}
                  />
                )}
              </div>

              <div className="col-span-1">
                <Label>Status *</Label>
                <div className="relative w-full" ref={statusRef}>
                  <button
                    type="button"
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                    className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>{formData.status || "Izaberi status"}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isStatusOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {statusOptions.map((option, index) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.status === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === statusOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, status: option });
                              setIsStatusOpen(false);
                            }}
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <Label>Naredni pregled</Label>
                <input
                  type="text"
                  value={formData.datumNarednogPregleda ? formData.datumNarednogPregleda.toLocaleDateString('sr-RS') : ''}
                  readOnly
                  className="w-full px-4 h-11 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                />
              </div>
            </div>

            <div className="col-span-2 mt-4">
              <Label>Napomena</Label>
              <textarea
                name="napomena"
                value={formData.napomena}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 resize-none"
                placeholder="Unesite napomenu..."
              />
            </div>

            <div className="col-span-1 mt-4">
              <div className="flex items-center gap-2 h-11">
                <Checkbox
                  checked={formData.iskljucenoIzPracenja}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <Label className="mb-0">Isključiti iz praćenja</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Otkaži
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700"
              >
                Sačuvaj
              </button>
            </div>
          </form>
        </Modal>
      </LocalizationProvider>
    </ThemeProvider>
  );
} 