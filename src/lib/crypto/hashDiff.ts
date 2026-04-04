export type CharDiff = { char: string; status: "same" | "changed" };

export function diffHashes(a: string, b: string): CharDiff[] {
  return a.split("").map((char, i) => ({
    char,
    status: char === b[i] ? "same" : "changed",
  }));
}
