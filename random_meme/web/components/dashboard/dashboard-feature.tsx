'use client';

import { AppHero } from '../ui/ui-layout';
import { Wheel } from "react-custom-roulette";
import {useState} from "react";
import { coins } from "./coins";

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

  const getTenRandomMemes = () => {
    const randomMemes = [];
    for (let i = 0; i < 10; i++) {
      randomMemes.push(getRandomMeme());
    }
    return randomMemes;
  }

  const getRandomMeme = () => {
    const randomIndex = Math.floor(Math.random() * coins.length);
    return coins[randomIndex];
  }

  const shortenName = (name: string) => {
    return name.length > 10 ? name.substring(0, 10) + "..." : name;
  }

  const getCurrentDateKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  const [randomMemes, setRandomMemes] = useState(() => {
    const storedDateKey = localStorage.getItem('dateKey');
    const currentDateKey = getCurrentDateKey();
    if (storedDateKey === currentDateKey) {
      const storedMemes = localStorage.getItem('randomMemes');
      return storedMemes ? JSON.parse(storedMemes) : getTenRandomMemes();
    } else {
      const newRandomMemes = getTenRandomMemes();
      localStorage.setItem('dateKey', currentDateKey);
      localStorage.setItem('randomMemes', JSON.stringify(newRandomMemes));
      return newRandomMemes;
    }
  });

  const data = randomMemes.map((meme: any) => ({
    option: shortenName(meme.name),
    image: {
      uri: meme.iconUrl,
      sizeMultiplier: 0.5,
    },
    color: meme.color,
  }));

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
            {!mustSpin ? <SpinResult memeCoin={randomMemes[prizeNumber]} /> : "0"}
          </>
        </div>
      </div>
    </div>
  );
}
