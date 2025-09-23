export interface Company {
  id: string;
  naziv: string;
  mesto: string;
  pib?: string;
  maticniBroj?: string;
  delatnost?: string;
}

export const companies: Company[] = [
  { id: '1', naziv: 'Universal Logistics', mesto: 'Beograd', pib: '100123456', maticniBroj: '12345678', delatnost: 'Transport' },
  { id: '2', naziv: 'NIS a.d.', mesto: 'Novi Sad', pib: '100234567', maticniBroj: '23456789', delatnost: 'Energetika' },
  { id: '3', naziv: 'Telekom Srbija', mesto: 'Beograd', pib: '100345678', maticniBroj: '34567890', delatnost: 'Telekomunikacije' },
  { id: '4', naziv: 'Hemofarm', mesto: 'Vršac', pib: '100456789', maticniBroj: '45678901', delatnost: 'Farmacija' },
  { id: '5', naziv: 'Fiat Automobili Srbija', mesto: 'Kragujevac', pib: '100567890', maticniBroj: '56789012', delatnost: 'Automobilska industrija' },
  { id: '6', naziv: 'Gazprom Neft', mesto: 'Novi Sad', pib: '100678901', maticniBroj: '67890123', delatnost: 'Energetika' },
  { id: '7', naziv: 'Delta Holding', mesto: 'Beograd', pib: '100789012', maticniBroj: '78901234', delatnost: 'Trgovina' },
  { id: '8', naziv: 'MK Group', mesto: 'Beograd', pib: '100890123', maticniBroj: '89012345', delatnost: 'Agrobiznis' },
  { id: '9', naziv: 'Carlsberg Srbija', mesto: 'Čelarevo', pib: '100901234', maticniBroj: '90123456', delatnost: 'Prehrambena industrija' },
  { id: '10', naziv: 'Tigar', mesto: 'Pirot', pib: '101012345', maticniBroj: '01234567', delatnost: 'Guma' },
  { id: '11', naziv: 'Zastava Automobili', mesto: 'Kragujevac', pib: '101123456', maticniBroj: '12345678', delatnost: 'Automobilska industrija' },
  { id: '12', naziv: 'Energoprojekt', mesto: 'Beograd', pib: '101234567', maticniBroj: '23456789', delatnost: 'Građevinarstvo' },
  { id: '13', naziv: 'Imlek', mesto: 'Beograd', pib: '101345678', maticniBroj: '34567890', delatnost: 'Prehrambena industrija' },
  { id: '14', naziv: 'Bambi', mesto: 'Požarevac', pib: '101456789', maticniBroj: '45678901', delatnost: 'Prehrambena industrija' },
  { id: '15', naziv: 'Knjaz Miloš', mesto: 'Aranđelovac', pib: '101567890', maticniBroj: '56789012', delatnost: 'Prehrambena industrija' },
  { id: '16', naziv: 'Jubmes', mesto: 'Smederevo', pib: '101678901', maticniBroj: '67890123', delatnost: 'Metalurgija' },
  { id: '17', naziv: 'Gorenje', mesto: 'Valjevo', pib: '101789012', maticniBroj: '78901234', delatnost: 'Bela tehnika' },
  { id: '18', naziv: 'Beko', mesto: 'Valjevo', pib: '101890123', maticniBroj: '89012345', delatnost: 'Bela tehnika' },
  { id: '19', naziv: 'Naftna industrija Srbije', mesto: 'Pančevo', pib: '101901234', maticniBroj: '90123456', delatnost: 'Energetika' },
  { id: '20', naziv: 'Zrenjanin Pivara', mesto: 'Zrenjanin', pib: '102012345', maticniBroj: '01234567', delatnost: 'Prehrambena industrija' },
];
