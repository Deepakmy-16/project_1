import { useState, useEffect } from "react";
import { Toaster } from "sonner@2.0.3";
import { Login } from "./components/Login";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { PriceList } from "./components/PriceList";
import { MonthComparison } from "./components/MonthComparison";
import { CropDetail } from "./components/CropDetail";
import { NotificationSettings } from "./components/NotificationSettings";
import { type Language } from "./utils/translations";
import { projectId, publicAnonKey } from "./utils/supabase/info";
import { CropsProvider } from "./utils/CropsContext";

type View = "dashboard" | "priceList" | "comparison" | "cropDetail";

interface User {
  id: string;
  email: string;
  name: string;
  mobile?: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedCropId, setSelectedCropId] = useState<string>("");
  const [language, setLanguage] = useState<Language>("en");
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkSession();
  }, []);

  const checkSession = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0b8d9661/session`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setAccessToken(token);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("accessToken");
        }
      } catch (error) {
        console.error("Session check error:", error);
        localStorage.removeItem("accessToken");
      }
    }
    setLoading(false);
  };

  const handleLogin = (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("accessToken", token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccessToken("");
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  const handleTabChange = (tab: "dashboard" | "priceList" | "comparison") => {
    if (tab === "dashboard") {
      setCurrentView("dashboard");
    } else if (tab === "priceList") {
      setCurrentView("priceList");
    } else {
      setCurrentView("comparison");
    }
  };

  const handleCropClick = (cropId: string) => {
    setSelectedCropId(cropId);
    setCurrentView("cropDetail");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedCropId("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Login
          onLogin={handleLogin}
          language={language}
          onLanguageChange={setLanguage}
        />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <CropsProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-blue-50">
        <Header
          currentTab={
            currentView === "dashboard"
              ? "dashboard"
              : currentView === "priceList"
              ? "priceList"
              : "comparison"
          }
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          onNotificationClick={() => setShowNotifications(true)}
          language={language}
          onLanguageChange={setLanguage}
          userName={user?.name}
        />

        <main className="container mx-auto px-4 py-8">
          {currentView === "dashboard" && (
            <Dashboard language={language} onCropClick={handleCropClick} />
          )}
          {currentView === "priceList" && (
            <PriceList language={language} onCropClick={handleCropClick} />
          )}
          {currentView === "comparison" && (
            <MonthComparison language={language} />
          )}
          {currentView === "cropDetail" && (
            <CropDetail
              cropId={selectedCropId}
              language={language}
              onBack={handleBackToDashboard}
            />
          )}
        </main>

        <NotificationSettings
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          language={language}
          accessToken={accessToken}
        />

        <Toaster position="top-right" richColors />

        {/* Footer */}
        <footer className="bg-gradient-to-r from-green-700 to-green-600 text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>© 2024 Smart Price Analysis in Agriculture. All rights reserved.</p>
            <p className="text-green-200 text-sm mt-2">
              Empowering farmers with real-time market intelligence
            </p>
          </div>
        </footer>
      </div>
    </CropsProvider>
  );
}