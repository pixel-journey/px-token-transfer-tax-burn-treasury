# Official sources

| Source | Use |
| --- | --- |
| [eosio.token](https://github.com/eosio/eosio.contracts) | Transfer / supply primitives |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Actions, assets |

Tax-on-transfer is a **dapp token policy**, not a system contract feature.

**Wallet path (do not mix with DEX):**

```text
tax       = floor(gross * taxBps / 10000)
recipient = gross - tax
burn      = floor(tax * burnBpsOfTax / taxBps)   # share of the tax, not of gross
treasury  = tax - burn
burn + treasury + recipient === gross
```

`burnBpsOfTax` is a share of the **tax**. On the 3% sample, 200 of 300 basis points of the tax burns — not 2% of gross. At 30 bps, amounts `1..333` pay tax 0 ([dust](https://github.com/pixel-journey/px-token-dust-truncation-visualizer)).

C++ mirror: [pxtax](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxtax) — accounting only, not deployed.

## Related labs

| Repo | Role |
| --- | --- |
| [dex tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax) | Pool sees exact qty; tax is extra debit |
| [dust](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) | First non-dust amount at 30 bps is 334 |
| [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Post-receive split; last leg remainder |
| [ledger](https://github.com/pixel-journey/px-token-balance-ledger) | sum(balances) === supply |
| [invariant kit](https://github.com/pixel-journey/px-invariant-kit) | Shared bps helpers |
| [treasury path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/TREASURY-TOKEN-LEARNING-PATH.md) | Formulas cheatsheet |
