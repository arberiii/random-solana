'use client';

import { AppHero } from '../ui/ui-layout';
import {useEffect, useState, useRef} from "react";
import { coins } from "./coins";

import "@jup-ag/terminal/css";
import dynamic from 'next/dynamic';
import { AccountButtons } from './actions';
import { MemeCoin } from './types';
import { useWallet } from '@solana/wallet-adapter-react';
const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), { ssr: false, });
import { SidebarContext } from './SidebarContext';
import { RankingSidebar } from './RankingSidebar';
import { CoinListSidebar } from './CoinListSidebar';

function SpinResult({ memeCoin }: { memeCoin: MemeCoin | null }) {
  if (!memeCoin || !memeCoin.name || !memeCoin.iconUrl) {
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

const getRandomMemes = (seed: number, size: number) => {
  const randomMemes = new Set();
  let i = 0;
  while (randomMemes.size < size && i < coins.length * 2) {
    const meme = getRandomMeme(seed + i);
    if (meme?.name) {
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

export default function DashboardFeature() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState<number | null>(null);
  const [memeCoin, setMemeCoin] = useState<MemeCoin | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [isRankingSidebarOpen, setIsRankingSidebarOpen] = useState(true);
  const [isCoinListOpen, setIsCoinListOpen] = useState(true);

  // this is necessary to close the modal 
  const [randomMemes, setRandomMemes] = useState(() => {
    const seed = new Date().setHours(0, 0, 0, 0);
    return getRandomMemes(seed, 200);
  });

  const data = randomMemes.map((meme: any) => ({
    // option: shortenName(meme.name),
    // image: {
    //   uri: meme.iconUrl,
    //   sizeMultiplier: 0.5,
    //   offsetY: 200,
    // },
  }))
  
  const backgroundColors = randomMemes.map((meme: any) => meme.color);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  useEffect(() => {
    if (prizeNumber !== null && !mustSpin) {
      setMemeCoin(randomMemes[prizeNumber] as MemeCoin);
      setShowSendModal(true);
    }
  }, [randomMemes, prizeNumber, mustSpin]);

  // Mock data for rankings - replace with real data later
  const mockRankings = [
    { rank: 1, address: "0x1234567890abcdef", totalSwaps: 150 },
    { rank: 2, address: "0xabcdef1234567890", totalSwaps: 120 },
    { rank: 3, address: "0x9876543210fedcba", totalSwaps: 90 },
    // Add more mock data as needed
  ];

  return (
    <SidebarContext.Provider value={{ isOpen: isCoinListOpen, setIsOpen: setIsCoinListOpen }}>
      <div className="relative pr-[3rem] pl-[3rem]">
        <AppHero title="Meme Coin Madness" subtitle="Because picking a meme coin is totally a sound financial strategy!" />
        <div className="max-w-xl mx-auto py-0 sm:px-0 lg:px-4 text-center">
          <div className="space-y-2 py-4">
            {memeCoin && <AccountButtons memeCoin={memeCoin} showSendModal={showSendModal} setShowSendModal={setShowSendModal} />}
            <>
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber || 0}
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
              {!mustSpin && prizeNumber !== null ? <SpinResult memeCoin={randomMemes[prizeNumber] as MemeCoin} /> : null}
            </>
          </div>
        </div>
        
        <RankingSidebar 
          rankings={mockRankings}
          isOpen={isRankingSidebarOpen}
          setIsOpen={setIsRankingSidebarOpen}
        />
        <CoinListSidebar 
          coins={randomMemes as MemeCoin[]} 
          selectedCoin={memeCoin}
          isOpen={isCoinListOpen}
          setIsOpen={setIsCoinListOpen}
        />
      </div>
    </SidebarContext.Provider>
  );
}
