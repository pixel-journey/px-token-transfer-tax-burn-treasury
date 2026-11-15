# Worked examples — transfer tax burn + treasury

Config under test: `taxBps 300`, `burnBpsOfTax 200` (burn is a share **of the tax**, not of the gross).

## breakdown on gross 10_000

| Field | Value |
| --- | --- |
| tax | 300 |
| burn | 200 |
| toTreasury | 100 |
| toRecipient | 9_700 |
| sum | 10_000 = gross |

Zero tax → full amount to recipient. Gross 1 at 300 bps → tax 0 (dust). Tax 0 keeps burn 0 even if burnBpsOfTax is set.

Config refusals: burn share of tax > tax, taxBps > 10000. Gross 0 / negative / above MAX_AMOUNT refused.

## applyToSupply

Supply 1_000_000 after one 10_000 transfer → supply **999_800** (only burn reduces supply), treasuryAccrued **100**. Burn larger than supply refused.

## Composition (two hops)

Alice starts with 50_000.

1. alice→bob 10_000 → alice 40_000, bob 9_700, treasury 100, supply −200.
2. bob→carol 9_700 → bob 0, carol = recipient of breakdown(9700), treasury += that hop's treasury, supply − that hop's burn.

Tracked: balances + treasury + burns = **50_000** throughout.

Overdraft 101 of 100 leaves desk unchanged. Supply 100 cannot absorb burn from gross 10_000. Dust 1→ hops leave treasury 0 and supply unchanged.
