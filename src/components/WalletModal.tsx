import React, { useState, useEffect } from "react";
import { X, ExternalLink, ShieldCheck, Check, AlertCircle, RefreshCw, Copy, CheckCircle2 } from "lucide-react";
import { ARBITRUM_SEPOLIA_CHAIN_ID } from "../lib/web3";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectWallet: (walletType: "metamask" | "trust") => Promise<void>;
  isConnecting?: boolean;
  errorMessage?: string | null;
  connectedAddress?: string | null;
  chainId?: number | null;
  onDisconnect?: () => void;
  ethBalance?: number;
  qarbiBalance?: number;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onConnectWallet,
  isConnecting = false,
  errorMessage = null,
  connectedAddress = null,
  chainId = null,
  onDisconnect,
  ethBalance = 0,
  qarbiBalance = 0,
}) => {
  const [activeView, setActiveView] = useState<"select" | "qr">("select");
  const [copied, setCopied] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<"metamask" | "trust" | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setActiveView("select");
      setSelectedWalletType(null);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyAddress = async () => {
    if (!connectedAddress) return;
    try {
      await navigator.clipboard.writeText(connectedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const qrUrl = (addr: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(addr)}`;

  const isCorrectChain = chainId === ARBITRUM_SEPOLIA_CHAIN_ID;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-cyan-500/30 bg-[#070d14] p-6 shadow-2xl shadow-cyan-950/50 z-10 overflow-hidden text-slate-100">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wide text-white">
                {connectedAddress ? "Connected Wallet" : "Connect a Wallet"}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Arbitrum Sepolia Testnet · Chain 421614</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* CONNECTED STATE VIEW */}
        {connectedAddress ? (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Connection Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isCorrectChain ? "Arbitrum Sepolia (Active)" : "Wrong Network"}
                </span>
              </div>

              {/* Address with copy button */}
              <div
                onClick={copyAddress}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group"
                title="Click to copy address"
              >
                <div className="font-mono text-xs text-slate-200 truncate">
                  {connectedAddress}
                </div>
                <button type="button" className="p-1 text-slate-400 group-hover:text-cyan-400 transition">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Live Balances Display */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Sepolia ETH</div>
                  <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">
                    {ethBalance.toFixed(4)} ETH
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">QARBI Token</div>
                  <div className="text-sm font-bold font-mono text-emerald-300 mt-0.5">
                    {qarbiBalance.toLocaleString()} QARBI
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Toggle or View */}
            {activeView === "qr" ? (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <p className="text-xs font-semibold text-cyan-300">Public Address QR Code</p>
                <div className="flex justify-center p-3 bg-white rounded-xl mx-auto w-fit">
                  <img
                    src={qrUrl(connectedAddress)}
                    alt="Wallet QR"
                    width={180}
                    height={180}
                    className="w-40 h-40"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView("select")}
                  className="text-xs text-slate-400 hover:text-white underline transition"
                >
                  Hide QR Code
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveView("qr")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-300 transition cursor-pointer"
              >
                View Wallet QR Code
              </button>
            )}

            {/* Disconnect Action */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={`https://sepolia.arbiscan.io/address/${connectedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition"
              >
                <span>View on Arbiscan</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <button
                type="button"
                onClick={() => {
                  onDisconnect?.();
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-xs font-semibold text-rose-300 transition cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          /* NOT CONNECTED STATE: SLEEK TON-STYLE MODAL OPTIONS */
          <div className="mt-5 space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your EVM wallet to interact with Stylus smart contracts, claim testnet tokens, and evolve autonomous agents.
            </p>

            {/* Wallet Option 1: MetaMask */}
            <button
              type="button"
              disabled={isConnecting}
              onClick={async () => {
                setSelectedWalletType("metamask");
                await onConnectWallet("metamask");
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/90 hover:from-slate-850 hover:to-cyan-950/30 border border-slate-800 hover:border-cyan-500/50 transition-all group cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                  🦊
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition">
                    MetaMask
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Browser extension & Mobile app
                  </div>
                </div>
              </div>
              <div className="text-slate-500 group-hover:text-cyan-400 transition">
                {isConnecting && selectedWalletType === "metamask" ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <span className="text-[10px] px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                    Popular
                  </span>
                )}
              </div>
            </button>

            {/* Wallet Option 2: Trust Wallet */}
            <button
              type="button"
              disabled={isConnecting}
              onClick={async () => {
                setSelectedWalletType("trust");
                await onConnectWallet("trust");
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/90 hover:from-slate-850 hover:to-blue-950/30 border border-slate-800 hover:border-blue-500/50 transition-all group cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                  🛡️
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-100 group-hover:text-blue-300 transition">
                    Trust Wallet
                  </div>
                  <div className="text-[11px] text-slate-400">
                    EIP-6963 multi-chain wallet
                  </div>
                </div>
              </div>
              <div className="text-slate-500 group-hover:text-blue-400 transition">
                {isConnecting && selectedWalletType === "trust" ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                ) : (
                  <span className="text-[10px] px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                    EIP-1193
                  </span>
                )}
              </div>
            </button>

            {/* Security Guarantee Badge */}
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-[11px] text-slate-400 flex items-center gap-2 mt-4">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Zero-Trust EIP-1193 isolated provider: private keys never leave your browser extension.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
