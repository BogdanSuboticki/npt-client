
import Badge from "../ui/badge/Badge";
import { useUser } from "../../context/UserContext";

interface ProfileTypeSelectorProps {
  onProfileTypeChange: (type: 'super-admin' | 'admin' | 'user' | 'komitent') => void;
  currentType: 'super-admin' | 'admin' | 'user' | 'komitent';
}

export default function ProfileTypeSelector({ onProfileTypeChange, currentType }: ProfileTypeSelectorProps) {
  const { setUserType } = useUser();
  const profileTypes = [
    {
      key: 'super-admin',
      title: 'Super Admin',
      description: 'Pun pristup svim nalozima i firmama',
      badge: <Badge color="error" variant="light">Super Admin</Badge>,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      key: 'admin',
      title: 'Admin',
      description: 'Pristup korisnicima u svojoj firmi',
      badge: <Badge color="warning" variant="light">Admin</Badge>,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      key: 'user',
      title: 'Korisnik',
      description: 'Pristup samo svom nalogu',
      badge: <Badge color="success" variant="light">Korisnik</Badge>,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      key: 'komitent',
      title: 'Komitent',
      description: 'Samo pregled podataka - bez izmena',
      badge: <Badge color="info" variant="light">Komitent</Badge>,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Tip profila
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Izaberite tip profila za prikaz
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {profileTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => {
              const userType = type.key as 'super-admin' | 'admin' | 'user' | 'komitent';
              onProfileTypeChange(userType);
              setUserType(userType);
            }}
            className={`p-4 rounded-xl border text-left ${
              currentType === type.key
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 dark:border-brand-400'
                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${
                currentType === type.key
                  ? 'bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {type.icon}
              </div>
              {type.badge}
            </div>
            <h5 className="font-medium text-gray-800 dark:text-white/90 mb-1">
              {type.title}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {type.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
} 