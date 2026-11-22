import { describe, expect, it } from "vitest";
import { AVTAR, avtarReply } from "./avtar";
import { TOOLS } from "./tools";

const topic = (message: string) => avtarReply(message).topic;

describe("AVTAR", () => {
  it("answers every starter chip from the FAQ", () => {
    for (const starter of AVTAR.starters) {
      expect(topic(starter), starter).not.toBeNull();
    }
    expect(topic("How do I merge PDFs?")).toBe("merge");
    expect(topic("Old or new tax regime?")).toBe("regime");
    expect(topic("Are my files uploaded?")).toBe("privacy");
    expect(topic("What tools are live?")).toBe("live");
  });

  it.each([
    ["can I combine two pdf files", "merge"],
    ["I need only pages 3 to 5", "split"],
    ["my scan is sideways", "organise"],
    ["convert pdf to jpg", "to-images"],
    ["turn my photos to pdf", "from-images"],
    ["how do I compress a pdf", "compress"],
    ["is there a rebate under 87A", "rebate"],
    ["what is the standard deduction", "standard"],
    ["can I claim 80C here", "deductions"],
    ["can I claim 80C in new regime?", "deductions"],
    ["is the 87a rebate in the new regime", "rebate"],
    ["what is a good ats score", "ats"],
    ["can you file my ITR", "file-itr"],
    ["what about capital gains on shares", "capital-gains"],
    ["when is the resume builder coming", "resume"],
    ["my pdf is password protected", "password"],
    ["is it free", "free"],
    ["do I need to sign up", "account"],
    ["who are you", "bot"],
    ["hello", "hello"],
    ["thank you", "thanks"],
  ])("%s -> %s", (message, expected) => {
    expect(topic(message)).toBe(expected);
  });

  it("lets a real question beat a greeting in the same message", () => {
    expect(topic("hi, how do I split a pdf into pages")).toBe("split");
  });

  it("matches whole words, not fragments", () => {
    // "hi" must not fire inside "this", nor "cv" inside a longer word.
    expect(topic("this")).toBeNull();
  });

  it("only links to pages that exist", () => {
    const known = new Set(["/", "/pdf", ...TOOLS.map((t) => t.href)]);
    for (const message of ["merge", "tax regime", "resume", "jobs", "ai chat", "what can you do"]) {
      for (const link of avtarReply(message).links) expect(known.has(link.href), link.href).toBe(true);
    }
  });

  it("admits when it does not know, instead of guessing", () => {
    const reply = avtarReply("what is the weather in Delhi");
    expect(reply.topic).toBeNull();
    expect(reply.text).toMatch(/don.t know/);
  });

  it("falls back to the closest tool when there is one", () => {
    const reply = avtarReply("biodata maker");
    expect(reply.links.length).toBeGreaterThan(0);
  });

  it("puts the current tax figures into its answers", () => {
    expect(avtarReply("87a rebate").text).toContain("₹12,00,000");
  });

  it.each([
    ["where can I learn system design", "learn-system-design"],
    ["how does a rate limiter work", "learn-system-design"],
    ["I want to practise SQL queries", "learn-databases"],
    ["best way to learn dbms", "learn-databases"],
    ["how do I prepare dsa for interviews", "learn-dsa"],
    ["leetcode style problems", "learn-dsa"],
    ["do you have any free courses", "learn"],
  ])("sends %j to the Learn tab", (message, expected) => {
    expect(topic(message)).toBe(expected);
    expect(avtarReply(message).links.map((l) => l.href)).toContain("/learn");
  });
});
