import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { breakdown, applyToSupply, assertConfig, MAX_AMOUNT } from "./tax.ts";

const cfg = { taxBps: 300, burnBpsOfTax: 200 };

describe("assertConfig", () => {
  it("refuses burn share above tax", () => {
    assert.throws(
      () => assertConfig({ taxBps: 100, burnBpsOfTax: 101 }),
      /exceed/,
    );
  });

  it("refuses taxBps above 10000", () => {
    assert.throws(() => assertConfig({ taxBps: 10001, burnBpsOfTax: 0 }), /taxBps/);
  });

  it("accepts zero tax with zero burn", () => {
    assert.deepEqual(assertConfig({ taxBps: 0, burnBpsOfTax: 0 }), {
      taxBps: 0,
      burnBpsOfTax: 0,
    });
  });
});

describe("breakdown", () => {
  it("splits 10000 at 300 bps with 200 burn-of-tax", () => {
    const b = breakdown(10_000n, cfg);
    assert.equal(b.tax, 300n);
    assert.equal(b.burn, 200n);
    assert.equal(b.toTreasury, 100n);
    assert.equal(b.toRecipient, 9_700n);
    assert.equal(b.burn + b.toTreasury + b.toRecipient, b.gross);
  });

  it("zero tax passes full amount", () => {
    const b = breakdown(1_000n, { taxBps: 0, burnBpsOfTax: 0 });
    assert.equal(b.toRecipient, 1_000n);
    assert.equal(b.tax, 0n);
  });

  it("dust transfer may yield zero tax", () => {
    const b = breakdown(1n, cfg);
    assert.equal(b.tax, 0n);
    assert.equal(b.burn, 0n);
    assert.equal(b.toRecipient, 1n);
  });

  it("when tax is zero burn stays zero even if burnBpsOfTax is set", () => {
    const b = breakdown(1n, { taxBps: 1, burnBpsOfTax: 1 });
    assert.equal(b.tax, 0n);
    assert.equal(b.burn, 0n);
    assert.equal(b.toRecipient, 1n);
  });

  it("refuses zero gross", () => {
    assert.throws(() => breakdown(0n, cfg), /positive/);
  });

  it("refuses negative gross", () => {
    assert.throws(() => breakdown(-1n, cfg), /negative/);
  });

  it("refuses gross above MAX_AMOUNT", () => {
    assert.throws(() => breakdown(MAX_AMOUNT + 1n, cfg), /MAX_AMOUNT/);
  });
});

describe("applyToSupply", () => {
  it("reduces supply by burn only", () => {
    const b = breakdown(10_000n, cfg);
    const next = applyToSupply(1_000_000n, b);
    assert.equal(next.supply, 1_000_000n - 200n);
    assert.equal(next.treasuryAccrued, 100n);
  });

  it("refuses burn larger than supply", () => {
    const b = breakdown(10_000n, cfg);
    assert.throws(() => applyToSupply(100n, b), /burn exceeds supply/);
  });
});
