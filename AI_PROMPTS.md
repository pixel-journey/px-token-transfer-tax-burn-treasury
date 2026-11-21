# AI prompts

Non-negotiables:

- Wallet path: `burn + treasury + recipient === gross`.
- `burnBpsOfTax` is a share of the **tax**, not of gross.
- At 30 bps, amounts 1..333 pay tax 0. First non-dust is 334 minor units.
- **PXJ precision is always 8.** 334 units is `0.00000334` PXJ, not 334 PXJ.
- Do not mix with DEX tax (`delivered === qty` is the other lab).
- `floor(amount * bps / 10000)` ports; symbol and precision do not.
- No wasm, no live transfer, no Hyperion.

Prompt seeds:

1. Gross 1000, tax 50: who receives what, and what is conserved?
2. Explain 200/300 of the tax as burn without calling it 2% of gross.
3. Port to a precision-4 token without changing the floor formula.
4. Refuse a "fix" that lowers PXJ precision to hide dust.
