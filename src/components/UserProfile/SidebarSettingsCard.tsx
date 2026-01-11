import { useUser } from "../../context/UserContext";
import Checkbox from "../form/input/Checkbox";

export default function SidebarSettingsCard() {
  const { userType, showMojaFirma, showKomitenti, setSidebarMode } = useUser();

  // Update sidebarMode when checkboxes change
  const handleMojaFirmaChange = (checked: boolean) => {
    // Calculate new sidebarMode based on new checkbox state
    const newShowMojaFirma = checked;
    const newShowKomitenti = showKomitenti;
    
    if (newShowMojaFirma && newShowKomitenti) {
      setSidebarMode('both');
    } else if (newShowMojaFirma) {
      setSidebarMode('moja-firma');
    } else if (newShowKomitenti) {
      setSidebarMode('komitenti');
    } else {
      // If both would be unchecked, default to moja-firma
      setSidebarMode('moja-firma');
    }
  };

  const handleKomitentiChange = (checked: boolean) => {
    // Calculate new sidebarMode based on new checkbox state
    const newShowMojaFirma = showMojaFirma;
    const newShowKomitenti = checked;
    
    if (newShowMojaFirma && newShowKomitenti) {
      setSidebarMode('both');
    } else if (newShowMojaFirma) {
      setSidebarMode('moja-firma');
    } else if (newShowKomitenti) {
      setSidebarMode('komitenti');
    } else {
      // If both would be unchecked, default to komitenti
      setSidebarMode('komitenti');
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
            Podešavanje menija
          </h4>

          <div className="mt-6">
            <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
              Izaberite šta može biti prikazano
            </h5>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="flex justify-center pt-0.5">
                    <Checkbox
                      checked={showMojaFirma}
                      onChange={handleMojaFirmaChange}
                      className="w-4 h-4"
                      id="moja-firma-checkbox"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-white/90">Moja Firma</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Prikazuje "Moja Firma" sekciju u meniju
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="flex justify-center pt-0.5">
                    <Checkbox
                      checked={showKomitenti}
                      onChange={handleKomitentiChange}
                      className="w-4 h-4"
                      id="komitenti-checkbox"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-white/90">Komitenti</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Prikazuje "Komitenti" sekciju u meniju
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 