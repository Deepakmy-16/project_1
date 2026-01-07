// Frontend crop data management
import { getCropImage } from "./cropImages";

export interface CropData {
  id: string;
  name: string;
  nameHi: string;
  nameKn: string;
  nameTa: string;
  nameTe: string;
  category?: string;
  presentPrice: number;
  previousPrice: number;
  imageUrl: string;
  monthlyData: Array<{ month: string; price: number }>;
}

// This will be populated from the API
// For now, export empty array as data will come from server
export const mockCrops: CropData[] = [];

// Helper function to add image URL to crop data from server
export function addImageUrlToCrop(crop: any): CropData {
  return {
    ...crop,
    imageUrl: getCropImage(crop.id),
  };
}

// Helper to add images to all crops
export function addImageUrlsToCrops(crops: any[]): CropData[] {
  return crops.map(addImageUrlToCrop);
}
