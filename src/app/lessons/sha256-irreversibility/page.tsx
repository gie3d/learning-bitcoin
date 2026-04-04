import { LessonLayout } from "@/components/layout/LessonLayout";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { ConceptSection } from "@/components/lesson/ConceptSection";
import { StepExplainer } from "@/components/lesson/StepExplainer";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { HashSandbox } from "@/components/crypto/HashSandbox";
import { AvalancheDemo } from "@/components/crypto/AvalancheDemo";
import { ReverseChallenge } from "@/components/crypto/ReverseChallenge";

export const metadata = {
  title: "Why is SHA-256 irreversible? — Learning Bitcoin",
  description:
    "Understand why SHA-256 is a one-way function: pigeonhole principle, avalanche effect, and no algebraic inverse.",
};

const SHA256_ROUND_CODE = `// One round of SHA-256 (simplified)
function round(a, b, c, d, e, f, g, h, w, k) {
  const S1  = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
  const ch  = (e & f) ^ (~e & g)          // bitwise choice
  const t1  = h + S1 + ch + k + w         // modular addition
  const S0  = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
  const maj = (a & b) ^ (a & c) ^ (b & c) // bitwise majority
  const t2  = S0 + maj

  return [t1 + t2, a, b, c, d + t1, e, f, g]
}
// 64 of these rounds, each feeding into the next.
// No step is invertible — XOR loses bits, modular addition wraps.`;

export default function SHA256IrreversibilityPage() {
  return (
    <LessonLayout>
      <LessonHeader
        title="Why is SHA-256 irreversible?"
        subtitle="SHA-256 is the backbone of Bitcoin's security. Understanding why it's a one-way function — not just hard, but mathematically impossible to reverse — is fundamental to understanding how Bitcoin works."
        difficulty="intermediate"
        readingTime="8 min read"
        topic="Cryptography"
      />

      {/* Section 0: Hook */}
      <div className="mb-12 rounded-3xl overflow-hidden shadow-card border border-border">
        <div
          className="px-5 py-3 text-xs font-semibold text-text-secondary"
          style={{ background: "linear-gradient(90deg, #f5f5f7, #f5f5f7)" }}
        >
          The sentence &ldquo;Hello, Bitcoin.&rdquo; — encoded as SHA-256
        </div>
        <div className="bg-code-bg px-5 py-4">
          <p className="font-mono text-sm text-blue break-all leading-relaxed tracking-wide">
            b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576f2a97c2d552ea9a8
          </p>
        </div>
        <div className="bg-white px-5 py-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            That 64-character string encodes the phrase above. You{" "}
            <strong className="text-text-primary">cannot</strong> get the
            original sentence back from it — not in a trillion years. Here&apos;s
            the mathematical reason why.
          </p>
        </div>
      </div>

      {/* Section 1: What is a hash? */}
      <ConceptSection title="What is a hash function?">
        <p className="text-text-secondary leading-relaxed">
          A hash function takes any input — a single character, a novel, an
          entire Bitcoin block — and produces a fixed-length fingerprint called
          a <strong className="text-text-primary">digest</strong>. SHA-256
          always outputs exactly 256 bits, written as 64 hexadecimal characters.
        </p>
        <p className="text-text-secondary leading-relaxed">
          Three properties define it:
        </p>
        <div className="space-y-3">
          {[
            {
              n: "01",
              label: "Deterministic",
              color: "text-orange",
              body: `"hello" always hashes to the same 64 characters. Always.`,
            },
            {
              n: "02",
              label: "Fixed-length",
              color: "text-purple",
              body: "One byte or one gigabyte — the output is always 64 hex characters.",
            },
            {
              n: "03",
              label: "Fast to compute",
              color: "text-blue",
              body: "Computing a SHA-256 hash is cheap. Reversing one is not possible.",
            },
          ].map(({ n, label, color, body }) => (
            <div
              key={n}
              className="flex gap-4 rounded-2xl bg-bg-soft border border-border p-4"
            >
              <span className={`font-mono text-xs font-bold shrink-0 mt-0.5 ${color}`}>
                {n}
              </span>
              <span className="text-sm text-text-secondary">
                <strong className="text-text-primary">{label}</strong> — {body}
              </span>
            </div>
          ))}
        </div>
        <p className="text-text-secondary leading-relaxed">
          Try it yourself below. Notice that any input — even nothing — always
          produces exactly 64 characters.
        </p>
        <HashSandbox />
      </ConceptSection>

      {/* Section 2: Why can't you reverse it? */}
      <ConceptSection title="Why you can&apos;t reverse it">
        <p className="text-text-secondary leading-relaxed">
          &ldquo;Irreversible&rdquo; is not a practical limitation waiting for faster
          computers. It&apos;s baked into the mathematical structure. Three separate
          arguments explain why.
        </p>
        <StepExplainer
          steps={[
            {
              number: 1,
              title: "Information destruction (the pigeonhole argument)",
              children: (
                <>
                  <p>
                    SHA-256 maps an <em>infinite</em> set of possible inputs
                    onto a <em>finite</em> set of 2<sup>256</sup> outputs. By
                    the pigeonhole principle, infinitely many inputs share every
                    possible output hash.
                  </p>
                  <p>
                    When you see a hash, you can&apos;t know which input produced it.
                    You might find <em>a</em> preimage by brute force — but
                    never <em>the</em> original. That information is gone.
                  </p>
                  <Callout variant="insight">
                    2<sup>256</sup> ≈ 10<sup>77</sup> — larger than the
                    estimated number of atoms in the observable universe. Even
                    checking one hash per atom per second, exhaustive search is
                    physically impossible.
                  </Callout>
                </>
              ),
            },
            {
              number: 2,
              title: "The avalanche effect (no gradient to follow)",
              children: (
                <>
                  <p>
                    Change a single character — flip one bit — and roughly
                    half of all output bits change, apparently at random.
                  </p>
                  <p>
                    There&apos;s no &ldquo;getting closer.&rdquo; Every wrong guess looks
                    equally wrong. Unlike a numeric equation you can solve
                    iteratively, you have zero signal to guide a search.
                  </p>
                  <AvalancheDemo />
                </>
              ),
            },
            {
              number: 3,
              title: "No algebraic inverse",
              children: (
                <>
                  <p>
                    SHA-256 uses bitwise XOR, AND, OR, bit rotation, and
                    modular addition — run through 64 rounds, each feeding into
                    the next. Unlike RSA (which has a mathematical inverse) or a
                    Caesar cipher (just reverse the shift), there is no inverse
                    operation for SHA-256.
                  </p>
                  <CodeBlock language="pseudocode">
                    {SHA256_ROUND_CODE}
                  </CodeBlock>
                  <p>
                    Each modular addition discards carry information. Each XOR
                    can be satisfied by two different input pairs. After 64
                    rounds, reconstructing the input is equivalent to solving a
                    massively underdetermined system of equations.
                  </p>
                </>
              ),
            },
          ]}
        />
      </ConceptSection>

      {/* Section 3: Sandbox */}
      <ConceptSection title="Explore: any input, always 64 characters">
        <p className="text-text-secondary leading-relaxed">
          Try a long paragraph, a single space, your name. No matter the size,
          the output is always exactly 64 hex characters — and nothing about it
          tells you how to find the input.
        </p>
        <HashSandbox />
      </ConceptSection>

      {/* Section 4: Avalanche demo */}
      <ConceptSection title="The avalanche effect, up close">
        <p className="text-text-secondary leading-relaxed">
          The two inputs below differ by only one character (capital{" "}
          <code className="font-mono text-sm text-blue bg-blue-light px-1.5 py-0.5 rounded-lg">W</code>{" "}
          vs lowercase{" "}
          <code className="font-mono text-sm text-blue bg-blue-light px-1.5 py-0.5 rounded-lg">w</code>
          ). Watch roughly half the output characters change.
        </p>
        <AvalancheDemo />
        <Callout variant="info">
          <span className="font-bold text-blue">Blue</span> characters are the same in both hashes.{" "}
          <span className="font-bold text-orange">Orange</span> characters differ.
          Edit either input to see the effect live.
        </Callout>
      </ConceptSection>

      {/* Section 5: Challenge */}
      <ConceptSection title="Try to reverse it">
        <p className="text-text-secondary leading-relaxed">
          Below is the SHA-256 hash of a short phrase. Figure out what the input
          was. No tricks — the only method that works is guessing.
        </p>
        <ReverseChallenge />
        <Callout variant="warning">
          Even matching 63 out of 64 characters is a complete miss. That&apos;s
          what &ldquo;preimage resistance&rdquo; means — hash functions are all-or-nothing.
        </Callout>
      </ConceptSection>

      {/* Section 6: Why it matters */}
      <ConceptSection title="Why this matters for Bitcoin">
        <p className="text-text-secondary leading-relaxed">
          SHA-256&apos;s irreversibility is not a footnote — it&apos;s the foundation Bitcoin
          is built on.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-border bg-orange-light p-5">
            <div className="text-2xl mb-3">⛏️</div>
            <h3 className="text-sm font-bold text-text-primary mb-2">Mining</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Miners must find a block header whose hash starts with a certain
              number of zeros. Because hashing is irreversible, there&apos;s no
              shortcut — they try billions of variations per second. That
              brute-force effort is the &ldquo;work&rdquo; in Proof of Work.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-purple-light p-5">
            <div className="text-2xl mb-3">🔑</div>
            <h3 className="text-sm font-bold text-text-primary mb-2">
              Address security
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Your private key is hashed to produce your public address. Even
              though your address is visible on the blockchain, the hash ensures
              no one can work backwards to your private key — and your funds.
            </p>
          </div>
        </div>
        <Callout variant="insight">
          Every Bitcoin block contains the SHA-256 hash of the previous block.
          This chain of hashes makes rewriting history computationally
          impossible — you&apos;d have to redo the proof-of-work for every block
          that follows.
        </Callout>
      </ConceptSection>
    </LessonLayout>
  );
}
