import { useState, useCallback } from 'react';
import axios from 'axios';
import { api, queryString } from '.';
import toast from 'react-hot-toast';

export const useStockMovements = () => {
  const [stockMovements, setStockMovements] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStockMovements = useCallback(async (query?:string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/stock-movements${queryString(query)}`);
      setStockMovements(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createStockMovement = async (stockMovement: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/stock-movements', stockMovement);
     fetchStockMovements()
      toast.success('Stock movement created successfully');
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while creating stock movement.');
      toast.error(error.response?.data?.message || 'An error occurred while creating stock movement.');
    } finally {
      setLoading(false);
    }
  };

//   const updateStockMovement = async (id: string, stockMovement: any) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.put(`/stockMovements/${id}`, stockMovement);
//       setStockMovements(prev => prev.map(sm => (sm._id === id ? response.data : sm)));
//       toast.success('Stock movement updated successfully');
//     } catch (error: any) {
//       setError(error.response?.data?.message || 'An error occurred while updating stock movement.');
//       toast.error(error.response?.data?.message || 'An error occurred while updating stock movement.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteStockMovement = async (id: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await api.delete(`/stockMovements/${id}`);
//       setStockMovements(prev => prev.filter(sm => sm._id !== id));
//       toast.success('Stock movement deleted successfully');
//     } catch (error: any) {
//       setError(error.response?.data?.message || 'An error occurred while deleting stock movement.');
//       toast.error(error.response?.data?.message || 'An error occurred while deleting stock movement.');
//     } finally {
//       setLoading(false);
//     }
//   };

  return {
    stockMovements,
    loading,
    error,
    fetchStockMovements,
    createStockMovement,
    // updateStockMovement,
    // deleteStockMovement,
  };
};