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
  showClearButton?: boolean;
  onClearClick?: () => void;
  preventOnChange?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ 
    buttonContent, 
    onButtonClick, 
    suggestions = [], 
    onSuggestionSelect, 
    showSuggestions = false, 
    onInputChange,
    showClearButton = false,
    onClearClick,
    preventOnChange = false,
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
      if (!preventOnChange) {
        onInputChange?.(value);
        setIsSuggestionsOpen(value.length > 0 && showSuggestions);
        setSelectedIndex(-1);
      }
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
          value={props.value || ''}
          className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 ${showClearButton ? 'pr-20' : 'pr-14'} text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          {...(Object.fromEntries(Object.entries(props).filter(([key]) => key !== 'value')))}
        />

        {showClearButton && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (combinedRef.current) {
                combinedRef.current.value = '';
              }
              onClearClick?.();
            }}
            className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mr-2"
            title="Obriši pretragu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}

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
          <div className="absolute top-full left-0 right-0 z-50 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-900">
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