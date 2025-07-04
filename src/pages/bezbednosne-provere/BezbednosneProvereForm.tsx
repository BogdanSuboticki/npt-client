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

interface BezbednosneProvereFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function BezbednosneProvereForm({ isOpen, onClose, onSave }: BezbednosneProvereFormProps) {
  const { theme: appTheme } = useTheme();
  const isMobile = useIsMobile();
  const [formData, setFormData] = React.useState({
    lokacija: "",
    datumProvere: new Date(),
    periodProvere: "",
    sledecaProvera: new Date(),
    napomena: "",
  });

  // Add state for dropdowns
  const [isRadnoMestoOpen, setIsRadnoMestoOpen] = React.useState(false);
  const radnoMestoRef = useRef<HTMLDivElement>(null);

  // Example options - replace with actual data
  const radnoMestoOptions = ["Radno mesto 1", "Radno mesto 2", "Radno mesto 3"];

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (radnoMestoRef.current && !radnoMestoRef.current.contains(target)) {
        setIsRadnoMestoOpen(false);
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
    if (!formData.lokacija || !formData.datumProvere || !formData.periodProvere) {
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



  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={sr}>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Nova Bezbednosna Provera</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label>Lokacija *</Label>
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
                      <span>{formData.lokacija || "Izaberi lokaciju"}</span>
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
                              formData.lokacija === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${index === radnoMestoOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, lokacija: option });
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
                <Label>Datum provere *</Label>
                {isMobile ? (
                  <input
                    type="date"
                    value={formData.datumProvere ? formData.datumProvere.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : new Date();
                      setFormData(prev => ({ ...prev, datumProvere: date }));
                    }}
                    className="w-full px-4 h-11 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90"
                    required
                  />
                ) : (
                  <DatePicker
                    value={formData.datumProvere}
                    onChange={(newValue) => {
                      if (newValue) {
                        setFormData(prev => ({ ...prev, datumProvere: newValue }));
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
                          zIndex: 9999999
                        }
                      },
                      textField: {
                        size: "small",
                        fullWidth: true,
                        onClick: () => setIsLekarskiOpen(true),
                        onTouchStart: () => setIsLekarskiOpen(true),
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
                              onTouchStart={(e) => {
                                e.stopPropagation();
                                setIsLekarskiOpen(true);
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
                <Label>Period provere u danima *</Label>
                <input
                  type="number"
                  name="periodProvere"
                  value={formData.periodProvere}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, periodProvere: value }));
                    
                    // Automatically calculate next inspection date
                    if (value && formData.datumProvere) {
                      const days = parseInt(value);
                      const nextDate = new Date(formData.datumProvere);
                      nextDate.setDate(nextDate.getDate() + days);
                      setFormData(prev => ({ ...prev, sledecaProvera: nextDate }));
                    }
                  }}
                  placeholder="Unesite broj dana"
                  min="1"
                  className="w-full px-4 h-11 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90"
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Sledeća provera</Label>
                {isMobile ? (
                  <input
                    type="date"
                    value={formData.sledecaProvera ? formData.sledecaProvera.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : new Date();
                      setFormData(prev => ({ ...prev, sledecaProvera: date }));
                    }}
                    className="w-full px-4 h-11 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90"
                    readOnly
                  />
                ) : (
                  <DatePicker
                    value={formData.sledecaProvera}
                    onChange={(newValue) => {
                      if (newValue) {
                        setFormData(prev => ({ ...prev, sledecaProvera: newValue }));
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
                          zIndex: 9999999
                        }
                      },
                      textField: {
                        size: "small",
                        fullWidth: true,
                        onClick: () => setIsNaredniLekarskiOpen(true),
                        onTouchStart: () => setIsNaredniLekarskiOpen(true),
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
                              onTouchStart={(e) => {
                                e.stopPropagation();
                                setIsNaredniLekarskiOpen(true);
                              }}
                            />
                          ),
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>

            <div className="col-span-2 mt-4">
              <Label>Napomena</Label>
              <textarea
                name="napomena"
                value={formData.napomena}
                onChange={handleInputChange}
                placeholder="Unesite napomenu..."
                className="w-full px-4 py-3 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg resize-none dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10"
                rows={3}
              />
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