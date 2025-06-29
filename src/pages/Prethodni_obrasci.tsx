import React from 'react';
import { useLocation } from 'react-router';
import { ReactComponent as DownloadIcon } from '../icons/download.svg?react';
import { ReactComponent as PrintIcon } from '../icons/Print.svg?react';
import { ReactComponent as EditIcon } from '../icons/Edit button.svg?react';
import { ReactComponent as DeleteIcon } from '../icons/Delete-button.svg?react';

type ObrazacItem = {
  id: number;
  title: string;
  date: string;
  status: 'completed' | 'pending';
  type: string;
  employee: string;
};

const PrethodniObrasci: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');

  // This would typically come from an API or database
  const allObrasci: ObrazacItem[] = [
    {
      id: 1,
      title: "Evidencija povreda na radu",
      date: "15.03.2024",
      status: "completed",
      type: "evidencija-povreda-rad",
      employee: "Marko Marković"
    },
    {
      id: 2,
      title: "Evidencija o radnim mestima sa povećanim rizikom",
      date: "14.03.2024",
      status: "completed",
      type: "evidencija-rizicna-radna-mesta",
      employee: "Petar Petrović"
    },
    {
      id: 3,
      title: "Evidencija o profesionalnim bolestima",
      date: "13.03.2024",
      status: "completed",
      type: "evidencija-profesionalne-bolesti",
      employee: "Ana Anić"
    },
    {
      id: 4,
      title: "Evidencija povreda na radu",
      date: "12.03.2024",
      status: "completed",
      type: "evidencija-povreda-rad",
      employee: "Jovan Jovanović"
    },
    {
      id: 5,
      title: "Evidencija o radnim mestima sa povećanim rizikom",
      date: "11.03.2024",
      status: "completed",
      type: "evidencija-rizicna-radna-mesta",
      employee: "Milan Milanković"
    },
    {
      id: 6,
      title: "Evidencija o profesionalnim bolestima",
      date: "10.03.2024",
      status: "completed",
      type: "evidencija-profesionalne-bolesti",
      employee: "Sofija Sofijić"
    },
    {
      id: 7,
      title: "Evidencija povreda na radu",
      date: "09.03.2024",
      status: "completed",
      type: "evidencija-povreda-rad",
      employee: "Nikola Nikolić"
    },
    {
      id: 8,
      title: "Evidencija o radnim mestima sa povećanim rizikom",
      date: "08.03.2024",
      status: "completed",
      type: "evidencija-rizicna-radna-mesta",
      employee: "Jana Janić"
    },
    {
      id: 9,
      title: "Evidencija o profesionalnim bolestima",
      date: "07.03.2024",
      status: "completed",
      type: "evidencija-profesionalne-bolesti",
      employee: "Stefan Stefanović"
    },
    {
      id: 10,
      title: "Evidencija povreda na radu",
      date: "06.03.2024",
      status: "completed",
      type: "evidencija-povreda-rad",
      employee: "Mina Minić"
    }
  ];

  // Filter obrasci based on type
  const filteredObrasci = type 
    ? allObrasci.filter(obrazac => obrazac.type === type)
    : allObrasci;

  const handleDownload = (id: number) => {
    // Implement download functionality
    console.log('Downloading obrazac:', id);
  };

  const handlePrint = (id: number) => {
    // Implement print functionality
    console.log('Printing obrazac:', id);
  };

  const handleEdit = (id: number) => {
    // Implement edit functionality
    console.log('Editing obrazac:', id);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality
    console.log('Deleting obrazac:', id);
  };

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Prethodni obrasci
        </h1>
      </div>
      <div className="rounded-lg bg-white dark:bg-white/[0.03] shadow-[0_0_5px_rgba(0,0,0,0.1)]">
        <div className="p-4">
          <div className="space-y-2">
            {filteredObrasci.map((obrazac) => (
              <div
                key={obrazac.id}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {obrazac.employee}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {obrazac.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(obrazac.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(obrazac.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <DownloadIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handlePrint(obrazac.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <PrintIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(obrazac.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <DeleteIcon className="w-4 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrethodniObrasci; 