import { useMemo } from "react";
import { useFirme } from "../components/form/FirmaSelect";
import { useCompanySelection } from "../context/CompanyContext";
import { PageContext } from "./usePageContext";

export const PREDUZECE_COLUMN = { key: "preduzece", label: "Preduzeće", sortable: true };

type Column = { key: string; label: string; sortable: boolean };

/**
 * Scopes a table to the company picked in the header search bar, and labels
 * each row with its company so records from different firms are never mixed.
 *
 * With no company picked the table shows everything the section allows. In
 * "Moje preduzeće" there is only one company, so the column is dropped as noise.
 */
export function usePreduzeceScope<T extends { firmaPib?: string }>(
  context: PageContext,
  rows: T[],
) {
  const firme = useFirme(context);
  const { selectedCompany } = useCompanySelection();
  const selectedPib = selectedCompany?.pib ?? "";

  const nazivByPib = useMemo(
    () => Object.fromEntries(firme.map(f => [f.pib, f.naziv])),
    [firme],
  );

  const rowsWithPreduzece = useMemo(
    () => rows.map(row => ({
      ...row,
      preduzece: nazivByPib[row.firmaPib ?? ""] ?? "",
    })),
    [rows, nazivByPib],
  );

  const data = useMemo(
    () => (selectedPib
      ? rowsWithPreduzece.filter(row => row.firmaPib === selectedPib)
      : rowsWithPreduzece),
    [rowsWithPreduzece, selectedPib],
  );

  const showPreduzece = firme.length > 1;

  const withPreduzeceColumn = (columns: Column[]) =>
    showPreduzece ? [columns[0], PREDUZECE_COLUMN, ...columns.slice(1)] : columns;

  return { data, showPreduzece, withPreduzeceColumn };
}
