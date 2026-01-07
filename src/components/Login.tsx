import { useState } from "react";
import { getTranslation, type Language } from "../utils/translations";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface LoginProps {
  onLogin: (accessToken: string, user: any) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Login({ onLogin, language, onLanguageChange }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = (key: any) => getTranslation(language, key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";
      const body = isLogin
        ? { email, password }
        : { email, password, name, mobile };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0b8d9661/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred");
        setLoading(false);
        return;
      }

      if (isLogin) {
        onLogin(data.accessToken, data.user);
      } else {
        // Auto login after registration
        setIsLogin(true);
        setError("");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1707721690544-781fe6ede937?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtaW5nJTIwYWdyaWN1bHR1cmUlMjBmaWVsZHxlbnwxfHx8fDE3NjQwNzgyMjR8MA&ixlib=rb-4.1.0&q=80&w=1080)`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-20">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg border-2 border-green-600"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="ta">தமிழ்</option>
          <option value="te">తెలుగు</option>
        </select>
      </div>

      {/* Login Form */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 border-4 border-green-600">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <svg
              className="w-16 h-16 text-green-600"
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
          </div>
          <h1 className="text-green-700 mb-2">{t("appName")}</h1>
          <h2 className="text-green-600">{isLogin ? t("login") : t("register")}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-2">{t("name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:border-green-600"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:border-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">{t("password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:border-green-600"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-2">
                {t("mobile")} (Optional)
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:border-green-600"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading
              ? "..."
              : isLogin
              ? t("loginButton")
              : t("registerButton")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-green-600 hover:text-green-700"
          >
            {isLogin ? t("dontHaveAccount") : t("alreadyHaveAccount")}{" "}
            <span className="underline">
              {isLogin ? t("register") : t("login")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}