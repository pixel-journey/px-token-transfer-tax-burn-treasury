/**
 * Composition: sequential taxed transfers.
 * Each transfer conserves gross = burn + treasury + recipient.
 * Supply falls only by burn. Treasury accrues. Overdraft / insufficient supply refuse.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { breakdown, applyToSupply, type TaxConfig } from "./tax.ts";

const cfg: TaxConfig = { taxBps: 300, burnBpsOfTax: 200 };

type Desk = {
  supply: bigint;
  treasury: bigint;
  balances: Map<string, bigint>;
};

function openDesk(supply: bigint, seed: Record<string, bigint>): Desk {
  return {
    supply,
    treasury: 0n,
    balances: new Map(Object.entries(seed)),
  };
}

function transfer(
  desk: Desk,
  from: string,
  to: string,
  gross: bigint,
  config: TaxConfig,
): void {
  const fromBal = desk.balances.get(from) ?? 0n;
  if (gross > fromBal) throw new Error("exceeds balance");
  const b = breakdown(gross, config);
  const next = applyToSupply(desk.supply, b);
  desk.balances.set(from, fromBal - gross);
  desk.balances.set(to, (desk.balances.get(to) ?? 0n) + b.toRecipient);
  desk.treasury += next.treasuryAccrued;
  desk.supply = next.supply;
}

function trackedSum(desk: Desk, supply0: bigint): bigint {
  let s = desk.treasury + (supply0 - desk.supply);
  for (const v of desk.balances.values()) s += v;
  return s;
}

describe("composition: sequential taxed transfers", () => {
  it("two hops conserve and only burn reduces supply", () => {
    const supply0 = 1_000_000n;
    const desk = openDesk(supply0, { alice: 50_000n, bob: 0n, carol: 0n });
    transfer(desk, "alice", "bob", 10_000n, cfg);
    assert.equal(desk.balances.get("alice"), 40_000n);
    assert.equal(desk.balances.get("bob"), 9_700n);
    assert.equal(desk.treasury, 100n);
    assert.equal(desk.supply, supply0 - 200n);
    assert.equal(trackedSum(desk, supply0), 50_000n);

    transfer(desk, "bob", "carol", 9_700n, cfg);
    const b2 = breakdown(9_700n, cfg);
    assert.equal(desk.balances.get("bob"), 0n);
    assert.equal(desk.balances.get("carol"), b2.toRecipient);
    assert.equal(desk.treasury, 100n + b2.toTreasury);
    assert.equal(desk.supply, supply0 - 200n - b2.burn);
    // alice seed only: balances + treasury + burns = 50_000
    assert.equal(trackedSum(desk, supply0), 50_000n);
  });

  it("overdraft refuses without mutating desk", () => {
    const desk = openDesk(1_000_000n, { alice: 100n, bob: 0n });
    assert.throws(() => transfer(desk, "alice", "bob", 101n, cfg), /exceeds balance/);
    assert.equal(desk.balances.get("alice"), 100n);
    assert.equal(desk.treasury, 0n);
    assert.equal(desk.supply, 1_000_000n);
  });

  it("burn larger than remaining supply refuses", () => {
    const desk = openDesk(100n, { alice: 10_000n, bob: 0n });
    assert.throws(() => transfer(desk, "alice", "bob", 10_000n, cfg), /burn exceeds supply/);
    assert.equal(desk.supply, 100n);
    assert.equal(desk.balances.get("alice"), 10_000n);
  });

  it("dust transfers accumulate zero tax and leave supply unchanged", () => {
    const desk = openDesk(1_000_000n, { alice: 5n, bob: 0n });
    transfer(desk, "alice", "bob", 1n, cfg);
    transfer(desk, "bob", "alice", 1n, cfg);
    assert.equal(desk.treasury, 0n);
    assert.equal(desk.supply, 1_000_000n);
    assert.equal((desk.balances.get("alice") ?? 0n) + (desk.balances.get("bob") ?? 0n), 5n);
  });
});
