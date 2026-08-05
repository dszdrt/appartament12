"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setError("Неверное имя пользователя или пароль");
        } else {
          setError(res.error);
        }
        setLoading(false);
      } else {
        // Force full browser navigation to dashboard on successful login
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("Произошла ошибка при входе");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
              <Lock className="text-gold w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif text-warm-white mb-2">Apartments12 CMS</h1>
            <p className="text-warm-white/50 text-sm">Вход в панель управления</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-warm-white/70 mb-2">
                Логин
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-warm-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-white/70 mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-warm-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold/90 text-charcoal font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Войти"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
