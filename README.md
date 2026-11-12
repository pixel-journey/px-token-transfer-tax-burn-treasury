# Transfer tax that still adds up

> **Trust:** private educational lab (Tier B)  
> **Domain:** token transfer tax  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach a transfer tax in basis points where tax is split between **burn (supply−−)** and **treasury**, and the three legs still equal the gross amount.

**Real code:** `npm test` (unit + **sequential composition**). This repo has **no** wasm.

**Production mirror (C++ → wasm):** [wax-contract-compiler `pxtax`](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxtax) — [run 29](https://github.com/pixel-journey/wax-contract-compiler/actions/runs/43213453996). WASM SHA256 `b40adbdbe4d567830d0d32904500d5d5785026de8bce3845e50ff0e8a338fc29`. Audit **0 errors / 0 warnings**. Does **not** transfer tokens or reduce live supply. **Not deployed.**

Reference: [eosio.token](https://github.com/eosio/eosio.contracts). Docs: [docs.wax.io](https://docs.wax.io/). Shared bps: [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit).

## Composition note

`tax.composition.test.ts` runs a desk of sequential taxed hops. Balances + treasury + burned always equals the seeded spendable amount. Only burn reduces `supply`. Overdraft and burn-above-supply leave the desk unchanged. Dust gross can tax 0.

## What is true (executed)

| Rule | Result |
| --- | --- |
| 3% tax, 200/300 of tax burns | burn + treasury + recipient = gross |
| Dust gross | tax can be 0 |
| Only burn reduces supply in `applyToSupply` | treasury is accrued counter |
| Sequential hops | tracked sum conserved |

## Related

- [px-token-balance-ledger](https://github.com/pixel-journey/px-token-balance-ledger)
- [px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer)
- [px-token-dex-differentiated-tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax)

## Run

```bash
npm test
```

MIT — Pixel Journey
