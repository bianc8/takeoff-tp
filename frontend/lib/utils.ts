import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatStringToUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
