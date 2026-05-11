import { AxiosError } from "axios";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Informe um username.");
      return;
    }
    if (username.trim().length < 3) {
      toast.error("Username deve ter no mínimo 3 caracteres.");
      return;
    }
    if (!password) {
      toast.error("Informe uma senha.");
      return;
    }
    if (password.length < 6) {
      toast.error("Senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      await register(username.trim(), password);
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordLength = password.length;
  const passwordStrength =
    passwordLength < 6
      ? 0
      : passwordLength < 10
        ? 1
        : passwordLength < 14
          ? 2
          : 3;
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Info */}
          <div className="hidden lg:flex flex-col justify-center text-white">
            <div className="mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6 shadow-2xl shadow-purple-500/50">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Junte-se Agora
              </h1>
              <p className="text-xl text-purple-200 mb-2">
                Comece a usar CaesarCipher
              </p>
              <p className="text-sm text-slate-300">
                Crie sua conta e acesse a criptografia clássica moderna
              </p>
            </div>

            <div className="space-y-6">
              <div
                className="flex gap-4 items-start animate-slide-up"
                style={{ animationDelay: "100ms" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Registro Instantâneo
                  </h3>
                  <p className="text-sm text-slate-300">
                    Crie sua conta em poucos segundos
                  </p>
                </div>
              </div>

              <div
                className="flex gap-4 items-start animate-slide-up"
                style={{ animationDelay: "200ms" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500/20 border border-pink-400/50 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-pink-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Totalmente Privado
                  </h3>
                  <p className="text-sm text-slate-300">
                    Seus dados são protegidos com criptografia
                  </p>
                </div>
              </div>

              <div
                className="flex gap-4 items-start animate-slide-up"
                style={{ animationDelay: "300ms" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Sem Compromisso
                  </h3>
                  <p className="text-sm text-slate-300">
                    Cancele sua conta a qualquer momento
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Register Form */}
          <div className="w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25" />

              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                {/* Logo for mobile */}
                <div className="lg:hidden text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-4 shadow-xl">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">
                    CaesarCipher
                  </h1>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">
                  Criar Conta
                </h2>
                <p className="text-slate-300 mb-8">
                  Junte-se à comunidade de criptografia
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username */}
                  <div className="group">
                    <label
                      htmlFor="register-username"
                      className="block text-sm font-medium text-slate-200 mb-2"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        id="register-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="seu_username"
                        autoComplete="username"
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Mínimo 3 caracteres
                    </p>
                  </div>

                  {/* Password */}
                  <div className="group">
                    <label
                      htmlFor="register-password"
                      className="block text-sm font-medium text-slate-200 mb-2"
                    >
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
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

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex gap-1 h-1">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-full transition-all ${
                                i < passwordStrength
                                  ? passwordStrength === 0
                                    ? "bg-red-500"
                                    : passwordStrength === 1
                                      ? "bg-orange-500"
                                      : passwordStrength === 2
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                  : "bg-white/10"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {passwordStrength === 0 && "Fraca"}
                          {passwordStrength === 1 && "Razoável"}
                          {passwordStrength === 2 && "Boa"}
                          {passwordStrength === 3 && "Forte"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="group">
                    <label
                      htmlFor="register-confirm"
                      className="block text-sm font-medium text-slate-200 mb-2"
                    >
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        id="register-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Password Match Indicator */}
                    {confirmPassword && (
                      <div
                        className={`mt-2 flex items-center gap-1 text-xs ${passwordsMatch ? "text-green-400" : "text-red-400"}`}
                      >
                        {passwordsMatch ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        {passwordsMatch
                          ? "Senhas coincidem"
                          : "Senhas não coincidem"}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !passwordsMatch}
                    className="w-full py-3 mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Criar Conta
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-sm text-slate-400">Já tem conta?</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Login Link */}
                <Link
                  to="/login"
                  className="w-full py-3 border-2 border-white/20 hover:border-white/40 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/5"
                >
                  Voltar para Login
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 relative">
      <div className="w-full max-w-md relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-4 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Criar
            <span className="text-indigo-600 dark:text-indigo-400">Conta</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Comece a criptografar suas mensagens
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-none animate-slide-up">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight mb-6">
            Cadastro
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 stagger">
            {/* Username */}
            <div className="animate-fade-in">
              <label
                htmlFor="register-username"
                className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
                <input
                  id="register-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Escolha um username"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all duration-200"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Mínimo de 3 caracteres
              </p>
            </div>

            {/* Password */}
            <div className="animate-fade-in">
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-12 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Mínimo de 6 caracteres
              </p>
            </div>

            {/* Confirm Password */}
            <div className="animate-fade-in">
              <label
                htmlFor="register-confirm"
                className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5"
              >
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
                <input
                  id="register-confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="animate-fade-in">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Criar conta
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              ou
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Já tem conta?{" "}
            <Link
              to="/login"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
