
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import CompanyInfoCard from "../components/UserProfile/CompanyInfoCard";
import CompanyContactCard from "../components/UserProfile/CompanyContactCard";
import ContractInfoCard from "../components/UserProfile/ContractInfoCard";
import SidebarSettingsCard from "../components/UserProfile/SidebarSettingsCard";
import OrganizationSettingsCard from "../components/UserProfile/OrganizationSettingsCard";
import SuperAdminDashboard from "../components/UserProfile/SuperAdminDashboard";
import ProfileTypeSelector from "../components/UserProfile/ProfileTypeSelector";
import PageMeta from "../components/common/PageMeta";
import { useUser } from "../context/UserContext";

type UserType = 'super-admin' | 'admin' | 'user';

interface UserData {
  name: string;
  role: string;
  location: string;
  company: string;
  email: string;
  phone: string;
  bio: string;
}

const userData: Record<UserType, UserData> = {
  'super-admin': {
    name: "Aleksandar Nikolić",
    role: "Super Administrator",
    location: "Beograd, Srbija",
    company: "Sistem Administracija d.o.o.",
    email: "aleksandar.nikolic@sistem.rs",
    phone: "+381 11 555 1234",
    bio: "Glavni administrator sistema sa punim pristupom svim organizacijama, korisnicima i sistemskim postavkama"
  },
  'admin': {
    name: "Marko Petrović",
    role: "Administrator",
    location: "Novi Sad, Srbija",
    company: "Tech Solutions d.o.o.",
    email: "marko.petrovic@techsolutions.rs",
    phone: "+381 21 123 4567",
    bio: "Administrator firme sa pristupom korisnicima u svojoj firmi"
  },
  'user': {
    name: "Ana Jovanović",
    role: "Korisnik",
    location: "Niš, Srbija",
    company: "Tech Solutions d.o.o.",
    email: "ana.jovanovic@techsolutions.rs",
    phone: "+381 18 987 6543",
    bio: "Redovan korisnik sistema sa pristupom samo svom nalogu"
  }
};

export default function UserProfiles() {
  const { userType, setUserType } = useUser();
  const currentUser = userData[userType];
  const displayName =
    userType === 'super-admin'
      ? 'Super admin Profil 1'
      : userType === 'admin'
      ? currentUser.company
      : currentUser.name;

  const handleProfileTypeChange = (type: UserType) => {
    setUserType(type);
  };

  return (
    <>
      <PageMeta
        title="Moj Profil"
        description="Ovo je stranica za prikaz mojeg profila"
      />
      <PageBreadcrumb pageTitle="Moj Profil" />
      
      <div className="space-y-6">
        {/* Profile Type Selector */}
        <ProfileTypeSelector 
          currentType={userType}
          onProfileTypeChange={handleProfileTypeChange}
        />

        {/* Main Profile Content */}
        <div className="rounded-2xl lg:py-6">
          <div className="space-y-6">
            {/* User Meta Card - Always visible */}
            <UserMetaCard 
              userType={userType}
              userName={displayName}
              userRole={currentUser.role}
              userLocation={currentUser.location}
              userCompany={currentUser.company}
            />

            {/* Super Admin Dashboard - Only for Super Admin */}
            {userType === 'super-admin' && (
              <SuperAdminDashboard />
            )}

            {/* Company Information Cards - Only for Admin, moved to top */}
            {userType === 'admin' && (
              <>
                <CompanyInfoCard />
                <CompanyContactCard />
                <ContractInfoCard />
              </>
            )}

            {/* User Info Card - Hidden for Super Admin and Admin */}
            {userType === 'user' && (
              <UserInfoCard 
                userType={userType}
                userName={displayName}
                userEmail={currentUser.email}
                userPhone={currentUser.phone}
                userBio={currentUser.bio}
              />
            )}

            {/* User Address Card - Hidden for Super Admin and Admin */}
            {userType === 'user' && (
              <UserAddressCard 
                userType={userType}
                userCountry="Srbija"
                userCity={currentUser.location.split(', ')[0]}
                userPostalCode="11000"
                userTaxId="123456789"
              />
            )}

            {/* Sidebar Settings Card - For Admin and Super Admin */}
            {(userType === 'admin' || userType === 'super-admin') && (
              <SidebarSettingsCard />
            )}

            {/* Organization Settings Card - For Admin only */}
            {userType === 'admin' && (
              <OrganizationSettingsCard />
            )}
          </div>
        </div>

        {/* Access Control Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Informacije o pristupu
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
              <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">
                Tip korisnika
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userType === 'super-admin' && 'Super Administrator - Pun pristup celokupnom sistemu i svim organizacijama'}
                {userType === 'admin' && 'Administrator - Pristup korisnicima u svojoj firmi'}
                {userType === 'user' && 'Korisnik - Pristup samo svom nalogu'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
              <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">
                Mogućnosti
              </h5>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {userType === 'super-admin' && (
                  <>
                    <li>• Kreiranje i upravljanje svim organizacijama</li>
                    <li>• Kreiranje novih admina i korisnika</li>
                    <li>• Pristup svim podacima u sistemu</li>
                    <li>• Sistemske postavke i konfiguracija</li>
                    <li>• Upravljanje dozvolama i pristupima</li>
                    <li>• Monitoring sistema i backup</li>
                  </>
                )}
                {userType === 'admin' && (
                  <>
                    <li>• Kreiranje novih korisnika</li>
                    <li>• Pristup korisnicima u svojoj firmi</li>
                    <li>• Upravljanje firmom</li>
                    <li>• Pregled podataka firme</li>
                  </>
                )}
                {userType === 'user' && (
                  <>
                    <li>• Izmena sopstvenog naloga</li>
                    <li>• Pregled sopstvenih podataka</li>
                    <li>• Ograničen pristup</li>
                  </>
                )}
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
              <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">
                {userType === 'super-admin' ? 'Sistem' : 'Firma'}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userType === 'super-admin' ? 'Sistem Administracija d.o.o.' : currentUser.company}
              </p>
              {userType === 'super-admin' && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Glavni administrator sistema
                </p>
              )}
              {userType === 'admin' && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Administrator firme
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
