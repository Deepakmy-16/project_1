import { Bell, LogOut, RefreshCw } from "lucide-react";
import { getTranslation, type Language } from "../utils/translations";
import { useCrops } from "../utils/CropsContext";
import { useState } from "react";

interface HeaderProps {
  currentTab: "dashboard" | "priceList" | "comparison";
  onTabChange: (tab: "dashboard" | "priceList" | "comparison") => void;
  onLogout: () => void;
  onNotificationClick: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  userName?: string;
}

export function Header({
  currentTab,
  onTabChange,
  onLogout,
  onNotificationClick,
  language,
  onLanguageChange,
  userName,
}: HeaderProps) {
  const t = (key: any) => getTranslation(language, key);
  const { refreshCrops } = useCrops();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshCrops();
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <header
      className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg sticky top-0 z-50"
      style={{
        backgroundImage: `linear-gradient(rgba(21, 128, 61, 0.95), rgba(22, 163, 74, 0.95)), url(https://images.unsplash.com/photo-1707721690544-781fe6ede937?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtaW5nJTIwYWdyaWN1bHR1cmUlMjBmaWVsZHxlbnwxfHx8fDE3NjQwNzgyMjR8MA&ixlib=rb-4.1.0&q=80&w=1080)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Top Row - Logo and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-12 h-12"
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
            <div>
              <h1 className="text-white text-2xl">{t("appName")}</h1>
              {userName && (
                <p className="text-green-100 text-sm">
                  {t("welcome")}, {userName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 text-white cursor-pointer"
            >
              <option value="en" className="text-gray-900">
                English
              </option>
              <option value="hi" className="text-gray-900">
                हिंदी
              </option>
              <option value="kn" className="text-gray-900">
                ಕನ್ನಡ
              </option>
              <option value="ta" className="text-gray-900">
                தமிழ்
              </option>
              <option value="te" className="text-gray-900">
                తెలుగు
              </option>
            </select>

            {/* Notification Button */}
            <button
              onClick={onNotificationClick}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
              title={t("notifications")}
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className={`p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors ${
                refreshing ? "animate-spin" : ""
              }`}
              title={t("refresh")}
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 flex-wrap">
          <button
            onClick={() => onTabChange("dashboard")}
            className={`px-6 py-3 rounded-lg transition-colors ${
              currentTab === "dashboard"
                ? "bg-white text-green-700"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {t("dashboard")}
          </button>
          <button
            onClick={() => onTabChange("priceList")}
            className={`px-6 py-3 rounded-lg transition-colors ${
              currentTab === "priceList"
                ? "bg-white text-green-700"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {t("priceList")}
          </button>
          <button
            onClick={() => onTabChange("comparison")}
            className={`px-6 py-3 rounded-lg transition-colors ${
              currentTab === "comparison"
                ? "bg-white text-green-700"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {t("comparison")}
          </button>
        </nav>
      </div>
    </header>
  );
}