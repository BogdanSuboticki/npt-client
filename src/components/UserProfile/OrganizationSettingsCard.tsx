import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Label from "../form/Label";

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
  const [newKorisnik, setNewKorisnik] = useState({
    ime: '',
    prezime: '',
    email: '',
    sifra: '',
    tip: 'mojaFirma' as 'mojaFirma' | 'komitent',
    firma: ''
  });

  // State for dropdown
  const [isFirmaOpen, setIsFirmaOpen] = useState(false);
  const firmaRef = useRef<HTMLDivElement>(null);

  // Example options for firma dropdown
  const firmaOptions = ["Client Company A", "Client Company B", "New Client Company"];

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdown
      if (firmaRef.current && !firmaRef.current.contains(target)) {
        setIsFirmaOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
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
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'client'>('admin');
  
  const handleSave = () => {
    setUsers(tempUsers);
    console.log("Saving organization user settings...", tempUsers);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUsers(users);
    setIsEditing(false);
  };

  const handleAccessChange = (userId: string, accessType: keyof User['access'], value: boolean) => {
    setTempUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, access: { ...user.access, [accessType]: value } }
        : user
    ));
  };

  const handleAddKorisnik = () => {
    if (newKorisnik.ime && newKorisnik.prezime && newKorisnik.email && newKorisnik.sifra) {
      const newKorisnikObj: User = {
        id: (users.length + 1).toString(),
        name: `${newKorisnik.ime} ${newKorisnik.prezime}`,
        email: newKorisnik.email,
        role: "Korisnik",
        organization: {
          id: newKorisnik.tip === 'mojaFirma' ? 'org1' : 'org2',
          name: newKorisnik.tip === 'mojaFirma' ? 'Tech Solutions d.o.o.' : newKorisnik.firma,
          type: newKorisnik.tip === 'mojaFirma' ? 'admin' : 'client'
        },
        access: { mojaFirma: true, komitenti: false, ostalo: false }
      };
      
      // In a real app, you would save to backend here
      console.log('Adding new korisnik:', newKorisnikObj);
      
      // Add to users list
      setUsers(prev => [...prev, newKorisnikObj]);
      
      // Reset form and close modal
      setNewKorisnik({ ime: '', prezime: '', email: '', sifra: '', tip: 'mojaFirma', firma: '' });
      setShowAddKorisnikModal(false);
    }
  };

  const handleCloseAddKorisnikModal = () => {
    setShowAddKorisnikModal(false);
    setNewKorisnik({ ime: '', prezime: '', email: '', sifra: '', tip: 'mojaFirma', firma: '' });
  };

  // Group users by organization
  const groupedOrganizations = (isEditing ? tempUsers : users).reduce((acc, user) => {
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
  const clientOrganizations = Object.values(groupedOrganizations).filter(org => org.type === 'client');

  // Show this card for Admin and Super Admin users
  if (userType !== 'admin' && userType !== 'super-admin') {
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
                  {users.length} korisnika ({adminOrganizations.length} admin organizacija, {clientOrganizations.length} klijent organizacija)
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Tip korisnika
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userType === 'super-admin' ? 'Super Administrator' : 'Administrator'}
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

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-[#101828] dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                  fill=""
                />
              </svg>
              Uredi
            </button>
          )}
        </div>

        {/* Organization Tabs */}
        <div className="mt-6">
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <h5 className="text-lg font-medium text-gray-800 dark:text-white/90">
              Upravljanje korisnicima organizacije
            </h5>
            
                         {/* Add User Button */}
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
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'admin'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Moja firma
            </button>
            <button
              onClick={() => setActiveTab('client')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'client'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Komitenti
            </button>
          </div>

          {/* Organization Content */}
          <div className="space-y-6">
            {(activeTab === 'admin' ? adminOrganizations : clientOrganizations).map((organization) => (
              <div key={organization.id} className="border border-gray-200 rounded-lg dark:border-gray-700">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <h6 className="font-medium text-gray-800 dark:text-white/90">
                    {organization.name}
                  </h6>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {organization.users.length} korisnika
                  </p>
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
                                disabled={!isEditing}
                                className="w-4 h-4"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={user.access.komitenti}
                                onChange={(checked) => handleAccessChange(user.id, 'komitenti', checked)}
                                disabled={!isEditing}
                                className="w-4 h-4"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={user.access.ostalo}
                                onChange={(checked) => handleAccessChange(user.id, 'ostalo', checked)}
                                disabled={!isEditing}
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
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Otkaži
            </Button>
            <Button onClick={handleSave}>
              Sačuvaj
            </Button>
          </div>
                 )}
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
               
               <div>
                 <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                   Tip korisnika
                 </Label>
                 <div className="space-y-2">
                   <label className="flex items-center">
                     <input
                       type="radio"
                       name="tip"
                       value="mojaFirma"
                       checked={newKorisnik.tip === 'mojaFirma'}
                       onChange={(e) => setNewKorisnik({ ...newKorisnik, tip: e.target.value as 'mojaFirma' | 'komitent', firma: '' })}
                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                     />
                     <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Moja firma</span>
                   </label>
                   <label className="flex items-center">
                     <input
                       type="radio"
                       name="tip"
                       value="komitent"
                       checked={newKorisnik.tip === 'komitent'}
                       onChange={(e) => setNewKorisnik({ ...newKorisnik, tip: e.target.value as 'mojaFirma' | 'komitent' })}
                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                     />
                     <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Komitent</span>
                   </label>
                 </div>
               </div>
               
                               {newKorisnik.tip === 'komitent' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Firma
                    </Label>
                    <div className="relative w-full" ref={firmaRef}>
                      <button
                        type="button"
                        onClick={() => setIsFirmaOpen(!isFirmaOpen)}
                        className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                      >
                        <span>{newKorisnik.firma || "Izaberi opciju"}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${isFirmaOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isFirmaOpen && (
                        <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                          <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:my-1 pr-1">
                            {firmaOptions.map((option: string, index: number) => (
                              <div
                                key={option}
                                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                                  newKorisnik.firma === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                                    } ${index === firmaOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                                onClick={() => {
                                  setNewKorisnik({ ...newKorisnik, firma: option });
                                  setIsFirmaOpen(false);
                                }}
                              >
                                <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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