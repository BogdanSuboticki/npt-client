import React from 'react';
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

interface IspitivanjeRadneSredineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function IspitivanjeRadneSredineForm({ isOpen, onClose, onSave }: IspitivanjeRadneSredineFormProps) {
  const { theme: appTheme } = useTheme();
  const [formData, setFormData] = React.useState({
    lokacija: "",
    radnoMesto: "",
    datumIspitivanja: null,
    datumNarednogIspitivanja: null,
    brojStručnogNalaza: "",
    prikaziUPodsetniku: false,
    ispitivanjeOdradjeno: false,
  });

  const [isIspitivanjeOpen, setIsIspitivanjeOpen] = React.useState(false);
  const [isNarednoOpen, setIsNarednoOpen] = React.useState(false);

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
        case 'datumIspitivanja':
          setIsIspitivanjeOpen(false);
          break;
        case 'datumNarednogIspitivanja':
          setIsNarednoOpen(false);
          break;
      }
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
          className="max-w-[800px] p-5 lg:p-8"
        >
          <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
            Ispitivanje radne sredine
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label>Lokacija *</Label>
                <Input
                  type="text"
                  value={formData.lokacija}
                  onChange={(e) => setFormData(prev => ({ ...prev, lokacija: e.target.value }))}
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Radno mesto *</Label>
                <Input
                  type="text"
                  value={formData.radnoMesto}
                  onChange={(e) => setFormData(prev => ({ ...prev, radnoMesto: e.target.value }))}
                  required
                />
              </div>

              <div className="col-span-1">
                <Label>Datum ispitivanja *</Label>
                <DatePicker
                  value={formData.datumIspitivanja}
                  onChange={(newValue) => handleDateChange('datumIspitivanja', newValue)}
                  open={isIspitivanjeOpen}
                  onOpen={() => setIsIspitivanjeOpen(true)}
                  onClose={() => setIsIspitivanjeOpen(false)}
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
                      onClick: () => setIsIspitivanjeOpen(true),
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '44px',
                          backgroundColor: '#F9FAFB',
                          cursor: 'pointer',
                        },
                        '& .MuiInputBase-input': {
                          padding: '12px 14px',
                          cursor: 'pointer',
                        },
                      },
                      InputProps: {
                        style: {
                          borderRadius: 8,
                          height: 44,
                          backgroundColor: '#F9FAFB',
                          cursor: 'pointer',
                        },
                        endAdornment: (
                          <CalenderIcon 
                            className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsIspitivanjeOpen(true);
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
                <Label>Datum narednog ispitivanja *</Label>
                <DatePicker
                  value={formData.datumNarednogIspitivanja}
                  onChange={(newValue) => handleDateChange('datumNarednogIspitivanja', newValue)}
                  open={isNarednoOpen}
                  onOpen={() => setIsNarednoOpen(true)}
                  onClose={() => setIsNarednoOpen(false)}
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
                      onClick: () => setIsNarednoOpen(true),
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '44px',
                          backgroundColor: '#F9FAFB',
                          cursor: 'pointer',
                        },
                        '& .MuiInputBase-input': {
                          padding: '12px 14px',
                          cursor: 'pointer',
                        },
                      },
                      InputProps: {
                        style: {
                          borderRadius: 8,
                          height: 44,
                          backgroundColor: '#F9FAFB',
                          cursor: 'pointer',
                        },
                        endAdornment: (
                          <CalenderIcon 
                            className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsNarednoOpen(true);
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
                <Label>Broj stručnog nalaza *</Label>
                <Input
                  type="text"
                  value={formData.brojStručnogNalaza}
                  onChange={(e) => setFormData(prev => ({ ...prev, brojStručnogNalaza: e.target.value }))}
                  required
                />
              </div>

              <div className="col-span-1">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.prikaziUPodsetniku}
                      onChange={(checked) => setFormData(prev => ({ ...prev, prikaziUPodsetniku: checked }))}
                    />
                    <Label>Prikaži u podsetniku</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.ispitivanjeOdradjeno}
                      onChange={(checked) => setFormData(prev => ({ ...prev, ispitivanjeOdradjeno: checked }))}
                    />
                    <Label>Ispitivanje odrađeno</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Odustani
              </Button>
              <Button
                variant="primary"
              >
                Sačuvaj
              </Button>
            </div>
          </form>
        </Modal>
      </LocalizationProvider>
    </ThemeProvider>
  );
} 