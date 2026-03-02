import { Company, companies } from "./companies";
import { RokoviData } from "../pages/rokovi/RokoviDataTable";

const addDays = (days: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
};

interface RokoviSeed {
  oblast: string;
  vrstaObaveze: string;
  napomena: string;
  dueInDays: number;
}

const sharedSeeds: RokoviSeed[] = [];

const companySpecificSeeds: Record<string, RokoviSeed[]> = {};

const buildRokoviFromSeeds = (seeds: RokoviSeed[], company: Company): RokoviData[] => {
  const numericCompanyId = Number.parseInt(company.id, 10);
  const baseId = Number.isNaN(numericCompanyId) ? 0 : numericCompanyId * 100;

  return seeds.map((seed, index) => {
    const rok = addDays(seed.dueInDays);

    return {
      id: baseId + index + 1,
      oblast: seed.oblast,
      vrstaObaveze: seed.vrstaObaveze,
      rok,
      status: "",
      napomena: `${seed.napomena}`,
      companyId: company.id,
      preduzece: company.naziv,
    };
  });
};

export const getRokoviByCompany = (company: Company): RokoviData[] => {
  const seeds = companySpecificSeeds[company.id] ?? sharedSeeds;
  return buildRokoviFromSeeds(seeds, company);
};

export const getAllRokovi = (): RokoviData[] => {
  const allRokovi: RokoviData[] = [];
  
  companies.forEach((company: Company) => {
    const rokovi = getRokoviByCompany(company);
    allRokovi.push(...rokovi);
  });
  
  // Get dynamic rokovi from localStorage
  const dynamicRokovi = getDynamicRokovi();
  allRokovi.push(...dynamicRokovi);
  
  return allRokovi;
};

// LocalStorage keys
const DYNAMIC_ROKOVI_KEY = 'dynamicRokovi';
const NEXT_ROK_ID_KEY = 'nextRokId';

// Get dynamic rokovi from localStorage
export const getDynamicRokovi = (): RokoviData[] => {
  try {
    const stored = localStorage.getItem(DYNAMIC_ROKOVI_KEY);
    if (!stored) return [];
    
    const rokovi = JSON.parse(stored);
    // Convert date strings back to Date objects
    return rokovi.map((rok: any) => ({
      ...rok,
      rok: new Date(rok.rok)
    }));
  } catch (error) {
    console.error('Error loading dynamic rokovi:', error);
    return [];
  }
};

// Save dynamic rokovi to localStorage
const saveDynamicRokovi = (rokovi: RokoviData[]) => {
  try {
    localStorage.setItem(DYNAMIC_ROKOVI_KEY, JSON.stringify(rokovi));
  } catch (error) {
    console.error('Error saving dynamic rokovi:', error);
  }
};

// Get next available rok ID
const getNextRokId = (): number => {
  try {
    const stored = localStorage.getItem(NEXT_ROK_ID_KEY);
    if (!stored) {
      const nextId = 10000; // Start from a high number to avoid conflicts
      localStorage.setItem(NEXT_ROK_ID_KEY, nextId.toString());
      return nextId;
    }
    const nextId = parseInt(stored, 10) + 1;
    localStorage.setItem(NEXT_ROK_ID_KEY, nextId.toString());
    return nextId;
  } catch (error) {
    console.error('Error getting next rok ID:', error);
    return Date.now(); // Fallback to timestamp
  }
};

// Create a new rok for povreda notification deadline (24 hours from datum povrede)
export const createPovredaInspekcijaRok = (
  povredaId: number,
  datumPovrede: Date,
  zaposleni: string,
  company: Company
): RokoviData => {
  const deadline = new Date(datumPovrede);
  deadline.setHours(deadline.getHours() + 24); // Add 24 hours
  
  const rok: RokoviData = {
    id: getNextRokId(),
    oblast: 'Bezbednost i zdravlje na radu',
    vrstaObaveze: 'Obaveštenje inspekcije o povredi na radu',
    rok: deadline,
    status: '',
    napomena: `Obavezno obavestiti inspekciju u roku od 24 sata od povrede. Zaposleni: ${zaposleni}.`,
    companyId: company.id,
    preduzece: company.naziv,
    povredaId: povredaId, // Link to povreda
    isCompleted: false
  };
  
  // Save to localStorage
  const existingRokovi = getDynamicRokovi();
  existingRokovi.push(rok);
  saveDynamicRokovi(existingRokovi);
  
  return rok;
};

// Complete a rok (mark as done) when datumObavestenjaInspekcije is set
export const completePovredaInspekcijaRok = (povredaId: number) => {
  const rokovi = getDynamicRokovi();
  const updatedRokovi = rokovi.map(rok => {
    if (rok.povredaId === povredaId && !rok.isCompleted) {
      return {
        ...rok,
        isCompleted: true,
        status: 'Završeno',
        napomena: `${rok.napomena} (Završeno)`
      };
    }
    return rok;
  });
  saveDynamicRokovi(updatedRokovi);
};

// Get rokovi by company including dynamic ones
export const getRokoviByCompanyWithDynamic = (company: Company): RokoviData[] => {
  const seedRokovi = getRokoviByCompany(company);
  const dynamicRokovi = getDynamicRokovi().filter(
    rok => rok.companyId === company.id && !rok.isCompleted
  );
  return [...seedRokovi, ...dynamicRokovi];
};

