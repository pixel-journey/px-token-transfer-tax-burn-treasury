# Official sources

| Source | Use |
| --- | --- |
| [eosio.token](https://github.com/eosio/eosio.contracts) | Transfer / supply primitives |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Actions, assets |
| [ANTELOPE-PORTABILITY](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ANTELOPE-PORTABILITY.md) | Floor formula ports; symbol and precision do not |
| [wharfkit/skill](https://github.com/wharfkit/skill) | SessionKit if a host later transfers |
| [invariant kit](https://github.com/pixel-journey/px-invariant-kit) | Shared bps helpers |

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

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

## Portability

`floor(amount * bps / 10000)` ports to any Antelope token contract after you swap the symbol and precision. **PXJ precision is always 8** in this org. EOS system token is precision 4. `334` at 30 bps is a **minor-unit** cutoff, not 334 whole tokens.

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
