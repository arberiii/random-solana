import { useEffect, useRef } from "react";
import { useWallet } from '@solana/wallet-adapter-react';

interface UserRank {
  rank: number;
  address: string;
  totalSwaps: number;
}

interface RankingSidebarProps {
  rankings: UserRank[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RankingSidebar({ rankings, isOpen, setIsOpen }: RankingSidebarProps) {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58();
  
  const handleAddressClick = (address: string) => {
    window.open(`https://solscan.io/account/${address}`, '_blank');
  };
  
  // Find user's rank if they exist in rankings
  const userRanking = rankings.find(rank => rank.address === walletAddress);
  
  return (
    <div className={`fixed left-0 top-[72px] bottom-[57px] transition-all duration-300 ease-in-out ${isOpen ? 'w-72' : 'w-12'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-base-200 p-2 rounded-r-lg shadow-lg hover:bg-base-300 transition-colors duration-200"
      >
        {isOpen ? 
          <span className="text-xl">‹</span> : 
          <span className="text-xl">›</span>
        }
      </button>
      
      <div className={`h-full bg-base-200 shadow-lg border-r border-base-300 overflow-hidden ${isOpen ? 'p-4' : 'p-0'}`}>
        {isOpen && (
          <>
            <h3 className="text-xl font-bold mb-4 text-accent">Top Traders</h3>
            
            {/* Current User's Stats */}
            <div className="mb-4">
              <div 
                className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border-2 border-accent cursor-pointer hover:bg-accent/20"
                onClick={() => walletAddress && handleAddressClick(walletAddress)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-accent">
                    {userRanking ? `#${userRanking.rank}` : '---'}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">Your Position</span>
                    <span className="font-medium text-xs opacity-70">
                      {walletAddress 
                        ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                        : 'Not Connected'
                      }
                    </span>
                  </div>
                </div>
                <span className="text-sm text-base-content/70">
                  {userRanking ? `${userRanking.totalSwaps} swaps` : '0 swaps'}
                </span>
              </div>
            </div>

            <div className="border-t border-base-300 my-4"></div>
            
            <div className="space-y-2 overflow-y-auto h-[calc(100%-12rem)]">
              {rankings.map((user, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer
                    ${user.address === walletAddress 
                      ? 'bg-accent/10 border border-accent' 
                      : 'bg-base-100 hover:bg-base-300'
                    }`}
                  onClick={() => handleAddressClick(user.address)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-accent">#{user.rank}</span>
                    <span className="font-medium">
                      {user.address.slice(0, 4)}...{user.address.slice(-4)}
                    </span>
                  </div>
                  <span className="text-sm text-base-content/70">
                    {user.totalSwaps} swaps
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