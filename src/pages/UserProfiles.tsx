import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import CompanyInfoCard from "../components/UserProfile/CompanyInfoCard";
import CompanyContactCard from "../components/UserProfile/CompanyContactCard";
import SidebarSettingsCard from "../components/UserProfile/SidebarSettingsCard";
import OrganizationSettingsCard from "../components/UserProfile/OrganizationSettingsCard";
import SuperAdminDashboard from "../components/UserProfile/SuperAdminDashboard";
import PageMeta from "../components/common/PageMeta";
import { useUser } from "../context/UserContext";
import { api } from "../api/client";

type UserType = 'super-admin' | 'admin' | 'user' | 'komitent';

interface AuthenticatedUser {
  id: number;
  name: string;
  ime?: string;
  prezime?: string;
  email: string;
  role: string;
  firma_pib?: string;
  profile_photo_url?: string;
  section_permissions?: {
    'moje-preduzece'?: { can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean };
    'komitenti'?: { can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean };
  };
  firma?: {
    naziv: string;
    pib: string;
    maticni_broj?: string;
    sifra_delatnosti?: string;
    adresa: string;
    mesto: string;
    drzava: string;
    email: string;
    direktor_ime_prezime?: string;
    direktor_telefon?: string;
    direktor_email?: string;
    saradnik_ime_prezime?: string;
    saradnik_telefon?: string;
    saradnik_email?: string;
  };
}

const mapRoleToUserType = (role: string): UserType => {
  if (role === 'super_admin') return 'super-admin';
  if (role === 'admin') return 'admin';
  if (role === 'komitent') return 'komitent';
  return 'user';
};

const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case 'super_admin':
      return 'Super Administrator';
    case 'admin':
      return 'Administrator';
    case 'komitent':
      return 'Komitent';
    default:
      return 'Korisnik';
  }
};

export default function UserProfiles() {
  const { setUserType, setSectionPermissions, setSidebarMode } = useUser();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadUser = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const userData = await api.get<AuthenticatedUser>("auth/me");
      setUser(userData);
      const mappedRole = mapRoleToUserType(userData.role);
      setUserType(mappedRole);

      // Set section permissions from backend
      const permissions = userData?.section_permissions ?? {};
      setSectionPermissions(permissions);

      // Set sidebar mode based on permissions
      const canSeeMojePreduzece = permissions?.['moje-preduzece']?.can_view ?? (userData.role !== 'user');
      const canSeeKomitenti = permissions?.['komitenti']?.can_view ?? (userData.role !== 'user');

      if (canSeeMojePreduzece && canSeeKomitenti) {
        setSidebarMode('both');
      } else if (canSeeKomitenti) {
        setSidebarMode('komitenti');
      } else {
        setSidebarMode('moja-firma');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri učitavanju korisnika.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [setUserType]);

  if (isLoading) {
    return (
      <>
        <PageMeta
          title="Moj Profil"
          description="Ovo je stranica za prikaz mojeg profila"
        />
        <PageBreadcrumb pageTitle="Moj Profil" />
        <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Učitavanje...</div>
      </>
    );
  }

  if (errorMessage || !user) {
    return (
      <>
        <PageMeta
          title="Moj Profil"
          description="Ovo je stranica za prikaz mojeg profila"
        />
        <PageBreadcrumb pageTitle="Moj Profil" />
        <div className="p-4 text-sm text-error-500">
          {errorMessage || "Greška pri učitavanju korisnika."}
        </div>
      </>
    );
  }

  const userType = mapRoleToUserType(user.role);
  const displayName = user.name || `${user.ime || ''} ${user.prezime || ''}`.trim() || user.email;
  const userLocation = user.firma?.mesto && user.firma?.drzava 
    ? `${user.firma.mesto}, ${user.firma.drzava}`
    : "Srbija";
  const userCompany = user.firma?.naziv || "";
  const profileImageUrl = user.profile_photo_url || "/images/user/owner.jpg";

  const handleProfileImageChange = async (file: File, _dataUrl: string) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post<{ user: AuthenticatedUser }>("auth/profile-photo", formData);
      setUser(response.user);
      // Clear any error message on success
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Greška pri ažuriranju profilne slike.");
    }
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
              userRole={getRoleDisplayName(user.role)}
              userLocation={userLocation}
              userCompany={userCompany}
              profileImageUrl={profileImageUrl}
              enableImageUpload={userType === 'admin' || userType === 'super-admin'}
              onProfileImageChange={handleProfileImageChange}
            />

            {/* Super Admin Dashboard - Only for Super Admin */}
            {userType === 'super-admin' && (
              <SuperAdminDashboard />
            )}

            {/* Company Information Cards - Only for Admin, moved to top */}
            {userType === 'admin' && user.firma && (
              <>
                <CompanyInfoCard firma={user.firma} onUpdate={loadUser} />
                <CompanyContactCard firma={user.firma} onUpdate={loadUser} />
              </>
            )}

            {/* Read-only notice for regular users */}
            {(userType === 'user' || userType === 'komitent') && (
              <div className="p-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Profil je samo za čitanje</p>
                    <p className="mt-1">
                      Podatke na profilu može menjati samo administrator. Ukoliko želite da promenite neke podatke, kontaktirajte administratora.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* User Info Card - Hidden for Super Admin and Admin */}
            {(userType === 'user' || userType === 'komitent') && (
              <UserInfoCard
                userType={userType}
                userName={displayName}
                userEmail={user.email}
                userPhone=""
                userBio=""
                isReadOnly={true}
              />
            )}

            {/* User Address Card - Hidden for Super Admin and Admin */}
            {(userType === 'user' || userType === 'komitent') && user.firma && (
              <UserAddressCard
                userType={userType}
                userCountry={user.firma.drzava || "Srbija"}
                userCity={user.firma.mesto || ""}
                userPostalCode=""
                userTaxId={user.firma.pib || ""}
                isReadOnly={true}
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
      </div>
    </>
  );
}
