"use client";

import { useAPI } from "@/hooks/useAPI";
import React, { createContext, useContext, ReactNode } from "react";

type APIContextType = ReturnType<typeof useAPI>;

const APIContext = createContext<APIContextType | null>(null);

export function APIProvider({ children }: { children: ReactNode }) {
  const data = useAPI();
  return <APIContext.Provider value={data}>{children}</APIContext.Provider>;
}

export function useAPIContext(): APIContextType {
  const ctx = useContext(APIContext);

  if (!ctx) {
    throw new Error("useAPIContext must be used within an APIProvider");
  }

  return ctx;
}