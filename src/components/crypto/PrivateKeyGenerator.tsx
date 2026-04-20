"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { generateKeyPair, type KeyPair } from "@/lib/crypto/secp256k1";
import { Callout } from "@/components/ui/Callout";

export function PrivateKeyGenerator() {
  const t = useTranslations("keyGen");
  const [count, setCount] = useState(0);
  const [pair, setPair] = useState<KeyPair | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    const kp = await generateKeyPair();
    setPair(kp);
    setCount((c) => c + 1);
    setLoading(false);
  }, []);

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{
          background:
            "linear-gradient(90deg, var(--color-orange-light), var(--color-purple-light))",
        }}
      >
        <div>
          <p className="text-xs font-bold text-text-primary">{t("title")}</p>
          <p className="text-xs text-text-secondary">{t("subtitle")}</p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-xl bg-orange px-4 py-2 text-xs font-semibold text-white
                     hover:bg-orange/90 transition-colors disabled:opacity-60 shrink-0"
        >
          {loading ? "···" : t("generateBtn")}
        </button>
      </div>

      {pair ? (
        <>
          {/* Private key */}
          <KeyRow
            label={t("privKeyLabel")}
            value={pair.privateKey}
            desc={t("privKeyDesc")}
            color="orange"
          />
          {/* Public key */}
          <KeyRow
            label={t("pubKeyLabel")}
            value={pair.publicKey}
            desc={t("pubKeyDesc")}
            color="blue"
          />
          {/* Address */}
          <KeyRow
            label={t("addressLabel")}
            value={pair.address}
            desc={t("addressDesc")}
            color="purple"
          />

          {/* Counter */}
          <div className="bg-white px-5 py-3 border-t border-border">
            <p className="text-xs text-text-secondary">
              {t("generatedCount", { count })}
            </p>
          </div>
        </>
      ) : (
        <div className="bg-white px-5 py-10 text-center">
          <p className="text-sm text-text-secondary">
            {t("generateBtn")}
          </p>
        </div>
      )}

      {/* Callout */}
      <div className="bg-white px-5 pb-5">
        <Callout variant="insight">{t("callout")}</Callout>
      </div>
    </div>
  );
}

function KeyRow({
  label,
  value,
  desc,
  color,
}: {
  label: string;
  value: string;
  desc: string;
  color: "orange" | "blue" | "purple";
}) {
  const colorClass = {
    orange: "text-orange",
    blue: "text-blue",
    purple: "text-purple",
  }[color];

  const bgClass = {
    orange: "bg-orange-light",
    blue: "bg-blue-light",
    purple: "bg-purple-light",
  }[color];

  return (
    <div className="border-t border-border">
      <div className={`px-5 py-2 ${bgClass}`}>
        <p className="text-xs font-semibold text-text-secondary">{label}</p>
      </div>
      <div className="bg-code-bg px-5 py-3">
        <p className={`font-mono text-xs break-all leading-relaxed tracking-wide ${colorClass}`}>
          {value}
        </p>
      </div>
      <div className="bg-white px-5 py-3">
        <p className="text-xs text-text-secondary">{desc}</p>
      </div>
    </div>
  );
}
