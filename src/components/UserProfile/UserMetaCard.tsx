import Badge from "../ui/badge/Badge";

interface UserMetaCardProps {
  userType?: 'super-admin' | 'admin' | 'user';
  userName?: string;
  userRole?: string;
  userLocation?: string;
  userCompany?: string;
}

export default function UserMetaCard({ 
  userType = 'user', 
  userName = "Musharof Chowdhury",
  userRole = "Team Manager",
  userLocation = "Arizona, United States",
  userCompany = "Tech Solutions d.o.o."
}: UserMetaCardProps) {

  const getRoleBadge = () => {
    switch (userType) {
      case 'super-admin':
        return <Badge color="error" variant="light">Super Admin</Badge>;
      case 'admin':
        return <Badge color="warning" variant="light">Admin</Badge>;
      case 'user':
        return <Badge color="success" variant="light">Korisnik</Badge>;
      default:
        return <Badge color="info" variant="light">Korisnik</Badge>;
    }
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src="/images/user/owner.jpg" alt="user" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {userName}
              </h4>
              <div className="flex flex-col items-center gap-2 text-center xl:flex-row xl:gap-3 xl:text-left">
                {getRoleBadge()}
                <div className="flex flex-col items-center gap-1 xl:flex-row xl:gap-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userRole}
                  </p>
                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userLocation}
                  </p>
                </div>
              </div>
              {userType !== 'user' && (
                <div className="mt-2 text-center xl:text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Firma: {userCompany}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
