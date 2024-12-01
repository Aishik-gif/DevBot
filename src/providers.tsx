"use client"
import React, { createContext, useContext } from 'react';
import { useWebContainer } from './hooks/useWebContainer';
import { WebContainer } from '@webcontainer/api';

export const WebContainerContext = createContext<WebContainer | undefined>(undefined);
const ContainerContext = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  const webContainer = useWebContainer();
  return (
    <WebContainerContext.Provider value={webContainer}>
      {children}
    </WebContainerContext.Provider>
  )
}

export default ContainerContext;