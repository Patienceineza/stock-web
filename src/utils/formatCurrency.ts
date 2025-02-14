import { useEffect, useState } from "react";


export const formatCurrency = (amount: number, exchangeRate: number): string => {
  const selectedCurrency = localStorage.getItem("selectedCurrency") || "USD";

  // Convert the amount
  const convertedAmount = selectedCurrency === "CDF" ? amount * exchangeRate : amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: selectedCurrency,
  }).format(convertedAmount);
};


export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string, exchangeRate: number) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (fromCurrency === "USD" && toCurrency === "CDF") {
    return amount * exchangeRate;
  } else if (fromCurrency === "CDF" && toCurrency === "USD") {
    return amount / exchangeRate;
  }

  return amount; // Fallback
};
