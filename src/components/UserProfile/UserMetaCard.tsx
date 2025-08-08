import { useRef, useState } from "react";
import Badge from "../ui/badge/Badge";
import { PencilIcon } from "../../icons";

interface UserMetaCardProps {
  userType?: 'super-admin' | 'admin' | 'user';
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
      default:
        return <Badge color="info" variant="light">Korisnik</Badge>;
    }
  };
  return (
    <>
      <div className="p-5 border border-gray-200 bg-white dark:bg-gray-800 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="relative w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img className="object-cover w-full h-full" src={localImageDataUrl || profileImageUrl} alt={userName || 'user'} />
              {enableImageUpload && (
                <>
                  <button
                    type="button"
                    title="Promeni sliku profila"
                    aria-label="Promeni sliku profila"
                    onClick={handlePickImage}
                    className="absolute flex items-center justify-center w-8 h-8 text-white transition-all rounded-full shadow-sm bottom-1 right-1 bg-gray-900/80 backdrop-blur hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span className="sr-only">Promeni sliku profila</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelected}
                  />
                </>
              )}
            </div>
            <div className="order-3 xl:order-2">
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
        </div>
      </div>
    </>
  );
}
