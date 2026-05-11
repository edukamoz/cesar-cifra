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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative">
      {/* Header */}
      <header className="relative z-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block">
              Caesar
              <span className="text-indigo-600 dark:text-indigo-400">
                Cipher
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {user?.username}
              </span>
            </div>

            <ThemeToggle />

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard de Criptografia
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Cifre e decifre mensagens com a Cifra de César
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap sm:flex-nowrap gap-1 p-1 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl mb-8 animate-slide-up max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab("encrypt")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === "encrypt"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <Lock className="w-4 h-4" />
            Cifrar
          </button>
          <button
            onClick={() => setActiveTab("decrypt")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === "decrypt"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <Unlock className="w-4 h-4" />
            Decifrar
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeTab === "history"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <History className="w-4 h-4" />
            Histórico
          </button>
        </div>

        {/* Tab content */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          {activeTab === "encrypt" && <EncryptPanel />}
          {activeTab === "decrypt" && <DecryptPanel />}
          {activeTab === "history" && <HistoryPanel />}
        </div>
      </main>
    </div>
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
    <div className="space-y-6">
      {/* Form card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/40 dark:shadow-none">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Criptografar Mensagem
            </h2>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500 dark:text-slate-400">
            Live Preview Ativo
          </span>
        </div>

        <form onSubmit={handleEncrypt} className="space-y-4">
          <div>
            <label
              htmlFor="encrypt-message"
              className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5"
            >
              Mensagem Original
            </label>
            <textarea
              id="encrypt-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a mensagem que deseja criptografar..."
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="encrypt-step"
              className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5"
            >
              Passo (deslocamento)
            </label>
            <div className="relative">
              <ArrowDownUp className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                id="encrypt-step"
                type="number"
                value={step}
                onChange={(e) =>
                  setStep(
                    e.target.value === "" ? "" : parseInt(e.target.value, 10),
                  )
                }
                placeholder="Ex: 5"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all duration-200"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Charset: a-z + 0-9 (36 posições)
            </p>
          </div>

          {/* Live Preview Block */}
          {message && typeof step === "number" && !result && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-200 dark:border-indigo-500/20 animate-fade-in">
              <span className="block text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-1">
                Pré-visualização (não salva):
              </span>
              <p className="text-slate-900 dark:text-white font-mono text-sm break-all">
                {livePreviewEncrypt(message, step)}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Gerar Hash e Salvar
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result card */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/40 dark:shadow-none animate-slide-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Resultado Salvo
            </h3>
          </div>

          {/* Encrypted message */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Mensagem Cifrada
              </span>
              <button
                onClick={() => copyToClipboard(result.encrypted, "msg")}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              >
                {copiedMsg ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedMsg ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-900 dark:text-white font-mono text-sm break-all leading-relaxed">
                {result.encrypted}
              </p>
            </div>
          </div>

          {/* Hash */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Hash (chave privada)
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(result.hash, "hash")}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              >
                {copiedHash ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedHash ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-200 dark:border-orange-500/20">
              <p className="text-orange-600 dark:text-orange-400 font-mono text-xs break-all leading-relaxed">
                {result.hash}
              </p>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Guarde este hash! Ele é válido por 24h e de uso único.
            </p>
          </div>
        </div>
      )}
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
