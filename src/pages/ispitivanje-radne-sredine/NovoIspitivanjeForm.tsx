import React from 'react';
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { sr } from "date-fns/locale";
import { useTheme } from "../../context/ThemeContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CalenderIcon } from "../../icons";

interface NovoIspitivanjeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  title?: string;
}

export default function NovoIspitivanjeForm({ isOpen, onClose, onSave, title = "Novo ispitivanje" }: NovoIspitivanjeFormProps) {
  const { theme: appTheme } = useTheme();
  const [formData, setFormData] = React.useState({
    ispravno: true,
    datumIspitivanja: null,
  });

  const [isDateOpen, setIsDateOpen] = React.useState(false);

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

  const handleDateChange = (value: Date | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, datumIspitivanja: value }));
      setIsDateOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={sr}>
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
                <Label>Status ispitivanja</Label>
                <div className="mt-2">
                  <div className="tabs-container">
                    <div className="tabs-wrapper">
                      <input 
                        type="radio" 
                        id="radio-ispravno" 
                        name="status-tabs" 
                        checked={formData.ispravno}
                        onChange={() => setFormData(prev => ({ ...prev, ispravno: true }))}
                      />
                      <label className="tab" htmlFor="radio-ispravno">
                        Ispravno
                      </label>
                      <input 
                        type="radio" 
                        id="radio-neispravno" 
                        name="status-tabs" 
                        checked={!formData.ispravno}
                        onChange={() => setFormData(prev => ({ ...prev, ispravno: false }))}
                      />
                      <label className="tab" htmlFor="radio-neispravno">
                        Neispravno
                      </label>
                      <span className="glider"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Datum ispitivanja *</Label>
                <DatePicker
                  value={formData.datumIspitivanja}
                  onChange={handleDateChange}
                  open={isDateOpen}
                  onOpen={() => setIsDateOpen(true)}
                  onClose={() => setIsDateOpen(false)}
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
                      onClick: () => setIsDateOpen(true),
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '44px',
                          backgroundColor: appTheme === 'dark' ? '#374151' : '#F9FAFB',
                          cursor: 'pointer',
                          '& fieldset': {
                            borderColor: appTheme === 'dark' ? '#4B5563' : '#D1D5DB',
                          },
                          '&:hover fieldset': {
                            borderColor: appTheme === 'dark' ? '#6B7280' : '#9CA3AF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: appTheme === 'dark' ? '#60A5FA' : '#465FFF',
                          },
                        },
                        '& .MuiInputBase-input': {
                          padding: '12px 14px',
                          cursor: 'pointer',
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
                          backgroundColor: appTheme === 'dark' ? '#374151' : '#F9FAFB',
                          cursor: 'pointer',
                        },
                        endAdornment: (
                          <CalenderIcon 
                            className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDateOpen(true);
                            }}
                          />
                        ),
                      },
                    },
                  }}
                  format="dd/MM/yyyy"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
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