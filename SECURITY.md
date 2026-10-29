# Security notes

| Issue | Lab mitigation |
|-------|----------------|
| Tax legs do not sum to gross | conservation check |
| burn share > tax | config refused |
| Burn past supply | applyToSupply refused |

Production needs issuer authority, pool exemptions, and DEX exact-amount paths where required.
