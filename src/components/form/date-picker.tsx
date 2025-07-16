import { useEffect, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

// Function to detect mobile devices
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(isMobile());
    };
    
    // Check on mount
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Only initialize flatpickr on desktop
    if (!isMobileDevice) {
      const flatPickr = flatpickr(`#${id}`, {
        mode: mode || "single",
        static: true,
        monthSelectorType: "static",
        dateFormat: "Y-m-d",
        defaultDate,
        onChange,
      });

      return () => {
        if (!Array.isArray(flatPickr)) {
          flatPickr.destroy();
        }
      };
    }
  }, [mode, onChange, id, defaultDate, isMobileDevice]);

  // Handle native date input change
  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onChange) {
      if (value) {
        const date = new Date(value);
        // Call onChange with the same signature as flatpickr
        if (Array.isArray(onChange)) {
          onChange.forEach(callback => callback([date], e.target.value, flatpickr as any));
        } else {
          onChange([date], e.target.value, flatpickr as any);
        }
      } else {
        // Handle empty value (no date selected)
        if (Array.isArray(onChange)) {
          onChange.forEach(callback => callback([], '', flatpickr as any));
        } else {
          onChange([], '', flatpickr as any);
        }
      }
    }
  };

  // Format date for native input (YYYY-MM-DD)
  const formatDateForNativeInput = (date: DateOption): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        {isMobileDevice ? (
          // Native date input for mobile
          <input
            id={id}
            type="date"
            defaultValue={defaultDate ? formatDateForNativeInput(defaultDate) : ''}
            onChange={handleNativeDateChange}
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
          />
        ) : (
          // Flatpickr input for desktop
          <>
            <input
              id={id}
              placeholder={placeholder}
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <CalenderIcon className="size-6" />
            </span>
          </>
        )}
      </div>
    </div>
  );
}
