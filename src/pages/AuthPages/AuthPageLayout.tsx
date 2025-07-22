import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {/* HSEradar Title - Mobile Only */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 lg:hidden">
          <h1 className="text-3xl font-bold text-brand-500 dark:text-brand-400">
            HSEradar
          </h1>
        </div>
        
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
              <h1 className="text-white text-4xl font-bold">HSE Radar</h1>
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 bottom-6 right-6">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
