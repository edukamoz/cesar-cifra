import { AxiosError } from "axios";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Informe seu username.");
      return;
    }
    if (!password) {
      toast.error("Informe sua senha.");
      return;
    }

    setIsLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Erro ao realizar login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Branding & Features */}
          <div className="hidden lg:flex flex-col justify-center text-white">
            <div className="mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-2xl shadow-indigo-500/50">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                CaesarCipher
              </h1>
              <p className="text-xl text-blue-200 mb-2">
                Criptografia Clássica Moderna
              </p>
              <p className="text-sm text-slate-300">
                Implemente a Cifra de César com segurança e facilidade
              </p>
            </div>

            <div className="space-y-6">
              <div
                className="flex gap-4 items-start animate-slide-up"
                style={{ animationDelay: "100ms" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Rápido & Eficiente
                  </h3>
                  <p className="text-sm text-slate-300">
                    Criptografe mensagens instantaneamente com a Cifra de César
                  </p>
                </div>
              </div>

              <div
                className="flex gap-4 items-start animate-slide-up"
                style={{ animationDelay: "200ms" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Seguro & Confiável
                  </h3>
                  <p className="text-sm text-slate-300">
                    Hashes únicos com validade de 24h para máxima segurança
                  </p>
                </div>
              </div>

              <div
                className="flex gap-4 items-start animate-slide-up"
                style={{ animationDelay: "300ms" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Histórico Completo
                  </h3>
                  <p className="text-sm text-slate-300">
                    Acompanhe todas as suas operações de criptografia
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-25" />

              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                {/* Logo for mobile */}
                <div className="lg:hidden text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-xl">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">
                    CaesarCipher
                  </h1>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">
                  Bem-vindo de volta
                </h2>
                <p className="text-slate-300 mb-8">
                  Acesse sua conta para começar a criptografar
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username */}
                  <div className="group">
                    <label
                      htmlFor="login-username"
                      className="block text-sm font-medium text-slate-200 mb-2"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        id="login-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="seu_username"
                        autoComplete="username"
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="group">
                    <label
                      htmlFor="login-password"
                      className="block text-sm font-medium text-slate-200 mb-2"
                    >
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Entrar
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-sm text-slate-400">Novo por aqui?</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Register Link */}
                <Link
                  to="/register"
                  className="w-full py-3 border-2 border-white/20 hover:border-white/40 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/5"
                >
                  Criar Nova Conta
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
