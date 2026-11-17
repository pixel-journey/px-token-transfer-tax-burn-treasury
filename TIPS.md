# Tips — wallet transfer tax (not a DEX quote)

Recipient gets `gross - tax`. That is correct for a documented wallet transfer. It is the wrong number to hand a pool that quoted `gross`. Use [dex tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax) when the pool must observe the full amount.

## Math

- `tax = floor(gross * taxBps / 10000)`
- `burn = floor(tax * burnBpsOfTax / taxBps)` when tax is positive
- `toTreasury = tax - burn`
- `toRecipient = gross - tax`
- Check `burn + treasury + recipient == gross`
- `burnBpsOfTax` is a share of the **tax**, not automatically "bps of gross"

Sample that the tests lock: gross 10000, taxBps 300, burnBpsOfTax 200 → tax 300, burn 200, treasury 100, recipient 9700.

## Config shapes

| Goal | Setting |
| --- | --- |
| Deflation only | `burnBpsOfTax = taxBps` |
| Treasury only | `burnBpsOfTax = 0` |
| Split | `burnBpsOfTax` strictly between |

`burnBpsOfTax > taxBps` is refused (treasury would go negative).

## Common mistakes

1. Reading 200 as "2% of gross burns" as the definition of the field. On the sample it coincides; the definition is two thirds of a 3% tax.
2. Burning without reducing supply.
3. Taxing 1 unit and reverting, or taking the whole unit. This lab's floor leaves tax 0 and recipient 1.
4. Pasting `breakdown` into an Alcor `transfer`.
5. Exempting nobody, including the pair, then wondering why swaps fail.

## Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| Issuer and pair exemption list | Must not be a memo the user types |
| Admin setter under msig | No setter exists here |
| Min tax of 1 | Changes the dust story; retest |

Wide multiply before divide on chain. `bigint` hides that class of overflow; `MAX_AMOUNT` is `2^62 - 1`.

Related: [dust](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) · [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) · [ledger](https://github.com/pixel-journey/px-token-balance-ledger) · [pxtax](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxtax)
