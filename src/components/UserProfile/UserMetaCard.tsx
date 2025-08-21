import { useRef, useState } from "react";
import Badge from "../ui/badge/Badge";

interface UserMetaCardProps {
  userType?: 'super-admin' | 'admin' | 'user' | 'komitent';
  userName?: string;
  userRole?: string;
  userLocation?: string;
  userCompany?: string;
  profileImageUrl?: string;
  enableImageUpload?: boolean;
  onProfileImageChange?: (file: File, dataUrl: string) => void;
}

export default function UserMetaCard({ 
  userType = 'user', 
  userName = "Musharof Chowdhury",
  userLocation = "Arizona, United States",
  profileImageUrl = "/images/user/owner.jpg",
  enableImageUpload = true,
  onProfileImageChange,
}: UserMetaCardProps) {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localImageDataUrl, setLocalImageDataUrl] = useState<string | null>(null);

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setLocalImageDataUrl(result);
      if (onProfileImageChange) {
        onProfileImageChange(selectedFile, result);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const getRoleBadge = () => {
    switch (userType) {
      case 'super-admin':
        return <Badge color="error" variant="light">Super Admin</Badge>;
      case 'admin':
        return <Badge color="warning" variant="light">Admin</Badge>;
      case 'user':
        return <Badge color="success" variant="light">Korisnik</Badge>;
      case 'komitent':
        return <Badge color="info" variant="light">Komitent</Badge>;
      default:
        return <Badge color="info" variant="light">Korisnik</Badge>;
    }
  };
  return (
    <>
      <div className="p-5 border border-gray-200 bg-white dark:bg-gray-800 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img className="object-cover w-full h-full" src={localImageDataUrl || profileImageUrl} alt={userName || 'user'} />
            </div>
            <div>
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {userName}
              </h4>
              <div className="flex flex-col items-center gap-2 text-center xl:flex-row xl:gap-3 xl:text-left">
                {getRoleBadge()}
                <div className="flex flex-col items-center gap-1 xl:flex-row xl:gap-3">
                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userLocation}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {enableImageUpload && (
            <button
              onClick={handlePickImage}
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
              Promeni sliku
            </button>
          )}
        </div>
        
        {enableImageUpload && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelected}
          />
        )}
      </div>
    </>
  );
}
