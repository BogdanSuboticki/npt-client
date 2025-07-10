import React, { useState } from 'react';
import DataTableTwo from '../components/tables/DataTables/TableTwo/DataTableTwo';
import RadnoMestoForm from './RadnoMestoForm';
import Button from "../components/ui/button/Button";

// Sample data for the table
const radnaMestaData = [
  {
    id: 1,
    nazivRadnogMesta: "Operater viljuškara",
    nazivLokacije: "Magacin Novi Sad",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
  },
  {
    id: 2,
    nazivRadnogMesta: "Administrativni radnik",
    nazivLokacije: "Kancelarija Beograd",
    povecanRizik: "Ne",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Ne",
  },
  {
    id: 3,
    nazivRadnogMesta: "Zavarivač",
    nazivLokacije: "Proizvodna hala Niš",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
  },
  {
    id: 4,
    nazivRadnogMesta: "Električar održavanja",
    nazivLokacije: "Pogon Subotica",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Da",
  },
  {
    id: 5,
    nazivRadnogMesta: "Magacioner",
    nazivLokacije: "Magacin Kragujevac",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Ne",
  },
  {
    id: 6,
    nazivRadnogMesta: "Menadžer proizvodnje",
    nazivLokacije: "Proizvodna hala Beograd",
    povecanRizik: "Ne",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Ne",
  },
  {
    id: 7,
    nazivRadnogMesta: "Laboratorijski tehničar",
    nazivLokacije: "Laboratorija Novi Sad",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
  },
  {
    id: 8,
    nazivRadnogMesta: "Vozač viljuškara",
    nazivLokacije: "Skladište Čačak",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
  },
  {
    id: 9,
    nazivRadnogMesta: "Inženjer bezbednosti",
    nazivLokacije: "Kancelarija Novi Sad",
    povecanRizik: "Ne",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Ne",
  },
  {
    id: 10,
    nazivRadnogMesta: "Operater na mašini",
    nazivLokacije: "Pogon Valjevo",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
  },
  {
    id: 11,
    nazivRadnogMesta: "Tehničar održavanja",
    nazivLokacije: "Pogon Pančevo",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Da",
  },
  {
    id: 12,
    nazivRadnogMesta: "Kontrolor kvaliteta",
    nazivLokacije: "Proizvodna hala Šabac",
    povecanRizik: "Ne",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Ne",
  },
  {
    id: 13,
    nazivRadnogMesta: "Hemijski tehničar",
    nazivLokacije: "Laboratorija Beograd",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
  },
  {
    id: 14,
    nazivRadnogMesta: "Referent nabavke",
    nazivLokacije: "Kancelarija Kragujevac",
    povecanRizik: "Ne",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Ne",
  },
  {
    id: 15,
    nazivRadnogMesta: "Bravar",
    nazivLokacije: "Radionica Zrenjanin",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Da",
  }
];

const columns = [
  { key: "id", label: "", sortable: true },
  { key: "nazivRadnogMesta", label: "Naziv radnog mesta", sortable: true },
  { key: "nazivLokacije", label: "Naziv lokacije", sortable: true },
  { key: "povecanRizik", label: "Povećan rizik", sortable: true },
  { key: "obaveznaObuka", label: "Obavezna obuka", sortable: true },
  { key: "obavezanOftamoloskiPregled", label: "Obavezan oftamološki pregled", sortable: true },
  { key: "obavezanPregledPoDrugomOsnovu", label: "Obavezan pregled po drugom osnovu", sortable: true },
];

const RadnaMesta: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(radnaMestaData);

  const handleSave = (newData: any) => {
    const newItem = {
      id: data.length + 1,
      ...newData,
      povecanRizik: newData.povecanRizik ? "Da" : "Ne",
      obaveznaObuka: newData.obaveznaObuka ? "Da" : "Ne",
      obavezanOftamoloskiPregled: newData.obavezanOftamoloskiPregled ? "Da" : "Ne",
      obavezanPregledPoDrugomOsnovu: newData.obavezanPregledPoDrugomOsnovu ? "Da" : "Ne",
    };
    setData([...data, newItem]);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Radna mesta
        </h1>
        <Button
          onClick={() => setShowForm(true)}
          size="sm"
          className="ml-5"
        >
          <svg
            className="w-5 h-5"
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
          Novi Unos
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)]">
        <DataTableTwo 
          data={data}
          columns={columns}
        />
      </div>

      <RadnoMestoForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default RadnaMesta; 