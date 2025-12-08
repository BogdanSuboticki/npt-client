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
import TwoStepVerification from "./pages/AuthPages/TwoStepVerification";
import Success from "./pages/OtherPage/Success";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import TaskList from "./pages/Task/TaskList";
import Saas from "./pages/Dashboard/Saas";
import ProtectedRoute from "./components/common/ProtectedRoute";
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

export default function App() {
  return (
    <UserProvider>
      <CompanyProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={srLatn}>
          <Router>
          <ScrollToTop />
          <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Ecommerce />} />
            <Route path="/dnevni-izvestaji" element={<DnevniIzvestajiPage />} />
            <Route path="/analytics" element={<ProtectedRoute excludedRoles={['komitent']}><Analytics /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute excludedRoles={['komitent']}><Marketing /></ProtectedRoute>} />
            <Route path="/crm" element={<ProtectedRoute excludedRoles={['komitent']}><Crm /></ProtectedRoute>} />
            <Route path="/stocks" element={<ProtectedRoute excludedRoles={['komitent']}><Stocks /></ProtectedRoute>} />
            <Route path="/saas" element={<ProtectedRoute excludedRoles={['komitent']}><Saas /></ProtectedRoute>} />
            <Route path="/lekarski-pregledi" element={<ProtectedRoute excludedRoles={['komitent']}><LekarskiPreglediPage /></ProtectedRoute>} />
            <Route path="/inspekcijski-nadzor" element={<ProtectedRoute excludedRoles={['komitent']}><InspekcijskiNadzorPage /></ProtectedRoute>} />
            <Route path="/ispitivanje-radne-sredine" element={<ProtectedRoute excludedRoles={['komitent']}><IspitivanjeRadneSredine /></ProtectedRoute>} />
            <Route path="/bezbednosne-provere" element={<ProtectedRoute excludedRoles={['komitent']}><BezbednosneProverePage /></ProtectedRoute>} />
            <Route path="/povrede" element={<ProtectedRoute excludedRoles={['komitent']}><PovredePage /></ProtectedRoute>} />
            <Route path="/pregledi-opreme" element={<ProtectedRoute excludedRoles={['komitent']}><PreglediOpremePage /></ProtectedRoute>} />
            <Route path="/rokovi" element={<ProtectedRoute excludedRoles={['komitent']}><RokoviPage /></ProtectedRoute>} />
            <Route path="/firme" element={<ProtectedRoute excludedRoles={['komitent']}><Firme /></ProtectedRoute>} />
            <Route path="/zaposleni" element={<ProtectedRoute excludedRoles={['komitent']}><ZaposleniPage /></ProtectedRoute>} />
            <Route path="/angazovanja" element={<ProtectedRoute excludedRoles={['komitent']}><AngazovanjaPage /></ProtectedRoute>} />
            <Route path="/zaduzenja-lzo" element={<ProtectedRoute excludedRoles={['komitent']}><ZaduzenjaLzoPage /></ProtectedRoute>} />
            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<ProtectedRoute excludedRoles={['komitent']}><Calendar /></ProtectedRoute>} />
            <Route path="/invoice" element={<ProtectedRoute excludedRoles={['komitent']}><Invoices /></ProtectedRoute>} />
            <Route path="/faq" element={<ProtectedRoute excludedRoles={['komitent']}><Faqs /></ProtectedRoute>} />
            <Route path="/pricing-tables" element={<ProtectedRoute excludedRoles={['komitent']}><PricingTables /></ProtectedRoute>} />
            <Route path="/blank" element={<ProtectedRoute excludedRoles={['komitent']}><Blank /></ProtectedRoute>} />
            <Route path="/obrasci" element={<ProtectedRoute excludedRoles={['komitent']}><Obrasci /></ProtectedRoute>} />
            <Route path="/prethodni-obrasci" element={<ProtectedRoute excludedRoles={['komitent']}><PrethodniObrasci /></ProtectedRoute>} />
            <Route path="/osposobljavanje" element={<ProtectedRoute excludedRoles={['komitent']}><Osposobljavanje /></ProtectedRoute>} />
            <Route path="/oprema" element={<ProtectedRoute excludedRoles={['komitent']}><Oprema /></ProtectedRoute>} />
            <Route path="/lzs" element={<ProtectedRoute excludedRoles={['komitent']}><LZS /></ProtectedRoute>} />
            <Route path="/lokacije" element={<ProtectedRoute excludedRoles={['komitent']}><Lokacije /></ProtectedRoute>} />

            {/* Forms */}
            <Route path="/form-elements" element={<ProtectedRoute excludedRoles={['komitent']}><FormElements /></ProtectedRoute>} />
            <Route path="/form-layout" element={<ProtectedRoute excludedRoles={['komitent']}><FormLayout /></ProtectedRoute>} />

            {/* Applications */}
            <Route path="/chat" element={<ProtectedRoute excludedRoles={['komitent']}><Chats /></ProtectedRoute>} />

            <Route path="/task-list" element={<ProtectedRoute excludedRoles={['komitent']}><TaskList /></ProtectedRoute>} />
            <Route path="/task-kanban" element={<ProtectedRoute excludedRoles={['komitent']}><TaskKanban /></ProtectedRoute>} />
            <Route path="/file-manager" element={<ProtectedRoute excludedRoles={['komitent']}><FileManager /></ProtectedRoute>} />

            {/* Email */}

            <Route path="/inbox" element={<ProtectedRoute excludedRoles={['komitent']}><EmailInbox /></ProtectedRoute>} />
            <Route path="/inbox-details" element={<ProtectedRoute excludedRoles={['komitent']}><EmailDetails /></ProtectedRoute>} />

            {/* Tables */}
            <Route path="/basic-tables" element={<ProtectedRoute excludedRoles={['komitent']}><BasicTables /></ProtectedRoute>} />
            <Route path="/data-tables" element={<ProtectedRoute excludedRoles={['komitent']}><DataTables /></ProtectedRoute>} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<ProtectedRoute excludedRoles={['komitent']}><Alerts /></ProtectedRoute>} />
            <Route path="/avatars" element={<ProtectedRoute excludedRoles={['komitent']}><Avatars /></ProtectedRoute>} />
            <Route path="/badge" element={<ProtectedRoute excludedRoles={['komitent']}><Badges /></ProtectedRoute>} />
            <Route path="/breadcrumb" element={<ProtectedRoute excludedRoles={['komitent']}><BreadCrumb /></ProtectedRoute>} />
            <Route path="/buttons" element={<ProtectedRoute excludedRoles={['komitent']}><Buttons /></ProtectedRoute>} />
            <Route path="/buttons-group" element={<ProtectedRoute excludedRoles={['komitent']}><ButtonsGroup /></ProtectedRoute>} />
            <Route path="/cards" element={<ProtectedRoute excludedRoles={['komitent']}><Cards /></ProtectedRoute>} />
            <Route path="/carousel" element={<ProtectedRoute excludedRoles={['komitent']}><Carousel /></ProtectedRoute>} />
            <Route path="/dropdowns" element={<ProtectedRoute excludedRoles={['komitent']}><Dropdowns /></ProtectedRoute>} />
            <Route path="/images" element={<ProtectedRoute excludedRoles={['komitent']}><Images /></ProtectedRoute>} />
            <Route path="/links" element={<ProtectedRoute excludedRoles={['komitent']}><Links /></ProtectedRoute>} />
            <Route path="/list" element={<ProtectedRoute excludedRoles={['komitent']}><Lists /></ProtectedRoute>} />
            <Route path="/modals" element={<ProtectedRoute excludedRoles={['komitent']}><Modals /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute excludedRoles={['komitent']}><Notifications /></ProtectedRoute>} />
            <Route path="/pagination" element={<ProtectedRoute excludedRoles={['komitent']}><Pagination /></ProtectedRoute>} />
            <Route path="/popovers" element={<ProtectedRoute excludedRoles={['komitent']}><Popovers /></ProtectedRoute>} />
            <Route path="/progress-bar" element={<ProtectedRoute excludedRoles={['komitent']}><Progressbar /></ProtectedRoute>} />
            <Route path="/ribbons" element={<ProtectedRoute excludedRoles={['komitent']}><Ribbons /></ProtectedRoute>} />
            <Route path="/spinners" element={<ProtectedRoute excludedRoles={['komitent']}><Spinners /></ProtectedRoute>} />
            <Route path="/tabs" element={<ProtectedRoute excludedRoles={['komitent']}><Tabs /></ProtectedRoute>} />
            <Route path="/tooltips" element={<ProtectedRoute excludedRoles={['komitent']}><Tooltips /></ProtectedRoute>} />
            <Route path="/videos" element={<ProtectedRoute excludedRoles={['komitent']}><Videos /></ProtectedRoute>} />

            {/* Charts */}
            <Route path="/line-chart" element={<ProtectedRoute excludedRoles={['komitent']}><LineChart /></ProtectedRoute>} />
            <Route path="/bar-chart" element={<ProtectedRoute excludedRoles={['komitent']}><BarChart /></ProtectedRoute>} />
            <Route path="/pie-chart" element={<ProtectedRoute excludedRoles={['komitent']}><PieChart /></ProtectedRoute>} />

            <Route path="/radna-mesta" element={<ProtectedRoute excludedRoles={['komitent']}><RadnaMesta /></ProtectedRoute>} />
            <Route path="/evidencija-rizicna-radna-mesta" element={<ProtectedRoute excludedRoles={['komitent']}><EvidencijaRizicnaRadnaMesta /></ProtectedRoute>} />
            <Route path="/evidencija-povreda-rad" element={<ProtectedRoute excludedRoles={['komitent']}><EvidencijaPovredaRad /></ProtectedRoute>} />
            <Route path="/evidencija-profesionalne-bolesti" element={<ProtectedRoute excludedRoles={['komitent']}><EvidencijaProfesionalneBolesti /></ProtectedRoute>} />
            <Route path="/evidencija-biloske-stetnosti" element={<ProtectedRoute excludedRoles={['komitent']}><EvidencijaBiloskeStetnosti /></ProtectedRoute>} />
            <Route path="/evidencija-kancerogeni-mutageni" element={<ProtectedRoute excludedRoles={['komitent']}><EvidencijaKancerogeniMutageni /></ProtectedRoute>} />
            <Route path="/evidencija-obuceni-bezbedan" element={<ProtectedRoute excludedRoles={['komitent']}><EvidencijaObuceniBezbedan /></ProtectedRoute>} />
            <Route path="/evidencija-primena-mera" element={<ProtectedRoute excludedRoles={['komitent']}><EvidencijaPrimenaMera /></ProtectedRoute>} />
            <Route path="/evidencija-pregledi-opreme" element={<ProtectedRoute excludedRoles={['komitent']}><EvidencijaPreglediOpreme /></ProtectedRoute>} />
            <Route path="/elektricne-instalacije" element={<ProtectedRoute excludedRoles={['komitent']}><EvidencijaElektricneInstalacije /></ProtectedRoute>} />
            <Route path="/ispitivanja-sredine" element={<ProtectedRoute excludedRoles={['komitent']}><EvidencijaIspitivanjaSredine /></ProtectedRoute>} />
            <Route path="/zastitna-oprema" element={<ProtectedRoute excludedRoles={['komitent']}><EvidencijaZastitnaOprema /></ProtectedRoute>} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/two-step-verification"
            element={<TwoStepVerification />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/success" element={<Success />} />
          <Route path="/five-zero-zero" element={<FiveZeroZero />} />
          <Route path="/five-zero-three" element={<FiveZeroThree />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </Router>
    </LocalizationProvider>
      </CompanyProvider>
    </UserProvider>
  );
}
