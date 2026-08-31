import React from "react";

interface WalletQrCardProps {
  address: string;
  label?: string;
}

function qrUrl(address: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(address)}`;
}

export const WalletQrCard: React.FC<WalletQrCardProps> = ({ address, label = "Connected wallet" }) => {
  const [copied, setCopied] = React.useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 w-72 rounded-2xl border border-slate-700 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">{label}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">Arbitrum Sepolia · 421614</p>
        </div>
        <span className="rounded-full border border-emerald-700/60 bg-emerald-950/50 px-2 py-1 text-[10px] text-emerald-300">CONNECTED</span>
      </div>
      <div className="flex justify-center rounded-xl bg-white p-3">
        <img
          src={qrUrl(address)}
          alt="QR code for connected wallet address"
          width={220}
          height={220}
          className="h-44 w-44 sm:h-48 sm:w-48"
          referrerPolicy="no-referrer"
        />
      </div>
      <button type="button" onClick={copyAddress} className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left font-mono text-[11px] text-slate-200 hover:bg-slate-800">
        <span className="block truncate">{address}</span>
        <span className="mt-1 block text-[10px] text-cyan-400">{copied ? "Copied ✓" : "Click to copy address"}</span>
      </button>
      <p className="mt-2 text-[9px] leading-4 text-slate-500">QR contains only the public wallet address. Never put a private key or seed phrase into a QR code.</p>
    </div>
  );
};
