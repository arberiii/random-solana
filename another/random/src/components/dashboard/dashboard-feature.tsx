'use client';

import { AppHero } from '../ui/ui-layout';
import {useState} from "react";
import { coins } from "./coins";

import dynamic from 'next/dynamic';
const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), { ssr: false, });

function SpinResult({ memeCoin }: { memeCoin: any }) {
  if (!memeCoin || !memeCoin.name || !memeCoin.iconUrl) {
    console.error("Invalid memeCoin data:", memeCoin);
    return null;
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '10px', 
      borderRadius: '10px', 
      backgroundColor: '#f0f8ff', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      margin: '10px', 
      fontFamily: 'Arial, sans-serif', 
      fontSize: '1.2em', 
      color: '#333' 
    }}>
      <span style={{ marginRight: '10px', fontWeight: 'bold' }}>{memeCoin.name}</span>
      <img 
        src={memeCoin.iconUrl} 
        alt={`${memeCoin.name} icon`} 
        style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          border: '2px solid #ddd' 
        }} 
      />
    </div>
  );
}


export default function DashboardFeature() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const getTenRandomMemes = (seed: number) => {
    const randomMemes = new Set();
    let i = 0;
    while (randomMemes.size < 14 && i < coins.length * 2) { // Adding a safeguard to prevent infinite loop
      const meme = getRandomMeme(seed + i);
      if (meme.name) {
        randomMemes.add(meme);
      }
      i++;
    }
    return Array.from(randomMemes);
  }

  const getRandomMeme = (seed: number) => {
    const randomIndex = Math.floor((Math.sin(seed) * 10000) % coins.length);
    return coins[Math.abs(randomIndex)];
  }

  const shortenName = (name: string) => {
    return name.length > 10 ? name.substring(0, 10) + "..." : name;
  }

  const getCurrentDateKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  const [randomMemes, setRandomMemes] = useState(() => {
    const currentDateKey = getCurrentDateKey();
    const seed = new Date().setHours(0, 0, 0, 0);
    return getTenRandomMemes(seed);
  });

  const data = randomMemes.map((meme: any) => ({
    option: shortenName(meme.name),
    image: {
      uri: meme.iconUrl,
      sizeMultiplier: 0.5,
      offsetY: 200,
    },
  }));

  const backgroundColors = randomMemes.map((meme: any) => meme.color);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  return (
    <div>
      <AppHero title="Meme Coin Madness" subtitle="Because picking a meme coin is totally a sound financial strategy!" />
      <div className="max-w-xl mx-auto py-0 sm:px-0 lg:px-4 text-center">

        <div className="space-y-2 py-4">
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
              backgroundColors={backgroundColors}
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
            {!mustSpin ? <SpinResult memeCoin={randomMemes[prizeNumber]} /> : "0"}
          </>
        </div>
      </div>
    </div>
  );
}
