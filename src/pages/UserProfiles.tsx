
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import CompanyInfoCard from "../components/UserProfile/CompanyInfoCard";
import CompanyContactCard from "../components/UserProfile/CompanyContactCard";
import SidebarSettingsCard from "../components/UserProfile/SidebarSettingsCard";
import OrganizationSettingsCard from "../components/UserProfile/OrganizationSettingsCard";
import SuperAdminDashboard from "../components/UserProfile/SuperAdminDashboard";
import ProfileTypeSelector from "../components/UserProfile/ProfileTypeSelector";
import PageMeta from "../components/common/PageMeta";
import { useUser } from "../context/UserContext";

type UserType = 'super-admin' | 'admin' | 'user' | 'komitent';

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
  },
  'komitent': {
    name: "Petar Marković",
    role: "Komitent",
    location: "Kragujevac, Srbija",
    company: "Tech Solutions d.o.o.",
    email: "petar.markovic@techsolutions.rs",
    phone: "+381 34 456 7890",
    bio: "Komitent sa pristupom samo za pregled podataka - bez mogućnosti izmena"
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
      : userType === 'komitent'
      ? currentUser.name
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
              enableImageUpload={true}
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
              </>
            )}

            {/* User Info Card - Hidden for Super Admin and Admin */}
            {(userType === 'user' || userType === 'komitent') && (
              <UserInfoCard 
                userType={userType}
                userName={displayName}
                userEmail={currentUser.email}
                userPhone={currentUser.phone}
                userBio={currentUser.bio}
              />
            )}

            {/* User Address Card - Hidden for Super Admin and Admin */}
            {(userType === 'user' || userType === 'komitent') && (
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

        {/* Profile Type Selector - Moved to bottom */}
        <ProfileTypeSelector 
          currentType={userType}
          onProfileTypeChange={handleProfileTypeChange}
        />
      </div>
    </>
  );
}
