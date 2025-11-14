import { createContext, ReactNode, useContext, useState } from "react";
import { Company } from "../data/companies";

interface CompanyContextValue {
  selectedCompany: Company | null;
  selectCompany: (company: Company | null) => void;
}

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const selectCompany = (company: Company | null) => {
    setSelectedCompany(company);
  };

  return (
    <CompanyContext.Provider value={{ selectedCompany, selectCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanySelection = () => {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error("useCompanySelection must be used within a CompanyProvider");
  }

  return context;
};

