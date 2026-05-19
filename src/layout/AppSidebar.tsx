import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useUser } from "../context/UserContext";

// Assume these icons are imported from an icon library
import {
  ChevronDownIcon,
  HorizontaLDots,
  GroupIcon,
  ZaposleniIcon,
  RadnaMestaIcon,
  OsposobljavanjeIcon,
  LokacijeIcon,
  OpremaIcon,
  LekarskiPreglediIcon,
  PreglediOpremeIcon,
  IspitivanjeSredineIcon,
  BezbednosnePromeneIcon,
  InspekcijskiNadzorIcon,
  ZaduzenjaLZOIcon,
  PovredeIcon,
  DnevniIzvestajiIcon,
  RokoviIcon,
  ObrasciIcon,
  NotesIcon,
  CestaPitanjaIcon,
  TehnickaPodrskaIcon,
  MojNalogIcon,
} from "../icons";

import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GroupIcon />,
    name: "Preduzeća/Radnje",
    path: "/firme?context=moja-firma",
  },
  {
    icon: <ZaposleniIcon />,
    name: "Zaposleni",
    path: "/zaposleni?context=moja-firma",
  },
  {
    icon: <ZaposleniIcon />,
    name: "Angažovanja",
    path: "/angazovanja?context=moja-firma",
  },
  {
    icon: <RadnaMestaIcon />,
    name: "Radna Mesta",
    path: "/radna-mesta?context=moja-firma",
  },
  {
    icon: <OsposobljavanjeIcon />,
    name: "Osposobljavanje",
    path: "/osposobljavanje?context=moja-firma",
  },
  {
    icon: <LokacijeIcon />,
    name: "Lokacije",
    path: "/lokacije?context=moja-firma",
  },
  {
    icon: <OpremaIcon />,
    name: "Oprema",
    path: "/oprema?context=moja-firma",
  },
  {
    icon: <OpremaIcon />,
    name: "LZS",
    path: "/lzs?context=moja-firma",
  },
  {
    icon: <LekarskiPreglediIcon />,
    name: "Lekarski Pregledi",
    path: "/lekarski-pregledi?context=moja-firma",
  },
  {
    icon: <PreglediOpremeIcon />,
    name: "Pregledi Opreme",
    path: "/pregledi-opreme?context=moja-firma",
  },
  {
    icon: <IspitivanjeSredineIcon />,
    name: "Ispitivanje Sredine",
    path: "/ispitivanje-radne-sredine?context=moja-firma",
  },
  {
    icon: <BezbednosnePromeneIcon />,
    name: "Kontrola Radnih Mesta",
    path: "/bezbednosne-provere?context=moja-firma",
  },
  {
    icon: <InspekcijskiNadzorIcon />,
    name: "Inspekcijski Nadzor",
    path: "/inspekcijski-nadzor?context=moja-firma",
  },
  {
    icon: <ZaduzenjaLZOIcon />,
    name: "Zaduženja LZS",
    path: "/zaduzenja-lzo?context=moja-firma",
  },
  {
    icon: <PovredeIcon />,
    name: "Povrede",
    path: "/povrede?context=moja-firma",
  },
  {
    icon: <DnevniIzvestajiIcon />,
    name: "Dnevni Izveštaji",
    path: "/dnevni-izvestaji?context=moja-firma",
  },
  {
    icon: <RokoviIcon />,
    name: "Rokovi",
    path: "/rokovi?context=moja-firma",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <ObrasciIcon />,
    name: "Obrasci",
    path: "/obrasci"
  },
  {
    icon: <NotesIcon />,
    name: "Notes",
    path: "/notes",
  },
  {
    icon: <CestaPitanjaIcon />,
    name: "Česta pitanja",
    path: "/faq",
  },
  {
    icon: <TehnickaPodrskaIcon />,
    name: "Tehnička podrška",
    path: "/tehnicka-podrska",
  },
  {
    icon: <MojNalogIcon />,
    name: "Moj nalog",
    path: "/profile",
  },
];

const komitentOthersItems: NavItem[] = [
  {
    icon: <DnevniIzvestajiIcon />,
    name: "Dnevni izveštaj",
    path: "/",
  },
  {
    icon: <ObrasciIcon />,
    name: "Obrasci",
    path: "/obrasci"
  },
  {
    icon: <NotesIcon />,
    name: "Notes",
    path: "/notes",
  },
  {
    icon: <CestaPitanjaIcon />,
    name: "Česta pitanja",
    path: "/faq",
  },
  {
    icon: <TehnickaPodrskaIcon />,
    name: "Tehnička podrška",
    path: "/tehnicka-podrska",
  },
  {
    icon: <MojNalogIcon />,
    name: "Moj nalog",
    path: "/profile",
  },
];

const supportItems: NavItem[] = [
  {
    icon: <GroupIcon />,
    name: "Preduzeća/Radnje",
    path: "/firme?context=komitenti",
  },
  {
    icon: <ZaposleniIcon />,
    name: "Zaposleni",
    path: "/zaposleni?context=komitenti",
  },
  {
    icon: <ZaposleniIcon />,
    name: "Angažovanja",
    path: "/angazovanja?context=komitenti",
  },
  {
    icon: <RadnaMestaIcon />,
    name: "Radna mesta",
    path: "/radna-mesta?context=komitenti",
  },
  {
    icon: <OsposobljavanjeIcon />,
    name: "Osposobljavanje",
    path: "/osposobljavanje?context=komitenti",
  },
  {
    icon: <LokacijeIcon />,
    name: "Lokacije",
    path: "/lokacije?context=komitenti",
  },
  {
    icon: <OpremaIcon />,
    name: "Oprema",
    path: "/oprema?context=komitenti",
  },
  {
    icon: <OpremaIcon />,
    name: "LZS",
    path: "/lzs?context=komitenti",
  },
  {
    icon: <LekarskiPreglediIcon />,
    name: "Lekarski pregledi",
    path: "/lekarski-pregledi?context=komitenti",
  },
  {
    icon: <PreglediOpremeIcon />,
    name: "Pregledi opreme",
    path: "/pregledi-opreme?context=komitenti",
  },
  {
    icon: <IspitivanjeSredineIcon />,
    name: "Ispitivanje sredine",
    path: "/ispitivanje-radne-sredine?context=komitenti",
  },
  {
    icon: <BezbednosnePromeneIcon />,
    name: "Kontrola Radnih Mesta",
    path: "/bezbednosne-provere?context=komitenti",
  },
  {
    icon: <InspekcijskiNadzorIcon />,
    name: "Inspekcijski nadzor",
    path: "/inspekcijski-nadzor?context=komitenti",
  },
  {
    icon: <ZaduzenjaLZOIcon />,
    name: "Zaduženja LZS",
    path: "/zaduzenja-lzo?context=komitenti",
  },
  {
    icon: <PovredeIcon />,
    name: "Povrede",
    path: "/povrede?context=komitenti",
  },
  {
    icon: <DnevniIzvestajiIcon />,
    name: "Dnevni izveštaji",
    path: "/dnevni-izvestaji?context=komitenti",
  },
  {
    icon: <RokoviIcon />,
    name: "Rokovi",
    path: "/rokovi?context=komitenti",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } = useSidebar();
  const location = useLocation();
  const { userType, showMojaFirma, showKomitenti, organizationSettings } = useUser();
  
  const [isMojaFirmaCollapsed, setIsMojaFirmaCollapsed] = useState(() => {
    const saved = localStorage.getItem('isMojaFirmaCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isKomitentiCollapsed, setIsKomitentiCollapsed] = useState(() => {
    const saved = localStorage.getItem('isKomitentiCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isOstaloCollapsed, setIsOstaloCollapsed] = useState(() => {
    const saved = localStorage.getItem('isOstaloCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const mojaFirmaRef = useRef<HTMLDivElement>(null);
  const komitentiRef = useRef<HTMLDivElement>(null);
  const ostaloRef = useRef<HTMLDivElement>(null);
  const [mojaFirmaHeight, setMojaFirmaHeight] = useState<number>(0);
  const [komitentiHeight, setKomitentiHeight] = useState<number>(0);
  const [ostaloHeight, setOstaloHeight] = useState<number>(0);

  const isActive = useCallback(
    (path: string) => {
      // Special case for "Moj nalog" - should be active for both /moj-nalog and /profile
      if (path === "/moj-nalog") {
        return location.pathname === "/moj-nalog" || location.pathname === "/profile";
      }
      
      // Handle paths with query parameters
      if (path.includes('?')) {
        const [pathname, queryString] = path.split('?');
        const urlParams = new URLSearchParams(queryString);
        const currentParams = new URLSearchParams(location.search);
        
        // Check if pathname matches and context parameter matches
        if (location.pathname === pathname) {
          const contextParam = urlParams.get('context');
          const currentContextParam = currentParams.get('context');
          return contextParam === currentContextParam;
        }
        return false;
      }
      
      return location.pathname === path;
    },
    [location.pathname, location.search]
  );

  useEffect(() => {
    if (mojaFirmaRef.current) {
      setMojaFirmaHeight(mojaFirmaRef.current.scrollHeight);
    }
    if (komitentiRef.current) {
      setKomitentiHeight(komitentiRef.current.scrollHeight);
    }
    if (ostaloRef.current) {
      setOstaloHeight(ostaloRef.current.scrollHeight);
    }
  }, [isMojaFirmaCollapsed, isKomitentiCollapsed, isOstaloCollapsed, isExpanded, isHovered, isMobileOpen, showMojaFirma, showKomitenti]);

  // Save states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('isMojaFirmaCollapsed', JSON.stringify(isMojaFirmaCollapsed));
  }, [isMojaFirmaCollapsed]);

  useEffect(() => {
    localStorage.setItem('isKomitentiCollapsed', JSON.stringify(isKomitentiCollapsed));
  }, [isKomitentiCollapsed]);

  useEffect(() => {
    localStorage.setItem('isOstaloCollapsed', JSON.stringify(isOstaloCollapsed));
  }, [isOstaloCollapsed]);

  // Add effect to handle body scroll locking
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileOpen]);

  const handleMenuClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          {nav.path && (
            <Link
              to={nav.path}
              className={`menu-item group ${
                isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
              }`}
              onClick={handleMenuClick}
            >
              <span
                className={`menu-item-icon-size ${
                  isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive dark:text-[#d0d5dd]"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text text-base font-medium">{nav.name}</span>
              )}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-[100dvh] lg:h-screen z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[270px]"
            : isHovered
            ? "w-[270px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ "--sidebar-bg": "white" } as React.CSSProperties}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <span className="text-[30px] font-medium text-gray-900 dark:text-white">HSEradar</span>
          ) : (
            <span className="text-[15px] font-medium text-gray-900 dark:text-white">HSEradar</span>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar pb-32 lg:pb-0">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
                               {/* Moje Preduzeće Section - Show if showMojaFirma is true (set based on section permissions) */}
                   {(userType === 'super-admin' ||
                     ((userType === 'admin' || userType === 'user') && showMojaFirma)) && (
              <div>
                <button
                  onClick={() => setIsMojaFirmaCollapsed(!isMojaFirmaCollapsed)}
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 w-full ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    <div className="flex items-center gap-2">
                      <span>MOJE PREDUZEĆE</span>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-200 ${
                          !isMojaFirmaCollapsed ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  ) : (
                    <HorizontaLDots className="size-6 dark:text-[#d0d5dd]" />
                  )}
                </button>
                <div
                  ref={mojaFirmaRef}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height: isMojaFirmaCollapsed ? "0px" : `${mojaFirmaHeight}px`,
                  }}
                >
                  {renderMenuItems(navItems)}
                </div>
              </div>
            )}

                               {/* Komitenti Section - Show if showKomitenti is true (set based on section permissions) */}
                   {(userType === 'super-admin' ||
                     ((userType === 'admin' || userType === 'user') && showKomitenti)) && (
              <div className="">
                <button
                  onClick={() => setIsKomitentiCollapsed(!isKomitentiCollapsed)}
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 w-full ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    <div className="flex items-center gap-2">
                      <span>KOMITENTI</span>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-200 ${
                          !isKomitentiCollapsed ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  ) : (
                    <HorizontaLDots className="size-6 dark:text-[#d0d5dd]" />
                  )}
                </button>
                <div
                  ref={komitentiRef}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height: isKomitentiCollapsed ? "0px" : `${komitentiHeight}px`,
                  }}
                >
                  {renderMenuItems(supportItems)}
                </div>
              </div>
            )}
                                                               {/* Ostalo Section - Show for Super Admin and Admin, or User if allowed by organization, or Komitent (only for profile access) */}
                    {(userType === 'super-admin' ||
                      userType === 'admin' ||
                      (userType === 'user' && organizationSettings.usersCanSeeOstalo) ||
                      userType === 'komitent') && (
                      <div className="">
                        {userType !== 'komitent' && (
                          <button
                            onClick={() => setIsOstaloCollapsed(!isOstaloCollapsed)}
                            className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 w-full ${
                              !isExpanded && !isHovered
                                ? "lg:justify-center"
                                : "justify-start"
                            }`}
                          >
                            {isExpanded || isHovered || isMobileOpen ? (
                              <div className="flex items-center gap-2">
                                <span>OSTALO</span>
                                <ChevronDownIcon
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    !isOstaloCollapsed ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            ) : (
                              <HorizontaLDots className="size-6 dark:text-[#d0d5dd]" />
                            )}
                          </button>
                        )}
                        <div
                          ref={ostaloRef}
                          className="overflow-hidden transition-all duration-300"
                          style={{
                            height: userType === 'komitent' ? 'auto' : (isOstaloCollapsed ? "0px" : `${ostaloHeight}px`),
                          }}
                        >
                          {renderMenuItems(userType === 'komitent' ? komitentOthersItems : othersItems)}
                        </div>
                      </div>
                    )}

          </div>
        </nav>

      </div>
    </aside>
  );
};

export default AppSidebar;
