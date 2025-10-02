// Currency configuration and utilities

export type CurrencyCode = "NOK" | "GBP" | "USD" | "EUR" | "SEK" | "DKK";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  stripeCode: string; // Stripe currency code (lowercase)
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  NOK: {
    code: "NOK",
    symbol: "kr",
    name: "Norske kroner",
    locale: "nb-NO",
    stripeCode: "nok",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    locale: "en-GB",
    stripeCode: "gbp",
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    locale: "en-US",
    stripeCode: "usd",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    locale: "de-DE",
    stripeCode: "eur",
  },
  SEK: {
    code: "SEK",
    symbol: "kr",
    name: "Svenske kronor",
    locale: "sv-SE",
    stripeCode: "sek",
  },
  DKK: {
    code: "DKK",
    symbol: "kr",
    name: "Danske kroner",
    locale: "da-DK",
    stripeCode: "dkk",
  },
};

/**
 * Format price in the given currency
 * @param amount - Amount in the smallest currency unit (øre for NOK, pence for GBP, cents for USD)
 * @param currencyCode - ISO currency code
 * @returns Formatted price string
 */
export function formatPrice(amount: number, currencyCode: CurrencyCode): string {
  // Handle free tickets
  if (amount === 0) {
    return "Gratis";
  }

  const currency = CURRENCIES[currencyCode];
  if (!currency) {
    // Fallback to NOK if currency not found
    return formatPrice(amount, "NOK");
  }

  const formatter = new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "NOK" ? 0 : 2,
  });

  return formatter.format(amount / 100);
}

/**
 * Get currency symbol for a currency code
 */
export function getCurrencySymbol(currencyCode: CurrencyCode): string {
  return CURRENCIES[currencyCode]?.symbol || "kr";
}

/**
 * Get Stripe currency code for a currency code
 */
export function getStripeCurrencyCode(currencyCode: CurrencyCode): string {
  return CURRENCIES[currencyCode]?.stripeCode || "nok";
}

/**
 * Get currency name for a currency code
 */
export function getCurrencyName(currencyCode: CurrencyCode): string {
  return CURRENCIES[currencyCode]?.name || "Norske kroner";
}

/**
 * Get all available currencies
 */
export function getAvailableCurrencies(): CurrencyConfig[] {
  return Object.values(CURRENCIES);
}

/**
 * Default currency for new events (can be made dynamic based on location)
 */
export const DEFAULT_CURRENCY: CurrencyCode = "NOK";

/**
 * Detect currency based on location/country (simplified logic)
 * In a real app, this could use geolocation or user preferences
 */
export function detectCurrencyFromLocation(location: string): CurrencyCode {
  const locationLower = location.toLowerCase();

  if (locationLower.includes("norway") || locationLower.includes("norge") || locationLower.includes("oslo")) {
    return "NOK";
  }
  if (locationLower.includes("uk") || locationLower.includes("britain") || locationLower.includes("london") || locationLower.includes("england")) {
    return "GBP";
  }
  if (locationLower.includes("sweden") || locationLower.includes("sverige") || locationLower.includes("stockholm")) {
    return "SEK";
  }
  if (locationLower.includes("denmark") || locationLower.includes("danmark") || locationLower.includes("copenhagen")) {
    return "DKK";
  }
  if (locationLower.includes("usa") || locationLower.includes("america") || locationLower.includes("new york")) {
    return "USD";
  }
  if (locationLower.includes("germany") || locationLower.includes("deutschland") || locationLower.includes("berlin")) {
    return "EUR";
  }

  // Default to NOK for Norway-based system
  return DEFAULT_CURRENCY;
}

/**
 * Safely get currency code from string, with fallback
 */
export function safeCurrencyCode(currency: string | undefined): CurrencyCode {
  if (!currency) return DEFAULT_CURRENCY;

  const validCurrencies = Object.keys(CURRENCIES) as CurrencyCode[];
  if (validCurrencies.includes(currency as CurrencyCode)) {
    return currency as CurrencyCode;
  }

  return DEFAULT_CURRENCY;
}
