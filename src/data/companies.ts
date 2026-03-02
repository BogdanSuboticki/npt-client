export interface Company {
  id: string;
  naziv: string;
  mesto: string;
  pib?: string;
  maticniBroj?: string;
  delatnost?: string;
}

export const companies: Company[] = [];
