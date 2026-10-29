# Transfer tax that still adds up

> **Trust:** private educational lab (Tier B)  
> **Quest:** 105 — transfer tax burn + treasury  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach a transfer tax in basis points where tax is split between **burn (supply−−)** and **treasury**, and the three legs still equal the gross amount.

**Real code:** `npm test`. **Not** a full token, **not** wasm, **not** a DEX exact-delivery path.

## What you can learn

- Why `floor(gross * bps / 10000)` can be zero on a dust transfer.
- Why the burn share is a fraction **of the tax**, not a second tax on the gross.
- Why the treasury leg is the remainder of the tax, so burn + treasury + recipient equals gross.
- Why only the burn leg reduces supply in this lab.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `invariants/tax.ts` | `assertConfig`, `breakdown`, `applyToSupply` |
| `invariants/tax.test.ts` | Executed claims |
| `EDUCATION.md` | The four formulas |
| `SECURITY.md` | Conservation and the production gaps |

## What is true (executed)

Config `{ taxBps: 300, burnBpsOfTax: 200 }` is a 3% tax. Of that tax, `200/300` burns and the rest goes to treasury.

| Rule | Result |
| --- | --- |
| `breakdown(10000n, that config)` | tax `300`, burn `200`, treasury `100`, recipient `9700` |
| Sum of burn + treasury + recipient | equals gross |
| `taxBps: 0` on `1000n` | tax `0`, recipient `1000` |
| `breakdown(1n, that config)` | tax `0`, recipient `1` (dust) |
| `burnBpsOfTax` above `taxBps` | refused |
| Gross `0n` | refused |
| `applyToSupply(1000000n, that breakdown)` | supply drops by `200` only; treasury accrued is `100` |

## The rule, in order

```text
tax         = floor(gross * taxBps / 10000)
burn        = floor(tax * burnBpsOfTax / taxBps)   when taxBps > 0 and tax > 0
toTreasury  = tax - burn
toRecipient = gross - tax
```

`assertConfig` requires integer `taxBps` and `burnBpsOfTax` in `0..10000`, and `burnBpsOfTax <= taxBps`. Amounts must be non-negative `bigint` at or below `MAX_AMOUNT` (`2^62 - 1`). Gross must be positive.

```ts
import { breakdown, applyToSupply } from "./invariants/tax.ts";

const b = breakdown(10_000n, { taxBps: 300, burnBpsOfTax: 200 });
// b.tax === 300n, b.burn === 200n, b.toTreasury === 100n, b.toRecipient === 9700n

const next = applyToSupply(1_000_000n, b);
// next.supply === 999_800n, next.treasuryAccrued === 100n
```

## Edge cases

- A small gross can pay zero tax even when `taxBps` is not zero. The whole amount stays with the recipient.
- When tax is zero, burn stays zero even if `burnBpsOfTax` is non-zero. The burn formula is skipped when `tax === 0`.
- `applyToSupply` refuses a burn larger than current supply. It does not credit a treasury account. `treasuryAccrued` is a counter on the return value.
- Conservation is checked inside `breakdown`. A negative leg is an internal error, not a user path the tests exercise.

## Best practice and the opposite

**Do** split the tax after it is computed, then give the remainder of the tax to treasury.  
**Do** test a 1-unit transfer, not only round numbers.

**Do not** treat `burnBpsOfTax` as basis points of the gross. It is basis points of the tax (`0..taxBps`).  
**Do not** call this an exact-out DEX tax. That rule lives in `px-token-dex-differentiated-tax`.

## Live path, not shipped

```
breakdown + applyToSupply          [tested]
    → issuer authority                [not in this repo]
    → token transfer that moves balances [not in this repo]
    → pool / DEX exemption             [not in this repo]
```

See [EDUCATION.md](EDUCATION.md) and [SECURITY.md](SECURITY.md).

## Related

- `px-token-dust-truncation-visualizer` — when floor tax is zero
- `px-token-dex-differentiated-tax` — exact delivery, a different rule
- Vault index: `px-contract-examples-vault`

## Run

```bash
npm test
```

MIT — Pixel Journey
