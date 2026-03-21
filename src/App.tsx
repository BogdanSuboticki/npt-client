import { BrowserRouter as Router, Routes, Route } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { srLatn } from "date-fns/locale";
import { UserProvider } from "./context/UserContext";
import { CompanyProvider } from "./context/CompanyContext";
import Ecommerce from "./pages/Dashboard/Ecommerce";
import Stocks from "./pages/Dashboard/Stocks";
import Crm from "./pages/Dashboard/Crm";
import Marketing from "./pages/Dashboard/Marketing";
import Analytics from "./pages/Dashboard/Analytics";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Carousel from "./pages/UiElements/Carousel";
import Maintenance from "./pages/OtherPage/Maintenance";
import FiveZeroZero from "./pages/OtherPage/FiveZeroZero";
import FiveZeroThree from "./pages/OtherPage/FiveZeroThree";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Pagination from "./pages/UiElements/Pagination";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import ButtonsGroup from "./pages/UiElements/ButtonsGroup";
import Notifications from "./pages/UiElements/Notifications";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import PieChart from "./pages/Charts/PieChart";
import Invoices from "./pages/Invoices";
import ComingSoon from "./pages/OtherPage/ComingSoon";
import FileManager from "./pages/FileManager";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import DataTables from "./pages/Tables/DataTables";
import PricingTables from "./pages/PricingTables";
import Faqs from "./pages/Faqs";
import Chats from "./pages/Chat/Chats";
import FormElements from "./pages/Forms/FormElements";
import FormLayout from "./pages/Forms/FormLayout";
import Blank from "./pages/Blank";
import EmailInbox from "./pages/Email/EmailInbox";
import EmailDetails from "./pages/Email/EmailDetails";
import Obrasci from "./pages/Obrasci";
import PrethodniObrasci from "./pages/Prethodni_obrasci";
import Osposobljavanje from "./pages/osposobljavanje/Osposobljavanje";
import Oprema from "./pages/oprema/Oprema";
import LZS from "./pages/lzs/LZS";
import Lokacije from "./pages/lokacije/Lokacije";
import LekarskiPreglediPage from "./pages/lekarski-pregledi/page";
import InspekcijskiNadzorPage from "./pages/inspekcijski-nadzor/page";
import IspitivanjeRadneSredine from "./pages/ispitivanje-radne-sredine/page";

import TaskKanban from "./pages/Task/TaskKanban";
import BreadCrumb from "./pages/UiElements/BreadCrumb";
import Cards from "./pages/UiElements/Cards";
import Dropdowns from "./pages/UiElements/Dropdowns";
import Links from "./pages/UiElements/Links";
import Lists from "./pages/UiElements/Lists";
import Popovers from "./pages/UiElements/Popovers";
import Progressbar from "./pages/UiElements/Progressbar";
import Ribbons from "./pages/UiElements/Ribbons";
import Spinners from "./pages/UiElements/Spinners";
import Tabs from "./pages/UiElements/Tabs";
import Tooltips from "./pages/UiElements/Tooltips";
import Modals from "./pages/UiElements/Modals";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import ChangePassword from "./pages/AuthPages/ChangePassword";
import TwoStepVerification from "./pages/AuthPages/TwoStepVerification";
import Success from "./pages/OtherPage/Success";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import TaskList from "./pages/Task/TaskList";
import Saas from "./pages/Dashboard/Saas";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicOnlyRoute from "./components/common/PublicOnlyRoute";
import RadnaMesta from "./pages/RadnaMesta";
import EvidencijaRizicnaRadnaMesta from "./pages/Evidencija_rizicna_radna_mesta";
import EvidencijaPovredaRad from "./pages/Evidencija_povreda_rad";
import EvidencijaProfesionalneBolesti from "./pages/Evidencija_profesionalne_bolesti";
import EvidencijaBiloskeStetnosti from "./pages/evidencija_biloske_stetnosti";
import EvidencijaKancerogeniMutageni from "./pages/evidencija_kancerogeni_mutageni";
import EvidencijaObuceniBezbedan from "./pages/evidencija_obuceni_bezbedan";
import EvidencijaPrimenaMera from "./pages/evidencija_primena_mera";
import EvidencijaPreglediOpreme from "./pages/evidencija_pregledi_opreme";
import EvidencijaElektricneInstalacije from "./pages/evidencija_elektricne_instalacije";
import EvidencijaIspitivanjaSredine from "./pages/evidencija_ispitivanja_sredine";
import EvidencijaZastitnaOprema from "./pages/evidencija_zastitna_oprema";
import BezbednosneProverePage from "./pages/bezbednosne-provere/page";
import PovredePage from "./pages/povrede/page";
import PreglediOpremePage from "./pages/pregledi-opreme/page";
import Firme from "./pages/firme/page";
import ZaposleniPage from "./pages/zaposleni/page";
import AngazovanjaPage from "./pages/angazovanja/page";
import ZaduzenjaLzoPage from "./pages/zaduzenja-lzo/page";
import RokoviPage from "./pages/rokovi/page";
import DnevniIzvestajiPage from "./pages/dnevni-izvestaji/page";
import NotesPage from "./pages/notes/page";
import TehnickaPodrska from "./pages/TehnickaPodrska";
import SuperAdminDashboard from "./pages/super-admin-dashboard/SuperAdminDashboard";
import SuperAdminRedirect from "./pages/super-admin-dashboard/SuperAdminRedirect";
import CentarObavestenjaPage from "./pages/centar-obavestenja/page";
import { useUser } from "./context/UserContext";
import { Navigate } from "react-router";

// Component to protect routes when password change is required
function PasswordChangeGuard({ children }: { children: React.ReactNode }) {
  const { mustChangePassword } = useUser();

  if (mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <UserProvider>
      <CompanyProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={srLatn}>
          <Router>
          <ScrollToTop />
          <Routes>
          {/* Super Admin Database Dashboard — standalone, no sidebar */}
          <Route path="/database" element={<ProtectedRoute allowedRoles={['super-admin']}><PasswordChangeGuard><SuperAdminDashboard /></PasswordChangeGuard></ProtectedRoute>} />

          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<ProtectedRoute><PasswordChangeGuard><SuperAdminRedirect><Ecommerce /></SuperAdminRedirect></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/dnevni-izvestaji" element={<ProtectedRoute><PasswordChangeGuard><DnevniIzvestajiPage /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/centar-obavestenja" element={<ProtectedRoute><PasswordChangeGuard><CentarObavestenjaPage /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Analytics /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Marketing /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/crm" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Crm /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/stocks" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Stocks /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/saas" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Saas /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/lekarski-pregledi" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><LekarskiPreglediPage /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/inspekcijski-nadzor" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><InspekcijskiNadzorPage /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/ispitivanje-radne-sredine" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><IspitivanjeRadneSredine /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/bezbednosne-provere" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><BezbednosneProverePage /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/povrede" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><PovredePage /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/pregledi-opreme" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><PreglediOpremePage /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/rokovi" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><RokoviPage /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/firme" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Firme /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/zaposleni" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><ZaposleniPage /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/angazovanja" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><AngazovanjaPage /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/zaduzenja-lzo" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><ZaduzenjaLzoPage /></PasswordChangeGuard></ProtectedRoute>} />
            {/* Others Page */}
            <Route path="/profile" element={<ProtectedRoute><PasswordChangeGuard><UserProfiles /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Calendar /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/invoice" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Invoices /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/faq" element={<ProtectedRoute><PasswordChangeGuard><Faqs /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/pricing-tables" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><PricingTables /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/blank" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Blank /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/obrasci" element={<ProtectedRoute><PasswordChangeGuard><Obrasci /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/prethodni-obrasci" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><PrethodniObrasci /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><PasswordChangeGuard><NotesPage /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/tehnicka-podrska" element={<ProtectedRoute><PasswordChangeGuard><TehnickaPodrska /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/osposobljavanje" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Osposobljavanje /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/oprema" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Oprema /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/lzs" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><LZS /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/lokacije" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Lokacije /></PasswordChangeGuard></ProtectedRoute>} />

            {/* Forms */}
            <Route path="/form-elements" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><FormElements /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/form-layout" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><FormLayout /></PasswordChangeGuard></ProtectedRoute>} />

            {/* Applications */}
            <Route path="/chat" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Chats /></PasswordChangeGuard></ProtectedRoute>} />

            <Route path="/task-list" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><TaskList /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/task-kanban" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><TaskKanban /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/file-manager" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><FileManager /></PasswordChangeGuard></ProtectedRoute>} />

            {/* Email */}

            <Route path="/inbox" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EmailInbox /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/inbox-details" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EmailDetails /></PasswordChangeGuard></ProtectedRoute>} />

            {/* Tables */}
            <Route path="/basic-tables" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><BasicTables /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/data-tables" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><DataTables /></PasswordChangeGuard></ProtectedRoute>} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Alerts /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/avatars" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Avatars /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/badge" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Badges /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/breadcrumb" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><BreadCrumb /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/buttons" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Buttons /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/buttons-group" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><ButtonsGroup /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/cards" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Cards /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/carousel" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Carousel /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/dropdowns" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Dropdowns /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/images" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Images /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/links" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Links /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/list" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Lists /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/modals" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Modals /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Notifications /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/pagination" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Pagination /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/popovers" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Popovers /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/progress-bar" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Progressbar /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/ribbons" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Ribbons /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/spinners" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Spinners /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/tabs" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Tabs /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/tooltips" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Tooltips /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/videos" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><Videos /></PasswordChangeGuard></ProtectedRoute>} />

            {/* Charts */}
            <Route path="/line-chart" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><LineChart /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/bar-chart" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><BarChart /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/pie-chart" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><PieChart /></PasswordChangeGuard></ProtectedRoute>} />

            <Route path="/radna-mesta" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><RadnaMesta /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/evidencija-rizicna-radna-mesta" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EvidencijaRizicnaRadnaMesta /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/evidencija-povreda-rad" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EvidencijaPovredaRad /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/evidencija-profesionalne-bolesti" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EvidencijaProfesionalneBolesti /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/evidencija-biloske-stetnosti" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EvidencijaBiloskeStetnosti /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/evidencija-kancerogeni-mutageni" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EvidencijaKancerogeniMutageni /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/evidencija-obuceni-bezbedan" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EvidencijaObuceniBezbedan /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/evidencija-primena-mera" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EvidencijaPrimenaMera /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/evidencija-pregledi-opreme" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EvidencijaPreglediOpreme /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/elektricne-instalacije" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EvidencijaElektricneInstalacije /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/ispitivanja-sredine" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EvidencijaIspitivanjaSredine /></PasswordChangeGuard></ProtectedRoute>} />
            <Route path="/zastitna-oprema" element={<ProtectedRoute excludedRoles={['komitent']}><PasswordChangeGuard><EvidencijaZastitnaOprema /></PasswordChangeGuard></ProtectedRoute>} />
          </Route>

          {/* Auth Layout - Public Only Routes (redirect if authenticated) */}
          <Route path="/signin" element={<PublicOnlyRoute><SignIn /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><SignUp /></PublicOnlyRoute>} />
          <Route path="/reset-password" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />
          <Route path="/two-step-verification" element={<PublicOnlyRoute><TwoStepVerification /></PublicOnlyRoute>} />

          {/* Change Password - Protected (only for authenticated users) */}
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

          {/* Fallback Route - Protected */}
          <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />

          {/* Error/Status Pages - Protected */}
          <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
          <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
          <Route path="/five-zero-zero" element={<ProtectedRoute><FiveZeroZero /></ProtectedRoute>} />
          <Route path="/five-zero-three" element={<ProtectedRoute><FiveZeroThree /></ProtectedRoute>} />
          <Route path="/coming-soon" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        </Routes>
      </Router>
    </LocalizationProvider>
      </CompanyProvider>
    </UserProvider>
  );
}
