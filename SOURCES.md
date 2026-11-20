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

`burnBpsOfTax` is a share of the **tax**. On the 3% sample, 200 of 300 basis points of the tax burns — not 2% of gross. At 30 bps, amounts `1..333` pay tax 0 ([px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer)).

C++ mirror: `wax-contract-compiler` (private; not this public course) — accounting only, not deployed.

## Related labs

| Repo | Role |
| --- | --- |
| [dex tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax) | Pool sees exact qty; tax is extra debit |
| [px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) | First non-dust amount at 30 bps is 334 |
| [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Post-receive split; last leg remainder |
| [ledger](https://github.com/pixel-journey/px-token-balance-ledger) | sum(balances) === supply |
| [invariant kit](https://github.com/pixel-journey/px-invariant-kit) | Shared bps helpers |
| `px-contract-examples-vault` (private; not this public course) | Formulas cheatsheet |
