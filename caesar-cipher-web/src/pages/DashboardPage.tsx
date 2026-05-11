import { AxiosError } from "axios";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  ArrowDownUp,
  Calendar,
  Check,
  Clock,
  Copy,
  Hash,
  History,
  KeyRound,
  Lock,
  LogOut,
  Send,
  ShieldCheck,
  Sparkles,
  Unlock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { cipherService } from "../services";
import type { ICipherDocument } from "../types";
import { livePreviewEncrypt } from "../utils/cipherUtils";

type Tab = "encrypt" | "decrypt" | "history";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("encrypt");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CaesarCipher
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Criptografia Clássica
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 border border-emerald-200/50 dark:border-emerald-500/20">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {user?.username}
              </span>
            </div>

            <ThemeToggle />

            <button
              onClick={logout}
              className="p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } lg:w-64 hidden lg:flex flex-col transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800`}
        >
          <div className="flex-1 overflow-y-auto">
            <nav className="p-6 space-y-2">
              <NavButton
                onClick={() => setActiveTab("encrypt")}
                active={activeTab === "encrypt"}
                icon={<Lock className="w-5 h-5" />}
                label="Criptografar"
              />
              <NavButton
                onClick={() => setActiveTab("decrypt")}
                active={activeTab === "decrypt"}
                icon={<Unlock className="w-5 h-5" />}
                label="Descriptografar"
              />
              <NavButton
                onClick={() => setActiveTab("history")}
                active={activeTab === "history"}
                icon={<History className="w-5 h-5" />}
                label="Histórico"
              />
            </nav>

            {/* Sidebar Info Card */}
            <div className="mx-6 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                  Dica
                </p>
              </div>
              <p className="text-xs text-indigo-800 dark:text-indigo-200">
                Guarde seus hashes! Eles expiram em 24h.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 top-20 z-30 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="p-6 space-y-2">
                <NavButton
                  onClick={() => {
                    setActiveTab("encrypt");
                    setSidebarOpen(false);
                  }}
                  active={activeTab === "encrypt"}
                  icon={<Lock className="w-5 h-5" />}
                  label="Criptografar"
                />
                <NavButton
                  onClick={() => {
                    setActiveTab("decrypt");
                    setSidebarOpen(false);
                  }}
                  active={activeTab === "decrypt"}
                  icon={<Unlock className="w-5 h-5" />}
                  label="Descriptografar"
                />
                <NavButton
                  onClick={() => {
                    setActiveTab("history");
                    setSidebarOpen(false);
                  }}
                  active={activeTab === "history"}
                  icon={<History className="w-5 h-5" />}
                  label="Histórico"
                />
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-8 lg:p-12">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-12 animate-fade-in">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {activeTab === "encrypt" && "Criptografar Mensagem"}
                  {activeTab === "decrypt" && "Descriptografar Mensagem"}
                  {activeTab === "history" && "Histórico de Operações"}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {activeTab === "encrypt" &&
                    "Cifre suas mensagens com a Cifra de César seguramente"}
                  {activeTab === "decrypt" &&
                    "Decifre mensagens usando o hash fornecido"}
                  {activeTab === "history" &&
                    "Visualize todas as suas operações anteriores"}
                </p>
              </div>

              {/* Content */}
              <div className="animate-slide-up">
                {activeTab === "encrypt" && <EncryptPanel />}
                {activeTab === "decrypt" && <DecryptPanel />}
                {activeTab === "history" && <HistoryPanel />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Navigation Button Component                                              */
/* ═══════════════════════════════════════════════════════════════════════════ */

function NavButton({
  onClick,
  active,
  icon,
  label,
}: {
  onClick: () => void;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Encrypt Panel                                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */

function EncryptPanel() {
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<number | "">("");
  const [result, setResult] = useState<{
    hash: string;
    encrypted: string;
  } | null>(null);
  const [, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!message.trim()) {
      toast.error("Informe a mensagem a ser cifrada.");
      return;
    }
    if (step === "" || !Number.isInteger(step)) {
      toast.error("Informe o passo (número inteiro).");
      return;
    }

    setIsLoading(true);
    try {
      const response = await cipherService.encrypt(message, step);
      if (response.success && response.data) {
        setResult({
          hash: response.data.hash,
          encrypted: response.data.encryptedMessage,
        });
        toast.success("Mensagem cifrada com sucesso!");
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Erro ao criptografar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: "hash" | "msg") => {
    await navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
    if (type === "hash") {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Form */}
      <div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none h-full">
          <form onSubmit={handleEncrypt} className="space-y-6">
            <div>
              <label
                htmlFor="encrypt-message"
                className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
              >
                Mensagem Original
              </label>
              <textarea
                id="encrypt-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite aqui a mensagem que deseja criptografar..."
                rows={5}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200 resize-none font-mono text-sm"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Caracteres suportados: a-z, 0-9 (36 posições totais)
              </p>
            </div>

            <div>
              <label
                htmlFor="encrypt-step"
                className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
              >
                Chave de Deslocamento
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <input
                  id="encrypt-step"
                  type="number"
                  value={step}
                  onChange={(e) =>
                    setStep(
                      e.target.value === "" ? "" : parseInt(e.target.value, 10),
                    )
                  }
                  placeholder="Ex: 3 ou 13"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200 text-lg font-semibold"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                ℹ️ Quanto maior o número, maior o deslocamento dos caracteres
              </p>
            </div>

            {/* Live Preview */}
            {message && typeof step === "number" && !result && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200 dark:border-blue-500/20 animate-fade-in">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  👁️ PRÉ-VISUALIZAÇÃO (não salva)
                </p>
                <p className="text-slate-900 dark:text-white font-mono text-sm break-all leading-relaxed bg-blue-100 dark:bg-blue-500/20 p-3 rounded-lg">
                  {livePreviewEncrypt(message, step)}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-4"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Criptografar & Salvar
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right: Result */}
      <div>
        {result ? (
          <div className="space-y-6 animate-slide-up">
            {/* Encrypted Message Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 p-8 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Mensagem Cifrada
                  </h3>
                </div>
                <button
                  onClick={() => copyToClipboard(result.encrypted, "msg")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-all text-sm font-medium"
                >
                  {copiedMsg ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-900 dark:text-white font-mono text-base break-all leading-relaxed">
                  {result.encrypted}
                </p>
              </div>
            </div>

            {/* Hash Card */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 rounded-2xl border border-orange-200 dark:border-orange-500/30 p-8 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center">
                    <KeyRound className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Chave Privada (Hash)
                    </h3>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      Necessária para descriptografar
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(result.hash, "hash")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/20 transition-all text-sm font-medium"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-orange-600 dark:text-orange-400 font-mono text-xs break-all leading-relaxed">
                  {result.hash}
                </p>
              </div>
              <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-500/20 rounded-lg border border-orange-200 dark:border-orange-500/30 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  ⚠️ <strong>Importante:</strong> Este hash é válido por 24h e
                  de uso único. Guarde-o com segurança!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setMessage("");
                setStep("");
              }}
              className="w-full py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Criptografar Outra Mensagem
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 shadow-xl shadow-slate-200/40 dark:shadow-none h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Pronto para criptografar?
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Preencha o formulário à esquerda e seu resultado aparecerá aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Decrypt Panel                                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */

function DecryptPanel() {
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [hash, setHash] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!encryptedMessage.trim()) {
      toast.error("Informe a mensagem cifrada.");
      return;
    }
    if (!hash.trim()) {
      toast.error("Informe o hash (chave privada).");
      return;
    }

    setIsLoading(true);
    try {
      const response = await cipherService.decrypt(
        encryptedMessage,
        hash.trim(),
      );
      if (response.success && response.data) {
        setResult(response.data.originalMessage);
        toast.success("Mensagem decifrada com sucesso!");
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Erro ao descriptografar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copiado!");
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Form card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/40 dark:shadow-none">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <Unlock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Descriptografar Mensagem
          </h2>
        </div>

        <form onSubmit={handleDecrypt} className="space-y-4">
          <div>
            <label
              htmlFor="decrypt-message"
              className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5"
            >
              Mensagem Cifrada
            </label>
            <textarea
              id="decrypt-message"
              value={encryptedMessage}
              onChange={(e) => setEncryptedMessage(e.target.value)}
              placeholder="Cole a mensagem cifrada aqui..."
              rows={4}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="decrypt-hash"
              className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5"
            >
              Hash (chave privada)
            </label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                id="decrypt-hash"
                type="text"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="Cole o hash recebido na criptografia"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all duration-200 font-mono text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                Descriptografar
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result card */}
      {result !== null && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/40 dark:shadow-none animate-slide-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Mensagem Original
            </h3>
          </div>

          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Resultado
            </span>
            <button
              onClick={() => copyToClipboard(result)}
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
            >
              {copiedResult ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copiedResult ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-slate-900 dark:text-white font-mono text-sm break-all leading-relaxed">
              {result}
            </p>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />O hash utilizado foi
            marcado como usado e não pode ser reutilizado.
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  History Panel                                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */

function HistoryPanel() {
  const [history, setHistory] = useState<ICipherDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await cipherService.history();
        if (response.success && response.data) {
          setHistory(response.data);
        }
      } catch (error) {
        toast.error("Não foi possível carregar o histórico.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Hash copiado!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/40 dark:shadow-none">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <History className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Seus Hashes Gerados
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400">
              Nenhum hash gerado ainda.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Criptografe uma mensagem para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              const isExpired = new Date(item.expiresAt) < new Date();
              const status = item.used
                ? "usado"
                : isExpired
                  ? "expirado"
                  : "disponível";

              return (
                <div
                  key={item._id}
                  className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    status === "disponível"
                      ? "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                      : "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 opacity-80"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          status === "disponível"
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400"
                            : status === "usado"
                              ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                              : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {status}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.createdAt && isValid(parseISO(item.createdAt))
                          ? format(
                              parseISO(item.createdAt),
                              "dd/MM/yyyy 'às' HH:mm",
                              { locale: ptBR },
                            )
                          : "Data indisponível"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono text-slate-900 dark:text-white truncate">
                        {item.hash}
                      </p>
                      <button
                        onClick={() => copyToClipboard(item.hash)}
                        className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer shrink-0"
                        title="Copiar Hash"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 shrink-0 border-t border-slate-200 dark:border-slate-700 pt-3 sm:border-0 sm:pt-0">
                    <div
                      className="flex items-center gap-1"
                      title="Passo (deslocamento)"
                    >
                      <ArrowDownUp className="w-3.5 h-3.5" />
                      <span>Passo: {item.step}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Expira em">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {item.expiresAt && isValid(parseISO(item.expiresAt))
                          ? format(
                              parseISO(item.expiresAt),
                              "dd/MM 'às' HH:mm",
                              { locale: ptBR },
                            )
                          : "Data indisponível"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
