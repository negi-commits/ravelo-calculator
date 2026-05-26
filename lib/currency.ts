export type CurrencyCode = "USD" | "INR" | "AED";

export const CURRENCIES: Record<
  CurrencyCode,
  { symbol: string; locale: string; defaultHourly: number }
> = {
  USD: { symbol: "$",    locale: "en-US", defaultHourly: 25  },
  INR: { symbol: "₹",   locale: "en-IN", defaultHourly: 300 },
  AED: { symbol: "AED", locale: "en-AE", defaultHourly: 75  },
};

export function formatMoney(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(CURRENCIES[currency].locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
