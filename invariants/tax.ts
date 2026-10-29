/**
 * Transfer tax: bps of amount, split between burn and treasury (educational).
 * burnBps + treasuryBps must equal taxBps. Floors apply; remainder to treasury leg.
 */

export const MAX_BPS = 10_000;
export const MAX_AMOUNT = 4_611_686_018_427_387_903n;

export type TaxConfig = {
  /** Total tax on transfer, 0..10000 */
  taxBps: number;
  /** Portion of tax that burns supply, 0..taxBps */
  burnBpsOfTax: number;
};

export type TaxBreakdown = {
  gross: bigint;
  tax: bigint;
  burn: bigint;
  toTreasury: bigint;
  toRecipient: bigint;
};

export function assertAmount(amount: bigint): bigint {
  if (typeof amount !== "bigint") throw new Error("amount must be bigint");
  if (amount < 0n) throw new Error("amount must not be negative");
  if (amount > MAX_AMOUNT) throw new Error("amount exceeds MAX_AMOUNT");
  return amount;
}

export function assertConfig(config: TaxConfig): TaxConfig {
  const { taxBps, burnBpsOfTax } = config;
  if (!Number.isInteger(taxBps) || taxBps < 0 || taxBps > MAX_BPS) {
    throw new Error("taxBps must be 0..10000");
  }
  if (!Number.isInteger(burnBpsOfTax) || burnBpsOfTax < 0 || burnBpsOfTax > MAX_BPS) {
    throw new Error("burnBpsOfTax must be 0..10000");
  }
  if (burnBpsOfTax > taxBps) throw new Error("burnBpsOfTax cannot exceed taxBps");
  return config;
}

/**
 * Compute transfer legs.
 * tax = floor(gross * taxBps / 10000)
 * burn = floor(tax * burnBpsOfTax / taxBps) when taxBps > 0, else 0
 * toTreasury = tax - burn  (remainder of tax stays out of burn)
 * toRecipient = gross - tax
 */
export function breakdown(gross: bigint, config: TaxConfig): TaxBreakdown {
  assertAmount(gross);
  assertConfig(config);
  if (gross === 0n) throw new Error("gross must be positive");

  const tax = (gross * BigInt(config.taxBps)) / 10_000n;
  let burn = 0n;
  if (config.taxBps > 0 && tax > 0n) {
    burn = (tax * BigInt(config.burnBpsOfTax)) / BigInt(config.taxBps);
  }
  const toTreasury = tax - burn;
  const toRecipient = gross - tax;
  if (toRecipient < 0n || toTreasury < 0n) throw new Error("internal: negative leg");
  if (burn + toTreasury + toRecipient !== gross) {
    throw new Error("internal: conservation failed");
  }
  return { gross, tax, burn, toTreasury, toRecipient };
}

/** Apply tax to supply: burn reduces supply; treasury is accounting only here. */
export function applyToSupply(
  supply: bigint,
  b: TaxBreakdown
): { supply: bigint; treasuryAccrued: bigint } {
  assertAmount(supply);
  if (b.burn > supply) throw new Error("burn exceeds supply");
  return {
    supply: supply - b.burn,
    treasuryAccrued: b.toTreasury,
  };
}
