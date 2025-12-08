"use client";

import { useNavigate } from "react-router";
import { useCompanySelection } from "../../context/CompanyContext";
import { useUser } from "../../context/UserContext";
import { DnevniIzvestajiData } from "../../pages/dnevni-izvestaji/DnevniIzvestajiDataTable";
import { DnevniIzvestajiIcon } from "../../icons";
import { companies } from "../../data/companies";

// Sample data - in a real app, this would come from an API
const sampleReports: DnevniIzvestajiData[] = [
  {
    id: 1,
    firma: "Universal Logistics",
    datum: new Date("2025-01-15"),
    svakodnevnaKontrolaBZR: true,
    osobaZaSaradnju: "Marko Petrović",
    promeneAPR: false,
    napomenaPromeneAPR: "",
    promenaPoslovaRadnihZadataka: false,
    napomenaPromenaPoslova: "",
    promenaRadnihMestaZaposlenih: false,
    formaPromenaRadnihMesta: null,
    promenaRadneSnage: false,
    formaPromenaRadneSnage: null,
    novaSredstvaZaRad: false,
    formaNovaSredstvaZaRad: null,
    stazeZaKomunikacijuBezbedne: true,
    napomenaStazeZaKomunikaciju: "Sve staze su prohodne i bezbedne.",
    planiranePopravkeRemont: false,
    napomenaPlaniranePopravke: "",
    koriscenjeLZS: false,
    napomenaKoriscenjeLZS: "",
    novaGradilistaNoviPogoni: false,
    napomenaNovaGradilista: "",
    povredaNaRadu: false,
    formaPovredaNaRadu: null,
    potencijalniRizici: false,
    napomenaPotencijalniRizici: "",
    napomena: "",
    napomenaBZR: "",
    pregledan: false,
    napomenaAdmin: "",
  },
  {
    id: 2,
    firma: "Universal Logistics",
    datum: new Date("2025-01-16"),
    svakodnevnaKontrolaBZR: true,
    osobaZaSaradnju: "Marko Petrović",
    promeneAPR: true,
    napomenaPromeneAPR: "Izmena u APR-u za novi projekat.",
    promenaPoslovaRadnihZadataka: false,
    napomenaPromenaPoslova: "",
    promenaRadnihMestaZaposlenih: false,
    formaPromenaRadnihMesta: null,
    promenaRadneSnage: false,
    formaPromenaRadneSnage: null,
    novaSredstvaZaRad: false,
    formaNovaSredstvaZaRad: null,
    stazeZaKomunikacijuBezbedne: true,
    napomenaStazeZaKomunikaciju: "",
    planiranePopravkeRemont: false,
    napomenaPlaniranePopravke: "",
    koriscenjeLZS: false,
    napomenaKoriscenjeLZS: "",
    novaGradilistaNoviPogoni: false,
    napomenaNovaGradilista: "",
    povredaNaRadu: false,
    formaPovredaNaRadu: null,
    potencijalniRizici: false,
    napomenaPotencijalniRizici: "",
    napomena: "",
    napomenaBZR: "",
    pregledan: true,
    napomenaAdmin: "Sve u redu.",
  },
];

export default function DnevniIzvestajiWidget() {
  const navigate = useNavigate();
  const { selectCompany, selectedCompany } = useCompanySelection();
  const { userType } = useUser();

  // For komitent, get their company (default to first company for now)
  // In a real app, this would come from user profile/context
  const komitentCompany = userType === 'komitent' ? companies[0] : null;
  const companyToUse = userType === 'komitent' ? komitentCompany : selectedCompany;

  // Filter reports for the company
  const companyReports = companyToUse
    ? sampleReports.filter((report) => report.firma === companyToUse.naziv)
    : [];

  // Get recent reports (last 3)
  const recentReports = companyReports
    .sort((a, b) => b.datum.getTime() - a.datum.getTime())
    .slice(0, 3);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("sr-Latn-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleAddToday = () => {
    // For komitent, auto-select their company
    if (userType === 'komitent' && komitentCompany) {
      selectCompany(komitentCompany);
    }
    navigate("/dnevni-izvestaji");
  };

  const handleReportClick = (report: DnevniIzvestajiData) => {
    // For komitent, auto-select their company
    if (userType === 'komitent' && komitentCompany) {
      selectCompany(komitentCompany);
    }
    // Navigate to dnevni izvestaji page with report ID
    navigate(`/dnevni-izvestaji?reportId=${report.id}`);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <DnevniIzvestajiIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Dnevni Izveštaji
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Prethodni izveštaji
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {recentReports.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            {userType === 'komitent' 
              ? "Nemate prethodnih izveštaja."
              : "Nema dostupnih izveštaja za ovo preduzeće."}
          </div>
        ) : (
          recentReports.map((report) => (
            <div
              key={report.id}
              onClick={() => handleReportClick(report)}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {formatDate(report.datum)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {report.pregledan ? "Pregledan" : "Nije pregledan"}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  report.pregledan
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {report.pregledan ? "Pregledan" : "Nije Pregledan"}
              </span>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleAddToday}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-medium text-sm"
      >
        Dodaj današnji izveštaj
      </button>
    </div>
  );
}

