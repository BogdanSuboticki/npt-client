import React, { useState } from 'react';
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { sr } from "date-fns/locale";
import { useTheme } from "../../../context/ThemeContext";


// Import the datepicker icon
const DatePickerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2V4M6 2V4M11.996 13H12.004M11.996 17H12.004M15.991 13H16M8 13H8.009M8 17H8.009M3.5 8H20.5M3 8H21M2.5 12.243C2.5 7.886 2.5 5.707 3.752 4.353C5.004 3 7.02 3 11.05 3H12.95C16.98 3 18.996 3 20.248 4.354C21.5 5.707 21.5 7.886 21.5 12.244V12.757C21.5 17.114 21.5 19.293 20.248 20.647C18.996 22 16.98 22 12.95 22H11.05C7.02 22 5.004 22 3.752 20.646C2.5 19.293 2.5 17.114 2.5 12.756V12.243Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface CustomDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = ""
}) => {
  const { theme: appTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (newValue: Date | null) => {
    onChange(newValue);
    setIsOpen(false);
  };

  const toggleDatePicker = () => {
    if (!disabled) {
      setTimeout(() => {
        setIsOpen(prev => !prev);
      }, 150); // 150ms delay
    }
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

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={sr}>
        {/* Use the same custom UI for both mobile and desktop for consistency */}
        <div className="relative custom-date-picker-input">
          <div 
            className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs bg-[#F9FAFB] text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:bg-[#101828] dark:focus:border-brand-800 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
            onClick={toggleDatePicker}
            onTouchStart={toggleDatePicker}
          >
            <div className="flex items-center justify-between h-full">
              <span className={`${value ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-gray-500'}`}>
                {value ? value.toLocaleDateString('sr-RS') : placeholder || 'Izaberi datum'}
              </span>
              <div 
                className={`text-gray-500 dark:text-gray-400 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
                onClick={(e: React.MouseEvent) => {
                  if (!disabled) {
                    e.stopPropagation();
                    toggleDatePicker();
                  }
                }}
                onTouchStart={(e: React.TouchEvent) => {
                  if (!disabled) {
                    e.stopPropagation();
                    toggleDatePicker();
                  }
                }}
              >
                <DatePickerIcon />
              </div>
            </div>
          </div>
          
          <MuiDatePicker
            value={value}
            onChange={handleDateChange}
            open={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            format="dd/MM/yyyy"
            disabled={disabled}
            slots={{
              toolbar: () => null
            }}
            slotProps={{
              textField: {
                style: { 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  pointerEvents: 'none'
                }
              },
            }}
          />
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default CustomDatePicker; 