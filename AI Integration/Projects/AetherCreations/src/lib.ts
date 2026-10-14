const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const formatPrice = (value: number) => usd.format(value);

export const unsplash = (photo: string, width: number) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=80`;

export const unsplashSrcSet = (photo: string, widths: readonly number[]) =>
  widths.map((w) => `${unsplash(photo, w)} ${w}w`).join(", ");
