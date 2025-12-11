"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Campaign } from "@/lib/types";
import { mockCampaigns } from "@/lib/mock-data";

interface CampaignContextType {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]); // Newest first
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  return (
    <CampaignContext.Provider value={{ campaigns, addCampaign, updateCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaigns must be used within a CampaignProvider");
  }
  return context;
}
