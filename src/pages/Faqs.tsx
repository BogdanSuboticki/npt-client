import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import FaqsTwo from "../components/UiExample/FaqsExample/FaqsTwo";
import PageMeta from "../components/common/PageMeta";

const faqSections = [
  "Opšte informacije",
  "Prijava i nalog",
  "Podsetnici i obaveštenja",
  "Izveštaji i praćenje",
  "Tehnička podrška",
  "Podešavanja naloga",
  "Administratorske funkcije",
  "Bezbednosna politika i zaštita podataka",
  "Često postavljana pitanja",
  "Kontakt i podrška",
];

export default function Faqs() {
  return (
    <>
      <PageMeta
        title="Često postavljena pitanja | HSE Radar"
        description="Često postavljena pitanja i odgovori o HSE Radar aplikaciji"
      />
      <PageBreadcrumb pageTitle="Često postavljena pitanja" />
      <div className="space-y-5 sm:space-y-6">
        {faqSections.map((title) => (
          <ComponentCard key={title} title={title}>
            <FaqsTwo title={title} />
          </ComponentCard>
        ))}
      </div>
    </>
  );
}
