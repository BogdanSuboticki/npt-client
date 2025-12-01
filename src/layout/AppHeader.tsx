import { useEffect, useRef, useState } from "react";

import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { useCompanySelection } from "../context/CompanyContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import SearchInput from "../pages/UiElements/SearchInput";
import { companies, Company } from "../data/companies";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'notification' | 'user' | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [showFullList, setShowFullList] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { selectCompany, selectedCompany } = useCompanySelection();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const handleNotificationToggle = () => {
    setOpenDropdown(openDropdown === 'notification' ? null : 'notification');
  };

  const handleUserToggle = () => {
    setOpenDropdown(openDropdown === 'user' ? null : 'user');
  };

  const closeAllDropdowns = () => {
    setOpenDropdown(null);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchValue(value);
    setShowFullList(true); // Always show the full list when typing
    selectCompany(null);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    selectCompany(null);
    // Don't change showFullList state - keep dropdown open
  };

  const handleSearchInputClick = () => {
    if (searchValue.length === 0) {
      setShowFullList(true);
    }
  };

  const handleMobileSearchToggle = () => {
    if (!showMobileSearch) {
      // When opening mobile search, show full list and focus the input
      setShowMobileSearch(true);
      setShowFullList(true);
      setTimeout(() => {
        const mobileSearchInput = document.getElementById('mobile-search-input');
        mobileSearchInput?.focus();
      }, 100);
    } else {
      // When closing mobile search, clear search and hide list
      setShowMobileSearch(false);
      setShowFullList(false);
      if (selectedCompany) {
        setSearchValue(selectedCompany.naziv);
      } else {
        setSearchValue('');
      }
    }
  };

  const handleCompanySelect = (company: Company) => {
    setSearchValue(company.naziv);
    selectCompany(company);
    setShowFullList(false);
    setShowMobileSearch(false);
  };


  const handleSearchButtonClick = () => {
    if (searchValue.trim()) {
      // Here you could add search functionality
      console.log('Searching for:', searchValue);
    } else {
      // Show full alphabetical list when no search term
      setShowFullList(true);
    }
  };

  // Group companies alphabetically and filter based on search value
  const getAlphabeticalGroups = () => {
    // Filter companies based on search value
    const filteredCompanies = searchValue.length > 0 
      ? companies.filter(company =>
          company.naziv.toLowerCase().includes(searchValue.toLowerCase()) ||
          company.mesto.toLowerCase().includes(searchValue.toLowerCase()) ||
          (company.delatnost && company.delatnost.toLowerCase().includes(searchValue.toLowerCase()))
        )
      : companies; // Show all companies when search is empty
    
    const sortedCompanies = [...filteredCompanies].sort((a, b) => 
      a.naziv.toLowerCase().localeCompare(b.naziv.toLowerCase())
    );
    
    const groups: { [key: string]: Company[] } = {};
    sortedCompanies.forEach(company => {
      const firstLetter = company.naziv.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(company);
    });
    
    return groups;
  };


  const inputRef = useRef<HTMLInputElement>(null);
  const fullListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        if (showFullList) {
          setShowFullList(false);
        }
        if (showMobileSearch) {
          setShowMobileSearch(false);
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking on the clear button
      if (target.closest('button[title="Obriši pretragu"]')) {
        return;
      }
      
      // Don't close if clicking on a company item in the dropdown
      if (target.closest('[data-company-item]')) {
        return;
      }
      
      if (fullListRef.current && !fullListRef.current.contains(event.target as Node)) {
        setShowFullList(false);
      }
      // Close mobile search when clicking outside
      if (showMobileSearch && !target.closest('[data-mobile-search]')) {
        setShowMobileSearch(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showFullList, showMobileSearch]);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-50 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="currentColor"
                />
              </svg>
            )}
            {/* Cross Icon */}
          </button>

           {!showMobileSearch ? (
             <Link to="/" className="lg:hidden">
               <span className="text-[26px] font-semibold text-gray-800 dark:text-white">HSEradar</span>
             </Link>
           ) : (
             <div className="lg:hidden flex items-center gap-2 flex-1" data-mobile-search>
               <div className="relative flex-1">
                 <input
                   id="mobile-search-input"
                   type="text"
                   placeholder="Unesite naziv firme..."
                   value={searchValue}
                   onChange={(e) => handleSearchInputChange(e.target.value)}
                   onClick={() => setShowFullList(true)}
                   className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
                 {searchValue && (
                   <button
                     onClick={() => setSearchValue('')}
                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
               </div>
             </div>
           )}

          {/* Mobile Search Results */}
          {showMobileSearch && showFullList && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-b-lg shadow-theme-lg max-h-[400px] overflow-hidden lg:hidden" data-mobile-search>
              {/* Company List */}
              <div className="overflow-y-auto" style={{ height: '400px' }}>
                {Object.keys(getAlphabeticalGroups()).length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <p className="text-sm">Nema rezultata</p>
                      <p className="text-xs mt-1">Pokušajte sa drugim pretraživanjem</p>
                    </div>
                  </div>
                ) : (
                  Object.entries(getAlphabeticalGroups())
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([letter, companies]) => (
                      <div key={letter} id={`mobile-section-${letter}`} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                        <div className="sticky top-0 bg-gray-100 dark:bg-gray-800 px-4 py-2">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{letter}</h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {companies.map((company) => (
                            <div
                              key={company.id}
                              data-company-item
                              className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCompanySelect(company);
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                              }}
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
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 lg:hidden" data-mobile-search>
            <button
              onClick={handleMobileSearchToggle}
              className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {showMobileSearch ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
                    stroke="currentColor"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={toggleApplicationMenu}
              className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
            </button>
          </div>

          <div className="hidden lg:block relative">
            <form>
               <SearchInput
                 ref={inputRef}
                 placeholder="Unesite naziv firme..."
                 className="xl:w-[430px] !bg-[#F9FAFB] dark:!bg-[#101828]"
                 buttonContent={
                   <>
                     <span>Pretraži</span>
                   </>
                 }
                 onButtonClick={handleSearchButtonClick}
                 onClick={handleSearchInputClick}
                 onInputChange={handleSearchInputChange}
                 value={searchValue}
                 showClearButton={showFullList}
                 onClearClick={handleClearSearch}
               />
            </form>
            
            {/* Full Company List Modal */}
            {showFullList && (
              <div ref={fullListRef} className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-b-lg shadow-theme-lg max-h-[600px] overflow-hidden">
                 {/* Company List */}
                 <div className="overflow-y-auto" style={{ height: '600px' }}>
                   {Object.keys(getAlphabeticalGroups()).length === 0 ? (
                     <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                       <div className="text-center">
                         <p className="text-sm">Nema rezultata</p>
                         <p className="text-xs mt-1">Pokušajte sa drugim pretraživanjem</p>
                       </div>
                     </div>
                   ) : (
                     Object.entries(getAlphabeticalGroups())
                       .sort(([a], [b]) => a.localeCompare(b))
                       .map(([letter, companies]) => (
                        <div key={letter} id={`section-${letter}`} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                          <div className="sticky top-0 bg-gray-100 dark:bg-gray-800 px-4 py-2">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{letter}</h3>
                          </div>
                          <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {companies.map((company) => (
                              <div
                                key={company.id}
                                data-company-item
                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCompanySelect(company);
                                }}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                }}
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
                        </div>
                      ))
                   )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* <!-- Dark Mode Toggler --> */}
            <ThemeToggleButton />
            {/* <!-- Dark Mode Toggler --> */}
            <NotificationDropdown 
              isOpen={openDropdown === 'notification'}
              onToggle={handleNotificationToggle}
              onClose={closeAllDropdowns}
            />
            {/* <!-- Notification Menu Area --> */}
          </div>
          {/* <!-- User Area --> */}
          <UserDropdown 
            isOpen={openDropdown === 'user'}
            onToggle={handleUserToggle}
            onClose={closeAllDropdowns}
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
