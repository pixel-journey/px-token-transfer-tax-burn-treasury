# Security — wallet transfer tax (burn + treasury)

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Bad bps ranges | assertConfig |
| `burnBpsOfTax > taxBps` | refused |
| Conservation break | internal throw (`burn + treasury + recipient == gross`) |
| Burn > supply | applyToSupply refused |
| Zero gross | refused |

Recipient gets `gross - tax`. That is correct for a documented **wallet** transfer. It is the wrong number for a pool that quoted `gross` — use [dex tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax).

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Who pays tax | Usually sender’s transfer path; document fee-on-transfer UX |
| Exempt list | Issuer / AMM pairs if any — explicit, not a memo the user types |
| Notify path | Only your token contract; ignore self-outbound |
| Pause | Emergency disable tax or transfers |
| Precision | Match token precision; integer units only |
| Wide multiply | `gross * taxBps` before `/ 10000` |

## Attack angles

1. Reading 200 as "2% of gross burns" as the field definition (it is a share of the **tax**).
2. Burning without reducing supply.
3. Pasting `breakdown` into an Alcor `transfer` (pool would see net).
4. Taxing 1 unit and reverting, or taking the whole unit — this lab floors to tax 0 on dust amounts.

## Honesty limits

No wasm. Mirror: [pxtax](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxtax). Related: [dust](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) · [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter).
