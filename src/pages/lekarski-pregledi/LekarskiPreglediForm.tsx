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

interface LekarskiPreglediFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function LekarskiPreglediForm({ isOpen, onClose, onSave }: LekarskiPreglediFormProps) {
  const { theme: appTheme } = useTheme();
  const [formData, setFormData] = React.useState({
    zaposleni: "",
    radnoMesto: "",
    povecanRizik: false,
    vrstaLekarskog: "",
    datumLekarskog: new Date(),
    intervalLekarskog: "",
    datumNarednogLekarskog: new Date(),
  });

  // Add state for dropdowns
  const [isRadnoMestoOpen, setIsRadnoMestoOpen] = React.useState(false);
  const [isVrstaLekarskogOpen, setIsVrstaLekarskogOpen] = React.useState(false);
  const radnoMestoRef = useRef<HTMLDivElement>(null);
  const vrstaLekarskogRef = useRef<HTMLDivElement>(null);

  // Example options - replace with actual data
  const radnoMestoOptions = ["Radno mesto 1", "Radno mesto 2", "Radno mesto 3"];
  const vrstaLekarskogOptions = ["Prethodni", "Periodični", "Vanredni"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (radnoMestoRef.current && !radnoMestoRef.current.contains(target)) {
        setIsRadnoMestoOpen(false);
      }
      if (vrstaLekarskogRef.current && !vrstaLekarskogRef.current.contains(target)) {
        setIsVrstaLekarskogOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add state for controlling calendar popups
  const [isLekarskiOpen, setIsLekarskiOpen] = React.useState(false);
  const [isNaredniLekarskiOpen, setIsNaredniLekarskiOpen] = React.useState(false);

  // Close all date pickers when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsLekarskiOpen(false);
      setIsNaredniLekarskiOpen(false);
    }
  }, [isOpen]);

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
    if (!formData.zaposleni || !formData.datumLekarskog || !formData.intervalLekarskog || !formData.datumNarednogLekarskog) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      povecanRizik: checked
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Novi Lekarski Pregled</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label>Zaposleni *</Label>
                <input
                  type="text"
                  name="zaposleni"
                  value={formData.zaposleni}
                  onChange={handleInputChange}
                  className="w-full px-4 h-11 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90"
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Radno mesto</Label>
                <div className="relative w-full" ref={radnoMestoRef}>
                  <button
                    type="button"
                    onClick={() => setIsRadnoMestoOpen(!isRadnoMestoOpen)}
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
                      <span>{formData.radnoMesto || "Izaberi radno mesto"}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isRadnoMestoOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isRadnoMestoOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {radnoMestoOptions.map((option, index) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.radnoMesto === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === radnoMestoOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, radnoMesto: option });
                              setIsRadnoMestoOpen(false);
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
                <Label>Vrsta lekarskog</Label>
                <div className="relative w-full" ref={vrstaLekarskogRef}>
                  <button
                    type="button"
                    onClick={() => setIsVrstaLekarskogOpen(!isVrstaLekarskogOpen)}
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
                      <span>{formData.vrstaLekarskog || "Izaberi vrstu lekarskog"}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isVrstaLekarskogOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isVrstaLekarskogOpen && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                        {vrstaLekarskogOptions.map((option, index) => (
                          <div
                            key={option}
                            className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                              formData.vrstaLekarskog === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === vrstaLekarskogOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, vrstaLekarskog: option });
                              setIsVrstaLekarskogOpen(false);
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
                <Label>Datum lekarskog pregleda *</Label>
                <DatePicker
                  value={formData.datumLekarskog}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFormData(prev => ({ ...prev, datumLekarskog: newValue }));
                      setIsLekarskiOpen(false);
                    }
                  }}
                  format="dd/MM/yyyy"
                  open={isLekarskiOpen}
                  onOpen={() => setIsLekarskiOpen(true)}
                  onClose={() => setIsLekarskiOpen(false)}
                  slots={{
                    toolbar: () => null
                  }}
                  slotProps={{
                    popper: {
                      sx: {
                        zIndex: 999999
                      }
                    },
                    textField: {
                      size: "small",
                      fullWidth: true,
                      onClick: () => setIsLekarskiOpen(true),
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
                              setIsLekarskiOpen(true);
                            }}
                          />
                        ),
                      },
                    },
                  }}
                />
              </div>

              <div className="col-span-1">
                <Label>Interval lekarskog pregleda *</Label>
                <input
                  type="text"
                  name="intervalLekarskog"
                  value={formData.intervalLekarskog}
                  onChange={handleInputChange}
                  className="w-full px-4 h-11 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90"
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Datum narednog lekarskog pregleda *</Label>
                <DatePicker
                  value={formData.datumNarednogLekarskog}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFormData(prev => ({ ...prev, datumNarednogLekarskog: newValue }));
                      setIsNaredniLekarskiOpen(false);
                    }
                  }}
                  format="dd/MM/yyyy"
                  open={isNaredniLekarskiOpen}
                  onOpen={() => setIsNaredniLekarskiOpen(true)}
                  onClose={() => setIsNaredniLekarskiOpen(false)}
                  slots={{
                    toolbar: () => null
                  }}
                  slotProps={{
                    popper: {
                      sx: {
                        zIndex: 999999
                      }
                    },
                    textField: {
                      size: "small",
                      fullWidth: true,
                      onClick: () => setIsNaredniLekarskiOpen(true),
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
                              setIsNaredniLekarskiOpen(true);
                            }}
                          />
                        ),
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="col-span-1 mt-4">
              <div className="flex items-center gap-2 h-11">
                <Checkbox
                  checked={formData.povecanRizik}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <Label className="mb-0">Povećan rizik</Label>
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