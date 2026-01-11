import { useState, useRef, useEffect } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Checkbox from "../form/input/Checkbox";
import { EditButtonIcon, DeleteButtonIcon } from "../../icons";
import FirmeForm from "../../pages/firme/FirmeForm";
import AngazovanjaForm from "../../pages/angazovanja/AngazovanjaForm";

interface Firma {
  id: string;
  name: string;
  email: string;
  type: 'admin' | 'client';
  status: 'active' | 'suspended' | 'pending';
  userCount: number;
  adminCount: number;
  createdAt: string;
  lastActivity: string;
  // Additional fields for table display
  naziv?: string;
  adresa?: string;
  mesto?: string;
  pib?: string;
  maticniBroj?: string;
  delatnost?: string;
  datumIstekaUgovora?: Date | string;
  [key: string]: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'user' | 'komitent';
  organization: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: {
    canCreateUsers: boolean;
    canManageOrganizations: boolean;
    canAccessAllData: boolean;
    canManageSystem: boolean;
  };
  // Angazovanja fields
  radnoMesto?: string;
  lokacija?: string;
  vrstaAngazovanja?: string;
  datumPocetka?: Date | string;
  datumPrestanka?: Date | string | null;
}

interface Komitent {
  id: string;
  name: string;
  email: string;
  organization: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  // FirmeForm fields
  naziv?: string;
  adresa?: string;
  drzava?: string;
  mesto?: string;
  pib?: string;
  maticniBroj?: string;
  delatnost?: string;
  emailFirme?: string;
  datumPocetkaUgovora?: Date | string;
  datumIstekaUgovora?: Date | string;
  [key: string]: any;
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'users' | 'komitenti'>('overview');
  
  // Refs for dropdowns
  const firmaRef = useRef<HTMLDivElement>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingPermissions, setEditingPermissions] = useState({
    canCreateUsers: false,
    canManageOrganizations: false,
    canAccessAllData: false,
    canManageSystem: false
  });
  
  // State for organization access checkboxes
  const [organizationAccess, setOrganizationAccess] = useState<{
    [key: string]: {
      mojaFirma: boolean;
      komitenti: boolean;
      ostalo: boolean;
    };
  }>({});

  // State for user access checkboxes (separate from organization access)
  const [userAccess, setUserAccess] = useState<{
    [key: string]: {
      mojaFirma: boolean;
      komitenti: boolean;
      ostalo: boolean;
    };
  }>({});

  // State for add forms
  const [showAddFirmaModal, setShowAddFirmaModal] = useState(false);
  const [showAddKorisnikModal, setShowAddKorisnikModal] = useState(false);
  const [showAddKomitentModal, setShowAddKomitentModal] = useState(false);
  
  // State for dropdowns
  const [isFirmaOpen, setIsFirmaOpen] = useState(false);
  
  // State for edit forms
  const [isEditingFirma, setIsEditingFirma] = useState(false);
  const [editingFirmaId, setEditingFirmaId] = useState<string | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isEditingKomitent, setIsEditingKomitent] = useState(false);
  const [editingKomitentId, setEditingKomitentId] = useState<string | null>(null);
  
  // State for access change confirmation modal
  const [showAccessChangeModal, setShowAccessChangeModal] = useState(false);
  const [pendingAccessChange, setPendingAccessChange] = useState<{
    orgId: string;
    accessType: 'mojaFirma' | 'komitenti' | 'ostalo';
    checked: boolean;
    orgName: string;
    accessTypeLabel: string;
    isUser: boolean;
  } | null>(null);

  // State for delete confirmation modals
  const [showDeleteFirmaModal, setShowDeleteFirmaModal] = useState(false);
  const [firmaToDelete, setFirmaToDelete] = useState<Firma | null>(null);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteKomitentModal, setShowDeleteKomitentModal] = useState(false);
  const [komitentToDelete, setKomitentToDelete] = useState<Komitent | null>(null);
  
  
  // Editing firma state - stores the firma being edited
  const [editingFirmaData, setEditingFirmaData] = useState<Firma | null>(null);
  // Editing user state - stores the user being edited
  const [editingUserData, setEditingUserData] = useState<User | null>(null);
  // Editing komitent state - stores the komitent being edited
  const [editingKomitentData, setEditingKomitentData] = useState<Komitent | null>(null);

  const firme: Firma[] = [
    {
      id: "1",
      name: "Tech Solutions d.o.o.",
      naziv: "Tech Solutions d.o.o.",
      email: "info@techsolutions.rs",
      type: "admin",
      status: "active",
      userCount: 45,
      adminCount: 3,
      createdAt: "2023-06-15",
      lastActivity: "2024-01-15 14:30",
      adresa: "Bulevar Kralja Aleksandra 1",
      mesto: "Beograd",
      pib: "123456789",
      maticniBroj: "987654321",
      delatnost: "IT delatnost",
      datumIstekaUgovora: new Date("2024-12-31")
    },
    {
      id: "2",
      name: "Client Company A",
      naziv: "Client Company A",
      email: "contact@clienta.rs",
      type: "client",
      status: "active",
      userCount: 12,
      adminCount: 1,
      createdAt: "2023-08-22",
      lastActivity: "2024-01-15 12:15",
      adresa: "Ulica Kralja Petra 10",
      mesto: "Novi Sad",
      pib: "987654321",
      maticniBroj: "123456789",
      delatnost: "Uslužne delatnosti",
      datumIstekaUgovora: new Date("2024-06-30")
    },
    {
      id: "3",
      name: "Client Company B",
      naziv: "Client Company B",
      email: "info@clientb.rs",
      type: "client",
      status: "active",
      userCount: 8,
      adminCount: 1,
      createdAt: "2023-09-10",
      lastActivity: "2024-01-14 16:45",
      adresa: "Ulica Nikole Pašića 5",
      mesto: "Niš",
      pib: "456789123",
      maticniBroj: "789123456",
      delatnost: "Trgovina",
      datumIstekaUgovora: new Date("2024-09-20")
    },
    {
      id: "4",
      name: "New Organization",
      naziv: "New Organization",
      email: "admin@neworg.rs",
      type: "admin",
      status: "pending",
      userCount: 0,
      adminCount: 0,
      createdAt: "2024-01-15",
      lastActivity: "N/A",
      adresa: "Ulica Maršala Tita 15",
      mesto: "Kragujevac",
      pib: "789123456",
      maticniBroj: "456789123",
      delatnost: "Proizvodnja",
      datumIstekaUgovora: new Date("2024-11-10")
    }
  ];

  const users: User[] = [
    {
      id: "1",
      name: "Aleksandar Nikolić",
      email: "aleksandar.nikolic@sistem.rs",
      role: "super-admin",
      organization: "Sistem Administracija d.o.o.",
      status: "active",
      lastLogin: "2024-01-15 14:30",
      permissions: {
        canCreateUsers: true,
        canManageOrganizations: true,
        canAccessAllData: true,
        canManageSystem: true
      }
    },
    {
      id: "2",
      name: "Marko Petrović",
      email: "marko.petrovic@techsolutions.rs",
      role: "admin",
      organization: "Tech Solutions d.o.o.",
      status: "active",
      lastLogin: "2024-01-15 13:45",
      permissions: {
        canCreateUsers: true,
        canManageOrganizations: false,
        canAccessAllData: false,
        canManageSystem: false
      }
    },
    {
      id: "3",
      name: "Ana Jovanović",
      email: "ana.jovanovic@techsolutions.rs",
      role: "user",
      organization: "Tech Solutions d.o.o.",
      status: "active",
      lastLogin: "2024-01-15 11:20",
      permissions: {
        canCreateUsers: false,
        canManageOrganizations: false,
        canAccessAllData: false,
        canManageSystem: false
      }
    }
  ];

  const komitenti: Komitent[] = [
    {
      id: "1",
      name: "Petar Stojanović",
      email: "petar.stojanovic@komitent.rs",
      organization: "Tech Solutions d.o.o.",
      status: "active",
      lastLogin: "2024-01-15 10:30",
      createdAt: "2023-12-01"
    },
    {
      id: "2",
      name: "Milica Đorđević",
      email: "milica.djordjevic@komitent.rs",
      organization: "Client Company A",
      status: "active",
      lastLogin: "2024-01-14 16:20",
      createdAt: "2023-11-15"
    },
    {
      id: "3",
      name: "Stefan Marković",
      email: "stefan.markovic@komitent.rs",
      organization: "Client Company B",
      status: "inactive",
      lastLogin: "2024-01-10 09:15",
      createdAt: "2023-10-20"
    }
  ];


  const handleSavePermissions = () => {
    if (selectedUser) {
      // Here you would typically save the permissions to your backend
      console.log('Saving permissions for user:', selectedUser.name, editingPermissions);
      
      // Update the user in the local state (in a real app, this would come from the backend)
      
      // Close the modal
      setShowPermissionsModal(false);
      setSelectedUser(null);
    }
  };

  const handleCloseModal = () => {
    setShowPermissionsModal(false);
    setSelectedUser(null);
  };

  const handleOrganizationAccessChange = (orgId: string, accessType: 'mojaFirma' | 'komitenti' | 'ostalo', checked: boolean, isUser: boolean = false) => {
    // Find the organization/user name for display based on isUser parameter
    let entityName = '';
    
    if (isUser) {
      // Looking for a user
      const user = users.find(u => u.id === orgId);
      if (user) {
        entityName = user.name;
      } else {
        return; // User not found
      }
    } else {
      // Looking for an organization
      const org = firme.find(f => f.id === orgId);
      if (org) {
        entityName = org.name;
      } else {
        return; // Organization not found
      }
    }
    
    const accessTypeLabels = {
      mojaFirma: 'Moja Firma',
      komitenti: 'Komitenti',
      ostalo: 'Ostalo'
    };
    
    // Show confirmation modal instead of immediately applying
    setPendingAccessChange({
      orgId,
      accessType,
      checked,
      orgName: entityName,
      accessTypeLabel: accessTypeLabels[accessType],
      isUser
    });
    setShowAccessChangeModal(true);
  };
  
  const confirmAccessChange = () => {
    if (pendingAccessChange) {
      if (pendingAccessChange.isUser) {
        // Update user access
        setUserAccess(prev => ({
          ...prev,
          [pendingAccessChange.orgId]: {
            ...prev[pendingAccessChange.orgId],
            [pendingAccessChange.accessType]: pendingAccessChange.checked
          }
        }));
      } else {
        // Update organization access
        setOrganizationAccess(prev => ({
          ...prev,
          [pendingAccessChange.orgId]: {
            ...prev[pendingAccessChange.orgId],
            [pendingAccessChange.accessType]: pendingAccessChange.checked
          }
        }));
      }
      
      // Close modal and reset pending change
      setShowAccessChangeModal(false);
      setPendingAccessChange(null);
    }
  };
  
  const cancelAccessChange = () => {
    setShowAccessChangeModal(false);
    setPendingAccessChange(null);
  };

  const handleSaveFirma = (data: any) => {
    if (isEditingFirma && editingFirmaId) {
      // Update existing firma
      console.log('Updating firma:', editingFirmaId, data);
      // In a real app, you would update in backend here
    } else {
      // Add new firma (admin organization)
      const newFirmaObj: Firma = {
        id: (firme.length + 1).toString(),
        name: data.nazivFirme,
        naziv: data.nazivFirme,
        email: data.emailFirme || '',
        adresa: data.adresaFirme,
        drzava: data.drzava,
        mesto: data.mesto,
        pib: data.pib,
        maticniBroj: data.maticniBroj,
        delatnost: data.sifraDelatnosti,
        type: 'admin',
        status: 'active',
        userCount: 0,
        adminCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastActivity: 'N/A',
        datumIstekaUgovora: data.datumIstekaUgovora,
        // Include komitent data if fromAdminDashboard
        ...(data.createKomitent && data.komitentData ? { komitentEmail: data.komitentData.email } : {})
      };
      
      // In a real app, you would save to backend here
      console.log('Adding new admin firma:', newFirmaObj);
    }
    
    // Reset form and close modal
    setIsEditingFirma(false);
    setEditingFirmaId(null);
    setEditingFirmaData(null);
    setShowAddFirmaModal(false);
  };

  const handleSaveKorisnik = (data: any) => {
    if (isEditingUser && editingUserId) {
      // Update existing user
      console.log('Updating user:', editingUserId, data);
      // In a real app, you would update in backend here
    } else {
      // Add new user
      const newKorisnikObj: User = {
        id: (users.length + 1).toString(),
        name: data.zaposleni || '',
        email: data.korisnikData?.email || '',
        role: 'user',
        organization: '', // Will be set based on context
        status: 'active',
        lastLogin: 'N/A',
        permissions: {
          canCreateUsers: false,
          canManageOrganizations: false,
          canAccessAllData: false,
          canManageSystem: false
        },
        radnoMesto: data.radnoMesto || '',
        lokacija: data.lokacija || '',
        vrstaAngazovanja: data.vrstaAngazovanja || '',
        datumPocetka: data.datumPocetka || new Date(),
        datumPrestanka: data.datumPrestanka || null,
      };
      
      // In a real app, you would save to backend here
      console.log('Adding new korisnik:', newKorisnikObj, data);
    }
    
    // Reset form and close modal
    setIsEditingUser(false);
    setEditingUserId(null);
    setEditingUserData(null);
    setShowAddKorisnikModal(false);
  };

  const handleCloseAddFirmaModal = () => {
    setShowAddFirmaModal(false);
    setIsEditingFirma(false);
    setEditingFirmaId(null);
    setEditingFirmaData(null);
  };

  const handleCloseAddKorisnikModal = () => {
    setShowAddKorisnikModal(false);
    setIsEditingUser(false);
    setEditingUserId(null);
    setEditingUserData(null);
  };

  const handleEditFirma = (firma: Firma) => {
    // Set the form data for editing
    setEditingFirmaData(firma);
    setIsEditingFirma(true);
    setEditingFirmaId(firma.id);
    setShowAddFirmaModal(true);
    console.log('Editing firma:', firma);
  };

  const handleDeleteFirma = (firma: Firma) => {
    setFirmaToDelete(firma);
    setShowDeleteFirmaModal(true);
  };

  const confirmDeleteFirma = () => {
    if (firmaToDelete) {
      // In a real app, you would delete from backend here
      console.log('Deleted firma:', firmaToDelete);
      setShowDeleteFirmaModal(false);
      setFirmaToDelete(null);
    }
  };

  const cancelDeleteFirma = () => {
    setShowDeleteFirmaModal(false);
    setFirmaToDelete(null);
  };

  const handleEditUser = (user: User) => {
    // Set the form data for editing
    setEditingUserData(user);
    setIsEditingUser(true);
    setEditingUserId(user.id);
    setShowAddKorisnikModal(true);
    console.log('Editing user:', user);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteUserModal(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      // In a real app, you would delete from backend here
      console.log('Deleted user:', userToDelete);
      setShowDeleteUserModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteUserModal(false);
    setUserToDelete(null);
  };

  const handleSaveKomitent = (data: any) => {
    if (isEditingKomitent && editingKomitentId) {
      // Update existing komitent
      console.log('Updating komitent:', editingKomitentId, data);
      // In a real app, you would update in backend here
    } else {
      // Add new komitent
      const newKomitentObj: Komitent = {
        id: (komitenti.length + 1).toString(),
        name: data.nazivFirme || '',
        email: data.komitentData?.email || data.emailFirme || '',
        organization: '', // Will be set based on context
        status: 'active',
        lastLogin: 'N/A',
        createdAt: new Date().toISOString().split('T')[0],
        naziv: data.nazivFirme || '',
        adresa: data.adresaFirme || '',
        drzava: data.drzava || '',
        mesto: data.mesto || '',
        pib: data.pib || '',
        maticniBroj: data.maticniBroj || '',
        delatnost: data.sifraDelatnosti || '',
        emailFirme: data.emailFirme || '',
        datumPocetkaUgovora: data.datumPocetkaUgovora || new Date(),
        datumIstekaUgovora: data.datumIstekaUgovora || new Date(),
      };
      
      // In a real app, you would save to backend here
      console.log('Adding new komitent:', newKomitentObj, data);
    }
    
    // Reset form and close modal
    setIsEditingKomitent(false);
    setEditingKomitentId(null);
    setEditingKomitentData(null);
    setShowAddKomitentModal(false);
  };

  const handleCloseAddKomitentModal = () => {
    setShowAddKomitentModal(false);
    setIsEditingKomitent(false);
    setEditingKomitentId(null);
    setEditingKomitentData(null);
  };

  const handleEditKomitent = (komitent: Komitent) => {
    // Set the form data for editing
    setEditingKomitentData(komitent);
    setIsEditingKomitent(true);
    setEditingKomitentId(komitent.id);
    setShowAddKomitentModal(true);
    console.log('Editing komitent:', komitent);
  };

  const handleDeleteKomitent = (komitent: Komitent) => {
    setKomitentToDelete(komitent);
    setShowDeleteKomitentModal(true);
  };

  const confirmDeleteKomitent = () => {
    if (komitentToDelete) {
      // In a real app, you would delete from backend here
      console.log('Deleted komitent:', komitentToDelete);
      setShowDeleteKomitentModal(false);
      setKomitentToDelete(null);
    }
  };

  const cancelDeleteKomitent = () => {
    setShowDeleteKomitentModal(false);
    setKomitentToDelete(null);
  };

  const totalFirme = firme.length;
  const totalAdministratori = firme.filter(firma => firma.type === 'admin').length;
  const totalKorisnici = users.length;
  const totalKomitenti = komitenti.length;

  // Filter only admin organizations for the organizations tab
  const adminOrganizations = firme.filter(firma => firma.type === 'admin');

  // Columns for admin table
  const adminColumns = [
    { key: "redniBroj", label: "Redni broj", sortable: true },
    { key: "naziv", label: "Naziv preduzeća/radnje", sortable: true },
    { key: "adresa", label: "Adresa", sortable: true },
    { key: "mesto", label: "Mesto", sortable: true },
    { key: "pib", label: "PIB", sortable: true },
    { key: "maticniBroj", label: "Matični broj", sortable: true },
    { key: "delatnost", label: "Delatnost", sortable: true },
    { key: "datumIstekaUgovora", label: "Datum isteka ugovora", sortable: true },
  ];

  // Sorting and pagination for admin table


  const formatDate = (date: Date | string): string => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('sr-Latn-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Reset page to 1 when items per page changes
  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdowns
      if (firmaRef.current && !firmaRef.current.contains(target)) {
        setIsFirmaOpen(false);
      }
    };

    const handleScroll = () => {
      if (isFirmaOpen) {
        setIsFirmaOpen(false);
      }
    };

    const handleResize = () => {
      if (isFirmaOpen) {
        setIsFirmaOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isFirmaOpen]);

  return (
    <div className="p-5 border border-gray-200 bg-white dark:bg-gray-800 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Pregled Sistema
            </h4>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === 'overview'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Pregled sistema
          </button>
          <button
            onClick={() => setActiveTab('organizations')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === 'organizations'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Admin ({totalFirme})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === 'users'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Korisnik ({totalKorisnici})
          </button>
          <button
            onClick={() => setActiveTab('komitenti')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === 'komitenti'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Komitent ({totalKomitenti})
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* System Statistics */}
              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">
                  Administratori
                </h5>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {totalAdministratori}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admin organizacije
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">
                  Korisnici
                </h5>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {totalKorisnici}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Registrovani korisnici
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">
                  Komitenti
                </h5>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {totalKomitenti}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Registrovani komitenti
                </p>
              </div>
            </div>
          )}

          {activeTab === 'organizations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  Upravljanje Adminima
                </h5>
                <Button size="sm" onClick={() => {
                  setIsEditingFirma(false);
                  setEditingFirmaId(null);
                  setEditingFirmaData(null);
                  setShowAddFirmaModal(true);
                }}>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Dodaj Administratora
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      {adminColumns.map(({ key, label }) => (
                        <th key={key} className="px-4 py-3">
                          {key === 'redniBroj' ? '' : label}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-center">Moja Firma</th>
                      <th className="px-4 py-3 text-center">Komitenti</th>
                      <th className="px-4 py-3 text-center">Ostalo</th>
                      <th className="px-4 py-3 text-center">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminOrganizations.map((org, index) => (
                      <tr key={org.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        {adminColumns.map(({ key }) => (
                          <td key={key} className={key === 'naziv' ? "px-4 py-4 font-medium text-gray-900 dark:text-white" : "px-4 py-4 text-gray-500 dark:text-gray-400"}>
                            {key === 'redniBroj' ? (
                              index + 1
                            ) : key === 'datumIstekaUgovora' ? (
                              formatDate((org[key as keyof Firma] as Date | string) || '')
                            ) : (
                              (org[key as keyof Firma] as string) || '-'
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={organizationAccess[org.id]?.mojaFirma || false}
                              onChange={(checked) => handleOrganizationAccessChange(org.id, 'mojaFirma', checked, false)}
                              className="w-4 h-4"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={organizationAccess[org.id]?.komitenti || false}
                              onChange={(checked) => handleOrganizationAccessChange(org.id, 'komitenti', checked, false)}
                              className="w-4 h-4"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={organizationAccess[org.id]?.ostalo || false}
                              onChange={(checked) => handleOrganizationAccessChange(org.id, 'ostalo', checked, false)}
                              className="w-4 h-4"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleEditFirma(org)}
                              className="text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF]"
                            >
                              <EditButtonIcon className="size-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteFirma(org)}
                              className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                            >
                              <DeleteButtonIcon className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

                     {activeTab === 'users' && (
             <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h5 className="text-lg font-medium text-gray-800 dark:text-white/90">
                   Upravljanje korisnicima
                 </h5>
                                   <Button size="sm" onClick={() => {
                    setIsEditingUser(false);
                    setEditingUserId(null);
                    setEditingUserData(null);
                    setShowAddKorisnikModal(true);
                  }}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Dodaj korisnika
                  </Button>
               </div>
               
               {/* Group users by organization */}
               {(() => {
                 const groupedUsers = users.reduce((acc, user) => {
                   const org = user.organization;
                   if (!acc[org]) {
                     acc[org] = [];
                   }
                   acc[org].push(user);
                   return acc;
                 }, {} as { [key: string]: User[] });

                 return Object.entries(groupedUsers).map(([organization, orgUsers]) => (
                   <div key={organization} className="space-y-3">
                                           {/* Organization Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 px-6 py-4 rounded-lg shadow-sm">
                        <h6 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                          {organization}
                        </h6>
                      </div>
                     
                     {/* Users Table for this Organization */}
                     <div className="overflow-x-auto">
                       <table className="w-full text-sm text-left">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                           <tr>
                             <th className="px-4 py-3">Ime i prezime</th>
                             <th className="px-4 py-3">Email</th>
                             <th className="px-4 py-3">Radno mesto</th>
                             <th className="px-4 py-3">Lokacija</th>
                             <th className="px-4 py-3">Vrsta angažovanja</th>
                             <th className="px-4 py-3">Datum početka</th>
                             <th className="px-4 py-3">Datum prestanka</th>
                             <th className="px-4 py-3 text-center">Moja Firma</th>
                             <th className="px-4 py-3 text-center">Komitenti</th>
                             <th className="px-4 py-3 text-center">Ostalo</th>
                             <th className="px-4 py-3 text-center">Akcije</th>
                           </tr>
                         </thead>
                         <tbody>
                           {orgUsers.map((user) => (
                             <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                               <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                                 {user.role === 'super-admin' ? 'Aleksandar Nikolić' : user.name}
                               </td>
                               <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                 {user.email}
                               </td>
                               <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                 {user.radnoMesto || '-'}
                               </td>
                               <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                 {user.lokacija || '-'}
                               </td>
                               <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                 {user.vrstaAngazovanja || '-'}
                               </td>
                               <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                 {user.datumPocetka ? formatDate(user.datumPocetka) : '-'}
                               </td>
                               <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                 {user.datumPrestanka ? formatDate(user.datumPrestanka) : '-'}
                               </td>
                               <td className="px-4 py-4">
                                 <div className="flex justify-center">
                                   <Checkbox
                                     checked={userAccess[user.id]?.mojaFirma || false}
                                     onChange={(checked) => handleOrganizationAccessChange(user.id, 'mojaFirma', checked, true)}
                                     className="w-4 h-4"
                                   />
                                 </div>
                               </td>
                               <td className="px-4 py-4">
                                 <div className="flex justify-center">
                                   <Checkbox
                                     checked={userAccess[user.id]?.komitenti || false}
                                     onChange={(checked) => handleOrganizationAccessChange(user.id, 'komitenti', checked, true)}
                                     className="w-4 h-4"
                                   />
                                 </div>
                               </td>
                               <td className="px-4 py-4">
                                 <div className="flex justify-center">
                                   <Checkbox
                                     checked={userAccess[user.id]?.ostalo || false}
                                     onChange={(checked) => handleOrganizationAccessChange(user.id, 'ostalo', checked, true)}
                                     className="w-4 h-4"
                                   />
                                 </div>
                               </td>
                               <td className="px-4 py-4">
                                 <div className="flex items-center justify-center gap-2">
                                   <button 
                                     onClick={() => handleEditUser(user)}
                                     className="text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF]"
                                   >
                                     <EditButtonIcon className="size-4" />
                                   </button>
                                   <button 
                                     onClick={() => handleDeleteUser(user)}
                                     className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                                   >
                                     <DeleteButtonIcon className="size-4" />
                                   </button>
                                 </div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   </div>
                 ));
               })()}
             </div>
           )}

          {activeTab === 'komitenti' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  Upravljanje Komitentima
                </h5>
                <Button size="sm" onClick={() => {
                  setIsEditingKomitent(false);
                  setEditingKomitentId(null);
                  setEditingKomitentData(null);
                  setShowAddKomitentModal(true);
                }}>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Dodaj komitenta
                </Button>
              </div>
              
              {/* Group komitenti by organization */}
              {(() => {
                const groupedKomitenti = komitenti.reduce((acc, komitent) => {
                  const org = komitent.organization;
                  if (!acc[org]) {
                    acc[org] = [];
                  }
                  acc[org].push(komitent);
                  return acc;
                }, {} as { [key: string]: Komitent[] });

                return Object.entries(groupedKomitenti).map(([organization, orgKomitenti]) => (
                  <div key={organization} className="space-y-3">
                    {/* Organization Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 px-6 py-4 rounded-lg shadow-sm">
                      <h6 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        {organization}
                      </h6>
                    </div>
                    
                    {/* Komitenti Table for this Organization */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th className="px-4 py-3">Naziv preduzeća</th>
                            <th className="px-4 py-3">Adresa</th>
                            <th className="px-4 py-3">Mesto</th>
                            <th className="px-4 py-3">PIB</th>
                            <th className="px-4 py-3">Matični broj</th>
                            <th className="px-4 py-3">Delatnost</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Datum isteka ugovora</th>
                            <th className="px-4 py-3 text-center">Akcije</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orgKomitenti.map((komitent) => (
                            <tr key={komitent.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                                {komitent.naziv || komitent.name}
                              </td>
                              <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                {komitent.adresa || '-'}
                              </td>
                              <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                {komitent.mesto || '-'}
                              </td>
                              <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                {komitent.pib || '-'}
                              </td>
                              <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                {komitent.maticniBroj || '-'}
                              </td>
                              <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                {komitent.delatnost || '-'}
                              </td>
                              <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                {komitent.emailFirme || komitent.email || '-'}
                              </td>
                              <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                                {komitent.datumIstekaUgovora ? formatDate(komitent.datumIstekaUgovora) : '-'}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button 
                                    onClick={() => handleEditKomitent(komitent)}
                                    className="text-gray-500 hover:text-[#465FFF] dark:text-gray-400 dark:hover:text-[#465FFF]"
                                  >
                                    <EditButtonIcon className="size-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteKomitent(komitent)}
                                    className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                                  >
                                    <DeleteButtonIcon className="size-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Permissions Modal */}
      <Modal
        isOpen={showPermissionsModal}
        onClose={handleCloseModal}
        className="max-w-[600px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          <div className="p-5 pt-10">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
              Uredi dozvole
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedUser?.name}
            </p>
          </div>
          
          <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-200px)]">
            <div className="space-y-4 pb-4">
              <>
                {/* Permission Item 1 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Kreiranje korisnika
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Može da kreira nove korisnike
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissions.canCreateUsers}
                      onChange={(e) => setEditingPermissions({
                        ...editingPermissions,
                        canCreateUsers: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                  </label>
                </div>
                
                {/* Permission Item 2 - Only show for non-super-admin users */}
                {selectedUser?.role !== 'super-admin' && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Upravljanje organizacijama
                        </Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Može da upravlja organizacijama
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingPermissions.canManageOrganizations}
                        onChange={(e) => setEditingPermissions({
                          ...editingPermissions,
                          canManageOrganizations: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                    </label>
                  </div>
                )}
                
                {/* Permission Item 3 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pristup svim podacima
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Ima pristup svim podacima u sistemu
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPermissions.canAccessAllData}
                    onChange={(e) => setEditingPermissions({
                      ...editingPermissions,
                      canAccessAllData: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                </label>
              </div>
              
              {/* Permission Item 4 */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Upravljanje sistemom
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Može da upravlja sistemskim postavkama
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPermissions.canManageSystem}
                    onChange={(e) => setEditingPermissions({
                      ...editingPermissions,
                      canManageSystem: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                </label>
              </div>
              </>
            </div>
          </div>

          <div className="pb-5 pt-2 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseModal}>
                Otkaži
              </Button>
              <Button onClick={handleSavePermissions}>
                Sačuvaj
              </Button>
            </div>
          </div>
                 </div>
       </Modal>

       {/* Add Firma Modal - Using FirmeForm */}
       <FirmeForm
         isOpen={showAddFirmaModal}
         onClose={handleCloseAddFirmaModal}
         onSave={handleSaveFirma}
         initialData={editingFirmaData ? {
           naziv: editingFirmaData.naziv || editingFirmaData.name,
           adresa: editingFirmaData.adresa || '',
           drzava: editingFirmaData.drzava || '',
           mesto: editingFirmaData.mesto || '',
           pib: editingFirmaData.pib || '',
           maticniBroj: editingFirmaData.maticniBroj || '',
           delatnost: editingFirmaData.delatnost || '',
           emailFirme: editingFirmaData.email || '',
           datumIstekaUgovora: editingFirmaData.datumIstekaUgovora || new Date(),
           datumPocetkaUgovora: editingFirmaData.datumPocetkaUgovora || new Date(),
           // Include any other fields that might exist on the firma object
           ...(editingFirmaData as any)
         } : undefined}
         fromAdminDashboard={true}
         userLabel="administratora"
       />

       {/* Add Korisnik Modal - Using AngazovanjaForm */}
       <AngazovanjaForm
         isOpen={showAddKorisnikModal}
         onClose={handleCloseAddKorisnikModal}
         onSave={handleSaveKorisnik}
         initialData={editingUserData ? {
           imePrezime: editingUserData.name,
           email: editingUserData.email,
           radnoMesto: editingUserData.radnoMesto || '',
           lokacija: editingUserData.lokacija || '',
           vrstaAngazovanja: editingUserData.vrstaAngazovanja || '',
           pocetakAngazovanja: editingUserData.datumPocetka || new Date(),
           prestanakAngazovanja: editingUserData.datumPrestanka || null,
           // Include any other fields that might exist on the user object
           ...(editingUserData as any)
         } : undefined}
         fromAdminDashboard={true}
       />

        {/* Access Change Confirmation Modal */}
        <Modal
          isOpen={showAccessChangeModal}
          onClose={cancelAccessChange}
          className="max-w-[450px] dark:bg-gray-800"
        >
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Da li ste sigurni?
            </h4>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Menjate pristup "{pendingAccessChange?.accessTypeLabel}" za "{pendingAccessChange?.orgName}"
            </p>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={cancelAccessChange}>
                Otkaži
              </Button>
              <Button onClick={confirmAccessChange}>
                Potvrdi
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Firma Confirmation Modal */}
        <Modal
          isOpen={showDeleteFirmaModal}
          onClose={cancelDeleteFirma}
          className="max-w-[450px] dark:bg-gray-800"
        >
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Da li ste sigurni?
            </h4>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Da li ste sigurni da želite da obrišete firmu "{firmaToDelete?.name}"?
            </p>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Ova akcija se ne može poništiti.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={cancelDeleteFirma}>
                Otkaži
              </Button>
              <Button 
                onClick={confirmDeleteFirma}
                className="bg-error-500 hover:bg-error-600 text-white"
              >
                Obriši firmu
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete User Confirmation Modal */}
        <Modal
          isOpen={showDeleteUserModal}
          onClose={cancelDeleteUser}
          className="max-w-[450px] dark:bg-gray-800"
        >
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Da li ste sigurni?
            </h4>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Da li ste sigurni da želite da obrišete korisnika "{userToDelete?.name}"?
            </p>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Ova akcija se ne može poništiti.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={cancelDeleteUser}>
                Otkaži
              </Button>
              <Button 
                onClick={confirmDeleteUser}
                className="bg-error-500 hover:bg-error-600 text-white"
              >
                Obriši korisnika
              </Button>
            </div>
          </div>
        </Modal>

        {/* Add Komitent Modal - Using FirmeForm */}
        <FirmeForm
          isOpen={showAddKomitentModal}
          onClose={handleCloseAddKomitentModal}
          onSave={handleSaveKomitent}
          initialData={editingKomitentData ? {
            naziv: editingKomitentData.naziv || editingKomitentData.name,
            adresa: editingKomitentData.adresa || '',
            drzava: editingKomitentData.drzava || '',
            mesto: editingKomitentData.mesto || '',
            pib: editingKomitentData.pib || '',
            maticniBroj: editingKomitentData.maticniBroj || '',
            delatnost: editingKomitentData.delatnost || '',
            emailFirme: editingKomitentData.emailFirme || editingKomitentData.email || '',
            datumPocetkaUgovora: editingKomitentData.datumPocetkaUgovora || new Date(),
            datumIstekaUgovora: editingKomitentData.datumIstekaUgovora || new Date(),
            // Include any other fields that might exist on the komitent object
            ...(editingKomitentData as any)
          } : undefined}
          fromAdminDashboard={true}
        />

        {/* Delete Komitent Confirmation Modal */}
        <Modal
          isOpen={showDeleteKomitentModal}
          onClose={cancelDeleteKomitent}
          className="max-w-[450px] dark:bg-gray-800"
        >
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Da li ste sigurni?
            </h4>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Da li ste sigurni da želite da obrišete komitenta "{komitentToDelete?.name}"?
            </p>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Ova akcija se ne može poništiti.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={cancelDeleteKomitent}>
                Otkaži
              </Button>
              <Button 
                onClick={confirmDeleteKomitent}
                className="bg-error-500 hover:bg-error-600 text-white"
              >
                Obriši komitenta
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
