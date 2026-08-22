"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  createExtendedCosigner,
  deriveChild,
  deriveReceiveAddress,
  type ExtendedCosigner,
} from "@/lib/crypto/multisig";

const THRESHOLD = 2;
const TOTAL_KEYS = 3;
const RECEIVE_BRANCH = 0; // branch 0 is receive, branch 1 is change
const INITIAL_ADDRESSES = 3;
const MAX_ADDRESSES = 10;

interface DerivedAddress {
  index: number;
  address: string;
}

export function ReceiveAddresses() {
  const t = useTranslations("receiveAddresses");

  const [accounts, setAccounts] = useState<ExtendedCosigner[] | null>(null);
  const [branchKeys, setBranchKeys] = useState<ExtendedCosigner[] | null>(null);
  const [addresses, setAddresses] = useState<DerivedAddress[]>([]);
  const [busy, setBusy] = useState(false);

  // Each cosigner contributes an extended key; the wallet derives from all of them.
  useEffect(() => {
    let active = true;
    (async () => {
      const accts = await Promise.all(
        Array.from({ length: TOTAL_KEYS }, () => createExtendedCosigner())
      );
      const branch = await Promise.all(accts.map((a) => deriveChild(a, RECEIVE_BRANCH)));
      const first: DerivedAddress[] = [];
      for (let i = 0; i < INITIAL_ADDRESSES; i++) {
        const { address } = await deriveReceiveAddress(branch, THRESHOLD, i);
        first.push({ index: i, address });
      }
      if (!active) return;
      setAccounts(accts);
      setBranchKeys(branch);
      setAddresses(first);
    })();
    return () => {
      active = false;
    };
  }, []);

  const deriveNext = useCallback(async () => {
    if (!branchKeys || busy) return;
    setBusy(true);
    try {
      const index = addresses.length;
      const { address } = await deriveReceiveAddress(branchKeys, THRESHOLD, index);
      setAddresses((prev) => [...prev, { index, address }]);
    } finally {
      setBusy(false);
    }
  }, [branchKeys, addresses.length, busy]);

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      <div className="px-5 py-3 text-xs font-semibold text-text-secondary bg-bg-soft">
        {t("title")}
      </div>

      {/* The descriptor — the thing that actually defines the wallet */}
      <div className="bg-code-bg px-5 py-4 border-t border-border">
        <p className="text-xs font-semibold text-text-secondary mb-2">{t("descriptorLabel")}</p>
        <pre className="overflow-x-auto font-mono text-xs text-text-secondary leading-relaxed">
          {accounts
            ? `sh(multi(${THRESHOLD},\n` +
              accounts.map((a) => `  [${a.fingerprint}]xpub…/${RECEIVE_BRANCH}/*`).join(",\n") +
              `\n))`
            : "···"}
        </pre>
      </div>

      {/* Derived receive addresses */}
      <div className="bg-white px-5 py-4 border-t border-border space-y-2">
        <p className="text-xs font-semibold text-text-secondary">{t("addressesLabel")}</p>
        {addresses.length === 0 && (
          <p className="font-mono text-xs text-text-secondary">···</p>
        )}
        {addresses.map(({ index, address }) => (
          <div
            key={index}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-border bg-bg-soft px-4 py-3"
          >
            <span className="font-mono text-[11px] font-semibold text-purple shrink-0">
              /{RECEIVE_BRANCH}/{index}
            </span>
            <span className="font-mono text-xs text-text-primary break-all">{address}</span>
            {index === 0 && (
              <span className="ml-auto shrink-0 rounded-lg bg-orange/10 px-2 py-0.5 text-[10px] font-semibold text-orange">
                {t("firstBadge")}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white px-5 pb-5 space-y-3">
        <button
          onClick={deriveNext}
          disabled={!branchKeys || busy || addresses.length >= MAX_ADDRESSES}
          className="rounded-xl bg-orange px-4 py-2 text-xs font-semibold text-white
                     hover:bg-orange/90 transition-colors disabled:opacity-40"
        >
          {addresses.length >= MAX_ADDRESSES ? t("maxBtn") : t("nextBtn")}
        </button>
        <p className="text-xs text-text-secondary leading-relaxed">{t("note")}</p>
      </div>
    </div>
  );
}
