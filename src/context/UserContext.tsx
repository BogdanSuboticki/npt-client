import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserType = 'super-admin' | 'admin' | 'user';

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  showMojaFirma: boolean;
  setShowMojaFirma: (show: boolean) => void;
  showKomitenti: boolean;
  setShowKomitenti: (show: boolean) => void;
  sidebarMode: 'both' | 'moja-firma' | 'komitenti';
  setSidebarMode: (mode: 'both' | 'moja-firma' | 'komitenti') => void;
  // Organization settings for Admin users
  organizationSettings: {
    usersCanSeeMojaFirma: boolean;
    usersCanSeeKomitenti: boolean;
    usersCanSeeOstalo: boolean;
    usersCanCustomizeSettings: boolean;
    restrictToBasicFunctions: boolean;
  };
  setOrganizationSettings: (settings: {
    usersCanSeeMojaFirma: boolean;
    usersCanSeeKomitenti: boolean;
    usersCanSeeOstalo: boolean;
    usersCanCustomizeSettings: boolean;
    restrictToBasicFunctions: boolean;
  }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>(() => {
    const saved = localStorage.getItem('userType');
    return (saved as UserType) || 'user';
  });

  const [sidebarMode, setSidebarMode] = useState<'both' | 'moja-firma' | 'komitenti'>(() => {
    const saved = localStorage.getItem('sidebarMode');
    return (saved as 'both' | 'moja-firma' | 'komitenti') || 'both';
  });

  const [showMojaFirma, setShowMojaFirma] = useState<boolean>(() => {
    const saved = localStorage.getItem('showMojaFirma');
    return saved ? JSON.parse(saved) : true;
  });

  const [showKomitenti, setShowKomitenti] = useState<boolean>(() => {
    const saved = localStorage.getItem('showKomitenti');
    return saved ? JSON.parse(saved) : true;
  });

  const [organizationSettings, setOrganizationSettings] = useState(() => {
    const saved = localStorage.getItem('organizationSettings');
    return saved ? JSON.parse(saved) : {
      usersCanSeeMojaFirma: true,
      usersCanSeeKomitenti: true,
      usersCanSeeOstalo: true,
      usersCanCustomizeSettings: true,
      restrictToBasicFunctions: false,
    };
  });

  // Update sidebar visibility based on mode
  useEffect(() => {
    switch (sidebarMode) {
      case 'both':
        setShowMojaFirma(true);
        setShowKomitenti(true);
        break;
      case 'moja-firma':
        setShowMojaFirma(true);
        setShowKomitenti(false);
        break;
      case 'komitenti':
        setShowMojaFirma(false);
        setShowKomitenti(true);
        break;
    }
  }, [sidebarMode]);

  // Save user type to localStorage
  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  // Save sidebar mode to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarMode', sidebarMode);
  }, [sidebarMode]);

  // Save individual section visibility to localStorage
  useEffect(() => {
    localStorage.setItem('showMojaFirma', JSON.stringify(showMojaFirma));
  }, [showMojaFirma]);

  useEffect(() => {
    localStorage.setItem('showKomitenti', JSON.stringify(showKomitenti));
  }, [showKomitenti]);

  useEffect(() => {
    localStorage.setItem('organizationSettings', JSON.stringify(organizationSettings));
  }, [organizationSettings]);

  const value: UserContextType = {
    userType,
    setUserType,
    showMojaFirma,
    setShowMojaFirma,
    showKomitenti,
    setShowKomitenti,
    sidebarMode,
    setSidebarMode,
    organizationSettings,
    setOrganizationSettings,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 