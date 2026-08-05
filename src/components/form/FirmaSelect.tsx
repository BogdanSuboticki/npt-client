"use client";

import { useEffect, useRef, useState } from "react";
import Label from "./Label";
import { api } from "../../api/client";
import { PageContext } from "../../hooks/usePageContext";

export interface FirmaOption {
  pib: string;
  naziv: string;
}

/**
 * Loads the companies visible in the current section.
 *
 * In "moja-firma" the backend returns exactly one company, so callers can rely
 * on that single entry being auto-selected rather than offering a choice.
 */
export function useFirme(context: PageContext) {
  const [firme, setFirme] = useState<FirmaOption[]>([]);

  useEffect(() => {
    let cancelled = false;

    api.get<{ data: any[] }>(`firme?context=${context}`)
      .then(res => {
        if (cancelled) return;
        const list = (res.data ?? []).map((f: any) => ({ pib: f.pib, naziv: f.naziv }));
        setFirme(list);
      })
      .catch(() => {
        if (!cancelled) setFirme([]);
      });

    return () => { cancelled = true; };
  }, [context]);

  return firme;
}

interface FirmaSelectProps {
  firme: FirmaOption[];
  value: string;
  onChange: (pib: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function FirmaSelect({
  firme,
  value,
  onChange,
  disabled = false,
  required = true,
}: FirmaSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = firme.find(f => f.pib === value);

  // A single company is context, not a choice — show it as a fixed value.
  const isFixed = disabled || firme.length <= 1;

  return (
    <div className="w-full">
      <Label>Preduzeće {required && !isFixed ? "*" : ""}</Label>
      {isFixed ? (
        <div className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-[#101828] dark:text-gray-300">
          {selected?.naziv ?? firme[0]?.naziv ?? "—"}
        </div>
      ) : (
        <div className="relative w-full" ref={ref}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-[#F9FAFB] px-4 py-2.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-[#101828] dark:text-gray-300"
          >
            <span className={selected ? "" : "text-gray-400"}>
              {selected ? `${selected.naziv} (${selected.pib})` : "Izaberi preduzeće"}
            </span>
            <svg
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-[100] mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="max-h-60 overflow-y-auto">
                {firme.map(firma => (
                  <div
                    key={firma.pib}
                    className={`cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      value === firma.pib ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                    onClick={() => {
                      onChange(firma.pib);
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {firma.naziv} ({firma.pib})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
