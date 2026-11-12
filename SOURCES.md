# Official sources

Transfer taxes are **token policy**, not a WAX system feature. Always verify the live token ABI.

| Source | Use |
| --- | --- |
| [eosio.token reference](https://github.com/eosio/eosio.contracts) | Transfer / supply primitives |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Actions, permissions |
| [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit) | Shared `bps` / quantity helpers |

## Domain map

| Repo | Role |
| --- | --- |
| [px-token-balance-ledger](https://github.com/pixel-journey/px-token-balance-ledger) | Conservation ledger |
| **This repo** | Gross tax → burn + treasury + recipient |
| [px-token-dex-differentiated-tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax) | DEX exact delivery + sell/transfer tax |
| [px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) | When floor tax is zero |
| [px-treasury-incoming-fee-splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Full 10000 bps fan-out |
