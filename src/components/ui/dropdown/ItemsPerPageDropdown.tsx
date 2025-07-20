import { useState, useRef, useEffect } from "react";

interface ItemsPerPageDropdownProps {
  value: number;
  onChange: (value: number) => void;
  options: number[];
  className?: string;
}

export default function ItemsPerPageDropdown({
  value,
  onChange,
  options,
  className = "",
}: ItemsPerPageDropdownProps) {
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

  const handleOptionClick = (option: number) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-20 sm:w-full ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-11 px-2 sm:px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 overflow-hidden"
      >
        <span>{value}</span>
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
          <div className="py-1">
            {options.map((option, index) => (
              <div
                key={option}
                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${
                  index === options.length - 1 ? 'rounded-b-lg' : ''
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 