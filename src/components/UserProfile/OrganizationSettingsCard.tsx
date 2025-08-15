import { useState } from "react";
import { useUser } from "../../context/UserContext";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import { EditButtonIcon, DeleteButtonIcon } from "../../icons";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: {
    id: string;
    name: string;
    type: 'admin' | 'client';
  };
  access: {
    mojaFirma: boolean;
    komitenti: boolean;
    ostalo: boolean;
  };
}

interface Organization {
  id: string;
  name: string;
  type: 'admin' | 'client';
  users: User[];
}

export default function OrganizationSettingsCard() {
  const { userType } = useUser();
  
  // State for add user modal
  const [showAddKorisnikModal, setShowAddKorisnikModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newKorisnik, setNewKorisnik] = useState({
    ime: '',
    prezime: '',
    email: ''
  });

  // State for access change confirmation modal
  const [showAccessChangeModal, setShowAccessChangeModal] = useState(false);
  const [pendingAccessChange, setPendingAccessChange] = useState<{
    userId: string;
    accessType: 'mojaFirma' | 'komitenti' | 'ostalo';
    checked: boolean;
    userName: string;
    accessTypeLabel: string;
  } | null>(null);

  // State for delete user confirmation modal
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);


  
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Ana Jovanović",
      email: "ana.jovanovic@techsolutions.rs",
      role: "Korisnik",
      organization: {
        id: "org1",
        name: "Tech Solutions d.o.o.",
        type: "admin"
      },
      access: { mojaFirma: true, komitenti: false, ostalo: true }
    },
    {
      id: "2",
      name: "Petar Nikolić",
      email: "petar.nikolic@techsolutions.rs",
      role: "Korisnik",
      organization: {
        id: "org1",
        name: "Tech Solutions d.o.o.",
        type: "admin"
      },
      access: { mojaFirma: true, komitenti: true, ostalo: false }
    },
    {
      id: "3",
      name: "Marija Petrović",
      email: "marija.petrovic@techsolutions.rs",
      role: "Korisnik",
      organization: {
        id: "org1",
        name: "Tech Solutions d.o.o.",
        type: "admin"
      },
      access: { mojaFirma: false, komitenti: false, ostalo: false }
    },
    {
      id: "4",
      name: "Stefan Đorđević",
      email: "stefan.djordjevic@techsolutions.rs",
      role: "Korisnik",
      organization: {
        id: "org2",
        name: "Client Company A",
        type: "client"
      },
      access: { mojaFirma: true, komitenti: true, ostalo: true }
    },
    {
      id: "5",
      name: "Jelena Stojanović",
      email: "jelena.stojanovic@techsolutions.rs",
      role: "Korisnik",
      organization: {
        id: "org2",
        name: "Client Company A",
        type: "client"
      },
      access: { mojaFirma: false, komitenti: true, ostalo: false }
    },
    {
      id: "6",
      name: "Marko Ivanović",
      email: "marko.ivanovic@clientb.rs",
      role: "Korisnik",
      organization: {
        id: "org3",
        name: "Client Company B",
        type: "client"
      },
      access: { mojaFirma: true, komitenti: false, ostalo: true }
    },
    {
      id: "7",
      name: "Sofija Petrović",
      email: "sofija.petrovic@clientb.rs",
      role: "Korisnik",
      organization: {
        id: "org3",
        name: "Client Company B",
        type: "client"
      },
      access: { mojaFirma: true, komitenti: true, ostalo: false }
    }
  ]);

  const [tempUsers, setTempUsers] = useState<User[]>(users);
  


  const handleAccessChange = (userId: string, accessType: keyof User['access'], value: boolean) => {
    // Find the user name for display
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const accessTypeLabels = {
      mojaFirma: 'Moja Firma',
      komitenti: 'Komitenti',
      ostalo: 'Ostalo'
    };
    
    // Show confirmation modal instead of immediately applying
    setPendingAccessChange({
      userId,
      accessType,
      checked: value,
      userName: user.name,
      accessTypeLabel: accessTypeLabels[accessType]
    });
    setShowAccessChangeModal(true);
  };

  const handleEditUser = (user: User) => {
    // Set the form data for editing
    setNewKorisnik({
      ime: user.name.split(' ')[0] || '',
      prezime: user.name.split(' ').slice(1).join(' ') || '',
      email: user.email
    });
    setIsEditing(true);
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
      setTempUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      console.log('Deleted user:', userToDelete);
      setShowDeleteUserModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteUserModal(false);
    setUserToDelete(null);
  };

  const handleAddKorisnik = () => {
    if (newKorisnik.ime && newKorisnik.prezime && newKorisnik.email) {
      if (isEditing && editingUserId) {
        // Update existing user
        const updatedUsers = users.map(user => 
          user.id === editingUserId 
            ? { ...user, name: `${newKorisnik.ime} ${newKorisnik.prezime}`, email: newKorisnik.email }
            : user
        );
        setUsers(updatedUsers);
        setTempUsers(updatedUsers);
        console.log('Updated user:', editingUserId);
      } else {
        // Add new user
        const newKorisnikObj: User = {
          id: (users.length + 1).toString(),
          name: `${newKorisnik.ime} ${newKorisnik.prezime}`,
          email: newKorisnik.email,
          role: "Korisnik",
          organization: {
            id: 'org1',
            name: 'Tech Solutions d.o.o.',
            type: 'admin'
          },
          access: { mojaFirma: true, komitenti: false, ostalo: false }
        };
        
        // In a real app, you would save to backend here
        console.log('Adding new korisnik:', newKorisnikObj);
        
        // Add to users list
        setUsers(prev => [...prev, newKorisnikObj]);
        setTempUsers(prev => [...prev, newKorisnikObj]);
      }
      
      // Reset form and close modal
      setNewKorisnik({ ime: '', prezime: '', email: '' });
      setIsEditing(false);
      setEditingUserId(null);
      setShowAddKorisnikModal(false);
    }
  };

  const handleCloseAddKorisnikModal = () => {
    setShowAddKorisnikModal(false);
    setIsEditing(false);
    setEditingUserId(null);
    setNewKorisnik({ ime: '', prezime: '', email: '' });
  };

  const confirmAccessChange = () => {
    if (pendingAccessChange) {
      setTempUsers(prev => prev.map(user => 
        user.id === pendingAccessChange.userId 
          ? { ...user, access: { ...user.access, [pendingAccessChange.accessType]: pendingAccessChange.checked } }
          : user
      ));
      
      // Close modal and reset pending change
      setShowAccessChangeModal(false);
      setPendingAccessChange(null);
    }
  };
  
  const cancelAccessChange = () => {
    setShowAccessChangeModal(false);
    setPendingAccessChange(null);
  };

  // Group users by organization
  const groupedOrganizations = tempUsers.reduce((acc, user) => {
    const orgId = user.organization.id;
    if (!acc[orgId]) {
      acc[orgId] = {
        id: orgId,
        name: user.organization.name,
        type: user.organization.type,
        users: []
      };
    }
    acc[orgId].users.push(user);
    return acc;
  }, {} as Record<string, Organization>);

  const adminOrganizations = Object.values(groupedOrganizations).filter(org => org.type === 'admin');

  // Show this card for Admin users only
  if (userType !== 'admin') {
    return null;
  }

  return (
    <div className="p-5 border border-gray-200 bg-white dark:bg-gray-800 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Podešavanja organizacije
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Broj korisnika u organizaciji
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {users.length} korisnika ({adminOrganizations.length} admin organizacija)
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Tip korisnika
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Administrator
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Aktivan
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Poslednja izmena
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Danas, 14:30
                </p>
              </div>
            </div>
          </div>


        </div>

        {/* Organization Tabs */}
        <div className="mt-6">
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <h5 className="text-lg font-medium text-gray-800 dark:text-white/90">
              Upravljanje korisnicima organizacije
            </h5>
            
                         {/* Add User Button */}
             <Button size="sm" onClick={() => {
               setIsEditing(false);
               setEditingUserId(null);
               setNewKorisnik({ ime: '', prezime: '', email: '' });
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
          
          {/* Organization Content */}
          <div className="space-y-6">
            {adminOrganizations.map((organization) => (
              <div key={organization.id} className="border border-gray-200 rounded-lg dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                                         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                       <tr>
                         <th className="px-4 py-3">Korisnik</th>
                         <th className="px-4 py-3">Email</th>
                         <th className="px-4 py-3 text-center">Moja Firma</th>
                         <th className="px-4 py-3 text-center">Komitenti</th>
                         <th className="px-4 py-3 text-center">Ostalo</th>
                         <th className="px-4 py-3 text-center">Akcije</th>
                       </tr>
                     </thead>
                    <tbody>
                      {organization.users.map((user) => (
                        <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </td>
                          <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                            {user.email}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-center">
                                                             <Checkbox
                                 checked={user.access.mojaFirma}
                                 onChange={(checked) => handleAccessChange(user.id, 'mojaFirma', checked)}
                                 className="w-4 h-4"
                               />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-center">
                                                             <Checkbox
                                 checked={user.access.komitenti}
                                 onChange={(checked) => handleAccessChange(user.id, 'komitenti', checked)}
                                 className="w-4 h-4"
                               />
                            </div>
                          </td>
                                                     <td className="px-4 py-4">
                             <div className="flex justify-center">
                                                              <Checkbox
                                   checked={user.access.ostalo}
                                   onChange={(checked) => handleAccessChange(user.id, 'ostalo', checked)}
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
            ))}
          </div>
        </div>


       </div>

       {/* Add Korisnik Modal */}
       <Modal
         isOpen={showAddKorisnikModal}
         onClose={handleCloseAddKorisnikModal}
         className="max-w-[500px] max-h-[90vh] dark:bg-gray-800 overflow-hidden"
       >
         <div className="flex flex-col h-full">
           <div className="p-5 pt-10">
             <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
               {isEditing ? 'Izmeni korisnika' : 'Dodaj novog korisnika'}
             </h4>
             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
               {isEditing ? 'Izmenite podatke o korisniku' : 'Unesite podatke o novom korisniku'}
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
               

             </div>
           </div>

           <div className="pb-5 pt-2 lg:pb-10 pr-5 lg:pr-10 pl-5 lg:pl-10 pt-0 flex-shrink-0">
             <div className="flex justify-end gap-2">
               <Button variant="outline" onClick={handleCloseAddKorisnikModal}>
                 Otkaži
               </Button>
               <Button onClick={handleAddKorisnik}>
                 {isEditing ? 'Izmeni korisnika' : 'Dodaj korisnika'}
               </Button>
               </div>
           </div>
         </div>
       </Modal>

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
              Menjate pristup "{pendingAccessChange?.accessTypeLabel}" za "{pendingAccessChange?.userName}"
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
      </div>
    );
  } 