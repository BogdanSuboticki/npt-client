import React, { useState } from "react";

export default function ContractInfoCard() {
  // Contract data state
  const [contractData] = useState({
    contractNumber: "UG-2024-001",
    startDate: "2024-01-01",
    endDate: "2024-12-31"
  });

  // Calculate contract status based on dates
  const getContractStatus = (startDate: string, endDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Remove time part for date comparison
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    if (today < start) {
      return "Očekuje se";
    } else if (today >= start && today <= end) {
      return "Aktivan";
    } else {
      return "Istekao";
    }
  };

  // Get current status
  const currentStatus = getContractStatus(contractData.startDate, contractData.endDate);

  return (
    <>
      <div className="p-5 border border-gray-200 bg-white dark:bg-gray-800 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Informacije o ugovoru
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                  Datum početka ugovora
                </p>
                <p className="text-[16px] font-medium text-gray-800 dark:text-white/90">
                  {new Date(contractData.startDate).toLocaleDateString('sr-RS')}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                  Datum isteka ugovora
                </p>
                <p className="text-[16px] font-medium text-gray-800 dark:text-white/90">
                  {new Date(contractData.endDate).toLocaleDateString('sr-RS')}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                  Status ugovora
                </p>
                <p className="text-[16px] font-medium text-gray-800 dark:text-white/90">
                  {currentStatus}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                  Broj ugovora
                </p>
                <p className="text-[16px] font-medium text-gray-800 dark:text-white/90">
                  {contractData.contractNumber}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
} 