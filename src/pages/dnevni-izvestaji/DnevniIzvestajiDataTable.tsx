"use client";

import { useState, useMemo, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
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
import { useUser } from "../../context/UserContext";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import html2pdf from 'html2pdf.js';

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
  pregledan?: boolean; // Admin review status
  napomenaAdmin?: string; // Admin's note/remark
  [key: string]: any;
}

export interface DataTableHandle {
  handlePrint: () => void;
  handleDownloadPDF: () => Promise<void>;
}

interface DataTableProps {
  data: DnevniIzvestajiData[];
  columns: Column[];
  selectedCompany: Company | null;
  readOnly?: boolean; // If true, show as read-only (for admin viewing)
  selectedReport?: DnevniIzvestajiData | null; // The specific report to display (for admin)
  onPregledanChange?: (reportId: number, pregledan: boolean) => void;
  onNapomenaBZRChange?: (reportId: number, napomena: string) => void;
  onSave?: (reportData: DnevniIzvestajiData) => void; // Callback to save new report
}

const DnevniIzvestajiDataTable = forwardRef<DataTableHandle, DataTableProps>(({
  data: initialData,
  columns: _columns,
  selectedCompany,
  readOnly = false,
  selectedReport = null,
  onPregledanChange,
  onNapomenaBZRChange,
  onSave,
}, ref) => {
  const { userType } = useUser();
  const isKomitent = userType === 'komitent';
  
  // Nadležno preduzeće - sample data (same for all companies)
  const nadleznoPreduzece = 'Sistem Administracija d.o.o.';
  
  // State to track answers for each question
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  // State to track napomena values
  const [napomenaValues, setNapomenaValues] = useState<Record<string, string>>({});
  // State to track person name
  const [personName, setPersonName] = useState<string>("");
  // State for form modals
  const [openForm, setOpenForm] = useState<{ questionKey: string; isOpen: boolean }>({ questionKey: "", isOpen: false });
  // State for general notes
  const [napomena, setNapomena] = useState<string>("");
  const [napomenaBZR, setNapomenaBZR] = useState<string>("");
  // State for admin review
  const [pregledan, setPregledan] = useState<boolean>(false);
  // State to store form data
  const [formData, setFormData] = useState<Record<string, any>>({});
  
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

  // Load data from selectedReport when in read-only mode
  useEffect(() => {
    if (readOnly && selectedReport) {
      // Load answers from the report
      const reportAnswers: Record<string, boolean | null> = {};
      const reportNapomena: Record<string, string> = {};
      
      reportAnswers["svakodnevnaKontrolaBZR"] = selectedReport.svakodnevnaKontrolaBZR;
      reportAnswers["promeneAPR"] = selectedReport.promeneAPR;
      reportNapomena["promeneAPR"] = selectedReport.napomenaPromeneAPR || "";
      reportAnswers["promenaPoslovaRadnihZadataka"] = selectedReport.promenaPoslovaRadnihZadataka;
      reportNapomena["promenaPoslovaRadnihZadataka"] = selectedReport.napomenaPromenaPoslova || "";
      reportAnswers["promenaRadnihMestaZaposlenih"] = selectedReport.promenaRadnihMestaZaposlenih;
      reportAnswers["promenaRadneSnage"] = selectedReport.promenaRadneSnage;
      reportAnswers["novaSredstvaZaRad"] = selectedReport.novaSredstvaZaRad;
      reportAnswers["stazeZaKomunikacijuBezbedne"] = selectedReport.stazeZaKomunikacijuBezbedne;
      reportNapomena["stazeZaKomunikacijuBezbedne"] = selectedReport.napomenaStazeZaKomunikaciju || "";
      reportAnswers["planiranePopravkeRemont"] = selectedReport.planiranePopravkeRemont;
      reportNapomena["planiranePopravkeRemont"] = selectedReport.napomenaPlaniranePopravke || "";
      reportAnswers["koriscenjeLZS"] = selectedReport.koriscenjeLZS;
      reportNapomena["koriscenjeLZS"] = selectedReport.napomenaKoriscenjeLZS || "";
      reportAnswers["novaGradilistaNoviPogoni"] = selectedReport.novaGradilistaNoviPogoni;
      reportNapomena["novaGradilistaNoviPogoni"] = selectedReport.napomenaNovaGradilista || "";
      reportAnswers["povredaNaRadu"] = selectedReport.povredaNaRadu;
      reportAnswers["potencijalniRizici"] = selectedReport.potencijalniRizici;
      reportNapomena["potencijalniRizici"] = selectedReport.napomenaPotencijalniRizici || "";
      
      setAnswers(reportAnswers);
      setNapomenaValues(reportNapomena);
      setPersonName(selectedReport.osobaZaSaradnju || "");
      
      // Mark forms as saved if they exist and load form data
      const saved: Record<string, boolean> = {};
      const loadedFormData: Record<string, any> = {};
      if (selectedReport.formaPromenaRadnihMesta) {
        saved["promenaRadnihMestaZaposlenih"] = true;
        loadedFormData["promenaRadnihMestaZaposlenih"] = selectedReport.formaPromenaRadnihMesta;
      }
      if (selectedReport.formaPromenaRadneSnage) {
        saved["promenaRadneSnage"] = true;
        loadedFormData["promenaRadneSnage"] = selectedReport.formaPromenaRadneSnage;
      }
      if (selectedReport.formaNovaSredstvaZaRad) {
        saved["novaSredstvaZaRad"] = true;
        loadedFormData["novaSredstvaZaRad"] = selectedReport.formaNovaSredstvaZaRad;
      }
      if (selectedReport.formaPovredaNaRadu) {
        saved["povredaNaRadu"] = true;
        loadedFormData["povredaNaRadu"] = selectedReport.formaPovredaNaRadu;
      }
      setSavedForms(saved);
      setFormData(loadedFormData);
      
      // Load general notes
      setNapomena(selectedReport.napomena || "");
      setNapomenaBZR(selectedReport.napomenaBZR || "");
      
      // Load admin review data
      setPregledan(selectedReport.pregledan || false);
    }
  }, [readOnly, selectedReport]);
  // State to track which forms have been saved
  const [savedForms, setSavedForms] = useState<Record<string, boolean>>({});
  // State for dropdowns
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Ref for the table container for print/PDF
  const tableRef = useRef<HTMLDivElement>(null);

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

  const handleFormSave = (questionKey: string, data: any) => {
    // Mark form as saved and store form data
    setSavedForms(prev => ({ ...prev, [questionKey]: true }));
    setFormData(prev => ({ ...prev, [questionKey]: data }));
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

  const handleGeneralNapomenaChange = (key: string, value: string) => {
    if (key === "napomena") {
      setNapomena(value);
    } else if (key === "napomenaBZR") {
      setNapomenaBZR(value);
    }
  };

  const questions = [
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

  // Format date helper function
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("sr-Latn-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Function to format form data for display
  const formatFormData = (questionKey: string, data: any): string => {
    if (!data) return "";
    
    if (questionKey === "promenaRadnihMestaZaposlenih" || questionKey === "promenaRadneSnage") {
      // AngazovanjaForm data
      const parts: string[] = [];
      if (data.zaposleni) parts.push(`Zaposleni: ${data.zaposleni}`);
      if (data.radnoMesto) parts.push(`Radno mesto: ${data.radnoMesto}`);
      if (data.lokacija) parts.push(`Lokacija: ${data.lokacija}`);
      if (data.vrstaAngazovanja) parts.push(`Vrsta angažovanja: ${data.vrstaAngazovanja}`);
      if (data.datumPocetka) {
        const date = data.datumPocetka instanceof Date ? data.datumPocetka : new Date(data.datumPocetka);
        parts.push(`Datum početka: ${formatDate(date)}`);
      }
      if (data.datumPrestanka) {
        const date = data.datumPrestanka instanceof Date ? data.datumPrestanka : new Date(data.datumPrestanka);
        parts.push(`Datum prestanka: ${formatDate(date)}`);
      }
      return parts.join("\n");
    } else if (questionKey === "novaSredstvaZaRad") {
      // OpremaForm data
      const parts: string[] = [];
      if (data.nazivOpreme) parts.push(`Naziv opreme: ${data.nazivOpreme}`);
      if (data.vrstaOpreme) parts.push(`Vrsta opreme: ${data.vrstaOpreme}`);
      if (data.fabrickBroj) parts.push(`Fabrički broj: ${data.fabrickBroj}`);
      if (data.inventarniBroj) parts.push(`Inventarni broj: ${data.inventarniBroj}`);
      if (data.lokacija) parts.push(`Lokacija: ${data.lokacija}`);
      if (data.godinaProizvodnje) parts.push(`Godina proizvodnje: ${data.godinaProizvodnje}`);
      if (data.intervalPregleda) parts.push(`Interval pregleda: ${data.intervalPregleda} meseci`);
      if (data.napomena) parts.push(`Napomena: ${data.napomena}`);
      return parts.join("\n");
    } else if (questionKey === "povredaNaRadu") {
      // PovredeForm data
      const parts: string[] = [];
      if (data.zaposleni) parts.push(`Zaposleni: ${data.zaposleni}`);
      if (data.datumPovrede) {
        const date = data.datumPovrede instanceof Date ? data.datumPovrede : new Date(data.datumPovrede);
        parts.push(`Datum povrede: ${formatDate(date)}`);
      }
      if (data.tezinaPovrede) parts.push(`Težina povrede: ${data.tezinaPovrede}`);
      if (data.brojPovredneListe) parts.push(`Broj povredne liste: ${data.brojPovredneListe}`);
      if (data.datumObavestenjaInspekcije) {
        const date = data.datumObavestenjaInspekcije instanceof Date ? data.datumObavestenjaInspekcije : new Date(data.datumObavestenjaInspekcije);
        parts.push(`Datum obaveštenja inspekcije: ${formatDate(date)}`);
      }
      if (data.datumPredajeFondu) {
        const date = data.datumPredajeFondu instanceof Date ? data.datumPredajeFondu : new Date(data.datumPredajeFondu);
        parts.push(`Datum predaje fondu: ${formatDate(date)}`);
      }
      if (data.datumPreuzimanjaIzFonda) {
        const date = data.datumPreuzimanjaIzFonda instanceof Date ? data.datumPreuzimanjaIzFonda : new Date(data.datumPreuzimanjaIzFonda);
        parts.push(`Datum preuzimanja iz fonda: ${formatDate(date)}`);
      }
      if (data.datumDostavjanjaUpravi) {
        const date = data.datumDostavjanjaUpravi instanceof Date ? data.datumDostavjanjaUpravi : new Date(data.datumDostavjanjaUpravi);
        parts.push(`Datum dostavljanja upravi: ${formatDate(date)}`);
      }
      if (data.napomena) parts.push(`Napomena: ${data.napomena}`);
      return parts.join("\n");
    }
    
    return "";
  };

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
      formData?: any;
    }> = [];

    // Get the item - use selectedReport if in read-only mode, otherwise use first item from data
    const item = readOnly && selectedReport 
      ? selectedReport 
      : (filteredAndSortedData[0] || { id: 1, firma: "", datum: new Date() });

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
        const currentFormData = formData[question.key] || (readOnly && selectedReport ? 
          (question.key === "promenaRadnihMestaZaposlenih" ? selectedReport.formaPromenaRadnihMesta :
           question.key === "promenaRadneSnage" ? selectedReport.formaPromenaRadneSnage :
           question.key === "novaSredstvaZaRad" ? selectedReport.formaNovaSredstvaZaRad :
           question.key === "povredaNaRadu" ? selectedReport.formaPovredaNaRadu : null) : null);
        
        rows.push({
          id: `form-${question.key}`,
          reportId: item.id,
          firma: "",
          datum: new Date(0),
          pitanje: `Forma: ${question.label}`,
          odgovor: isKomitent && currentFormData ? formatFormData(question.key, currentFormData) : "Forma je popunjena",
          napomena: "",
          napomenaBZR: "",
          isQuestion: false,
          questionType: "form",
          questionKey: question.key,
          formData: currentFormData,
        });
      }
      
    });

    // Add general notes rows after all questions
    rows.push({
      id: 'napomena-general',
      reportId: item.id,
      firma: "",
      datum: new Date(0),
      pitanje: "Napomena",
      odgovor: null,
      napomena: napomena,
      napomenaBZR: "",
      isQuestion: false,
      questionType: "generalNote",
      questionKey: "napomena",
    });

    // Add "Napomena za BZR" for all users
    rows.push({
      id: 'napomena-bzr',
      reportId: item.id,
      firma: "",
      datum: new Date(0),
      pitanje: "Napomena za BZR",
      odgovor: null,
      napomena: "",
      napomenaBZR: napomenaBZR,
      isQuestion: false,
      questionType: "generalNote",
      questionKey: "napomenaBZR",
    });

    return rows;
  }, [filteredAndSortedData, answers, napomenaValues, personName, questions, savedForms, readOnly, selectedReport, napomena, napomenaBZR, isKomitent, formData]);

  // Display all data without pagination
  const currentTransformedData = transformedData;

  // Get today's date
  const today = useMemo(() => new Date(), []);

  // Expose print and PDF functions via ref
  useImperativeHandle(ref, () => ({
    handlePrint,
    handleDownloadPDF,
  }));

  // Validate that all questions have been answered
  const validateAllAnswers = (): { isValid: boolean; missingAnswers: string[] } => {
    const missingAnswers: string[] = [];
    
    // Check if person name is provided (for BZR kontrola)
    if (!personName || personName.trim() === "") {
      missingAnswers.push("Svakodnevna kontrola stanja BZR i komunikacija sa");
    }
    
    questions.forEach((question) => {
      // All questions need an answer (DA or NE)
      const answer = answers[question.key];
      if (answer === null || answer === undefined) {
        missingAnswers.push(question.label);
      } else if (answer === true) {
        // If answer is DA, check additional requirements
        if (question.type === "form") {
          // Form questions need the form to be saved
          if (!savedForms[question.key]) {
            missingAnswers.push(`${question.label} (forma nije popunjena)`);
          }
        } else if (question.type === "napomena") {
          // Napomena questions need napomena text when DA
          const napomenaValue = napomenaValues[question.key] || "";
          if (!napomenaValue || napomenaValue.trim() === "") {
            missingAnswers.push(`${question.label} (napomena nije uneta)`);
          }
        }
      }
    });
    
    return {
      isValid: missingAnswers.length === 0,
      missingAnswers
    };
  };

  // Handle save button click
  const handleSave = () => {
    // Validate all answers
    const validation = validateAllAnswers();
    if (!validation.isValid) {
      alert(`Molimo popunite sva polja pre čuvanja:\n\n${validation.missingAnswers.join('\n')}`);
      return;
    }

    if (!onSave || !selectedCompany) {
      return;
    }

    // Get today's date
    const today = new Date();

    // Build the report data object
    const reportData: DnevniIzvestajiData = {
      id: initialData.length > 0 ? Math.max(...initialData.map(r => r.id)) + 1 : 1,
      firma: selectedCompany.naziv,
      datum: today,
      svakodnevnaKontrolaBZR: true,
      osobaZaSaradnju: personName,
      promeneAPR: answers["promeneAPR"] || false,
      napomenaPromeneAPR: napomenaValues["promeneAPR"] || "",
      promenaPoslovaRadnihZadataka: answers["promenaPoslovaRadnihZadataka"] || false,
      napomenaPromenaPoslova: napomenaValues["promenaPoslovaRadnihZadataka"] || "",
      promenaRadnihMestaZaposlenih: answers["promenaRadnihMestaZaposlenih"] || false,
      formaPromenaRadnihMesta: formData["promenaRadnihMestaZaposlenih"] || null,
      promenaRadneSnage: answers["promenaRadneSnage"] || false,
      formaPromenaRadneSnage: formData["promenaRadneSnage"] || null,
      novaSredstvaZaRad: answers["novaSredstvaZaRad"] || false,
      formaNovaSredstvaZaRad: formData["novaSredstvaZaRad"] || null,
      stazeZaKomunikacijuBezbedne: answers["stazeZaKomunikacijuBezbedne"] || false,
      napomenaStazeZaKomunikaciju: napomenaValues["stazeZaKomunikacijuBezbedne"] || "",
      planiranePopravkeRemont: answers["planiranePopravkeRemont"] || false,
      napomenaPlaniranePopravke: napomenaValues["planiranePopravkeRemont"] || "",
      koriscenjeLZS: answers["koriscenjeLZS"] || false,
      napomenaKoriscenjeLZS: napomenaValues["koriscenjeLZS"] || "",
      novaGradilistaNoviPogoni: answers["novaGradilistaNoviPogoni"] || false,
      napomenaNovaGradilista: napomenaValues["novaGradilistaNoviPogoni"] || "",
      povredaNaRadu: answers["povredaNaRadu"] || false,
      formaPovredaNaRadu: formData["povredaNaRadu"] || null,
      potencijalniRizici: answers["potencijalniRizici"] || false,
      napomenaPotencijalniRizici: napomenaValues["potencijalniRizici"] || "",
      napomena: napomena,
      napomenaBZR: napomenaBZR,
      pregledan: false,
      napomenaAdmin: "",
    };

    onSave(reportData);
  };

  // Get answer display text for a question
  const getAnswerDisplayText = (row: typeof currentTransformedData[0]): string => {
    if (!row.isQuestion) {
      // For napomena rows, show the napomena text
      if (row.pitanje.startsWith("Napomena:")) {
        return row.napomena || "-";
      }
      // For general notes
      if (row.questionType === "generalNote") {
        return row.questionKey === "napomena" ? (row.napomena || "-") : (row.napomenaBZR || "-");
      }
      // For form rows, show the form indicator
      if (row.pitanje.startsWith("Forma:")) {
        return row.odgovor as string || "Forma je popunjena";
      }
      return "";
    }
    
    if (row.odgovor === true) {
      return "DA";
    } else if (row.odgovor === false) {
      return "NE";
    }
    
    return "-";
  };

  const handlePrint = () => {
    // Validate all answers
    const validation = validateAllAnswers();
    if (!validation.isValid) {
      alert(`Molimo popunite sva polja pre štampanja:\n\n${validation.missingAnswers.join('\n')}`);
      return;
    }

    // Build table rows HTML
    let tableRowsHtml = '';
    currentTransformedData.forEach((row) => {
      const answerText = getAnswerDisplayText(row);
      const isNapomenaRow = row.pitanje.startsWith("Napomena:");
      
      tableRowsHtml += `
        <tr>
          <td style="border: 1px solid #000; padding: ${isNapomenaRow ? '4px 6px' : '3px 6px'}; font-size: ${isNapomenaRow ? '9px' : '10px'}; vertical-align: top; ${isNapomenaRow ? 'font-style: italic;' : ''} width: 60%; line-height: 1.2;">
            ${row.pitanje}
          </td>
          <td style="border: 1px solid #000; padding: ${isNapomenaRow ? '4px 6px' : '3px 6px'}; font-size: ${isNapomenaRow ? '9px' : '10px'}; text-align: ${isNapomenaRow ? 'left' : 'center'}; vertical-align: top; white-space: pre-wrap; word-wrap: break-word; width: 40%; line-height: 1.2;">
            ${answerText}
          </td>
        </tr>
      `;
    });

    // Create full HTML document for printing
    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Dnevni Izveštaj</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 8px;
            color: #000;
            font-size: 10px;
          }
          .header {
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #000;
          }
          .header-row {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0;
            page-break-inside: avoid;
          }
          thead {
            display: table-header-group;
          }
          tbody {
            display: table-row-group;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th {
            border: 1px solid #000;
            padding: 6px;
            background-color: #f5f5f5;
            font-weight: bold;
            font-size: 11px;
          }
          th:first-child {
            text-align: left;
            width: 60%;
          }
          th:last-child {
            text-align: center;
            width: 40%;
          }
          @page {
            size: A4 landscape;
            margin: 0.3in;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-row">
            <div>
              <div><strong>Nadležno preduzeće:</strong> ${nadleznoPreduzece}</div>
              <div><strong>Preduzeće:</strong> ${selectedCompany?.naziv || ''}</div>
              <div><strong>Svakodnevna kontrola stanja BZR i komunikacija sa:</strong> ${readOnly && selectedReport ? (selectedReport.osobaZaSaradnju || personName || '-') : (personName || '-')}</div>
            </div>
            <div><strong>Datum:</strong> ${readOnly && selectedReport ? formatDate(selectedReport.datum) : formatDate(today)}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Pitanje</th>
              <th>Odgovor</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position: absolute; width: 0; height: 0; border: none;';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printHtml);
      iframeDoc.close();

      // Wait for content to load then print
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        // Clean up after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    }
  };

  const handleDownloadPDF = async () => {
    // Validate all answers
    const validation = validateAllAnswers();
    if (!validation.isValid) {
      alert(`Molimo popunite sva polja pre preuzimanja PDF-a:\n\n${validation.missingAnswers.join('\n')}`);
      return;
    }

    // Build table rows HTML (same as print)
    let tableRowsHtml = '';
    currentTransformedData.forEach((row) => {
      const answerText = getAnswerDisplayText(row);
      const isNapomenaRow = row.pitanje.startsWith("Napomena:");
      const isGeneralNote = row.questionType === "generalNote";
      
      tableRowsHtml += `
        <tr>
          <td style="border: 1px solid #000; padding: ${isNapomenaRow || isGeneralNote ? '4px 6px' : '3px 6px'}; font-size: ${isNapomenaRow || isGeneralNote ? '9px' : '10px'}; vertical-align: top; ${isNapomenaRow ? 'font-style: italic;' : ''} width: 60%; line-height: 1.2;">
            ${row.pitanje}
          </td>
          <td style="border: 1px solid #000; padding: ${isNapomenaRow || isGeneralNote ? '4px 6px' : '3px 6px'}; font-size: ${isNapomenaRow || isGeneralNote ? '9px' : '10px'}; text-align: ${isNapomenaRow || isGeneralNote ? 'left' : 'center'}; vertical-align: top; white-space: pre-wrap; word-wrap: break-word; width: 40%; line-height: 1.2;">
            ${answerText}
          </td>
        </tr>
      `;
    });

    // Calculate proper width for A4 landscape (11.69in - 0.6in margins = 11.09in = ~1055px at 96dpi)
    const a4LandscapeWidth = 1055;
    
    // Create PDF container as a visible div element, centered
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-export-container';
    pdfContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${a4LandscapeWidth}px;
      min-height: 800px;
      background: white;
      padding: 8px;
      font-family: Arial, sans-serif;
      font-size: 10px;
      color: #000;
      z-index: 99999;
      visibility: visible;
      opacity: 1;
      box-sizing: border-box;
    `;
    pdfContainer.innerHTML = `
      <div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #000;">
        <div style="display: flex; justify-content: space-between; font-size: 10px;">
          <div>
            <div><strong>Nadležno preduzeće:</strong> ${nadleznoPreduzece}</div>
            <div><strong>Preduzeće:</strong> ${selectedCompany?.naziv || ''}</div>
            <div><strong>Svakodnevna kontrola stanja BZR i komunikacija sa:</strong> ${readOnly && selectedReport ? (selectedReport.osobaZaSaradnju || personName || '-') : (personName || '-')}</div>
          </div>
          <div><strong>Datum:</strong> ${readOnly && selectedReport ? formatDate(selectedReport.datum) : formatDate(today)}</div>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 0; table-layout: fixed;">
        <colgroup>
          <col style="width: 60%;">
          <col style="width: 40%;">
        </colgroup>
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 6px; text-align: left; background-color: #f5f5f5; font-weight: bold; font-size: 11px;">Pitanje</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: center; background-color: #f5f5f5; font-weight: bold; font-size: 11px;">Odgovor</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    `;

    document.body.appendChild(pdfContainer);

    // Wait for DOM to fully render
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const opt = {
        margin: 0.3,
        filename: `dnevni-izvestaj-${formatDate(today).replace(/\./g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: a4LandscapeWidth,
          height: pdfContainer.scrollHeight,
          x: 0,
          y: 0
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'landscape' 
        }
      };

      await html2pdf().set(opt).from(pdfContainer).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Greška pri generisanju PDF-a. Molimo pokušajte ponovo.');
    } finally {
      // Clean up
      if (pdfContainer.parentNode) {
        document.body.removeChild(pdfContainer);
      }
    }
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-[#1D2939] shadow-theme-sm" ref={tableRef}>
      <div className="flex flex-col gap-4 px-4 py-4">
        {/* Display Nadležno preduzeće, Preduzeće, BZR kontrola, and Datum with Print/PDF buttons */}
        {selectedCompany && (
          <div className="flex flex-col gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Nadležno preduzeće:</span>
                  <span className="text-gray-600 dark:text-gray-400">{nadleznoPreduzece}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Preduzeće:</span>
                  <span className="text-gray-600 dark:text-gray-400">{selectedCompany.naziv}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Svakodnevna kontrola stanja BZR i komunikacija sa:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {readOnly && selectedReport 
                      ? (selectedReport.osobaZaSaradnju || personName || "-")
                      : (personName || "-")
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Datum:</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {readOnly && selectedReport ? formatDate(selectedReport.datum) : formatDate(today)}
                  </span>
                </div>
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
                        <div className="relative flex items-center justify-center">
                          {readOnly ? (
                            <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                              {row.odgovor === true ? "DA" : row.odgovor === false ? "NE" : "-"}
                            </span>
                          ) : (
                            <>
                              <div ref={(el) => {
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
                            </>
                          )}
                        </div>
                      ) : row.pitanje.startsWith("Napomena:") ? (
                        readOnly ? (
                          <div className="text-left">
                            <span className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap">
                              {row.napomena || "-"}
                            </span>
                          </div>
                        ) : (
                          <textarea
                            value={row.napomena}
                            onChange={(e) => handleNapomenaChange(row.questionKey, e.target.value)}
                            placeholder="Unesite napomenu..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm min-h-[80px] resize-y"
                          />
                        )
                      ) : row.questionType === "generalNote" ? (
                        // For "Napomena za BZR" in readOnly mode (admin viewing, not Komitent), make it editable
                        // For regular "Napomena", show read-only in readOnly mode
                        // For Komitent, always show read-only
                        readOnly && row.questionKey === "napomenaBZR" && !isKomitent ? (
                          <textarea
                            value={row.napomenaBZR}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setNapomenaBZR(newValue);
                              if (onNapomenaBZRChange && selectedReport) {
                                onNapomenaBZRChange(selectedReport.id, newValue);
                              }
                            }}
                            placeholder="Unesite napomenu za BZR..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm min-h-[100px] resize-y"
                          />
                        ) : readOnly || isKomitent ? (
                          <div className="text-left">
                            <span className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap">
                              {row.questionKey === "napomena" ? (row.napomena || "-") : (row.napomenaBZR || "-")}
                            </span>
                          </div>
                        ) : (
                          <textarea
                            value={row.questionKey === "napomena" ? row.napomena : row.napomenaBZR}
                            onChange={(e) => handleGeneralNapomenaChange(row.questionKey, e.target.value)}
                            placeholder="Unesite napomenu..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm min-h-[80px] resize-y"
                          />
                        )
                      ) : row.pitanje.startsWith("Forma:") ? (
                        <div className="text-left">
                          {isKomitent && row.odgovor && typeof row.odgovor === "string" && row.odgovor !== "Forma je popunjena" ? (
                            <div className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap">
                              {row.odgovor}
                            </div>
                          ) : (
                            <span className="text-blue-600 dark:text-blue-400 font-medium">Forma je popunjena</span>
                          )}
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

      {/* Admin Review Section - Only Pregledan checkbox (only for admins) */}
      {readOnly && selectedReport && !isKomitent && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#11181E]">
          <Checkbox
            id="pregledan-checkbox"
            label="Pregledan"
            checked={pregledan}
            onChange={(checked) => {
              setPregledan(checked);
              if (onPregledanChange && selectedReport) {
                onPregledanChange(selectedReport.id, checked);
              }
            }}
          />
        </div>
      )}

      {/* Save Button Section - Only for komitent when creating new report */}
      {!readOnly && isKomitent && onSave && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#11181E] flex justify-end">
          <Button onClick={handleSave}>
            Sačuvaj izveštaj
          </Button>
        </div>
      )}

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
});

DnevniIzvestajiDataTable.displayName = 'DnevniIzvestajiDataTable';

export default DnevniIzvestajiDataTable;

