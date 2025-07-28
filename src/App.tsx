import { BrowserRouter as Router, Routes, Route } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { srLatn } from "date-fns/locale";
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
import Lokacije from "./pages/lokacije/Lokacije";
import LekarskiPreglediPage from "./pages/lekarski-pregledi/page";
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
import ZaduzenjaLzoPage from "./pages/zaduzenja-lzo/page";

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={srLatn}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Ecommerce />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/crm" element={<Crm />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/saas" element={<Saas />} />
            <Route path="/lekarski-pregledi" element={<LekarskiPreglediPage />} />
            <Route path="/ispitivanje-radne-sredine" element={<IspitivanjeRadneSredine />} />
            <Route path="/bezbednosne-provere" element={<BezbednosneProverePage />} />
            <Route path="/povrede" element={<PovredePage />} />
            <Route path="/pregledi-opreme" element={<PreglediOpremePage />} />
            <Route path="/firme" element={<Firme />} />
            <Route path="/zaposleni" element={<ZaposleniPage />} />
            <Route path="/zaduzenja-lzo" element={<ZaduzenjaLzoPage />} />
            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/invoice" element={<Invoices />} />
            <Route path="/faq" element={<Faqs />} />
            <Route path="/pricing-tables" element={<PricingTables />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/obrasci" element={<Obrasci />} />
            <Route path="/prethodni-obrasci" element={<PrethodniObrasci />} />
            <Route path="/osposobljavanje" element={<Osposobljavanje />} />
            <Route path="/oprema" element={<Oprema />} />
            <Route path="/lokacije" element={<Lokacije />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/form-layout" element={<FormLayout />} />

            {/* Applications */}
            <Route path="/chat" element={<Chats />} />

            <Route path="/task-list" element={<TaskList />} />
            <Route path="/task-kanban" element={<TaskKanban />} />
            <Route path="/file-manager" element={<FileManager />} />

            {/* Email */}

            <Route path="/inbox" element={<EmailInbox />} />
            <Route path="/inbox-details" element={<EmailDetails />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/data-tables" element={<DataTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/breadcrumb" element={<BreadCrumb />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/buttons-group" element={<ButtonsGroup />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/carousel" element={<Carousel />} />
            <Route path="/dropdowns" element={<Dropdowns />} />
            <Route path="/images" element={<Images />} />
            <Route path="/links" element={<Links />} />
            <Route path="/list" element={<Lists />} />
            <Route path="/modals" element={<Modals />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/pagination" element={<Pagination />} />
            <Route path="/popovers" element={<Popovers />} />
            <Route path="/progress-bar" element={<Progressbar />} />
            <Route path="/ribbons" element={<Ribbons />} />
            <Route path="/spinners" element={<Spinners />} />
            <Route path="/tabs" element={<Tabs />} />
            <Route path="/tooltips" element={<Tooltips />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
            <Route path="/pie-chart" element={<PieChart />} />

            <Route path="/radna-mesta" element={<RadnaMesta />} />
            <Route path="/evidencija-rizicna-radna-mesta" element={<EvidencijaRizicnaRadnaMesta />} />
            <Route path="/evidencija-povreda-rad" element={<EvidencijaPovredaRad />} />
            <Route path="/evidencija-profesionalne-bolesti" element={<EvidencijaProfesionalneBolesti />} />
            <Route path="/evidencija-biloske-stetnosti" element={<EvidencijaBiloskeStetnosti />} />
            <Route path="/evidencija-kancerogeni-mutageni" element={<EvidencijaKancerogeniMutageni />} />
            <Route path="/evidencija-obuceni-bezbedan" element={<EvidencijaObuceniBezbedan />} />
            <Route path="/evidencija-primena-mera" element={<EvidencijaPrimenaMera />} />
            <Route path="/evidencija-pregledi-opreme" element={<EvidencijaPreglediOpreme />} />
            <Route path="/elektricne-instalacije" element={<EvidencijaElektricneInstalacije />} />
            <Route path="/ispitivanja-sredine" element={<EvidencijaIspitivanjaSredine />} />
            <Route path="/zastitna-oprema" element={<EvidencijaZastitnaOprema />} />
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
  );
}
