import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getTranslation, type Language } from "../utils/translations";
import { useCrops } from "../utils/CropsContext";
import { type CropData } from "../utils/cropData";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CropDetailProps {
  cropId: string;
  language: Language;
  onBack: () => void;
}

export function CropDetail({ cropId, language, onBack }: CropDetailProps) {
  const { crops, loading: cropsLoading } = useCrops();
  const [crop, setCrop] = useState<CropData | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (crops.length > 0 && cropId) {
      const foundCrop = crops.find((c) => c.id === cropId);
      setCrop(foundCrop || null);
      setLoading(false);
    }
  }, [cropId, crops]);

  if (loading || cropsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Crop not found</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {t("dashboard")}
        </button>
      </div>
    );
  }

  const priceChange = crop.presentPrice - crop.previousPrice;
  const percentChange = ((priceChange / crop.previousPrice) * 100).toFixed(2);
  const isPriceUp = priceChange > 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Crop Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <ImageWithFallback
              src={crop.imageUrl}
              alt={getCropName(crop)}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-gray-800 mb-4">{getCropName(crop)}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4">
                <p className="text-green-600 mb-2">{t("presentPrice")}</p>
                <p className="text-3xl text-green-700">₹{crop.presentPrice}</p>
                <p className="text-green-600 text-sm mt-1">{t("perQuintal")}</p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
                <p className="text-gray-600 mb-2">{t("previousPrice")}</p>
                <p className="text-3xl text-gray-700">₹{crop.previousPrice}</p>
                <p className="text-gray-600 text-sm mt-1">{t("perQuintal")}</p>
              </div>
            </div>

            <div
              className={`mt-6 p-4 rounded-xl flex items-center justify-between ${
                isPriceUp
                  ? "bg-green-50 border-2 border-green-500"
                  : "bg-red-50 border-2 border-red-500"
              }`}
            >
              <div>
                <p
                  className={`text-sm ${
                    isPriceUp ? "text-green-600" : "text-red-600"
                  } mb-1`}
                >
                  {t("priceChange")}
                </p>
                <p
                  className={`text-2xl ${
                    isPriceUp ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {isPriceUp ? "+" : ""}₹{priceChange} ({percentChange}%)
                </p>
              </div>
              {isPriceUp ? (
                <TrendingUp className="w-12 h-12 text-green-600" />
              ) : (
                <TrendingDown className="w-12 h-12 text-red-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Price Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-gray-800 mb-6">{t("monthlyComparison")}</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={crop.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                stroke="#666"
                style={{ fontSize: "14px" }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: "14px" }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                formatter={(value: any) => [`₹${value}`, "Price"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #16a34a",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPriceUp ? "#16a34a" : "#dc2626"}
                strokeWidth={3}
                dot={{ fill: isPriceUp ? "#16a34a" : "#dc2626", r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ lineHeight: "40px" }}
                iconType="circle"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price History Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-gray-800 mb-4">Price History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Month</th>
                <th className="px-6 py-3 text-right">Price (₹)</th>
                <th className="px-6 py-3 text-right">Change from Previous</th>
              </tr>
            </thead>
            <tbody>
              {crop.monthlyData.map((data, index) => {
                const prevPrice =
                  index > 0 ? crop.monthlyData[index - 1].price : data.price;
                const change = data.price - prevPrice;
                const percentChange =
                  index > 0 ? ((change / prevPrice) * 100).toFixed(2) : "0.00";
                const isUp = change > 0;

                return (
                  <tr
                    key={data.month}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">{data.month} 2024</td>
                    <td className="px-6 py-4 text-right">₹{data.price}</td>
                    <td
                      className={`px-6 py-4 text-right ${
                        index === 0
                          ? "text-gray-500"
                          : isUp
                          ? "text-green-600"
                          : change < 0
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {index === 0 ? (
                        "-"
                      ) : (
                        <>
                          {isUp ? "+" : ""}₹{change} ({percentChange}%)
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Alert */}
      <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <svg
            className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-blue-700 mb-2">Price Alert Notifications</h3>
            <p className="text-blue-600">
              Enable notifications in your settings to receive real-time alerts
              when the price of {getCropName(crop)} changes significantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}