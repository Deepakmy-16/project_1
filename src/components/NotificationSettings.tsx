import { useState, useEffect } from "react";
import { X, Bell, Save } from "lucide-react";
import { getTranslation, type Language } from "../utils/translations";
import { useCrops } from "../utils/CropsContext";
import { toast } from "sonner@2.0.3";
import { projectId } from "../utils/supabase/info";

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  accessToken: string;
}

export function NotificationSettings({
  isOpen,
  onClose,
  language,
  accessToken,
}: NotificationSettingsProps) {
  const { crops, loading: cropsLoading } = useCrops();
  const [mobile, setMobile] = useState("");
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const t = (key: any) => getTranslation(language, key);

  const getCropName = (cropId: string) => {
    const crop = crops.find((c) => c.id === cropId);
    if (!crop) return cropId;

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
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0b8d9661/notifications`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setMobile(data.settings.mobile || "");
          setSelectedCrops(data.settings.selectedCrops || []);
        }
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0b8d9661/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ mobile, selectedCrops }),
        }
      );

      if (response.ok) {
        toast.success("Notification settings saved successfully!");
        onClose();
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCrop = (cropId: string) => {
    setSelectedCrops((prev) =>
      prev.includes(cropId)
        ? prev.filter((id) => id !== cropId)
        : [...prev, cropId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6" />
            <h2>{t("notifications")}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {initialLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mobile Number Input */}
              <div>
                <label className="block text-gray-700 mb-2">
                  {t("mobileNumber")}
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 XXXXXXXXXX"
                  className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:border-green-600"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Enter your mobile number to receive SMS notifications about
                  price changes
                </p>
              </div>

              {/* Crop Selection */}
              <div>
                <label className="block text-gray-700 mb-3">
                  {t("selectCrops")}
                </label>
                <div className="space-y-3">
                  {crops.map((crop) => {
                    const isSelected = selectedCrops.includes(crop.id);
                    return (
                      <div
                        key={crop.id}
                        onClick={() => toggleCrop(crop.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                          isSelected
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 hover:border-green-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCrop(crop.id)}
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <img
                          src={crop.imageUrl}
                          alt={getCropName(crop.id)}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-gray-800">{getCropName(crop.id)}</p>
                          <p className="text-sm text-gray-600">
                            Current: ₹{crop.presentPrice} {t("perQuintal")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Select crops to receive regular price updates and
                  notifications when prices change
                </p>
              </div>

              {/* Information Box */}
              <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg
                    className="w-6 h-6 text-blue-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-blue-700 mb-1">Notification Features:</p>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Receive SMS alerts when prices change by 5% or more</li>
                      <li>• Daily price summaries for selected crops</li>
                      <li>• Market trend notifications</li>
                      <li>• Best time to sell alerts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || initialLoading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}