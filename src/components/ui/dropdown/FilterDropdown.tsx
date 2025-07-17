import { useState, useRef, useEffect } from "react";
import Checkbox from "../../form/input/Checkbox";

interface FilterDropdownProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (options: string[]) => void;
  className?: string;
}

export default function FilterDropdown({
  label,
  options,
  selectedOptions,
  onSelectionChange,
  className = "",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      // If all are selected, deselect all
      onSelectionChange([]);
    } else {
      // If not all are selected, select all
      onSelectionChange([...options]);
    }
  };

  const handleOptionChange = (value: string) => {
    const newSelection = selectedOptions.includes(value)
      ? selectedOptions.filter(item => item !== value)
      : [...selectedOptions, value];
    
    // If we're deselecting the last item, deselect "Prikaži sve" as well
    if (newSelection.length === 0) {
      onSelectionChange([]);
    } else {
      onSelectionChange(newSelection);
    }
  };

  return (
    <div className={`relative w-full lg:w-auto ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 overflow-hidden"
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
          <span>{label}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ml-2 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
              <div
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none"
                onClick={handleSelectAll}
              >
                <Checkbox
                  checked={selectedOptions.length === options.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 min-w-[16px] min-h-[16px] flex-shrink-0"
                  id={`select-all-${label}`}
                />
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Prikaži sve</span>
              </div>
            </div>
            <div className="pt-1">
              {options.map((option, index) => (
                <div
                  key={option}
                  className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                    index === options.length - 1 ? 'rounded-bl-lg' : ''
                  }`}
                  onClick={() => handleOptionChange(option)}
                >
                  <Checkbox
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                    className="w-4 h-4 min-w-[16px] min-h-[16px] flex-shrink-0"
                    id={`${label}-${option}`}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 