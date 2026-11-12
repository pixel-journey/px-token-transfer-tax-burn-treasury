# Transfer tax that still adds up

> **Trust:** private educational lab (Tier B)  
> **Domain:** token transfer tax  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach a transfer tax in basis points where tax is split between **burn (supply−−)** and **treasury**, and the three legs still equal the gross amount.

**Real code:** `npm test`. **Not** a full token, **not** wasm.

Reference: [eosio.token](https://github.com/eosio/eosio.contracts). Docs: [docs.wax.io](https://docs.wax.io/). Shared bps: [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit).

## What is true (executed)

| Rule | Result |
| --- | --- |
| 3% tax, 200/300 of tax burns | burn + treasury + recipient = gross |
| Dust gross | tax can be 0 |
| Only burn reduces supply in `applyToSupply` | treasury is accrued counter |

## Related

- [px-token-balance-ledger](https://github.com/pixel-journey/px-token-balance-ledger)
- [px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer)
- [px-token-dex-differentiated-tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax)

## Run

```bash
npm test
```

MIT — Pixel Journey
