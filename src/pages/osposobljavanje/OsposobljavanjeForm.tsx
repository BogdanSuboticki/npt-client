import React, { useEffect } from 'react';
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { sr } from "date-fns/locale";
import Checkbox from "../../components/form/input/Checkbox";
import { useTheme } from "../../context/ThemeContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CalenderIcon } from "../../icons";

interface OsposobljavanjeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function OsposobljavanjeForm({ isOpen, onClose, onSave }: OsposobljavanjeFormProps) {
  const { theme: appTheme } = useTheme();
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

  // Add state for controlling calendar popups
  const [isBZROpen, setIsBZROpen] = React.useState(false);
  const [isNaredniBZROpen, setIsNaredniBZROpen] = React.useState(false);
  const [isZOPOpen, setIsZOPOpen] = React.useState(false);
  const [isNaredniZOPOpen, setIsNaredniZOPOpen] = React.useState(false);

  // Close all date pickers when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsBZROpen(false);
      setIsNaredniBZROpen(false);
      setIsZOPOpen(false);
      setIsNaredniZOPOpen(false);
    }
  }, [isOpen]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.MuiPickersPopper-root') && !target.closest('.MuiInputBase-root')) {
        setIsBZROpen(false);
        setIsNaredniBZROpen(false);
        setIsZOPOpen(false);
        setIsNaredniZOPOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zaposleni || !formData.radnoMesto || !formData.lokacija) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }
    onSave(formData);
    onClose();
  };

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

  const handleDateChange = (field: string, value: Date | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, [field]: value }));
      switch (field) {
        case 'osposobljavanjeBZR':
          setIsBZROpen(false);
          break;
        case 'datumNarednogBZR':
          setIsNaredniBZROpen(false);
          break;
        case 'osposobljavanjeZOP':
          setIsZOPOpen(false);
          break;
        case 'datumNarednogZOP':
          setIsNaredniZOPOpen(false);
          break;
      }
    }
  };

  const toggleDatePicker = (field: string) => {
    switch (field) {
      case 'osposobljavanjeBZR':
        setIsBZROpen(prev => !prev);
        break;
      case 'datumNarednogBZR':
        setIsNaredniBZROpen(prev => !prev);
        break;
      case 'osposobljavanjeZOP':
        setIsZOPOpen(prev => !prev);
        break;
      case 'datumNarednogZOP':
        setIsNaredniZOPOpen(prev => !prev);
        break;
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={sr}>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          className="max-w-[800px] p-5 lg:p-10 dark:bg-gray-800"
        >
          <form onSubmit={handleSubmit}>
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
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
                <DatePicker
                  value={formData.osposobljavanjeBZR}
                  onChange={(newValue) => handleDateChange('osposobljavanjeBZR', newValue)}
                  open={isBZROpen}
                  onOpen={() => setIsBZROpen(true)}
                  onClose={() => setIsBZROpen(false)}
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
                      onClick: () => toggleDatePicker('osposobljavanjeBZR'),
                      onTouchStart: () => toggleDatePicker('osposobljavanjeBZR'),
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
                          cursor: 'pointer',
                        },
                        '& .MuiInputBase-input': {
                          padding: '12px 14px',
                          color: appTheme === 'dark' ? '#F9FAFB' : '#111827',
                          '&::placeholder': {
                            color: appTheme === 'dark' ? '#9CA3AF' : '#6B7280',
                            opacity: 1,
                          },
                          cursor: 'pointer',
                        },
                      },
                      InputProps: {
                        style: {
                          borderRadius: 8,
                          height: 44,
                          backgroundColor: appTheme === 'dark' ? '#101828' : '#F9FAFB',
                          cursor: 'pointer',
                        },
                        endAdornment: (
                          <CalenderIcon 
                            className="size-5 text-gray-500 dark:text-gray-400 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDatePicker('osposobljavanjeBZR');
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              toggleDatePicker('osposobljavanjeBZR');
                            }}
                          />
                        ),
                      },
                    },
                  }}
                  format="dd/MM/yyyy"
                />
              </div>

              <div className="col-span-1">
                <Label>Datum Narednog BZR</Label>
                <DatePicker
                  value={formData.datumNarednogBZR}
                  onChange={(newValue) => handleDateChange('datumNarednogBZR', newValue)}
                  open={isNaredniBZROpen}
                  onOpen={() => setIsNaredniBZROpen(true)}
                  onClose={() => setIsNaredniBZROpen(false)}
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
                      onClick: () => toggleDatePicker('datumNarednogBZR'),
                      onTouchStart: () => toggleDatePicker('datumNarednogBZR'),
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
                          cursor: 'pointer',
                        },
                        '& .MuiInputBase-input': {
                          padding: '12px 14px',
                          color: appTheme === 'dark' ? '#F9FAFB' : '#111827',
                          '&::placeholder': {
                            color: appTheme === 'dark' ? '#9CA3AF' : '#6B7280',
                            opacity: 1,
                          },
                          cursor: 'pointer',
                        },
                      },
                      InputProps: {
                        style: {
                          borderRadius: 8,
                          height: 44,
                          backgroundColor: appTheme === 'dark' ? '#101828' : '#F9FAFB',
                          cursor: 'pointer',
                        },
                        endAdornment: (
                          <CalenderIcon 
                            className="size-5 text-gray-500 dark:text-gray-400 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDatePicker('datumNarednogBZR');
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              toggleDatePicker('datumNarednogBZR');
                            }}
                          />
                        ),
                      },
                    },
                  }}
                  format="dd/MM/yyyy"
                />
              </div>

              <div className="col-span-1">
                <Label>Osposobljavanje ZOP</Label>
                <DatePicker
                  value={formData.osposobljavanjeZOP}
                  onChange={(newValue) => handleDateChange('osposobljavanjeZOP', newValue)}
                  open={isZOPOpen}
                  onOpen={() => setIsZOPOpen(true)}
                  onClose={() => setIsZOPOpen(false)}
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
                      onClick: () => toggleDatePicker('osposobljavanjeZOP'),
                      onTouchStart: () => toggleDatePicker('osposobljavanjeZOP'),
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
                          cursor: 'pointer',
                        },
                        '& .MuiInputBase-input': {
                          padding: '12px 14px',
                          color: appTheme === 'dark' ? '#F9FAFB' : '#111827',
                          '&::placeholder': {
                            color: appTheme === 'dark' ? '#9CA3AF' : '#6B7280',
                            opacity: 1,
                          },
                          cursor: 'pointer',
                        },
                      },
                      InputProps: {
                        style: {
                          borderRadius: 8,
                          height: 44,
                          backgroundColor: appTheme === 'dark' ? '#101828' : '#F9FAFB',
                          cursor: 'pointer',
                        },
                        endAdornment: (
                          <CalenderIcon 
                            className="size-5 text-gray-500 dark:text-gray-400 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDatePicker('osposobljavanjeZOP');
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              toggleDatePicker('osposobljavanjeZOP');
                            }}
                          />
                        ),
                      },
                    },
                  }}
                  format="dd/MM/yyyy"
                />
              </div>

              <div className="col-span-1">
                <Label>Datum Narednog ZOP</Label>
                <DatePicker
                  value={formData.datumNarednogZOP}
                  onChange={(newValue) => handleDateChange('datumNarednogZOP', newValue)}
                  open={isNaredniZOPOpen}
                  onOpen={() => setIsNaredniZOPOpen(true)}
                  onClose={() => setIsNaredniZOPOpen(false)}
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
                      onClick: () => toggleDatePicker('datumNarednogZOP'),
                      onTouchStart: () => toggleDatePicker('datumNarednogZOP'),
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
                          cursor: 'pointer',
                        },
                        '& .MuiInputBase-input': {
                          padding: '12px 14px',
                          color: appTheme === 'dark' ? '#F9FAFB' : '#111827',
                          '&::placeholder': {
                            color: appTheme === 'dark' ? '#9CA3AF' : '#6B7280',
                            opacity: 1,
                          },
                          cursor: 'pointer',
                        },
                      },
                      InputProps: {
                        style: {
                          borderRadius: 8,
                          height: 44,
                          backgroundColor: appTheme === 'dark' ? '#101828' : '#F9FAFB',
                          cursor: 'pointer',
                        },
                        endAdornment: (
                          <CalenderIcon 
                            className="size-5 text-gray-500 dark:text-gray-400 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDatePicker('datumNarednogZOP');
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              toggleDatePicker('datumNarednogZOP');
                            }}
                          />
                        ),
                      },
                    },
                  }}
                  format="dd/MM/yyyy"
                />
              </div>

              <div className="col-span-1">
                <Label>Povećani Rizik</Label>
                <div className="mt-2">
                  <Checkbox
                    checked={formData.povecanRizik}
                    onChange={(checked) => setFormData({...formData, povecanRizik: checked})}
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
      </LocalizationProvider>
    </ThemeProvider>
  );
}

