import { useState } from "react";
import FaqTwo from "../../faqs/FaqTwo";

type FaqData = {
  title: string;
  content: string;
}

const faqDataMap: Record<string, FaqData[]> = {
  "Opšte informacije": [
    {
      title: "Šta je HSE Radar?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Ko može koristiti HSE Radar?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Na kojim uređajima se može koristiti?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Da li je potrebna internet konekcija?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ],
  "Prijava i nalog": [
    {
      title: "Kako se prijavljujem u sistem?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Šta da radim ako sam zaboravio lozinku?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Da li mogu koristiti isti nalog na više uređaja?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kako da promenim lozinku?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ],
  "Podsetnici i obaveštenja": [
    {
      title: "Kako funkcionišu podsetnici?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kada se šalju obaveštenja?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Mogu li isključiti određene podsetnike?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Da li mogu dodati lične napomene?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ],
  "Izveštaji i praćenje": [
    {
      title: "Kako da vidim koje aktivnosti sam završio?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kako nadređeni prate učinak zaposlenih?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Mogu li izvesti podatke u Excel ili PDF?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Koliko dugo se čuvaju podaci o aktivnostima?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ],
  "Tehnička podrška": [
    {
      title: "Kome da se obratim ako aplikacija ne radi?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kako prijaviti grešku u sistemu?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Da li postoji korisnička podrška 24/7?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kako se vrši ažuriranje softvera?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ],
  "Podešavanja naloga": [
    {
      title: "Kako promeniti lične podatke?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Mogu li podesiti jezik aplikacije?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Da li mogu menjati obaveštenja koje primam?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kako da deaktiviram svoj nalog?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ],
  "Administratorske funkcije": [
    {
      title: "Kako dodati nove korisnike?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kako dodeliti ili ukloniti pristup?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kako pregledati aktivnosti svih korisnika?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kako generisati mesečni izveštaj?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ],
  "Bezbednosna politika i zaštita podataka": [
    {
      title: "Kako se čuvaju moji lični podaci?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Da li su moji podaci zaštićeni?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Ko ima pristup mojim informacijama?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kako se postupa u slučaju bezbednosnog incidenta?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ],
  "Često postavljana pitanja": [
    {
      title: "Zašto ne dobijam podsetnike?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kako se računaju rokovi za HSE aktivnosti?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Kako funkcioniše kategorizacija aktivnosti?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Mogu li se aktivnosti preneti na drugog zaposlenog?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ],
  "Kontakt i podrška": [
    {
      title: "Kako stupiti u kontakt sa podrškom?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Gde mogu pronaći korisničko uputstvo?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Postoji li trening za korišćenje softvera?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Da li postoji demo verzija?",
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ],
};

interface FaqsTwoProps {
  title: string;
}

export default function FaqsTwo({ title }: FaqsTwoProps) {
  const [openIndexFirstGroup, setOpenIndexFirstGroup] = useState<number | null>(null);
  const [openIndexSecondGroup, setOpenIndexSecondGroup] = useState<number | null>(null);

  const handleToggleFirstGroup = (index: number) => {
    setOpenIndexFirstGroup(openIndexFirstGroup === index ? null : index);
  };

  const handleToggleSecondGroup = (index: number) => {
    setOpenIndexSecondGroup(openIndexSecondGroup === index ? null : index);
  };

  const faqData = faqDataMap[title] || [];

  const renderFaqItems = (
    data: typeof faqData,
    openIndex: number | null,
    handleToggle: (index: number) => void
  ) =>
    data.map((item, index) => (
      <FaqTwo
        key={index}
        title={item.title}
        content={item.content}
        isOpen={openIndex === index}
        toggleAccordionTwo={() => handleToggle(index)}
      />
    ));

  return (
    <div className="grid gird-cols-1 gap-x-8 gap-y-5 xl:grid-cols-2">
      <div className="space-y-3">
        {renderFaqItems(
          faqData.slice(0, 2),
          openIndexFirstGroup,
          handleToggleFirstGroup
        )}
      </div>
      <div className="space-y-3">
        {renderFaqItems(
          faqData.slice(2, 4),
          openIndexSecondGroup,
          handleToggleSecondGroup
        )}
      </div>
    </div>
  );
}
