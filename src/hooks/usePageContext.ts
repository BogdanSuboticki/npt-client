import { useSearchParams } from "react-router";

export type PageContext = 'moja-firma' | 'komitenti';

export const usePageContext = (): PageContext => {
  const [searchParams] = useSearchParams();
  const context = searchParams.get('context') as PageContext;
  
  // Default to 'moja-firma' if no context is specified
  return context || 'moja-firma';
};

export const getTitleForContext = (baseTitle: string, context: PageContext): string => {
  switch (context) {
    case 'komitenti':
      return `${baseTitle} - Komitenti`;
    case 'moja-firma':
    default:
      return `${baseTitle} - Moja Firma`;
  }
};
