"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  buildRedeemScript,
  createCosigner,
  redeemScriptToP2shAddress,
  signMessage,
  verifySignature,
  type Cosigner,
} from "@/lib/crypto/multisig";

const TOTAL_KEYS = 3;

const HONEST_TX = {
  amount: "0.25000000",
  to: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
};
const TAMPERED_TX = {
  amount: "2.50000000",
  to: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
};

function txMessage(tx: { amount: string; to: string }) {
  return `send ${tx.amount} BTC to ${tx.to}`;
}

const KEY_COLORS = ["orange", "purple", "blue"] as const;

export function MultisigVault() {
  const t = useTranslations("multisigVault");

  const [threshold, setThreshold] = useState(2);
  const [cosigners, setCosigners] = useState<Cosigner[] | null>(null);
  const [signatures, setSignatures] = useState<Record<number, string>>({});
  const [address, setAddress] = useState<string | null>(null);
  const [tampered, setTampered] = useState(false);
  const [broadcast, setBroadcast] = useState(false);

  // Keys are generated in the browser so the page stays server-renderable.
  useEffect(() => {
    setCosigners(Array.from({ length: TOTAL_KEYS }, () => createCosigner()));
  }, []);

  const redeemScript = cosigners
    ? buildRedeemScript(threshold, cosigners.map((c) => c.publicKey))
    : null;

  // The script commits to M, so changing the threshold changes the vault address.
  useEffect(() => {
    if (!redeemScript) return;
    let active = true;
    redeemScriptToP2shAddress(redeemScript).then((addr) => {
      if (active) setAddress(addr);
    });
    return () => {
      active = false;
    };
  }, [redeemScript]);

  const reset = useCallback(() => {
    setSignatures({});
    setTampered(false);
    setBroadcast(false);
  }, []);

  function sign(index: number) {
    if (!cosigners) return;
    const sig = signMessage(txMessage(HONEST_TX), cosigners[index].privateKey);
    setSignatures((prev) => ({ ...prev, [index]: sig }));
  }

  function changeThreshold(m: number) {
    setThreshold(m);
    reset();
  }

  const tx = tampered ? TAMPERED_TX : HONEST_TX;
  const message = txMessage(tx);

  // Every signature is re-verified against whatever the transaction currently says.
  const validCount = cosigners
    ? Object.entries(signatures).filter(([i, sig]) =>
        verifySignature(sig, message, cosigners[Number(i)].publicKey)
      ).length
    : 0;
  const met = validCount >= threshold;

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      {/* Header + threshold picker */}
      <div className="px-5 py-3 bg-bg-soft flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-text-secondary">{t("title")}</span>
        <div className="ml-auto flex items-center gap-1">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              onClick={() => changeThreshold(m)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                threshold === m
                  ? "bg-orange text-white"
                  : "border border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {t("ofN", { m, n: TOTAL_KEYS })}
            </button>
          ))}
        </div>
      </div>

      {/* Vault identity */}
      <div className="bg-code-bg px-5 py-4 border-t border-border space-y-3">
        <div>
          <p className="text-xs font-semibold text-text-secondary mb-1">{t("addressLabel")}</p>
          <p className="font-mono text-sm text-orange break-all">{address ?? "···"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-text-secondary mb-1">{t("scriptLabel")}</p>
          <p className="font-mono text-xs text-text-secondary break-all opacity-70">
            {redeemScript
              ? `OP_${threshold} ${cosigners!
                  .map((c) => `<${c.publicKey.slice(0, 8)}…>`)
                  .join(" ")} OP_${TOTAL_KEYS} OP_CHECKMULTISIG`
              : "···"}
          </p>
        </div>
      </div>

      {/* Transaction */}
      <div className="bg-white px-5 py-4 border-t border-border">
        <p className="text-xs font-semibold text-text-secondary mb-2">{t("txLabel")}</p>
        <div
          className={`rounded-2xl border p-3 font-mono text-xs space-y-1 ${
            tampered ? "border-red/40 bg-red-light" : "border-border bg-bg-soft"
          }`}
        >
          <p className={tampered ? "text-red font-semibold" : "text-text-primary"}>
            {tx.amount} BTC
          </p>
          <p className="text-text-secondary break-all">→ {tx.to}</p>
        </div>
      </div>

      {/* Cosigners */}
      <div className="bg-white px-5 pb-4 space-y-2">
        {(cosigners ?? []).map((cosigner, i) => {
          const sig = signatures[i];
          const valid = sig ? verifySignature(sig, message, cosigner.publicKey) : false;
          const color = KEY_COLORS[i];
          return (
            <div
              key={cosigner.publicKey}
              className="flex items-center gap-3 rounded-2xl border border-border bg-bg-soft p-3"
            >
              <div className={`h-2 w-2 shrink-0 rounded-full bg-${color}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold text-${color}`}>{t(`role${i + 1}`)}</p>
                <p className="font-mono text-[11px] text-text-secondary truncate">
                  {sig ? `${sig.slice(0, 24)}…` : `${cosigner.publicKey.slice(0, 24)}…`}
                </p>
              </div>
              {sig ? (
                <span
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    valid ? "bg-green-light text-green" : "bg-red-light text-red"
                  }`}
                >
                  {valid ? t("sigValid") : t("sigInvalid")}
                </span>
              ) : (
                <button
                  onClick={() => sign(i)}
                  disabled={tampered}
                  className="shrink-0 rounded-xl bg-orange px-3 py-1.5 text-xs font-semibold
                             text-white hover:bg-orange/90 transition-colors disabled:opacity-40"
                >
                  {t("signBtn")}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress + actions */}
      <div className="bg-white px-5 pb-5 space-y-3 border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-soft">
            <div
              className={`h-full transition-all duration-300 ${met ? "bg-green" : "bg-orange"}`}
              style={{ width: `${Math.min(100, (validCount / threshold) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-text-secondary tabular-nums">
            {t("progress", { valid: validCount, threshold })}
          </span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          {broadcast
            ? t("broadcastDone")
            : met
              ? t("statusMet")
              : tampered
                ? t("statusTampered")
                : t("statusPending", { missing: threshold - validCount })}
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setBroadcast(true)}
            disabled={!met || broadcast}
            className="rounded-xl bg-green px-4 py-2 text-xs font-semibold text-white
                       hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {t("broadcastBtn")}
          </button>
          <button
            onClick={() => {
              setTampered((v) => !v);
              setBroadcast(false);
            }}
            disabled={Object.keys(signatures).length === 0}
            className="rounded-xl border border-border px-4 py-2 text-xs font-semibold
                       text-text-secondary hover:text-text-primary transition-colors disabled:opacity-40"
          >
            {tampered ? t("restoreBtn") : t("tamperBtn")}
          </button>
          <button
            onClick={reset}
            className="rounded-xl border border-border px-4 py-2 text-xs font-semibold
                       text-text-secondary hover:text-text-primary transition-colors"
          >
            {t("resetBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}
