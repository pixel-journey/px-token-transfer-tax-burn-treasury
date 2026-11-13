# Tips — transfer taxes

## Math

- Always verify `burn + toTreasury + toRecipient === gross`.
- Prefer wide intermediates for `gross * taxBps`.
- Document whether exempt accounts (issuer, pairs) exist — this lab taxes every gross.

## Product design

| Goal | Config idea |
| --- | --- |
| Deflation only | burnBpsOfTax = taxBps |
| Treasury only | burnBpsOfTax = 0 |
| Split | burnBpsOfTax in (0, taxBps) |

## Related

| Lab | Role |
| --- | --- |
| [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Split after receive |
| [dust visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) | Zero tax floors |
| [balance ledger](https://github.com/pixel-journey/px-token-balance-ledger) | Open/transfer book |
| [pxtax mirror](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxtax) | C++ preview |

## Common mistakes

1. Applying tax bps to the **net** instead of gross.
2. Burning without lowering supply.
3. Ignoring dust so users think 30 bps always takes something.
