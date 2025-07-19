import React from 'react';
import CardIconTwo from '../components/cards/card-with-icon/CardIconTwo';

const cards = [
  

  {
    title: "Obrazac 1",
    description: "Evidencija o radnim mestima sa povećanim rizikom, zaposlenima koji obavljaju poslove na radnim mestima sa povećanim rizikom i lekarskim pregledima zaposlenih koji obavljaju te poslove",
    link: "/evidencija-rizicna-radna-mesta"
  },

  {
    title: "Obrazac 2",
    description: "Evidencija o povredama na radu",
    link: "/evidencija-povreda-rad"
  },
  {
    title: "Obrazac 3",
    description: "Evidencija o profesionalnim bolestima",
    link: "/evidencija-profesionalne-bolesti"
  },    
  {
    title: "Obrazac 4",
    description: "Evidencija o zaposlenima izloženim biološkim štetnostima grupe 3/4",
    link: "/evidencija-biloske-stetnosti"
  },
  {
    title: "Obrazac 5",
    description: "Evidencija o zaposlenima koji su izloženi kancerogenima ili mutagenima, hemijskim materijama i azbestu, kao i o zdravstvenom stanju i izloženosti",
    link: "/evidencija-kancerogeni-mutageni"
  }, 
  {
    title: "Obrazac 6",
    description: "Evidencija o zaposlenima obučenim za bezbedan i zdrav rad i pravilno korišćenje lične zaštitne opreme",
    link: "/evidencija-obuceni-bezbedan"
  },
  {
    title: "Obrazac 7",
    description: "Evidencija o primeni mera za bezbednost i zdravlje na radu za delatnosti iz člana 48. zakona o bezbednosti i zdravlju na radu.",
    link: "/evidencija-primena-mera"
  },
  {
    title: "Obrazac 8",
    description: "Evidencija o izvršenim pregledima i proverama opreme za rad",
    link: "/evidencija-pregledi-opreme"
  },
  {
    title: "Obrazac 9",
    description: "Evidencija o izvršenim pregledima i ispitivanjima električnih i gromobranskih instalacija",
    link: "/elektricne-instalacije"
  },
  {
    title: "Obrazac 10",
    description: "Evidencija o izvršenim ispitivanjima uslova radne sredine",
    link: "/ispitivanja-sredine"
  },
  {
    title: "Obrazac 11",
    description: "Evidencija o izdatoj ličnoj zaštitnoj opremi",
    link: "/zastitna-oprema"
  },





];

const Obrasci: React.FC = () => {
  return (
    <div className="">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Obrasci</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <CardIconTwo
            key={index}
            title={card.title}
            description={card.description}
            link={card.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Obrasci; 