"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Company } from "../../data/companies";
import AngazovanjaForm from "../angazovanja/AngazovanjaForm";
import PovredeForm from "../povrede/PovredeForm";
import OpremaForm from "../oprema/OpremaForm";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

export interface DnevniIzvestajiData {
  id: number;
  firma: string;
  datum: Date;
  svakodnevnaKontrolaBZR: boolean;
  osobaZaSaradnju: string;
  promeneAPR: boolean;
  napomenaPromeneAPR: string;
  promenaPoslovaRadnihZadataka: boolean;
  napomenaPromenaPoslova: string;
  promenaRadnihMestaZaposlenih: boolean;
  formaPromenaRadnihMesta: any; // Form data
  promenaRadneSnage: boolean;
  formaPromenaRadneSnage: any; // Form data
  novaSredstvaZaRad: boolean;
  formaNovaSredstvaZaRad: any; // Form data
  stazeZaKomunikacijuBezbedne: boolean;
  napomenaStazeZaKomunikaciju: string;
  planiranePopravkeRemont: boolean;
  napomenaPlaniranePopravke: string;
  koriscenjeLZS: boolean;
  napomenaKoriscenjeLZS: string;
  novaGradilistaNoviPogoni: boolean;
  napomenaNovaGradilista: string;
  povredaNaRadu: boolean;
  formaPovredaNaRadu: any; // Form data
  potencijalniRizici: boolean;
  napomenaPotencijalniRizici: string;
  napomena: string;
  napomenaBZR: string;
  [key: string]: any;
}

interface DataTableProps {
  data: DnevniIzvestajiData[];
  columns: Column[];
  selectedCompany: Company | null;
}

export default function DnevniIzvestajiDataTable({
  data: initialData,
  columns: _columns,
  selectedCompany,
}: DataTableProps) {
  // State to track answers for each question
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  // State to track napomena values
  const [napomenaValues, setNapomenaValues] = useState<Record<string, string>>({});
  // State to track person name
  const [personName, setPersonName] = useState<string>("");
  // State for form modals
  const [openForm, setOpenForm] = useState<{ questionKey: string; isOpen: boolean }>({ questionKey: "", isOpen: false });
  
  // Hardcoded mapping of company to person name
  const companyPersonMap: Record<string, string> = {
    '1': 'Marko Petrović', // Universal Logistics
    '2': 'Ana Jovanović', // NIS a.d.
    '3': 'Petar Marković', // Telekom Srbija
    '4': 'Jovan Nikolić', // Hemofarm
    '5': 'Milan Stojanović', // Fiat Automobili Srbija
    '6': 'Snežana Popović', // Gazprom Neft
    '7': 'Dragan Đorđević', // Delta Holding
    '8': 'Milica Radović', // MK Group
    '9': 'Stefan Lazić', // Carlsberg Srbija
    '10': 'Jelena Milić', // Tigar
    '11': 'Nenad Vuković', // Zastava Automobili
    '12': 'Tamara Janković', // Energoprojekt
    '13': 'Bojan Stanković', // Imlek
    '14': 'Ivana Đukić', // Bambi
    '15': 'Dejan Todorović', // Knjaz Miloš
    '16': 'Marija Pavlović', // Jubmes
    '17': 'Nikola Simić', // Gorenje
    '18': 'Sara Jović', // Beko
    '19': 'Luka Ristić', // Naftna industrija Srbije
    '20': 'Maja Kostić', // Zrenjanin Pivara
  };
  
  // Update person name when company is selected
  useEffect(() => {
    if (selectedCompany && selectedCompany.id) {
      const personNameForCompany = companyPersonMap[selectedCompany.id] || "";
      setPersonName(personNameForCompany);
    } else {
      setPersonName("");
    }
  }, [selectedCompany]);
  // State to track which forms have been saved
  const [savedForms, setSavedForms] = useState<Record<string, boolean>>({});
  // State for dropdowns
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredAndSortedData = useMemo(() => {
    return initialData;
  }, [initialData]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      Object.keys(openDropdowns).forEach((key) => {
        if (openDropdowns[key] && dropdownRefs.current[key] && !dropdownRefs.current[key]?.contains(target)) {
          setOpenDropdowns(prev => ({ ...prev, [key]: false }));
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdowns]);

  const handleAnswerChange = (questionKey: string, answer: boolean | null) => {
    setAnswers(prev => ({
      ...prev,
      [questionKey]: answer
    }));
    // Clear napomena if answer is changed to Ne or null
    if (answer === false || answer === null) {
      setNapomenaValues(prev => {
        const newValues = { ...prev };
        delete newValues[questionKey];
        return newValues;
      });
      setSavedForms(prev => {
        const newValues = { ...prev };
        delete newValues[questionKey];
        return newValues;
      });
    }
    // If Da is selected for form-type question, open the form
    const formQuestions = ["promenaRadnihMestaZaposlenih", "promenaRadneSnage", "novaSredstvaZaRad", "povredaNaRadu"];
    if (answer === true && formQuestions.includes(questionKey)) {
      setOpenForm({ questionKey, isOpen: true });
    }
    // Close dropdown after selection
    setOpenDropdowns(prev => ({ ...prev, [questionKey]: false }));
  };

  const handleFormSave = (questionKey: string, _data: any) => {
    // Mark form as saved
    setSavedForms(prev => ({ ...prev, [questionKey]: true }));
    setOpenForm({ questionKey: "", isOpen: false });
  };

  const handleFormClose = () => {
    setOpenForm({ questionKey: "", isOpen: false });
  };

  const handleNapomenaChange = (questionKey: string, value: string) => {
    setNapomenaValues(prev => ({
      ...prev,
      [questionKey]: value
    }));
  };

  const questions = [
    { 
      key: "svakodnevnaKontrolaBZR", 
      label: "Svakodnevna kontrola stanja BZR i komunikacija sa: -osoba za saradnju-",
      type: "personInput" // Direct input field, no yes/no
    },
    { 
      key: "promeneAPR", 
      label: "Promene u APR-u",
      type: "napomena" // Opens napomena when Da
    },
    { 
      key: "promenaPoslovaRadnihZadataka", 
      label: "Promena poslova i radnih zadataka",
      type: "napomena" // Opens napomena when Da
    },
    { 
      key: "promenaRadnihMestaZaposlenih", 
      label: "Promena radnih mesta zaposlenih",
      type: "form" // Opens form when Da
    },
    { 
      key: "promenaRadneSnage", 
      label: "Promena radne snage",
      type: "form" // Opens form when Da
    },
    { 
      key: "novaSredstvaZaRad", 
      label: "Nova sredstva za rad",
      type: "form" // Opens form when Da
    },
    { 
      key: "stazeZaKomunikacijuBezbedne", 
      label: "Staze za komunikaciju su bezbedne i prohodne",
      type: "napomena" // Opens napomena when Da
    },
    { 
      key: "planiranePopravkeRemont", 
      label: "Planirane popravke i remont opreme za rad",
      type: "napomena" // Opens napomena when Da
    },
    { 
      key: "koriscenjeLZS", 
      label: "Korišćenje ličnih zaštitnih sredstava u skladu sa pravilnikom BZR",
      type: "napomena" // Opens napomena when Da
    },
    { 
      key: "novaGradilistaNoviPogoni", 
      label: "Nova gradilišta ili novi pogoni",
      type: "napomena" // Opens napomena when Da
    },
    { 
      key: "povredaNaRadu", 
      label: "Povreda na radu",
      type: "form" // Opens form when Da
    },
    { 
      key: "potencijalniRizici", 
      label: "Potencijalni rizici i opasnosti na radnom mestu",
      type: "napomena" // Opens napomena when Da
    },
  ];

  // Transform data to have one row per question - using state for answers
  const transformedData = useMemo(() => {
    const rows: Array<{
      id: string;
      reportId: number;
      firma: string;
      datum: Date;
      pitanje: string;
      odgovor: boolean | null | string;
      napomena: string;
      napomenaBZR: string;
      isQuestion: boolean;
      questionType?: string;
      questionKey: string;
    }> = [];

    // Get the first item (or create a default one if no data)
    const item = filteredAndSortedData[0] || { id: 1, firma: "", datum: new Date() };

    // Add rows for each question
    questions.forEach((question) => {
      const currentAnswer = answers[question.key] ?? null;
      const napomenaValue = napomenaValues[question.key] || "";
      
      rows.push({
        id: `question-${question.key}`,
        reportId: item.id,
        firma: item.firma,
        datum: item.datum,
        pitanje: question.label,
        odgovor: currentAnswer,
        napomena: napomenaValue,
        napomenaBZR: "",
        isQuestion: true,
        questionType: question.type,
        questionKey: question.key,
      });
      
      // If answer is Da and type is napomena, add a napomena row
      if (question.type === "napomena" && currentAnswer === true) {
        rows.push({
          id: `napomena-${question.key}`,
          reportId: item.id,
          firma: "",
          datum: new Date(0),
          pitanje: `Napomena: ${question.label}`,
          odgovor: null,
          napomena: napomenaValue,
          napomenaBZR: "",
          isQuestion: false,
          questionType: "napomena",
          questionKey: question.key,
        });
      }
      
      // If answer is Da and type is form, add a form indicator row (only if form is saved)
      if (question.type === "form" && currentAnswer === true && savedForms[question.key]) {
        rows.push({
          id: `form-${question.key}`,
          reportId: item.id,
          firma: "",
          datum: new Date(0),
          pitanje: `Forma: ${question.label}`,
          odgovor: "Forma je popunjena",
          napomena: "",
          napomenaBZR: "",
          isQuestion: false,
          questionType: "form",
          questionKey: question.key,
        });
      }
      
    });

    return rows;
  }, [filteredAndSortedData, answers, napomenaValues, personName, questions, savedForms]);

  // Display all data without pagination
  const currentTransformedData = transformedData;

  // Get today's date
  const today = useMemo(() => new Date(), []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("sr-Latn-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-[#1D2939] shadow-theme-sm">
      <div className="flex flex-col gap-4 px-4 py-4">
        {/* Display Firma and Datum */}
        {selectedCompany && (
          <div className="flex flex-col gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Firma:</span>
                <span className="text-gray-600 dark:text-gray-400">{selectedCompany.naziv}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Datum:</span>
                <span className="text-gray-600 dark:text-gray-400">{formatDate(today)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar">
        <div className="min-h-[200px]">
          <Table className="w-full">
            <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] border-l-0 min-w-[300px]"
                >
                  <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400">
                    Pitanje
                  </p>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] border-r-0 min-w-[80px] text-center"
                >
                  <p className="font-bold text-gray-700 text-theme-xs dark:text-gray-400">
                    Odgovor
                  </p>
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentTransformedData.map((row) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell className="px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 border-l-0">
                      {row.pitanje}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 text-center font-medium border-r-0">
                      {row.isQuestion ? (
                        row.questionType === "personInput" ? (
                          <span className="text-gray-800 dark:text-gray-200 text-sm">
                            {personName || "-"}
                          </span>
                        ) : (
                          <div className="relative flex items-center justify-center" ref={(el) => {
                            if (el) dropdownRefs.current[row.questionKey] = el;
                          }}>
                            <button
                              type="button"
                              onClick={() => setOpenDropdowns(prev => ({ ...prev, [row.questionKey]: !prev[row.questionKey] }))}
                              className="flex items-center justify-between w-32 px-4 py-2 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                              <span>
                                {row.odgovor === true ? "DA" : row.odgovor === false ? "NE" : "Izaberi"}
                              </span>
                              <svg
                                className={`w-4 h-4 transition-transform ${openDropdowns[row.questionKey] ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {openDropdowns[row.questionKey] && (
                              <div className="absolute z-[100] w-32 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-[#11181E] dark:border-gray-700 top-full">
                                <div
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none rounded-t-lg"
                                  onClick={() => handleAnswerChange(row.questionKey, true)}
                                >
                                  <span className="text-sm text-gray-700 dark:text-gray-300">DA</span>
                                </div>
                                <div
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none rounded-b-lg border-t border-gray-200 dark:border-gray-700"
                                  onClick={() => handleAnswerChange(row.questionKey, false)}
                                >
                                  <span className="text-sm text-gray-700 dark:text-gray-300">NE</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      ) : row.pitanje.startsWith("Napomena:") ? (
                        <textarea
                          value={row.napomena}
                          onChange={(e) => handleNapomenaChange(row.questionKey, e.target.value)}
                          placeholder="Unesite napomenu..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm min-h-[80px] resize-y"
                        />
                      ) : row.pitanje.startsWith("Forma:") ? (
                        <div className="text-left">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">Forma je popunjena</span>
                        </div>
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {currentTransformedData.length === 0 && (
                <TableRow>
                  <td
                    colSpan={2}
                    className="px-4 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    Nema dostupnih izveštaja za prikaz.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Form Modals */}
      {openForm.isOpen && openForm.questionKey === "promenaRadnihMestaZaposlenih" && (
        <AngazovanjaForm
          isOpen={openForm.isOpen}
          onClose={handleFormClose}
          onSave={(data: any) => handleFormSave(openForm.questionKey, data)}
        />
      )}
      {openForm.isOpen && openForm.questionKey === "promenaRadneSnage" && (
        <AngazovanjaForm
          isOpen={openForm.isOpen}
          onClose={handleFormClose}
          onSave={(data: any) => handleFormSave(openForm.questionKey, data)}
        />
      )}
      {openForm.isOpen && openForm.questionKey === "novaSredstvaZaRad" && (
        <OpremaForm
          isOpen={openForm.isOpen}
          onClose={handleFormClose}
          onSave={(data: any) => handleFormSave(openForm.questionKey, data)}
        />
      )}
      {openForm.isOpen && openForm.questionKey === "povredaNaRadu" && (
        <PovredeForm
          isOpen={openForm.isOpen}
          onClose={handleFormClose}
          onSave={(data: any) => handleFormSave(openForm.questionKey, data)}
        />
      )}
    </div>
  );
}

