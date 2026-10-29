# px-token-transfer-tax-burn-treasury

> **Trust:** private educational lab (Tier B)  
> **Quest:** 105 — transfer tax burn + treasury  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach a transfer tax in bps where tax is split between **burn (supply−−)** and **treasury**, with conservation of gross amount.

**Real code:** `npm test`. **Not** a full token or wasm.

---

## What is true (executed)

| Rule | Result |
|------|--------|
| 10000 @ 300 bps, 200 burn-of-tax | tax 300 · burn 200 · treasury 100 · recipient 9700 |
| Zero tax | full amount to recipient |
| Dust | may be zero tax |
| burnBpsOfTax > taxBps | refused |

```bash
npm test
```

Related: `px-token-dust-truncation-visualizer`, `px-token-dex-differentiated-tax`.

## License

MIT — Pixel Journey
