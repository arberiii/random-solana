import { createContext, useContext } from 'react';

type SidebarContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const SidebarContext = createContext<SidebarContextType>({ 
  isOpen: true,
  setIsOpen: () => {} 
});

export const useSidebarContext = () => useContext(SidebarContext); 