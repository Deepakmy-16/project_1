import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { getTranslation, type Language } from "../utils/translations";
import { useCrops } from "../utils/CropsContext";
import { type CropData } from "../utils/cropData";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PriceListProps {
  language: Language;
  onCropClick: (cropId: string) => void;
}

export function PriceList({ language, onCropClick }: PriceListProps) {
  const { crops, loading } = useCrops();
  const [displayCrops, setDisplayCrops] = useState<CropData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value) {
      const filteredCrops = crops.filter((crop) =>
        getCropName(crop).toLowerCase().includes(value.toLowerCase())
      );
      setDisplayCrops(filteredCrops);
    } else {
      setDisplayCrops(crops);
    }
  };

  const handleFilter = (category: string) => {
    setFilterCategory(category);
    if (category === "all") {
      setDisplayCrops(crops);
    } else {
      const filteredCrops = crops.filter((crop) => crop.category === category);
      setDisplayCrops(filteredCrops);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Get unique categories
  const categories = Array.from(
    new Set(crops.map((c) => c.category).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-green-700">{t("priceList")}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {displayCrops.length} of {crops.length} {t("crops")}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search crops..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterCategory === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All ({crops.length})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilter(category as string)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                filterCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category} ({crops.filter((c) => c.category === category).length})
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayCrops.map((crop) => {
          const priceChange = crop.presentPrice - crop.previousPrice;
          const percentChange =
            ((priceChange / crop.previousPrice) * 100).toFixed(2);
          const isPriceUp = priceChange > 0;

          return (
            <div
              key={crop.id}
              className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer border-2 ${
                isPriceUp ? "border-green-500" : "border-red-500"
              }`}
              onClick={() => onCropClick(crop.id)}
            >
              <div className="h-48 overflow-hidden relative">
                <ImageWithFallback
                  src={crop.imageUrl}
                  alt={getCropName(crop)}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full ${
                    isPriceUp ? "bg-green-600" : "bg-red-600"
                  } text-white flex items-center gap-1`}
                >
                  {isPriceUp ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{percentChange}%</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-gray-800 mb-3">{getCropName(crop)}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">
                      {t("presentPrice")}
                    </span>
                    <span
                      className={`${
                        isPriceUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{crop.presentPrice}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">
                      {t("previousPrice")}
                    </span>
                    <span className="text-gray-500">₹{crop.previousPrice}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">
                        {t("change")}
                      </span>
                      <span
                        className={`${
                          isPriceUp ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {isPriceUp ? "+" : ""}₹{priceChange}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
                    isPriceUp
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {t("viewDetails")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table View */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">{t("crops")}</th>
                <th className="px-6 py-4 text-right">{t("presentPrice")}</th>
                <th className="px-6 py-4 text-right">{t("previousPrice")}</th>
                <th className="px-6 py-4 text-right">{t("change")}</th>
                <th className="px-6 py-4 text-center">Status</th>
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
                    className={`border-b hover:bg-gray-50 cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                    onClick={() => onCropClick(crop.id)}
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
                    <td
                      className={`px-6 py-4 text-right ${
                        isPriceUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{crop.presentPrice}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      ₹{crop.previousPrice}
                    </td>
                    <td
                      className={`px-6 py-4 text-right ${
                        isPriceUp ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isPriceUp ? "+" : ""}₹{priceChange} ({percentChange}%)
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isPriceUp ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Up</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-sm">Down</span>
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
    </div>
  );
}