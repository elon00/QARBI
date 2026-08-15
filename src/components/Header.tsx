import React from "react";
import { ShieldCheck, Cpu, Globe, Droplets, Wallet, Sparkles, ChevronDown } from "lucide-react";
import { LanguageCode, TranslationStrings } from "../types";
import { LANGUAGE_OPTIONS } from "../data/translations";

interface HeaderProps {
  t: TranslationStrings;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  userBalanceQarbi: number;
  userBalanceEth: number;
  onOpenFaucet: () => void;
  isEmergencyLocked: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  currentLanguage,
  onLanguageChange,
  userBalanceQarbi,
  userBalanceEth,
  onOpenFaucet,
  isEmergencyLocked,
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);
  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === currentLanguage) || LANGUAGE_OPTIONS[0];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                  Stylus Rust VM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Network & Live Metrics */}
          <div className="hidden lg:flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono font-medium text-emerald-400">{t.networkBadge}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-mono">Chain 421614</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Stylus Gas: <strong>~4.1k Wasm</strong> (89% Savings)</span>
            </div>

            {isEmergencyLocked && (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-600 text-rose-300 font-semibold animate-bounce">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>KILL SWITCH ACTIVE</span>
              </div>
            )}
          </div>

          {/* Right Action Bar: Language + Faucet + Wallet */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                title="Choose your native language"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="hidden md:inline font-sans">{currentLangObj.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 py-1.5 max-h-96 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      Select Native Language
                    </div>
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition hover:bg-slate-800 ${
                          currentLanguage === lang.code
                            ? "text-cyan-400 bg-cyan-950/40 font-semibold"
                            : "text-slate-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-base">{lang.flag}</span>
                          <div>
                            <span className="block font-medium">{lang.nativeName}</span>
                            <span className="block text-[10px] text-slate-500">{lang.name}</span>
                          </div>
                        </div>
                        {currentLanguage === lang.code && (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Testnet Faucet Button */}
            <button
              type="button"
              onClick={onOpenFaucet}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-900/30 transition active:scale-95 cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-200" />
              <span className="hidden sm:inline">{t.claimFaucet}</span>
              <span className="sm:hidden">Faucet</span>
            </button>

            {/* Simulated Wallet Pill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              <div className="text-right">
                <div className="font-mono text-cyan-300 font-semibold leading-tight">
                  {userBalanceQarbi} <span className="text-[10px] text-slate-400">$QARBI</span>
                </div>
                <div className="font-mono text-[10px] text-slate-400 leading-tight">
                  {userBalanceEth.toFixed(3)} Sepolia ETH
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
