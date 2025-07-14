import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  ChevronDownIcon,
  HorizontaLDots,
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

// Import the shop icon for Firme
const FirmeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 10V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14.833 21V15C14.833 14.4696 14.6223 13.9609 14.2472 13.5858C13.8721 13.2107 13.3634 13 12.833 13H10.833C10.3026 13 9.79387 13.2107 9.41879 13.5858C9.04372 13.9609 8.83301 14.4696 8.83301 15V21" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="16"/>
    <path d="M21.818 9.364L20.124 3.435C20.0881 3.30965 20.0124 3.19939 19.9083 3.1209C19.8042 3.04241 19.6774 2.99997 19.547 3H15.5L15.975 8.704C15.9823 8.79568 16.0114 8.88429 16.0597 8.96254C16.1081 9.04078 16.1743 9.10641 16.253 9.154C16.643 9.387 17.405 9.817 18 10C19.016 10.313 20.5 10.2 21.346 10.096C21.4282 10.0854 21.5072 10.0569 21.5773 10.0126C21.6474 9.96835 21.707 9.90929 21.752 9.8396C21.7969 9.7699 21.8261 9.69123 21.8375 9.60909C21.8489 9.52695 21.8423 9.44331 21.818 9.364Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 10C14.568 9.825 15.288 9.426 15.69 9.188C15.7835 9.13205 15.8594 9.05087 15.909 8.95377C15.9585 8.85667 15.9796 8.74757 15.97 8.639L15.5 3H8.5L8.03 8.639C8.02018 8.74774 8.04124 8.85704 8.09077 8.95433C8.14031 9.05163 8.2163 9.13297 8.31 9.189C8.712 9.426 9.432 9.825 10 10C11.493 10.46 12.507 10.46 14 10Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3.87599 3.435L2.18199 9.365C2.15808 9.44418 2.15169 9.52762 2.16326 9.60951C2.17483 9.69141 2.20408 9.76981 2.24899 9.83927C2.2939 9.90873 2.35339 9.96758 2.42333 10.0117C2.49326 10.0559 2.57197 10.0843 2.65399 10.095C3.49899 10.2 4.98399 10.312 5.99999 10C6.59499 9.817 7.35799 9.387 7.74699 9.155C7.82582 9.10731 7.89215 9.04153 7.9405 8.9631C7.98884 8.88467 8.0178 8.79585 8.02499 8.704L8.49999 3H4.45299C4.32261 2.99997 4.19577 3.04241 4.09166 3.1209C3.98756 3.19939 3.91185 3.30965 3.87599 3.435Z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <FirmeIcon />,
    name: "Firme",
    path: "/firme",
  },
  {
    icon: <ZaposleniIcon />,
    name: "Zaposleni",
    path: "/zaposleni",
  },
  {
    icon: <RadnaMestaIcon />,
    name: "Radna mesta",
    path: "/radna-mesta",
  },
  {
    icon: <OsposobljavanjeIcon />,
    name: "Osposobljavanje",
    path: "/osposobljavanje",
  },
  {
    icon: <LokacijeIcon />,
    name: "Lokacije",
    path: "/lokacije",
  },
  {
    icon: <OpremaIcon />,
    name: "Oprema",
    path: "/oprema",
  },
  {
    icon: <LekarskiPreglediIcon />,
    name: "Lekarski pregledi",
    path: "/lekarski-pregledi",
  },
  {
    icon: <PreglediOpremeIcon />,
    name: "Pregledi opreme",
    path: "/pregledi-opreme",
  },
  {
    icon: <IspitivanjeSredineIcon />,
    name: "Ispitivanje sredine",
    path: "/ispitivanje-radne-sredine",
  },
  {
    icon: <BezbednosnePromeneIcon />,
    name: "Bezbednosne provere",
    path: "/bezbednosne-provere",
  },
  {
    icon: <InspekcijskiNadzorIcon />,
    name: "Inspekcijski nadzor",
    path: "/inspekcijski-nadzor",
  },
  {
    icon: <ZaduzenjaLZOIcon />,
    name: "Zaduženja LZO",
    path: "/zaduzenja-lzo",
  },
  {
    icon: <PovredeIcon />,
    name: "Povrede",
    path: "/povrede",
  },
  {
    icon: <DnevniIzvestajiIcon />,
    name: "Dnevni izveštaji",
    path: "/dnevni-izvestaji",
  },
  {
    icon: <RokoviIcon />,
    name: "Rokovi",
    path: "/rokovi",
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
    path: "/moj-nalog",
  },
];

const supportItems: NavItem[] = [
  {
    icon: <FirmeIcon />,
    name: "Firme",
    path: "/firme",
  },
  {
    icon: <ZaposleniIcon />,
    name: "Zaposleni",
    path: "/zaposleni",
  },
  {
    icon: <RadnaMestaIcon />,
    name: "Radna mesta",
    path: "/radna-mesta",
  },
  {
    icon: <OsposobljavanjeIcon />,
    name: "Osposobljavanje",
    path: "/osposobljavanje",
  },
  {
    icon: <LokacijeIcon />,
    name: "Lokacije",
    path: "/lokacije",
  },
  {
    icon: <OpremaIcon />,
    name: "Oprema",
    path: "/oprema",
  },
  {
    icon: <LekarskiPreglediIcon />,
    name: "Lekarski pregledi",
    path: "/lekarski-pregledi",
  },
  {
    icon: <PreglediOpremeIcon />,
    name: "Pregledi opreme",
    path: "/pregledi-opreme",
  },
  {
    icon: <IspitivanjeSredineIcon />,
    name: "Ispitivanje sredine",
    path: "/ispitivanje-radne-sredine",
  },
  {
    icon: <BezbednosnePromeneIcon />,
    name: "Bezbednosne provere",
    path: "/bezbednosne-provere",
  },
  {
    icon: <InspekcijskiNadzorIcon />,
    name: "Inspekcijski nadzor",
    path: "/inspekcijski-nadzor",
  },
  {
    icon: <ZaduzenjaLZOIcon />,
    name: "Zaduženja LZO",
    path: "/zaduzenja-lzo",
  },
  {
    icon: <PovredeIcon />,
    name: "Povrede",
    path: "/povrede",
  },
  {
    icon: <DnevniIzvestajiIcon />,
    name: "Dnevni izveštaji",
    path: "/dnevni-izvestaji",
  },
  {
    icon: <RokoviIcon />,
    name: "Rokovi",
    path: "/rokovi",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } = useSidebar();
  const location = useLocation();
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
    (path: string) => location.pathname === path,
    [location.pathname]
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
  }, [isMojaFirmaCollapsed, isKomitentiCollapsed, isOstaloCollapsed, isExpanded, isHovered, isMobileOpen]);

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
                    <span>MOJA FIRMA</span>
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
            <div className="">
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
              <div
                ref={ostaloRef}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isOstaloCollapsed ? "0px" : `${ostaloHeight}px`,
                }}
              >
                {renderMenuItems(othersItems)}
              </div>
            </div>
          </div>
        </nav>

      </div>
    </aside>
  );
};

export default AppSidebar;
