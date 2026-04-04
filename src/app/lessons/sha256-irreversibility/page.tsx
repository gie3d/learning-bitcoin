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
        subtitle="SHA-256 is the backbone of Bitcoin's security. Understanding why it's a one-way function — and why that's not just a computational inconvenience but a mathematical certainty — is fundamental to understanding how Bitcoin works."
        difficulty="intermediate"
        readingTime="8 min read"
        topic="Cryptography"
      />

      {/* Section 0: Hook */}
      <div className="mb-10 rounded-lg border border-border bg-surface p-5">
        <p className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-3">
          The sentence below, encoded
        </p>
        <p className="font-mono text-xs text-accent-teal break-all leading-relaxed">
          b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576f2a97c2d552ea9a8
        </p>
        <p className="mt-3 text-sm text-text-secondary">
          This 64-character string is the SHA-256 hash of{" "}
          <em>&ldquo;Hello, Bitcoin.&rdquo;</em> — you can verify it below. You{" "}
          <strong className="text-text-primary">cannot</strong> get the original
          sentence back from this string. Not in a trillion years. Here&apos;s
          why.
        </p>
      </div>

      {/* Section 1: What is a hash? */}
      <ConceptSection title="What is a hash function?">
        <p className="text-text-secondary leading-relaxed">
          A hash function takes any input — a single character, a novel, a
          Bitcoin block — and produces a fixed-length output called a{" "}
          <strong className="text-text-primary">digest</strong>. SHA-256 always
          outputs exactly 256 bits, written as 64 hexadecimal characters.
        </p>
        <p className="text-text-secondary leading-relaxed">
          Three properties define a well-designed hash function:
        </p>
        <ul className="list-none space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="text-accent-teal font-mono shrink-0">01</span>
            <span className="text-text-secondary">
              <strong className="text-text-primary">Deterministic</strong> —
              the same input always produces the same output. &ldquo;hello&rdquo; will
              always hash to the same 64 characters.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent-teal font-mono shrink-0">02</span>
            <span className="text-text-secondary">
              <strong className="text-text-primary">Fixed-length</strong> —
              whether your input is one byte or one gigabyte, the output is
              always 64 hex characters.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent-teal font-mono shrink-0">03</span>
            <span className="text-text-secondary">
              <strong className="text-text-primary">Fast to compute</strong> —
              computing a SHA-256 hash is cheap. Modern hardware can do billions
              per second.
            </span>
          </li>
        </ul>
        <p className="text-text-secondary leading-relaxed">
          Try it yourself. Notice that any input — even an empty string — always
          produces exactly 64 characters.
        </p>
        <HashSandbox />
      </ConceptSection>

      {/* Section 2: Why can't you reverse it? */}
      <ConceptSection title="Why you can't reverse it">
        <p className="text-text-secondary leading-relaxed">
          &ldquo;Irreversible&rdquo; here is not a practical limitation — it&apos;s not
          that computers aren&apos;t fast enough yet. It&apos;s a property baked into
          the mathematical structure. Three separate arguments explain why.
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
                    the pigeonhole principle, infinitely many different inputs
                    share every output hash.
                  </p>
                  <p>
                    When you see a hash, you cannot know which of those infinite
                    inputs produced it. You might find <em>a</em> preimage by
                    brute force, but you can never recover <em>the</em> original
                    input. The information about which input was used is simply
                    gone.
                  </p>
                  <Callout variant="insight">
                    2<sup>256</sup> ≈ 10<sup>77</sup> — larger than the
                    estimated number of atoms in the observable universe (~10
                    <sup>80</sup>). Even if you could check one hash per atom
                    per second, exhaustive search is physically impossible.
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
                    Change a single character in the input — even flip one bit —
                    and approximately half of all output bits change, in a way
                    that appears completely random.
                  </p>
                  <p>
                    This means there is no &ldquo;getting closer&rdquo; to the right
                    answer. If you&apos;re trying to reverse a hash, you have no
                    signal to guide you. Unlike a numeric equation where you can
                    iteratively approach a solution, every wrong guess looks
                    equally wrong.
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
                    SHA-256 is built from operations that individually have no
                    inverse when combined: bitwise XOR, AND, OR, bit rotation,
                    and modular addition. These are run through 64 rounds, each
                    feeding into the next.
                  </p>
                  <p>
                    Unlike RSA (where encryption and decryption are inverse
                    mathematical operations) or even a Caesar cipher (where you
                    can just reverse the shift), SHA-256 has no mathematical
                    operation that undoes it. The round function looks like this:
                  </p>
                  <CodeBlock language="pseudocode">
                    {SHA256_ROUND_CODE}
                  </CodeBlock>
                  <p>
                    Each modular addition discards carry information. Each XOR
                    can be satisfied by two different input pairs. After 64
                    rounds, reconstructing the input from the output is
                    equivalent to solving a system of equations with far more
                    unknowns than constraints.
                  </p>
                </>
              ),
            },
          ]}
        />
      </ConceptSection>

      {/* Section 3: Live sandbox (already shown in section 1 — reiterate with focus) */}
      <ConceptSection title="Explore: any input, always 64 characters">
        <p className="text-text-secondary leading-relaxed">
          The sandbox below lets you hash anything. Try a long paragraph, a
          single space, or your name. The output is always exactly 64 hex
          characters — a 256-bit window that tells you nothing about how to
          reconstruct the input.
        </p>
        <HashSandbox />
      </ConceptSection>

      {/* Section 4: Avalanche demo (dedicated) */}
      <ConceptSection title="The avalanche effect, up close">
        <p className="text-text-secondary leading-relaxed">
          The two inputs below differ by only one character (capital{" "}
          <code className="font-mono text-sm text-accent-teal bg-code-bg px-1 rounded">
            W
          </code>{" "}
          vs lowercase{" "}
          <code className="font-mono text-sm text-accent-teal bg-code-bg px-1 rounded">
            w
          </code>
          ). Watch how the outputs diverge — roughly half the characters change
          every time, regardless of how small the edit is.
        </p>
        <AvalancheDemo />
        <Callout variant="info">
          <span className="font-mono text-accent-teal">Teal</span> characters
          are the same in both hashes.{" "}
          <span className="font-mono text-accent-amber">Amber</span> characters
          differ. Edit either input to see the effect live.
        </Callout>
      </ConceptSection>

      {/* Section 5: Challenge */}
      <ConceptSection title="Try to reverse it">
        <p className="text-text-secondary leading-relaxed">
          Below is the SHA-256 hash of a short phrase. Try to figure out what
          the input was. There is no trick — the only method that works is
          guessing.
        </p>
        <ReverseChallenge />
        <Callout variant="warning">
          Notice: even if your guess&apos;s hash matches 60 out of 64 characters,
          it&apos;s still completely wrong. There is no partial credit. This is what
          &ldquo;preimage resistance&rdquo; means in practice.
        </Callout>
      </ConceptSection>

      {/* Section 6: Why it matters for Bitcoin */}
      <ConceptSection title="Why this matters for Bitcoin">
        <p className="text-text-secondary leading-relaxed">
          SHA-256&apos;s irreversibility is not an academic curiosity — it is the
          foundation on which Bitcoin&apos;s security rests, in two critical ways:
        </p>
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              Mining
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Bitcoin miners must find an input (a block header with a specific
              nonce) whose SHA-256 hash starts with a certain number of zeros.
              Because hashing is irreversible, there is no shortcut — miners
              must try billions of nonces per second until they find one that
              works. This brute-force effort is the &ldquo;work&rdquo; in Proof of Work.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              Address security
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Your Bitcoin private key is hashed (via SHA-256 and RIPEMD-160)
              to produce your public address. That address is publicly visible
              on the blockchain. But because the hash is irreversible, knowing
              your address tells an attacker nothing about your private key —
              and therefore nothing about your funds.
            </p>
          </div>
        </div>
        <Callout variant="insight">
          Every block in the Bitcoin blockchain contains the SHA-256 hash of
          the previous block. This chain of hashes is what makes altering
          history computationally infeasible — you would have to redo the
          proof-of-work for every subsequent block.
        </Callout>
      </ConceptSection>
    </LessonLayout>
  );
}
