# Education

A simple taxed transfer:

```text
tax          = floor(gross * taxBps / 10000)
burn         = floor(tax * burnBpsOfTax / taxBps)   // when taxBps > 0
toTreasury   = tax - burn
toRecipient  = gross - tax
```

**Conservation:** `burn + toTreasury + toRecipient === gross`.

Burn is the only leg that reduces **supply** in this lab. Treasury accrual is tracked as a separate counter (production would credit an account).

DEX-facing “exact delivery” is a **different** rule — see `px-token-dex-differentiated-tax`.
