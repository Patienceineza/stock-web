import { useState, useEffect, useCallback } from "react";
import { api } from "@/hooks/api";
import toast from "react-hot-toast";

export const useExchangeRate = () => {
  const [rate, setRate] = useState<number | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current exchange rate
  const fetchExchangeRate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/exchange-rate");
      setRate(response.data.rate);
    } catch (err) {
      setError("Failed to fetch the exchange rate.");
      toast.error("Failed to fetch the exchange rate.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Update the exchange rate (admin only)
  const updateExchangeRate = async (newRate: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.put("/exchange-rate", { rate: newRate });
      setRate(newRate);
      toast.success("Exchange rate updated successfully.");
    } catch (err) {
      setError("Failed to update the exchange rate.");
      toast.error("Failed to update the exchange rate.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate(); // Fetch exchange rate on component mount
  }, [fetchExchangeRate]);

  return { rate, loading, error, fetchExchangeRate, updateExchangeRate };
};
