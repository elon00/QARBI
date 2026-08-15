import React, { useState } from "react";
import { Droplets, Sparkles, CheckCircle, ExternalLink } from "lucide-react";
import { TranslationStrings, TransactionRecord } from "../types";
import { generateTxHash } from "../lib/crypto";

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (qarbiAmount: number, ethAmount: number, txRecord: TransactionRecord) => void;
  t: TranslationStrings;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({
  isOpen,
  onClose,
  onClaim,
  t,
}) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedTx, setClaimedTx] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClaimTokens = () => {
    setIsClaiming(true);
    setClaimedTx(null);

    setTimeout(() => {
      const txHash = generateTxHash();
      const qarbiClaim = 100;
      const ethClaim = 0.05;

      const txRecord: TransactionRecord = {
        hash: txHash,
        blockNumber: 18492310,
        from: "0x0000000000000000000000000000000000000000 (Faucet)",
        to: "0x71C...8e9B (User Wallet)",
        type: "FAUCET_CLAIM",
        value: `${qarbiClaim} QARBI + ${ethClaim} ETH`,
        status: "CONFIRMED",
        timestamp: Date.now(),
        gasUsed: 21000,
        gasSavedStylus: "Standard EVM",
        dataSummary: `Claimed ${qarbiClaim} $QARBI + ${ethClaim} Sepolia ETH from Testnet Faucet`,
      };

      onClaim(qarbiClaim, ethClaim, txRecord);
      setClaimedTx(txHash);
      setIsClaiming(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {t.faucet.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {t.faucet.subtitle}
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">Network:</span>
            <span className="text-cyan-400 font-bold">Arbitrum Sepolia (421614)</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">Claim Allocation:</span>
            <span className="text-amber-400 font-bold">+100 $QARBI / +0.05 Sepolia ETH</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">Recipient:</span>
            <span className="text-slate-300">0x71C...8e9B (Connected)</span>
          </div>
        </div>

        {claimedTx ? (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Tokens Dispatched to Wallet!</span>
            </div>
            <div className="font-mono text-[10px] break-all text-emerald-400/90">
              Tx: {claimedTx}
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={isClaiming}
            onClick={handleClaimTokens}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-white shadow-lg transition flex items-center justify-center space-x-2 ${
              isClaiming
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-900/30 cursor-pointer active:scale-95"
            }`}
          >
            {isClaiming ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Minting Testnet Tokens...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>{t.faucet.claimButton}</span>
              </>
            )}
          </button>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
