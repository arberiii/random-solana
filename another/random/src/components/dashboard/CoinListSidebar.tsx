import { useEffect, useRef } from "react";
import { MemeCoin } from "./types";

interface CoinListSidebarProps {
  coins: MemeCoin[];
  selectedCoin: MemeCoin | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CoinListSidebar({ coins, selectedCoin, isOpen, setIsOpen }: CoinListSidebarProps) {
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCoin && selectedRef.current && isOpen) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedCoin, isOpen]);

  const formatMarketCap = (marketCap: string) => {
    const num = parseInt(marketCap);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num}`;
  };

  const sortedCoins = [...coins].sort((a, b) => 
    parseInt(b.marketCap) - parseInt(a.marketCap)
  );

  const handleCoinClick = (contractAddress: string) => {
    const cleanAddress = contractAddress.replace('solana/', '');
    window.open(`https://dexscreener.com/solana/${cleanAddress}`, '_blank');
  };

  return (
    <div className={`fixed right-0 top-[72px] bottom-[57px] transition-all duration-300 ease-in-out ${isOpen ? 'w-72' : 'w-12'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-base-200 p-2 rounded-l-lg shadow-lg hover:bg-base-300 transition-colors duration-200"
      >
        {isOpen ? 
          <span className="text-xl">›</span> : 
          <span className="text-xl">‹</span>
        }
      </button>
      
      <div className={`h-full bg-base-200 shadow-lg border-l border-base-300 overflow-hidden ${isOpen ? 'p-4' : 'p-0'}`}>
        {isOpen && (
          <>
            <h3 className="text-xl font-bold mb-4 text-primary">Available Coins</h3>
            <div className="space-y-2 overflow-y-auto h-[calc(100%-3rem)]">
              {sortedCoins.map((coin, index) => (
                <div 
                  key={index}
                  ref={selectedCoin?.uuid === coin.uuid ? selectedRef : undefined}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer
                    ${selectedCoin?.uuid === coin.uuid 
                      ? 'bg-primary/20 border-2 border-primary' 
                      : 'bg-base-100 hover:bg-base-300'
                    }`}
                  onClick={() => coin.contractAddresses[0] && handleCoinClick(coin.contractAddresses[0])}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={coin.iconUrl} 
                      alt={coin.name} 
                      className="w-8 h-8 rounded-full border-2 border-base-300"
                    />
                    <span className="font-medium">{coin.name}</span>
                  </div>
                  <span className="text-sm text-base-content/70">
                    {formatMarketCap(coin.marketCap)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}