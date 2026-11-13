# Worked examples — transfer tax

## Example A — 5% tax, half of tax burns

```text
taxBps = 500          // 5% of gross
burnBpsOfTax = 250    // half of the tax burns; half to treasury
gross = 10_000n

tax = floor(10000 * 500 / 10000) = 500
burn = floor(500 * 250 / 500) = 250
toTreasury = 250
toRecipient = 9500
sum legs = 10000
```

## Example B — dust tax

Small gross with low bps → `tax = 0` → burn 0, treasury 0, recipient = gross.  
See also [dust visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer).

## Example C — pure burn tax

`burnBpsOfTax === taxBps` → entire tax burns; treasury 0.

## Example D — pure treasury tax

`burnBpsOfTax === 0` → tax all to treasury; supply unchanged by burn leg.

## Example E — multi-hop composition

Several taxed transfers: `net + totalBurned + totalTreasury === startGross` (composition locks conservation).

## Example F — applyToSupply

`supply' = supply - burn`. Refuses `burn > supply`.
