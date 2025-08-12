import { useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Checkbox from "../form/input/Checkbox";

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
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'user';
  organization: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: {
    canCreateUsers: boolean;
    canManageOrganizations: boolean;
    canAccessAllData: boolean;
    canManageSystem: boolean;
  };
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'users'>('overview');
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

  // State for add forms
  const [showAddFirmaModal, setShowAddFirmaModal] = useState(false);
  const [showAddKorisnikModal, setShowAddKorisnikModal] = useState(false);
  const [newFirma, setNewFirma] = useState({
    naziv: '',
    email: '',
    sifra: ''
  });
  const [newKorisnik, setNewKorisnik] = useState({
    ime: '',
    prezime: '',
    email: '',
    firma: '',
    sifra: ''
  });

  const firme: Firma[] = [
    {
      id: "1",
      name: "Tech Solutions d.o.o.",
      email: "info@techsolutions.rs",
      type: "admin",
      status: "active",
      userCount: 45,
      adminCount: 3,
      createdAt: "2023-06-15",
      lastActivity: "2024-01-15 14:30"
    },
    {
      id: "2",
      name: "Client Company A",
      email: "contact@clienta.rs",
      type: "client",
      status: "active",
      userCount: 12,
      adminCount: 1,
      createdAt: "2023-08-22",
      lastActivity: "2024-01-15 12:15"
    },
    {
      id: "3",
      name: "Client Company B",
      email: "info@clientb.rs",
      type: "client",
      status: "active",
      userCount: 8,
      adminCount: 1,
      createdAt: "2023-09-10",
      lastActivity: "2024-01-14 16:45"
    },
    {
      id: "4",
      name: "New Organization",
      email: "admin@neworg.rs",
      type: "admin",
      status: "pending",
      userCount: 0,
      adminCount: 0,
      createdAt: "2024-01-15",
      lastActivity: "N/A"
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

  const handleOrganizationAccessChange = (orgId: string, accessType: 'mojaFirma' | 'komitenti' | 'ostalo', checked: boolean) => {
    setOrganizationAccess(prev => ({
      ...prev,
      [orgId]: {
        ...prev[orgId],
        [accessType]: checked
      }
    }));
  };

  const handleAddFirma = () => {
    if (newFirma.naziv && newFirma.email && newFirma.sifra) {
      const newFirmaObj: Firma = {
        id: (firme.length + 1).toString(),
        name: newFirma.naziv,
        email: newFirma.email,
        type: 'client',
        status: 'active',
        userCount: 0,
        adminCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastActivity: 'N/A'
      };
      
      // In a real app, you would save to backend here
      console.log('Adding new firma:', newFirmaObj);
      
      // Reset form and close modal
      setNewFirma({ naziv: '', email: '', sifra: '' });
      setShowAddFirmaModal(false);
    }
  };

  const handleAddKorisnik = () => {
    if (newKorisnik.ime && newKorisnik.prezime && newKorisnik.email && newKorisnik.firma && newKorisnik.sifra) {
      const newKorisnikObj: User = {
        id: (users.length + 1).toString(),
        name: `${newKorisnik.ime} ${newKorisnik.prezime}`,
        email: newKorisnik.email,
        role: 'user',
        organization: newKorisnik.firma,
        status: 'active',
        lastLogin: 'N/A',
        permissions: {
          canCreateUsers: false,
          canManageOrganizations: false,
          canAccessAllData: false,
          canManageSystem: false
        }
      };
      
      // In a real app, you would save to backend here
      console.log('Adding new korisnik:', newKorisnikObj);
      
      // Reset form and close modal
      setNewKorisnik({ ime: '', prezime: '', email: '', firma: '', sifra: '' });
      setShowAddKorisnikModal(false);
    }
  };

  const handleCloseAddFirmaModal = () => {
    setShowAddFirmaModal(false);
    setNewFirma({ naziv: '', email: '', sifra: '' });
  };

  const handleCloseAddKorisnikModal = () => {
    setShowAddKorisnikModal(false);
    setNewKorisnik({ ime: '', prezime: '', email: '', firma: '', sifra: '' });
  };

  const totalFirme = firme.length;
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const totalAdmins = users.filter(user => user.role === 'admin').length;

  return (
    <div className="p-5 border border-gray-200 bg-white dark:bg-gray-800 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Super Administrator Dashboard
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pregled celokupnog sistema, firmi i korisnika
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Pregled sistema
          </button>
          <button
            onClick={() => setActiveTab('organizations')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'organizations'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Firme ({totalFirme})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'users'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Korisnici ({totalUsers})
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* System Statistics */}
              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">
                  Ukupno firmi
                </h5>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {totalFirme}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admin firmi
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">
                  Ukupno korisnika
                </h5>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {totalUsers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Registrovani korisnici
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">
                  Aktivnih korisnika
                </h5>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {activeUsers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Trenutno aktivni
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <h5 className="font-medium text-gray-800 dark:text-white/90 mb-2">
                  Administratora
                </h5>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {totalAdmins}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admin korisnika
                </p>
              </div>
            </div>
          )}

          {activeTab === 'organizations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  Upravljanje firmama
                </h5>
                <Button size="sm" onClick={() => setShowAddFirmaModal(true)}>
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
                  Dodaj firmu
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-3">Korisnik</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3 text-center">Moja Firma</th>
                      <th className="px-4 py-3 text-center">Komitenti</th>
                      <th className="px-4 py-3 text-center">Ostalo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firme.map((org) => (
                      <tr key={org.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                          {org.name}
                        </td>
                        <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                          {org.email}
                        </td>
                                                 <td className="px-4 py-4">
                           <div className="flex justify-center">
                             <Checkbox
                               checked={organizationAccess[org.id]?.mojaFirma || false}
                               onChange={(checked) => handleOrganizationAccessChange(org.id, 'mojaFirma', checked)}
                               className="w-4 h-4"
                             />
                           </div>
                         </td>
                         <td className="px-4 py-4">
                           <div className="flex justify-center">
                             <Checkbox
                               checked={organizationAccess[org.id]?.komitenti || false}
                               onChange={(checked) => handleOrganizationAccessChange(org.id, 'komitenti', checked)}
                               className="w-4 h-4"
                             />
                           </div>
                         </td>
                         <td className="px-4 py-4">
                           <div className="flex justify-center">
                             <Checkbox
                               checked={organizationAccess[org.id]?.ostalo || false}
                               onChange={(checked) => handleOrganizationAccessChange(org.id, 'ostalo', checked)}
                               className="w-4 h-4"
                             />
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
                                   <Button size="sm" onClick={() => setShowAddKorisnikModal(true)}>
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
                             <th className="px-4 py-3">Korisnik</th>
                             <th className="px-4 py-3">Email</th>
                             <th className="px-4 py-3 text-center">Moja Firma</th>
                             <th className="px-4 py-3 text-center">Komitenti</th>
                             <th className="px-4 py-3 text-center">Ostalo</th>
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
                               <td className="px-4 py-4">
                                 <div className="flex justify-center">
                                   <Checkbox
                                     checked={organizationAccess[user.id]?.mojaFirma || false}
                                     onChange={(checked) => handleOrganizationAccessChange(user.id, 'mojaFirma', checked)}
                                     className="w-4 h-4"
                                   />
                                 </div>
                               </td>
                               <td className="px-4 py-4">
                                 <div className="flex justify-center">
                                   <Checkbox
                                     checked={organizationAccess[user.id]?.komitenti || false}
                                     onChange={(checked) => handleOrganizationAccessChange(user.id, 'komitenti', checked)}
                                     className="w-4 h-4"
                                   />
                                 </div>
                               </td>
                               <td className="px-4 py-4">
                                 <div className="flex justify-center">
                                   <Checkbox
                                     checked={organizationAccess[user.id]?.ostalo || false}
                                     onChange={(checked) => handleOrganizationAccessChange(user.id, 'ostalo', checked)}
                                     className="w-4 h-4"
                                   />
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

       {/* Add Firma Modal */}
       <Modal
         isOpen={showAddFirmaModal}
         onClose={handleCloseAddFirmaModal}
         className="max-w-[500px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
       >
         <div className="flex flex-col h-full">
           <div className="p-5 pt-10">
             <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
               Dodaj novu firmu
             </h4>
             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
               Unesite podatke o novoj firmi
             </p>
           </div>
           
           <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-200px)]">
             <div className="space-y-4 pb-4">
               <div>
                 <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Naziv firme
                 </Label>
                 <input
                   type="text"
                   value={newFirma.naziv}
                   onChange={(e) => setNewFirma({ ...newFirma, naziv: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                   placeholder="Unesite naziv firme"
                 />
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Email
                 </Label>
                 <input
                   type="email"
                   value={newFirma.email}
                   onChange={(e) => setNewFirma({ ...newFirma, email: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                   placeholder="Unesite email adresu"
                 />
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Šifra
                 </Label>
                 <input
                   type="password"
                   value={newFirma.sifra}
                   onChange={(e) => setNewFirma({ ...newFirma, sifra: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                   placeholder="Unesite šifru"
                 />
               </div>
             </div>
           </div>

           <div className="pb-5 pt-2 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
             <div className="flex justify-end gap-2">
               <Button variant="outline" onClick={handleCloseAddFirmaModal}>
                 Otkaži
               </Button>
               <Button onClick={handleAddFirma}>
                 Dodaj firmu
               </Button>
             </div>
           </div>
         </div>
       </Modal>

       {/* Add Korisnik Modal */}
       <Modal
         isOpen={showAddKorisnikModal}
         onClose={handleCloseAddKorisnikModal}
         className="max-w-[500px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
       >
         <div className="flex flex-col h-full">
           <div className="p-5 pt-10">
             <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
               Dodaj novog korisnika
             </h4>
             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
               Unesite podatke o novom korisniku
             </p>
           </div>
           
           <div className="px-5 lg:px-10 overflow-y-auto flex-1 max-h-[calc(90vh-200px)]">
             <div className="space-y-4 pb-4">
               <div>
                 <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Ime
                 </Label>
                 <input
                   type="text"
                   value={newKorisnik.ime}
                   onChange={(e) => setNewKorisnik({ ...newKorisnik, ime: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                   placeholder="Unesite ime"
                 />
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Prezime
                 </Label>
                 <input
                   type="text"
                   value={newKorisnik.prezime}
                   onChange={(e) => setNewKorisnik({ ...newKorisnik, prezime: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                   placeholder="Unesite prezime"
                 />
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Email
                 </Label>
                 <input
                   type="email"
                   value={newKorisnik.email}
                   onChange={(e) => setNewKorisnik({ ...newKorisnik, email: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                   placeholder="Unesite email adresu"
                 />
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Firma
                 </Label>
                 <select
                   value={newKorisnik.firma}
                   onChange={(e) => setNewKorisnik({ ...newKorisnik, firma: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                 >
                   <option value="">Izaberite firmu</option>
                   {firme.map((firma) => (
                     <option key={firma.id} value={firma.name}>
                       {firma.name}
                     </option>
                   ))}
                 </select>
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Šifra
                 </Label>
                 <input
                   type="password"
                   value={newKorisnik.sifra}
                   onChange={(e) => setNewKorisnik({ ...newKorisnik, sifra: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                   placeholder="Unesite šifru"
                 />
               </div>
             </div>
           </div>

           <div className="pb-5 pt-2 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
             <div className="flex justify-end gap-2">
               <Button variant="outline" onClick={handleCloseAddKorisnikModal}>
                 Otkaži
               </Button>
               <Button onClick={handleAddKorisnik}>
                 Dodaj korisnika
               </Button>
               </div>
           </div>
         </div>
       </Modal>
     </div>
   );
 }
