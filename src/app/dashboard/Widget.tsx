// import { useEffect, useState } from "react";
// import {
//   fetchInventoryReport,
//   fetchSalesReport,
//   fetchBestSellingReport,
// } from "@/hooks/api/reports";
// import { useTranslation } from "react-i18next";
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   BarChart,
//   Bar,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";
// import Card from "@/components/ui/card";

// const Reports = () => {
//   const { t } = useTranslation(); // For translations if needed

//   const [inventoryReport, setInventoryReport] = useState<any>([]);
//   const [salesReport, setSalesReport] = useState<any>([]);
//   const [bestSellingReport, setBestSellingReport] = useState<any>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchReports = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [inventory, sales, bestSelling] = await Promise.all([
//           fetchInventoryReport(),
//           fetchSalesReport(),
//           fetchBestSellingReport(),
//         ]);
//         console.log(bestSelling)

//         setInventoryReport(inventory?.data);
//         setSalesReport(sales?.data);
//         setBestSellingReport(bestSelling?.data);
//       } catch (err) {
//         setError(t("reports.errorFetchingReports"));
//         console.error("Error fetching reports:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, [t]);

//   if (loading) {
//     return <p>{t("reports.loading")}</p>;
//   }

//   if (error) {
//     return <p className="text-red-500">{error}</p>;
//   }

//   // Colors for pie chart
//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
// };



// export default Reports;
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



// // const BestSellingChart = () => {
// //   const [bestSellingReport, setBestSellingReport] = useState<any[]>([]);
// //   const { t } = useTranslation();

// //   useEffect(() => {
// //     const fetchBestSellingReport = async () => {
// //       try {
// //         const response = await fetch("/api/reports/best-selling"); // Replace with actual API call
// //         const result = await response.json();
// //         if (result.success && Array.isArray(result.data)) {
// //           setBestSellingReport(result.data);
// //         } else {
// //           setBestSellingReport([]); // Handle empty or unexpected response
// //         }
// //       } catch (error) {
// //         console.error(t("reports.errorFetchingBestSelling"), error);
// //       }
// //     };

// //     fetchBestSellingReport();
// //   }, [t]);

// //   return (
// //     <Card className="p-6 shadow-lg">
// //       <h2 className="text-2xl font-bold mb-4">{t("reports.bestSellingProducts")}</h2>
// //       <ResponsiveContainer width="100%" height={400}>
// //         <BarChart
// //           data={bestSellingReport}
// //           margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
// //         >
// //           <CartesianGrid strokeDasharray="3 3" />
// //           <XAxis dataKey="productName" />
// //           <YAxis />
// //           <Tooltip />
// //           <Legend/>
// //           <Bar dataKey="totalSales" fill="#8884d8" name={t("reports.totalSalesLabel")} />
// //           <Bar dataKey="quantitySold" fill="#82ca9d" name={t("reports.quantitySoldLabel")} />
// //         </BarChart>
// //       </ResponsiveContainer>
// //     </Card>
// //   );
// // };

import React from 'react'

export default function Widget() {
  return (
    <div>Widget</div>
  )
}
