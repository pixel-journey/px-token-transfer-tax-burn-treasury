# Security notes — transfer tax

## Mitigated in the lab

| Issue | Behavior |
| --- | --- |
| Bad bps ranges | assertConfig |
| burnBpsOfTax > taxBps | refused |
| Conservation break | internal throw |
| Burn > supply | applyToSupply refused |
| Zero gross | refused |

## Production still needs

| Concern | Guidance |
| --- | --- |
| Who pays tax | Usually sender’s transfer path; document fee-on-transfer UX |
| Exempt list | Issuer / AMM pairs if any — explicit |
| Notify path | Only your token contract; ignore self-outbound |
| Pause | Emergency disable tax or transfers |
| Precision | Match token precision; integer units only |

No wasm in this repo. Mirror: [pxtax](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxtax) if present in compiler tree.
