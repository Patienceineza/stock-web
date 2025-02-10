import { useState } from "react";
import { useExchangeRate } from "@/hooks/api/exchangeRate";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ExchangeRateManager = () => {
  const { rate, loading, updateExchangeRate } = useExchangeRate();
  const [newRate, setNewRate] = useState<number>(rate);
  const { t } = useTranslation();

  const handleUpdate = async () => {
    if (newRate > 0) {
      await updateExchangeRate(newRate);
    } else {
      alert("Please enter a valid exchange rate.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-gray-500 dark:text-gray-300 flex space-x-2 text-sm">
        <Link to="/Account" className="hover:text-gray-700 dark:hover:text-white">Home</Link>
        <span>/</span>
        <span className="text-black dark:text-white">Exchange Rate</span>
      </nav>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Manage Exchange Rate
      </h1>

      {/* Loading State */}
      {loading ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">Loading current rate...</p>
      ) : (
        <div className="space-y-6">
          {/* Current Rate */}
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>Current Exchange Rate:</strong> {rate ? `${rate} CDF/USD` : "Unavailable"}
            </p>
          </div>

          {/* Input Field */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              New Exchange Rate (CDF/USD)
            </label>
            <input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(Number(e.target.value))}
              placeholder="Enter new rate"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            
            {/* Update Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleUpdate}
                className="btn btn-primary"
              >
                Update Exchange Rate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeRateManager;
