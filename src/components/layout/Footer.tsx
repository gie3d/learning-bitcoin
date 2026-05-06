"use client";

import { useLocale } from "next-intl";

export function Footer() {
  const locale = useLocale();
  const isTH = locale === "th";

  return (
    <footer className="footer">
      <div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 16,
            color: "var(--ink-soft)",
          }}
        >
          Bitcoin, explained.
        </span>
        <span style={{ marginLeft: 12, fontSize: 12 }}>
          {isTH
            ? "· บทเรียนแบบโต้ตอบสำหรับทุกคน"
            : "· Interactive lessons for everyone"}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>
          {isTH
            ? "ชอบแอปนี้ไหม? เลี้ยงกาแฟผ่าน Lightning"
            : "Buy me a coffee via Lightning"}
        </span>
        <a className="lightning" href="lightning:gie3d@blink.sv">
          ⚡ gie3d@blink.sv
        </a>
      </div>
    </footer>
  );
}
