import React, { forwardRef, useState, useEffect, useRef } from 'react';

interface Company {
  id: string;
  naziv: string;
  mesto: string;
  pib?: string;
  maticniBroj?: string;
  delatnost?: string;
}

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  buttonContent?: React.ReactNode;
  onButtonClick?: () => void;
  suggestions?: Company[];
  onSuggestionSelect?: (company: Company) => void;
  showSuggestions?: boolean;
  onInputChange?: (value: string) => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ 
    buttonContent, 
    onButtonClick, 
    suggestions = [], 
    onSuggestionSelect, 
    showSuggestions = false, 
    onInputChange,
    className = '', 
    ...props 
  }, ref) => {
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Combine refs
    const combinedRef = (ref || inputRef) as React.RefObject<HTMLInputElement>;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
          setIsSuggestionsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onInputChange?.(value);
      setIsSuggestionsOpen(value.length > 0 && showSuggestions);
      setSelectedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isSuggestionsOpen || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSuggestionSelect(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsSuggestionsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    const handleSuggestionSelect = (company: Company) => {
      if (combinedRef.current) {
        combinedRef.current.value = company.naziv;
      }
      onSuggestionSelect?.(company);
      setIsSuggestionsOpen(false);
      setSelectedIndex(-1);
    };

    return (
      <div className="relative" ref={suggestionsRef}>
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-gray-400 dark:text-gray-500"
          >
            <path
              d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <input
          ref={combinedRef}
          type="text"
          className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          {...props}
        />

        {buttonContent && (
          <button
            onClick={onButtonClick}
            className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
          >
            {buttonContent}
          </button>
        )}

        {/* Suggestions Dropdown */}
        {isSuggestionsOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-900">
            {suggestions.map((company, index) => (
              <div
                key={company.id}
                className={`cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  index === selectedIndex ? 'bg-gray-50 dark:bg-gray-800' : ''
                } ${index === 0 ? 'rounded-t-lg' : ''} ${
                  index === suggestions.length - 1 ? 'rounded-b-lg' : ''
                }`}
                onClick={() => handleSuggestionSelect(company)}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {company.naziv}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{company.mesto}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput; 