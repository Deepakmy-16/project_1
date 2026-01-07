import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { getTranslation, type Language } from "../utils/translations";
import { useCrops } from "../utils/CropsContext";
import { type CropData } from "../utils/cropData";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DashboardProps {
  language: Language;
  onCropClick: (cropId: string) => void;
}

export function Dashboard({ language, onCropClick }: DashboardProps) {
  const { crops, loading } = useCrops();
  const [displayCrops, setDisplayCrops] = useState<CropData[]>([]);

  useEffect(() => {
    if (crops.length > 0) {
      setDisplayCrops(crops);
    }
  }, [crops]);

  const t = (key: any) => getTranslation(language, key);

  const getCropName = (crop: CropData) => {
    switch (language) {
      case "hi":
        return crop.nameHi;
      case "kn":
        return crop.nameKn;
      case "ta":
        return crop.nameTa;
      case "te":
        return crop.nameTe;
      default:
        return crop.name;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const priceUpCrops = displayCrops.filter(
    (crop) => crop.presentPrice > crop.previousPrice
  );
  const priceDownCrops = displayCrops.filter(
    (crop) => crop.presentPrice < crop.previousPrice
  );

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-green-700">{t("priceUp")}</h3>
          </div>
          <p className="text-3xl text-green-700">{priceUpCrops.length}</p>
          <p className="text-green-600 mt-2">{t("crops")}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-500 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-600 rounded-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-red-700">{t("priceDown")}</h3>
          </div>
          <p className="text-3xl text-red-700">{priceDownCrops.length}</p>
          <p className="text-red-600 mt-2">{t("crops")}</p>
        </div>
      </div>

      {/* Price Up Crops */}
      {priceUpCrops.length > 0 && (
        <div>
          <h2 className="text-green-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            {t("priceUp")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priceUpCrops.map((crop) => {
              const priceChange = crop.presentPrice - crop.previousPrice;
              const percentChange =
                ((priceChange / crop.previousPrice) * 100).toFixed(2);

              return (
                <div
                  key={crop.id}
                  className="bg-white border-2 border-green-500 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onCropClick(crop.id)}
                >
                  <div className="h-48 overflow-hidden">
                    <ImageWithFallback
                      src={crop.imageUrl}
                      alt={getCropName(crop)}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-800 mb-2">{getCropName(crop)}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">
                        {t("presentPrice")}:
                      </span>
                      <span className="text-green-600">
                        ₹{crop.presentPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600">
                        {t("previousPrice")}:
                      </span>
                      <span className="text-gray-500">
                        ₹{crop.previousPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <span className="text-green-700">
                        +₹{priceChange} ({percentChange}%)
                      </span>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <button className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      {t("viewDetails")}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Down Crops */}
      {priceDownCrops.length > 0 && (
        <div>
          <h2 className="text-red-700 mb-4 flex items-center gap-2">
            <TrendingDown className="w-6 h-6" />
            {t("priceDown")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priceDownCrops.map((crop) => {
              const priceChange = crop.presentPrice - crop.previousPrice;
              const percentChange =
                ((priceChange / crop.previousPrice) * 100).toFixed(2);

              return (
                <div
                  key={crop.id}
                  className="bg-white border-2 border-red-500 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onCropClick(crop.id)}
                >
                  <div className="h-48 overflow-hidden">
                    <ImageWithFallback
                      src={crop.imageUrl}
                      alt={getCropName(crop)}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-800 mb-2">{getCropName(crop)}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">
                        {t("presentPrice")}:
                      </span>
                      <span className="text-red-600">
                        ₹{crop.presentPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600">
                        {t("previousPrice")}:
                      </span>
                      <span className="text-gray-500">
                        ₹{crop.previousPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                      <span className="text-red-700">
                        ₹{priceChange} ({percentChange}%)
                      </span>
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                    <button className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      {t("viewDetails")}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}