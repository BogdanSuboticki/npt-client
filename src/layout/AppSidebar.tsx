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
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
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
    path: "/ispitivanje-sredine",
  },
  {
    icon: <BezbednosnePromeneIcon />,
    name: "Bezbednosne promene",
    path: "/bezbednosne-promene",
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
    path: "/ispitivanje-sredine",
  },
  {
    icon: <BezbednosnePromeneIcon />,
    name: "Bezbednosne promene",
    path: "/bezbednosne-promene",
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
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen z-50 border-r border-gray-200 
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
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar pb-20 lg:pb-0">
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
