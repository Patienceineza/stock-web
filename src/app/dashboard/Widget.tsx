import { useEffect, useState } from "react";
import {
  fetchInventoryReport,
  fetchSalesReport,
  fetchBestSellingReport,
} from "@/hooks/api/reports";
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { ImSpinner8 } from "react-icons/im";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianAxis,
  ComposedChart,
  Area
} from "recharts";
import Card from "@/components/ui/card";
import { PiMoneyLight } from "react-icons/pi";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { LiaLuggageCartSolid } from "react-icons/lia";

const Reports = () => {
  const { t } = useTranslation(); // For translations if needed

  const [inventoryReport, setInventoryReport] = useState<any>([]);
  const [salesReport, setSalesReport] = useState<any>([]);
  const [bestSellingReport, setBestSellingReport] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const [inventory, sales, bestSelling] = await Promise.all([
          fetchInventoryReport(),
          fetchSalesReport({ query: query || "" }),
          fetchBestSellingReport(),
        ]);

        setInventoryReport(inventory);
        setSalesReport(sales);
        setBestSellingReport(bestSelling?.data);
      } catch (err) {
        setError(t("reports.errorFetchingReports"));
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [t]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const sales = await fetchSalesReport({ query: query || "" })
        setSalesReport(sales);
      } catch (err) {
        setError(t("reports.errorFetchingReports"));
        console.error("Error fetching reports:", err);
      }
    }
    fetchSales();
  }, [query])

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><ImSpinner8 className="animate-spin text-4xl text-blue-500" /></div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Colors for pie chart
  // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];


  const besellingData = bestSellingReport.map((item: any) => ({
    name: item.productName,
    quantitySold: item.quantitySold,
    averagePrice: item.averagePrice,
  }));

  const salesData = salesReport?.topProducts.map((item: any) => ({
    name: item.name,
    quantitySold: item.quantity,
    revenue: item.revenue,
  }));

  interface DataType {
    productName: string;
    quantity: number;
    status: number;
    stockValue: number;
  }
  const columns: TableColumnsType<DataType> = [
    {
      title: "#",
      dataIndex: "index"
    },
    {
      title: "product Name",
      dataIndex: "productName"
    },
    {
      title: "quantity",
      dataIndex: "quantity",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "status",
      dataIndex: "status"
    },
    {
      title: "stockValue",
      dataIndex: "stockValue",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.stockValue - b.stockValue,
    }
  ]
  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  interface LowStockItem {
    productName: string;
    quantity: number;
    status: string;
    stockValue: number;
  }

  const lowerStock = inventoryReport.lowStockItems.map((item: LowStockItem, index: number) => ({
    index: index + 1,
    productName: item.productName,
    quantity: item.quantity,
    status: item.status,
    stockValue: item.stockValue,
  }));

  const inventory = inventoryReport.inventorySummary.map((item: LowStockItem, index: number) => ({
    index: index + 1,
    productName: item.productName,
    quantity: item.quantity,
    status: item.status,
    stockValue: item.stockValue,
  }));

  // const SalesReport = () => {
  //   const [salesReport, setSalesReport] = useState<any>(null);
  //   const { t } = useTranslation();

  //   useEffect(() => {
  //     const fetchSalesReport = async () => {
  //       try {
  //         const response = await fetch("/api/reports/sales");
  //         const result = await response.json();
  //         setSalesReport(result);
  //       } catch (error) {
  //         console.error(t("reports.errorFetchingSales"), error);
  //       }
  //     };

  //     fetchSalesReport();
  //   }, [t]);

  //   if (!salesReport) {
  //     return <p>{t("reports.loadingSalesReport")}</p>;
  //   }

  //   return (
  //     <div className="p-6 space-y-6">
  //       <h1 className="text-3xl font-bold">{t("reports.salesReportTitle")}</h1>

  //       {/* Cards Section */}
  //       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  //         <Card title={t("reports.totalSales")} value={`$${salesReport.totalSales.toFixed(2)}`} color="text-blue-500" />
  //         <Card title={t("reports.totalOrders")} value={salesReport.totalOrders} color="text-green-500" />
  //         <Card title={t("reports.averageOrderValue")} value={`$${salesReport.averageOrderValue.toFixed(2)}`} color="text-purple-500" />
  //         <Card title={t("reports.totalQuantity")} value={salesReport.totalQuantity} color="text-orange-500" />
  //         <Card title={t("reports.totalDiscount")} value={`${salesReport.totalDiscount}%`} color="text-red-500" />
  //         <Card title={t("reports.totalTax")} value={`${salesReport.totalTax}%`} color="text-yellow-500" />
  //         <Card title={t("reports.totalProfit")} value={`$${salesReport.totalProfit.toFixed(2)}`} color="text-pink-500" />
  //         <Card title={t("reports.averageItemsPerOrder")} value={salesReport.averageItemsPerOrder.toFixed(1)} color="text-teal-500" />
  //       </div>

  //       {/* Bar Chart Section */}
  //       {/* <Card title={t("reports.topProductsByRevenue")} value="">
  //         <ResponsiveContainer width="100%" height={400}>
  //           <BarChart data={salesReport.topProducts} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
  //             <CartesianGrid strokeDasharray="3 3" />
  //             <XAxis dataKey="name" />
  //             <YAxis />
  //             <Tooltip />
  //             <Bar dataKey="revenue" fill="#8884d8" name={t("reports.revenue")} />
  //           </BarChart>
  //         </ResponsiveContainer>
  //       </Card> */}
  //     </div>
  //   );
  // };



  // const BestSellingChart = () => {
  //   const [bestSellingReport, setBestSellingReport] = useState<any[]>([]);
  //   const { t } = useTranslation();

  //   useEffect(() => {
  //     const fetchBestSellingReport = async () => {
  //       try {
  //         const response = await fetch("/api/reports/best-selling"); // Replace with actual API call
  //         const result = await response.json();
  //         if (result.success && Array.isArray(result.data)) {
  //           setBestSellingReport(result.data);
  //         } else {
  //           setBestSellingReport([]); // Handle empty or unexpected response
  //         }
  //       } catch (error) {
  //         console.error(t("reports.errorFetchingBestSelling"), error);
  //       }
  //     };

  //     fetchBestSellingReport();
  //   }, [t]);

  //   return (
  //     <Card className="p-6 shadow-lg">
  //       <h2 className="text-2xl font-bold mb-4">{t("reports.bestSellingProducts")}</h2>
  //       <ResponsiveContainer width="100%" height={400}>
  //         <BarChart
  //           data={bestSellingReport}
  //           margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
  //         >
  //           <CartesianGrid strokeDasharray="3 3" />
  //           <XAxis dataKey="productName" />
  //           <YAxis />
  //           <Tooltip />
  //           <Legend/>
  //           <Bar dataKey="totalSales" fill="#8884d8" name={t("reports.totalSalesLabel")} />
  //           <Bar dataKey="quantitySold" fill="#82ca9d" name={t("reports.quantitySoldLabel")} />
  //         </BarChart>
  //       </ResponsiveContainer>
  //     </Card>
  //   );
  // };


  // export default function Widget() {
  //   return (
  //     <div>Widget</div>
  //   )
  // }


  //   return (
  //     <div className="p-6 space-y-8">
  //       <h1 className="text-3xl font-bold mb-6">{t("reports.title")}</h1>
  // <SalesReport/>
  //       {/* Inventory Report Card */}
  //       <div className="p-6 bg-white shadow rounded-lg">
  //         <h2 className="text-xl font-semibold mb-4">{t("reports.inventoryTitle")}</h2>
  //         <ResponsiveContainer width="100%" height={300}>
  //           <BarChart data={inventoryReport}>
  //             <CartesianGrid strokeDasharray="3 3" />
  //             <XAxis dataKey="productName" />
  //             <YAxis />
  //             <Tooltip />
  //             <Bar dataKey="quantity" fill="#82ca9d" />
  //           </BarChart>
  //         </ResponsiveContainer>
  //       </div>

  //       {/* Sales Report Card */}
  //       <div className="p-6 bg-white shadow rounded-lg">
  //         <h2 className="text-xl font-semibold mb-4">{t("reports.salesTitle")}</h2>
  //         <ResponsiveContainer width="100%" height={300}>
  //           <LineChart data={salesReport}>
  //             <CartesianGrid strokeDasharray="3 3" />
  //             <XAxis dataKey="date" />
  //             <YAxis />
  //             <Tooltip />
  //             <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
  //           </LineChart>
  //         </ResponsiveContainer>
  //       </div>

  //       {/* Best-Selling Products Card */}
  //       <div className="p-6 bg-white shadow rounded-lg">
  //         <h2 className="text-xl font-semibold mb-4">{t("reports.bestSellingTitle")}</h2>
  //         <ResponsiveContainer width="100%" height={300}>
  //           <PieChart>
  //             <Pie
  //               data={bestSellingReport}
  //               dataKey="sales"
  //               nameKey="productName"
  //               cx="50%"
  //               cy="50%"
  //               outerRadius={100}
  //               fill="#8884d8"
  //               label={(entry) => entry.productName}
  //             >
  //               {bestSellingReport.map((_:any, index:any) => (
  //                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
  //               ))}
  //             </Pie>
  //           </PieChart>
  //         </ResponsiveContainer>
  //       </div>
  //     </div>
  //   );

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <Card title="Total stock" value={`$${inventoryReport?.totalStockValue}`} color="bg-[#FF9F43] bg-opacity-20" icon={<PiMoneyLight className="text-[#FF9F43] font-bold" />} />
        <Card title="Total sales" value={`$${salesReport?.totalSales}`} color="bg-[#20c997] bg-opacity-20" icon={<FaHandHoldingDollar className="text-[#20c997] font-bold" />} />
        <Card title="Total orders" value={salesReport?.totalOrders} color="bg-[#0dcaf0] bg-opacity-20" icon={<LiaLuggageCartSolid className="text-[#0dcaf0] font-bold" />} />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="mt-5 bg-white p-2 shadow-sm border">
          <div className="flex justify-between items-center gap-20">
            <h1 className="text-base pl-5 py-5">Total sales based on period (daily, weekly, monthly)</h1>
            <select
              className="block px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            >
              <option value="">select period</option>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart width={730} height={250} data={salesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Bar dataKey="quantitySold" name="Quantity Sold" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-5 bg-white p-2 shadow-sm border">
          <h1 className="text-base pl-5 py-5">Best selling product chart</h1>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart width={730} height={250} data={besellingData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Bar dataKey="quantitySold" name="Quantity Sold" barSize={20} fill="#413ea0" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="w-full bg-white p-2 shadow-sm border mt-5">
        <h1 className="text-base pl-5 py-5">Lower stock</h1>
        <Table columns={columns} dataSource={lowerStock} onChange={onChange} />
      </div>
      <div className="w-full bg-white p-2 shadow-sm border mt-5">
        <h1 className="text-base pl-5 py-5">Inventory summary</h1>
        <Table columns={columns} dataSource={inventory} onChange={onChange} />
      </div>
    </>
  )
};
export default Reports;