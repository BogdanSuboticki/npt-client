import { useMemo } from "react";
import { UserIcon, GroupIcon, BoxIconLine, ZaposleniIcon } from "../../icons";

// Sample data - in a real app, this would come from API
const sampleUsers = [
  {
    id: "1",
    role: "super-admin",
    status: "active",
  },
  {
    id: "2",
    role: "admin",
    status: "active",
  },
  {
    id: "3",
    role: "user",
    status: "active",
  },
  {
    id: "4",
    role: "komitent",
    status: "active",
  },
];

const sampleFirme = [
  { id: "1", naziv: "Tech Solutions d.o.o." },
  { id: "2", naziv: "Client Company A" },
  { id: "3", naziv: "Client Company B" },
  { id: "4", naziv: "New Organization" },
];

const sampleZaposleni = [
  { id: 1, imePrezime: "Petar Petrović" },
  { id: 2, imePrezime: "Ana Anić" },
  { id: 3, imePrezime: "Marko Marković" },
];

interface SystemMetricsProps {
  // Optional props for when API is connected
  adminCount?: number;
  userCount?: number;
  komitentCount?: number;
  companyCount?: number;
  workerCount?: number;
}

export default function SystemMetrics({
  adminCount,
  userCount,
  komitentCount,
  companyCount,
  workerCount,
}: SystemMetricsProps = {}) {
  // Calculate counts from sample data if not provided
  const metrics = useMemo(() => {
    // In a real app, these would come from API
    const admins = adminCount ?? sampleUsers.filter(u => u.role === 'admin' || u.role === 'super-admin').length;
    const users = userCount ?? sampleUsers.filter(u => u.role === 'user').length;
    const komitenti = komitentCount ?? sampleUsers.filter(u => u.role === 'komitent').length;
    const firme = companyCount ?? sampleFirme.length;
    const radnici = workerCount ?? sampleZaposleni.length;

    return { admins, users, komitenti, firme, radnici };
  }, [adminCount, userCount, komitentCount, companyCount, workerCount]);

  const metricsData = [
    {
      label: "Administratori",
      value: metrics.admins,
      icon: UserIcon,
      color: "warning",
    },
    {
      label: "Korisnici",
      value: metrics.users,
      icon: GroupIcon,
      color: "success",
    },
    {
      label: "Komitenti",
      value: metrics.komitenti,
      icon: UserIcon,
      color: "info",
    },
    {
      label: "Preduzeća",
      value: metrics.firme,
      icon: BoxIconLine,
      color: "primary",
    },
    {
      label: "Radnici",
      value: metrics.radnici,
      icon: ZaposleniIcon,
      color: "success",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-6">
      {metricsData.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <IconComponent className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.label}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value.toLocaleString()}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}

