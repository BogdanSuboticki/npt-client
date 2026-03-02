import { CardDescription, CardTitle } from "../../ui/card";
import { Link } from "react-router";

export default function CardLinkOne() {
  return (
    <div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div>
          <CardTitle>Kartica</CardTitle>

          <CardDescription>Nema opisa.</CardDescription>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-3 mt-4 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}
