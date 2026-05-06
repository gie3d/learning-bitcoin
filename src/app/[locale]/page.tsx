import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { HomeHero } from "@/components/home/HomeHero";

const LESSONS = [
  {
    id: "sha256-irrev",
    icon: "🔐",
    title_en: "Why is SHA-256 irreversible?",
    title_th: "ทำไม SHA-256 ถึงย้อนกลับไม่ได้?",
    desc_en:
      "Type anything and see the hash. Change one letter and watch half the output flip — then try to reverse it.",
    desc_th:
      "พิมพ์อะไรก็ได้แล้วดูผลแฮชทันที เห็นว่าแค่เปลี่ยนตัวอักษรเดียวทำให้ผลลัพธ์เปลี่ยนไปครึ่งหนึ่ง",
    minutes: 8,
    level: "intermediate",
    status: "ready",
    href: "/lessons/sha256-irreversibility",
  },
  {
    id: "sha256-internals",
    icon: "⚙️",
    title_en: "How does SHA-256 actually work?",
    title_th: "SHA-256 ทำงานยังไง?",
    desc_en:
      'Follow "abc" through padding, message schedule expansion, and 64 rounds of compression.',
    desc_th:
      'ติดตาม "abc" ผ่านการเติม padding การขยาย schedule และการบีบอัด 64 รอบ',
    minutes: 10,
    level: "intermediate",
    status: "ready",
    href: "/lessons/how-sha256-works",
  },
  {
    id: "keys",
    icon: "🔑",
    title_en: "How do public & private keys work?",
    title_th: "กุญแจสาธารณะและส่วนตัวทำงานยังไง?",
    desc_en:
      "Generate a real private key in your browser. See point multiplication. Try cracking a tiny elliptic curve.",
    desc_th:
      "สร้างกุญแจส่วนตัวจริงในเบราว์เซอร์ ดูการคูณจุดสร้างกุญแจสาธารณะ",
    minutes: 10,
    level: "intermediate",
    status: "ready",
    href: "/lessons/public-private-keys",
  },
  {
    id: "addresses",
    icon: "📬",
    title_en: "From key to address",
    title_th: "จากกุญแจสู่ที่อยู่",
    desc_en: "Public key → hash → checksum → Base58. Watch each transformation byte-by-byte.",
    desc_th: "public key → hash → checksum → Base58 ดูการแปลงทีละไบต์",
    minutes: 6,
    level: "beginner",
    status: "soon",
    href: null,
  },
  {
    id: "tx",
    icon: "✉️",
    title_en: "Anatomy of a transaction",
    title_th: "กายวิภาคของธุรกรรม",
    desc_en: "Inputs, outputs, scripts. Drag UTXOs around and build a valid transaction.",
    desc_th: "inputs, outputs, scripts ลากเล่น UTXO แล้วประกอบธุรกรรม",
    minutes: 12,
    level: "intermediate",
    status: "soon",
    href: null,
  },
  {
    id: "mining",
    icon: "⛏️",
    title_en: "Mining: the lottery",
    title_th: "การขุด: ลอตเตอรี่",
    desc_en: "Why do miners burn electricity? Scrub the difficulty target and feel the wall.",
    desc_th: "ทำไมผู้ขุดถึงเผาไฟฟ้า? ลากปรับความยากแล้วสัมผัสกำแพง",
    minutes: 14,
    level: "advanced",
    status: "soon",
    href: null,
  },
  {
    id: "network",
    icon: "🌐",
    title_en: "How nodes agree",
    title_th: "โหนดตกลงกันได้ยังไง",
    desc_en: "Watch a simulated network propagate a block. What happens when two miners win at once?",
    desc_th: "ดูเครือข่ายจำลองส่งบล็อก ถ้าผู้ขุดสองคนชนะพร้อมกันล่ะ?",
    minutes: 10,
    level: "advanced",
    status: "soon",
    href: null,
  },
];

const TOOLS = [
  {
    id: "sha256-visualizer",
    icon: "🔬",
    title_en: "SHA-256 Visualizer",
    title_th: "SHA-256 Visualizer",
    desc_en:
      "Type any message and follow each step — padding, schedule expansion, and all 64 compression rounds.",
    desc_th: "พิมพ์ข้อความใดก็ได้และติดตามทุกขั้นตอน",
    href: "/tools/sha256-visualizer",
    ready: true,
  },
  {
    id: "key-generator",
    icon: "🗝️",
    title_en: "Key generator",
    title_th: "สร้างกุญแจ",
    desc_en: "Roll a real 256-bit private key. Watch the public key derive in real time.",
    desc_th: "สุ่มกุญแจส่วนตัว 256 บิต",
    href: null,
    ready: false,
  },
  {
    id: "tx-builder",
    icon: "📦",
    title_en: "Transaction builder",
    title_th: "สร้างธุรกรรม",
    desc_en: "Drag UTXOs together. Sign. Broadcast (in your head).",
    desc_th: "ลาก UTXO เซ็น ส่ง",
    href: null,
    ready: false,
  },
];

export default async function HomePage() {
  const locale = await getLocale();
  const isTH = locale === "th";

  return (
    <>
      <SiteHeader />
      <main>
        <HomeHero locale={locale} />

        {/* Learning map */}
        <section id="lessons" style={{ padding: "40px 0 80px" }}>
          <div className="page">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 48,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div className="eyebrow" style={{ marginBottom: 12 }}>
                  {isTH ? "— เส้นทางการเรียน" : "— The learning path"}
                </div>
                <h2 className="section">
                  {isTH ? (
                    <>
                      เริ่มจาก <em>หลักการ</em>
                      <br />
                      ไปสู่ <em>ระบบทั้งหมด</em>
                    </>
                  ) : (
                    <>
                      Start with <em>primitives</em>,<br />
                      build up to the <em>whole system</em>.
                    </>
                  )}
                </h2>
              </div>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: "var(--ink-soft)",
                  maxWidth: 320,
                }}
              >
                {isTH
                  ? "แต่ละแทร็กสร้างต่อจากแทร็กก่อนหน้า ลองข้ามไปไหนก็ได้ — แต่เริ่มจากการเข้ารหัสจะเข้าใจที่สุด"
                  : "Each topic builds on the one before. Jump in anywhere — but start at cryptography for the full picture."}
              </p>
            </div>

            {/* List layout */}
            <div style={{ borderTop: "1px solid var(--rule)" }}>
              {LESSONS.map((lesson) => {
                const ready = lesson.status === "ready";
                const title = isTH ? lesson.title_th : lesson.title_en;
                const desc = isTH ? lesson.desc_th : lesson.desc_en;

                const inner = (
                  <div
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "60px 1fr auto auto auto",
                      gap: 24,
                      alignItems: "center",
                      padding: "20px 8px",
                      borderBottom: "1px solid var(--rule)",
                      opacity: ready ? 1 : 0.5,
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: 28 }}>{lesson.icon}</div>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 22,
                          letterSpacing: "-0.01em",
                          color: "var(--ink)",
                        }}
                      >
                        {title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--ink-mute)",
                          marginTop: 2,
                        }}
                      >
                        {desc}
                      </div>
                    </div>
                    <span className="pill">{lesson.level}</span>
                    <span className="pill">{lesson.minutes} min</span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                        color: ready ? "var(--orange-deep)" : "var(--ink-mute)",
                        fontSize: 18,
                      }}
                    >
                      {ready ? "→" : (isTH ? "เร็วๆ นี้" : "soon")}
                    </span>
                  </div>
                );

                return ready && lesson.href ? (
                  <Link
                    key={lesson.id}
                    href={lesson.href}
                    style={{
                      display: "block",
                      transition: "background 0.15s",
                      borderRadius: 4,
                    }}
                    className="lesson-row-link"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={lesson.id}>{inner}</div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tools section */}
        <section
          id="tools"
          style={{
            padding: "40px 0 80px",
            borderTop: "1px solid var(--rule)",
          }}
        >
          <div className="page">
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              — {isTH ? "เครื่องมือ" : "The tools"}
            </div>
            <h2 className="section" style={{ marginBottom: 40 }}>
              {isTH ? (
                <>
                  เล่นกับ <em>เครื่องจริง</em>
                </>
              ) : (
                <>
                  Play with the <em>actual machinery</em>.
                </>
              )}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 20,
              }}
            >
              {TOOLS.map((tool) => {
                const title = isTH ? tool.title_th : tool.title_en;
                const desc = isTH ? tool.desc_th : tool.desc_en;

                const cardStyle: React.CSSProperties = {
                  textAlign: "left",
                  padding: 28,
                  opacity: tool.ready ? 1 : 0.55,
                  borderColor: tool.ready ? "var(--orange-soft)" : "var(--rule)",
                  width: "100%",
                  display: "block",
                };

                const cardInner = (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 16,
                      }}
                    >
                      <div style={{ fontSize: 36 }}>{tool.icon}</div>
                      {tool.ready ? (
                        <span className="pill orange dot">
                          {isTH ? "พร้อมใช้" : "Live"}
                        </span>
                      ) : (
                        <span className="pill">
                          {isTH ? "เร็วๆ นี้" : "Soon"}
                        </span>
                      )}
                    </div>
                    <h3 className="card-title">{title}</h3>
                    <p
                      style={{
                        marginTop: 10,
                        fontSize: 14,
                        color: "var(--ink-soft)",
                        lineHeight: 1.55,
                      }}
                    >
                      {desc}
                    </p>
                  </>
                );

                return tool.ready && tool.href ? (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="card"
                    style={cardStyle}
                  >
                    {cardInner}
                  </Link>
                ) : (
                  <div key={tool.id} className="card" style={cardStyle}>
                    {cardInner}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
