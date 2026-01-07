import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getTranslation, type Language } from "../utils/translations";
import { useCrops } from "../utils/CropsContext";
import { type CropData } from "../utils/cropData";

interface MonthComparisonProps {
  language: Language;
}

export function MonthComparison({ language }: MonthComparisonProps) {
  const { crops, loading } = useCrops();
  const [displayCrops, setDisplayCrops] = useState<CropData[]>([]);

  useEffect(() => {
    if (crops.length > 0) {
      // Sort by absolute price change for better display
      const sorted = [...crops].sort((a, b) => {
        const changeA = Math.abs(a.presentPrice - a.previousPrice);
        const changeB = Math.abs(b.presentPrice - b.previousPrice);
        return changeB - changeA;
      });
      setDisplayCrops(sorted);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-green-700 mb-2">{t("comparison")}</h2>
        <p className="text-gray-600">
          Comparing October 2024 vs November 2024 prices
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-green-700">Price Increased</h3>
          </div>
          <p className="text-3xl text-green-700">
            {crops.filter((c) => c.presentPrice > c.previousPrice).length}
          </p>
          <p className="text-green-600 text-sm mt-2">
            {t("crops")} with higher prices
          </p>
        </div>

        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <h3 className="text-red-700">Price Decreased</h3>
          </div>
          <p className="text-3xl text-red-700">
            {crops.filter((c) => c.presentPrice < c.previousPrice).length}
          </p>
          <p className="text-red-600 text-sm mt-2">
            {t("crops")} with lower prices
          </p>
        </div>

        <div className="bg-gray-50 border-2 border-gray-500 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-gray-700">Total {t("crops")}</h3>
          </div>
          <p className="text-3xl text-gray-700">{crops.length}</p>
          <p className="text-gray-600 text-sm mt-2">Tracked in system</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-700 to-green-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">{t("crops")}</th>
                <th className="px-6 py-4 text-right">{t("lastMonth")}</th>
                <th className="px-6 py-4 text-right">{t("thisMonth")}</th>
                <th className="px-6 py-4 text-right">{t("change")}</th>
                <th className="px-6 py-4 text-center">% {t("change")}</th>
                <th className="px-6 py-4 text-center">Trend</th>
              </tr>
            </thead>
            <tbody>
              {displayCrops.map((crop, index) => {
                const priceChange = crop.presentPrice - crop.previousPrice;
                const percentChange =
                  ((priceChange / crop.previousPrice) * 100).toFixed(2);
                const isPriceUp = priceChange > 0;

                return (
                  <tr
                    key={crop.id}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={crop.imageUrl}
                          alt={getCropName(crop)}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span>{getCropName(crop)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700">
                      ₹{crop.previousPrice}
                    </td>
                    <td
                      className={`px-6 py-4 text-right ${
                        isPriceUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{crop.presentPrice}
                    </td>
                    <td
                      className={`px-6 py-4 text-right ${
                        isPriceUp ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isPriceUp ? "+" : ""}₹{priceChange}
                    </td>
                    <td
                      className={`px-6 py-4 text-center ${
                        isPriceUp ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isPriceUp ? "+" : ""}
                      {percentChange}%
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isPriceUp ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full">
                          <TrendingDown className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Comparison Bars */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-gray-800 mb-6">Price Comparison Chart</h3>
        <div className="space-y-6">
          {displayCrops.map((crop) => {
            const maxPrice = Math.max(crop.presentPrice, crop.previousPrice);
            const prevPercentage = (crop.previousPrice / maxPrice) * 100;
            const presentPercentage = (crop.presentPrice / maxPrice) * 100;
            const isPriceUp = crop.presentPrice > crop.previousPrice;

            return (
              <div key={crop.id}>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={crop.imageUrl}
                    alt={getCropName(crop)}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-gray-700 w-32">{getCropName(crop)}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-24">
                      {t("lastMonth")}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-8">
                      <div
                        className="bg-gray-500 h-8 rounded-full flex items-center justify-end px-3 text-white text-sm"
                        style={{ width: `${prevPercentage}%` }}
                      >
                        ₹{crop.previousPrice}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-24">
                      {t("thisMonth")}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-8">
                      <div
                        className={`h-8 rounded-full flex items-center justify-end px-3 text-white text-sm ${
                          isPriceUp ? "bg-green-600" : "bg-red-600"
                        }`}
                        style={{ width: `${presentPercentage}%` }}
                      >
                        ₹{crop.presentPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}