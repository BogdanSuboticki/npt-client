import React from 'react';
import CardIconTwo from '../components/cards/card-with-icon/CardIconTwo';

const cards = [
  



  {
    title: "Evidencija o povredama na radu",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum",
    link: "/evidencija-povreda-rad"
  },
  {
    title: "Evidencija o profesionalnim bolestima",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum",
    link: "/evidencija-profesionalne-bolesti"
  },
  {
    title: "Evidencija o zaposlenima izloženim biološkim štetnostima grupe 3/4",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum",
    link: "/bioloske-stetnosti"
  },
  {
    title: "Evidencija o radnim mestima sa povećanim rizikom, zaposlenima koji obavljaju poslove na radnim mestima sa povećanim rizikom i lekarskim pregledima zaposlenih koji obavljaju te poslove",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum",
    link: "/evidencija-rizicna-radna-mesta"
  },
  {
    title: "Evidencija zaposlenima koji su izloženi karcinogenima i mutagenima, hemijskim materijama i azbestu, kao i zdravstvenom stanju i izloženosti",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum",
    link: "/karcinogeni-mutageni"
  },  
  {
    title: "Evidencija o primeni mera za bezbednost i zdravlje na radu iz člana 48. zakona o bezbednosti zdravlja na radu",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum",
    link: "/mere-bezbednost"
  },
  {
    title: "Evidencija o zaposlenima obučenim za bezbedan i zdrav rad i pravilno korišćenje zaštitne opreme",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum",
    link: "/obuka-zastitna-oprema"
  },

  {
    title: "Evidencija o izvršenim pregledima i proverama opreme za rad",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum",
    link: "/pregledi-opreme"
  },
  {
    title: "Evidencija o izvršenim pregledima i ispitivanjima električnih i gromobranskih instalacija",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum",
    link: "/elektricne-instalacije"
  },
  {
    title: "Evidencija o izvršenim ispitivanjima uslova radne sredine",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum",
    link: "/ispitivanja-sredine"
  },
  {
    title: "Evidencija o izdatoj ličnoj zaštitnoj opremi",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum",
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