import { useUser } from "../../context/UserContext";
import Badge from "../ui/badge/Badge";

export default function SidebarSettingsCard() {
  const { userType, sidebarMode, setSidebarMode, organizationSettings } = useUser();

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'both':
        return <Badge color="info" variant="light">Oba dela</Badge>;
      case 'moja-firma':
        return <Badge color="success" variant="light">Moja Firma</Badge>;
      case 'komitenti':
        return <Badge color="warning" variant="light">Komitenti</Badge>;
      default:
        return null;
    }
  };

  // Only show this card for Admin users
  if (userType !== 'admin') {
    return null;
  }

  return (
    <div className="p-5 border border-gray-200 bg-white dark:bg-gray-800 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Podešavanja sidebara
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Trenutni režim
              </p>
              <div className="flex items-center gap-2">
                {getModeBadge(sidebarMode)}
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {sidebarMode === 'both' && 'Oba dela'}
                  {sidebarMode === 'moja-firma' && 'Samo Moja Firma'}
                  {sidebarMode === 'komitenti' && 'Samo Komitenti'}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Podešavanja organizacije
              </p>
              <div className="flex flex-wrap gap-2">
                {organizationSettings.usersCanSeeMojaFirma && (
                  <Badge color="success" variant="light">Moja Firma</Badge>
                )}
                {organizationSettings.usersCanSeeKomitenti && (
                  <Badge color="warning" variant="light">Komitenti</Badge>
                )}
                {organizationSettings.usersCanSeeOstalo && (
                  <Badge color="info" variant="light">Ostalo</Badge>
                )}
              </div>
              {!organizationSettings.usersCanCustomizeSettings && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Podešavanja su kontrolisana od strane administratora
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tip korisnika
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Administrator
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Aktivan
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Options */}
        <div className="mt-6">
          <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
            Izaberite režim sidebara
          </h5>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sidebarMode"
                  value="both"
                  checked={sidebarMode === 'both'}
                  onChange={(e) => setSidebarMode(e.target.value as 'both' | 'moja-firma' | 'komitenti')}
                  className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color="info" variant="light">Oba dela</Badge>
                    <span className="font-medium text-gray-800 dark:text-white/90">Prikazuj oba dela</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Prikazuje i "Moja Firma" i "Komitenti" sekcije u sidebaru
                  </p>
                </div>
              </label>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sidebarMode"
                  value="moja-firma"
                  checked={sidebarMode === 'moja-firma'}
                  onChange={(e) => setSidebarMode(e.target.value as 'both' | 'moja-firma' | 'komitenti')}
                  className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color="success" variant="light">Moja Firma</Badge>
                    <span className="font-medium text-gray-800 dark:text-white/90">Samo Moja Firma</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Prikazuje samo "Moja Firma" sekciju u sidebaru
                  </p>
                </div>
              </label>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sidebarMode"
                  value="komitenti"
                  checked={sidebarMode === 'komitenti'}
                  onChange={(e) => setSidebarMode(e.target.value as 'both' | 'moja-firma' | 'komitenti')}
                  className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color="warning" variant="light">Komitenti</Badge>
                    <span className="font-medium text-gray-800 dark:text-white/90">Samo Komitenti</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Prikazuje samo "Komitenti" sekciju u sidebaru
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 