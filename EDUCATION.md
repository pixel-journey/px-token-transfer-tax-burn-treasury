# Education — transfer tax, burn, and treasury

> **Rung:** `npm test` passes. Not a token, not a DEX, not wasm.  
> **The test is the rule.**

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Split one gross amount into burn, treasury, and recipient without losing units |
| Intermediate | Explain why `burnBpsOfTax` is a share of the tax, and why a 1-unit transfer pays no tax |
| Masterclass | Say why this split must not be applied to the quantity a DEX pool observes |

Neighbor for the floor itself: `px-token-dust-truncation-visualizer`. Neighbor for exact pool delivery: `px-token-dex-differentiated-tax`. Do not collapse them into one sentence.

---

## Beginner — one scene

A transfer of 10000 units is taxed at 300 basis points (3%). Of the tax, 200/300 burns and the rest is treasury.

```text
tax         = floor(10000 * 300 / 10000) = 300
burn        = floor(300 * 200 / 300)     = 200
toTreasury  = 300 - 200                   = 100
toRecipient = 10000 - 300                 = 9700
```

Check: 200 + 100 + 9700 = 10000. The tests assert each of those four numbers.

`applyToSupply` on a supply of 1000000 returns supply `999800` and treasury accrued `100`. Only the burn reduces supply. Treasury is a counter, not an account credit.

### Words

| Word | Meaning here |
| --- | --- |
| `taxBps` | Tax rate on the gross, 0..10000 |
| `burnBpsOfTax` | How much of the **tax** burns, and it cannot exceed `taxBps` |
| Dust | `breakdown(1n, { taxBps: 300, burnBpsOfTax: 200 })` has tax 0 and recipient 1 |
| Conservation | burn + treasury + recipient = gross, checked inside `breakdown` |

### Predict, then run

```bash
npm test
```

1. Tax of 0 on 1000 units: recipient is 1000, tax is 0.
2. `burnBpsOfTax: 101` with `taxBps: 100` throws because burn share cannot exceed the tax.
3. Gross `0n` throws `gross must be positive`.

---

## Intermediate — two different "basis points"

People misread `burnBpsOfTax: 200` as "2% of the gross burns." It is not. 200 is the numerator against `taxBps` (300), so two thirds of the tax burns. Two percent of 10000 would have been 200 as well, which is a coincidence on this one example. Change the gross and the coincidence dies.

Derived, not a separate test: gross 20000, same config.

```text
tax = 600
burn = floor(600 * 200 / 300) = 400
treasury = 200
recipient = 19400
```

Burn is 400, which is not "200 bps of 20000" (that would be 400 — also a coincidence because 2% of gross equals 200/300 of a 3% tax). The identity `burn = floor(gross * burnBpsOfTax / 10000)` is only true when the tax division does not drop a different remainder than the combined division. Do not rewrite the code to tax the gross twice. Follow the two-step formula the file uses.

When `taxBps` is 0, burn is forced to 0 even if you passed a non-zero `burnBpsOfTax`. When the floor tax is 0, burn is also 0. `assertConfig` still requires `burnBpsOfTax <= taxBps`, so `{ taxBps: 0, burnBpsOfTax: 1 }` is refused before the formula runs.

`applyToSupply` throws if burn exceeds supply. It does not move treasury into a balance.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Burn share larger than the tax | Negative treasury | config refused | `refuses burn share above tax` |
| Legs that do not sum | Silent mint or burn | internal conservation check | sum asserted on the 10000 case |
| Tax on 1 unit | You take 1 and pay the recipient 0, or you revert | tax 0, recipient 1 | `dust transfer may yield zero tax` |
| Burn more than supply | Supply wraps | `burn exceeds supply` | source; the happy test uses a supply that covers 200 |

---

## Masterclass — the pool must see the amount you promised

### This split changes what the recipient gets

Recipient gets `gross - tax`. That is correct for a wallet-to-wallet transfer you have documented. It is the wrong number to hand a DEX pair that checked `quantity` against a quote. If the pair expects 10000 and the token delivers 9700, the swap reverts or, worse, the pair's reserve math breaks. `px-token-dex-differentiated-tax` exists because exact delivery is a different rule: the pool's observed amount stays intact, and the tax is taken on a side the pair is not measuring. This lab does not do that. Do not paste `breakdown` into a `transfer` that Alcor or Taco will see.

### Issuer, exemptions, width

Not in this repo:

- `require_auth` of the issuer for changing `taxBps`.
- An exemption list (the pair, the burn account, a fee-free merchant).
- A real burn (retire / transfer to the burn name) versus a local supply counter.
- A treasury account that actually receives `toTreasury` in the same action.
- `__int128` for `gross * taxBps` before dividing. `bigint` hides that class of overflow; the cap is `MAX_AMOUNT` (`2^62 - 1`).

### Exercise

Config `{ taxBps: 10000, burnBpsOfTax: 10000 }` on gross 50. Derived: tax 50, burn 50, treasury 0, recipient 0. Conservation holds. The tests do not use a 100% rate. `px-token-dust-truncation-visualizer` does assert a 100% `taxBps` on a different helper (`tax` 500, `net` 0) with no burn split.

Who is allowed to set the rate in this repo? Nobody. There is no setter.

---

## What this course will not teach

- A balance table
- Exact-out DEX delivery
- That 200 burn on the sample is "2% of gross" as the definition of the field (it is two thirds of a 3% tax)
