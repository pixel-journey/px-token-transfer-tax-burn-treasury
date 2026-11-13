# Transfer tax: burn and treasury legs

> **Domain:** fee-on-transfer token math  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** `tax = floor(gross * taxBps / 10000)`, then split tax into **burn** and **treasury** so `burn + treasury + recipient === gross`.

**Code under test:** `npm test` (unit + multi-hop composition).

**Docs:** [docs.wax.io](https://docs.wax.io/). Token shape: [eosio.token](https://github.com/eosio/eosio.contracts).

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | 5% split, dust, pure burn/treasury |
| [TIPS.md](TIPS.md) | Config patterns and mistakes |
| [SECURITY.md](SECURITY.md) | Conservation and production gaps |
| [SOURCES.md](SOURCES.md) | Official + related |

## What is true (executed)

| Rule | Result |
| --- | --- |
| Valid config | tax/burn/treasury/recipient conserve |
| burnBpsOfTax > taxBps | refused |
| Multi-hop | nets + burns + treasury = start |
| applyToSupply | supply decreases by burn only |

```bash
npm test
```

MIT — Pixel Journey
