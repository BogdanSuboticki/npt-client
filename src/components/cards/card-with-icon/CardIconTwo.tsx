import { CardTitle, CardDescription } from "../../ui/card";
import { Link } from "react-router";
import { ReactComponent as ObrasciIcon } from "../../../icons/Obrasci.svg?react";

interface CardIconTwoProps {
  title: string;
  description: string;
  link: string;
}

const mockFilledForms = [
  {
    id: "1",
    date: "15.03.2024",
    status: "completed",
    employee: "Marko Marković"
  },
  {
    id: "2",
    date: "10.03.2024",
    status: "completed",
    employee: "Petar Petrović"
  },
  {
    id: "3",
    date: "05.03.2024",
    status: "completed",
    employee: "Ana Anić"
  }
];

export default function CardIconTwo({ title, description, link }: CardIconTwoProps) {
  // Extract the type from the link (remove the leading slash)
  const type = link.substring(1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-5">
          <div className="h-14 w-14 flex items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500 dark:bg-brand-500/10">
            <ObrasciIcon className="w-7 h-7" />
          </div>
          <Link to={link}>
            <button className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4.16666V15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.16666 10H15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Popuni novi obrazac
            </button>
          </Link>
        </div>

        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>

      <div className="mt-auto">
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Poslednji obrasci</h3>
            <Link to={`/prethodni-obrasci?type=${type}`} className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300">
              Pogledaj sve
            </Link>
          </div>
          <div className="space-y-2">
            {mockFilledForms.map((form) => (
              <div 
                key={form.id}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{form.employee}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{form.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
