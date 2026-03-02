import { useState, useEffect } from "react";
import { UserIcon, GroupIcon, BoxIconLine, ZaposleniIcon } from "../../icons";
import { api } from "../../api/client";

export default function SystemMetrics() {
  const [stats, setStats] = useState({
    adminCount: 0,
    userCount: 0,
    komitentCount: 0,
    companyCount: 0,
    workerCount: 0,
  });

  useEffect(() => {
    api
      .get<{
        adminCount: number;
        userCount: number;
        komitentCount: number;
        companyCount: number;
        workerCount: number;
      }>("dashboard/stats")
      .then(setStats)
      .catch(() => {});
  }, []);

  const metricsData = [
    {
      label: "Administratori",
      value: stats.adminCount,
      icon: UserIcon,
      color: "warning",
    },
    {
      label: "Korisnici",
      value: stats.userCount,
      icon: GroupIcon,
      color: "success",
    },
    {
      label: "Komitenti",
      value: stats.komitentCount,
      icon: UserIcon,
      color: "info",
    },
    {
      label: "Preduzeća",
      value: stats.companyCount,
      icon: BoxIconLine,
      color: "primary",
    },
    {
      label: "Radnici",
      value: stats.workerCount,
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
