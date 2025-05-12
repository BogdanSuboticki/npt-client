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
    path: "/obrasci",
  },
  {
    icon: <NotesIcon />,
    name: "Notes",
    path: "/notes",
  },
  {
    icon: <CestaPitanjaIcon />,
    name: "Česta pitanja",
    path: "/cesta-pitanja",
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
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
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

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "support" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "support", "others"].forEach((menuType) => {
      const items =
        menuType === "main"
          ? navItems
          : menuType === "support"
          ? supportItems
          : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "support" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

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

  const handleSubmenuToggle = (
    index: number,
    menuType: "main" | "support" | "others"
  ) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (
    items: NavItem[],
    menuType: "main" | "support" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text text-base font-medium">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text text-base font-medium">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <span className="text-[30px] font-medium text-gray-900 dark:text-white">HSEtra</span>
          ) : (
            <span className="text-[30px] font-medium text-gray-900 dark:text-white"></span>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
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
                  <HorizontaLDots className="size-6" />
                )}
              </button>
              <div
                ref={mojaFirmaRef}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isMojaFirmaCollapsed ? "0px" : `${mojaFirmaHeight}px`,
                }}
              >
                {renderMenuItems(navItems, "main")}
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
                  <HorizontaLDots className="size-6" />
                )}
              </button>
              <div
                ref={komitentiRef}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isKomitentiCollapsed ? "0px" : `${komitentiHeight}px`,
                }}
              >
                {renderMenuItems(supportItems, "support")}
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
                  <HorizontaLDots className="size-6" />
                )}
              </button>
              <div
                ref={ostaloRef}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isOstaloCollapsed ? "0px" : `${ostaloHeight}px`,
                }}
              >
                {renderMenuItems(othersItems, "others")}
              </div>
            </div>
          </div>
        </nav>

      </div>
    </aside>
  );
};

export default AppSidebar;
