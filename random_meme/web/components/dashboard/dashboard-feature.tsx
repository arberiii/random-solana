'use client';

import { AppHero } from '../ui/ui-layout';
import { Wheel } from "react-custom-roulette";
import {useState} from "react";

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  {
    label: 'Solana Developers GitHub',
    href: 'https://github.com/solana-developers/',
  },
];
const data = [
  { option: "iPhone" },
  { option: "Smart TV" },
  { option: "Car" },
  { option: "Hose" },
  { option: "Computer" },
  { option: "Travel" },
  { option: "Free Store" },
  { option: "Palabras cortas" },
  { option: "Sin premio" }
];

export default function DashboardFeature() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };


  return (
    <div>
      <AppHero title="gm" subtitle="Say hi to your new Solana dApp." />
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">

        <div className="space-y-2">
          <p>Here are some helpful links to get you started.</p>
          <>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              outerBorderColor={"#f2f2f2"}
              outerBorderWidth={10}
              innerBorderColor={"#f2f2f2"}
              radiusLineColor={"#dedede"}
              radiusLineWidth={1}
              fontSize={15}
              textColors={["#ffffff"]}
              backgroundColors={[
                "#F22B35",
                "#F99533",
                "#24CA69",
                "#514E50",
                "#46AEFF",
                "#9145B7"
              ]}
              onStopSpinning={() => {
                setMustSpin(false);
                console.log(data[prizeNumber]);
              }}
            />
            <button
              className="btn btn-xs lg:btn-md btn-primary"
              onClick={handleSpinClick}
            >
              SPIN
            </button>
            <br/>
            <br/>
            {!mustSpin ? data[prizeNumber].option : "0"}
          </>

          <br/>
          <br/>
          <br/>
          {links.map((link, index) => (
            <div key={index}>
              <a
                href={link.href}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
