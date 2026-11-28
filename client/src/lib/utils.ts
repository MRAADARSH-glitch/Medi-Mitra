import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Format a number or numeric string as Indian rupees, e.g. ₹1,500 */
export function formatINR(value: number | string | null | undefined): string {
  const n = Number(value);
  return inrFormatter.format(Number.isFinite(n) ? n : 0);
}
