import { api } from ".";

export const fetchInventoryReport = async () => {
  try {
    const response = await api.get("/reports/inventory");
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory report:", error);
    throw error;
  }
};


export const fetchSalesReport = async () => {
  try {
    const response = await api.get("/reports/sales");
    return response.data;
  } catch (error) {
    console.error("Error fetching sales report:", error);
    throw error;
  }
};


export const fetchBestSellingReport = async () => {
  try {
    const response = await api.get("/reports/best-selling");
    return response.data;
  } catch (error) {
    console.error("Error fetching best-selling products report:", error);
    throw error;
  }
};
