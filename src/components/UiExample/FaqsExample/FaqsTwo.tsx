import { useState } from "react";
import FaqTwo from "../../faqs/FaqTwo";

type FaqData = {
  title: string;
  content: string;
}

const faqDataMap: Record<string, FaqData[]> = {};

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

  if (faqData.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Nema pitanja za prikaz.
      </div>
    );
  }

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
