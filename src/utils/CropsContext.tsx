import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { projectId, publicAnonKey } from "./supabase/info";
import { addImageUrlsToCrops, type CropData } from "./cropData";

interface CropsContextType {
  crops: CropData[];
  loading: boolean;
  refreshCrops: () => Promise<void>;
}

const CropsContext = createContext<CropsContextType | undefined>(undefined);

export function CropsProvider({ children }: { children: ReactNode }) {
  const [crops, setCrops] = useState<CropData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0b8d9661/crops`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Add image URLs to crops from our image library
        const cropsWithImages = addImageUrlsToCrops(data.crops || []);
        setCrops(cropsWithImages);
      } else {
        console.error("Failed to fetch crops");
      }
    } catch (error) {
      console.error("Error fetching crops:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const refreshCrops = async () => {
    await fetchCrops();
  };

  return (
    <CropsContext.Provider value={{ crops, loading, refreshCrops }}>
      {children}
    </CropsContext.Provider>
  );
}

export function useCrops() {
  const context = useContext(CropsContext);
  if (context === undefined) {
    throw new Error("useCrops must be used within a CropsProvider");
  }
  return context;
}
