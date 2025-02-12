import { useEffect, useState } from "react";
import {
  fetchInventoryReport,
  fetchSalesReport,
  fetchBestSellingReport,
} from "@/hooks/api/reports";
import { Empty, Table, ConfigProvider } from 'antd';
import type { GetProp, TableColumnsType, TableProps } from 'antd';
import type { ColumnType } from 'antd/es/table';
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
import { BsFiletypeXls, BsFiletypePdf } from "react-icons/bs";
import { exportToExcel, exportToPDF } from "@/utils/exports";
import IconFile from "@/components/Icon/IconFile";

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

  const bestSellingData = bestSellingReport.map((item: any) => ({
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
      dataIndex: "index",
      defaultSortOrder:'ascend'
    },
    {
      title: "Product name",
      dataIndex: "productName"
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "status",
      dataIndex: "status"
    },
    {
      title: "Stock value",
      dataIndex: "stockValue",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.stockValue - b.stockValue,
    }
  ]
  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const renderEmpty: GetProp<typeof ConfigProvider, 'renderEmpty'> = (componentName) => {
    if (componentName === 'Table.filter' /** 👈 5.20.0+ */) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Filter(Custom)" />;
    }
  }

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

  const handleExportToExcel = (reportType: 'bestSelling' | 'inventory') => {
    const exportConfig = {
      bestSelling: {
        data: bestSellingReport.map((item: { 
          productName: string;
          quantitySold: number;
          status: string;
          totalSales: number;
        }, index: number) => ({
          index: index + 1,
          productName: item.productName,
          quantity: item.quantitySold,
          status: item.status,
          stockValue: item.totalSales,
        })),
        sheetName: "Most selling product",
        filename: "Most_Selling",
        columns
      },
      inventory: {
        data: inventoryReport.inventorySummary,
        sheetName: "Inventory summary",
        filename: "Inventory_summary",
        columns,
      }
    };
  
    const config = exportConfig[reportType];
    if (config) {
      const formattedColumns = columns
        .filter((col): col is ColumnType<DataType> => 'dataIndex' in col)
        .map(({ dataIndex, title }) => ({
          key: dataIndex as string,
          header: title as string,
        }));
      exportToExcel(config.data, config.sheetName, config.filename, formattedColumns);
    }
  };

  const handleExportToPdf = (reportType: 'bestSelling' | 'inventory') => {
    const exportConfig = {
      bestSelling: {
        data: bestSellingReport.map((item: {
          productName: string;
          quantitySold: number; 
          status: string;
          totalSales: number;
        }, index: number) => ({
          index: index + 1,
          productName: item.productName,
          quantity: item.quantitySold,
          status: item.status,
          stockValue: item.totalSales,
        })),
        filename: "Most_Selling_Products"
      },
      inventory: {
        data: inventoryReport.inventorySummary,
        filename: "Inventory_Summary"
      }
    };

    const config = exportConfig[reportType];
    if (config) {
      const formattedColumns = columns
        .filter((col): col is ColumnType<DataType> => 'dataIndex' in col)
        .map(({ dataIndex, title }) => ({
          key: dataIndex as string,
          header: title as string,
        }));
      exportToPDF(config.data, config.filename, formattedColumns);
    }
  };
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <Card title="Total stock" value={`$${inventoryReport?.totalStockValue}`} color="bg-[#FF9F43] bg-opacity-20" icon={<PiMoneyLight className="text-[#FF9F43] font-bold" />} />
        <Card title="Total sales" value={`$${salesReport?.totalSales}`} color="bg-[#20c997] bg-opacity-20" icon={<FaHandHoldingDollar className="text-[#20c997] font-bold" />} />
        <Card title="Total orders" value={salesReport?.totalOrders} color="bg-[#0dcaf0] bg-opacity-20" icon={<LiaLuggageCartSolid className="text-[#0dcaf0] font-bold" />} />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="mt-5 bg-white dark:bg-[#0e1726] dark:border-0 rounded-md dark:text-dark-light p-2 shadow-sm border">
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
              <Bar dataKey="quantitySold" name="Quantity Sold" barSize={20} fill="#1E3A8A"/>
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-5 bg-white dark:bg-[#0e1726] dark:border-0 rounded-md dark:text-dark-light p-2 shadow-sm border">
          <h1 className="text-base pl-5 py-5">Best selling product chart</h1>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart width={730} height={250} data={bestSellingData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Bar dataKey="quantitySold" name="Quantity Sold" barSize={20} fill="#1E3A8A" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="w-full bg-white dark:bg-[#0e1726] dark:border-0 rounded-md dark:text-dark-light p-2 shadow-sm border mt-5">
        <div className="flex justify-between px-5 py-5">
        <h1 className="text-base ">Lower stock</h1>
        <div className="grid grid-cols-2 grid-flow-col gap-5 text-lg">
          <button onClick={() => handleExportToExcel('bestSelling')} className="flex items-center justify-center gap-2 btn btn-primary btn-sm"><IconFile className="w-5 h-5" />
          <span>EXCEL</span></button>
          <button onClick={()=>handleExportToPdf('bestSelling')} className="flex items-center justify-center gap-2 btn btn-primary btn-sm"><IconFile className="w-5 h-5" />
          <span>PDF</span></button>
        </div>
        </div>
        <ConfigProvider renderEmpty={renderEmpty}>
        <Table 
          columns={columns} 
          dataSource={lowerStock} 
          onChange={onChange}
          className="dark:dark-table"
          components={{
            header: {
              row: (props: any) => (
                <tr {...props} className="dark:bg-[#0e1726]" />
              ),
              cell: (props: any) => (
                <th
                  {...props} 
                  className="dark:bg-[#0e1726] dark:text-gray-200"
                />
              )
            },
            body: {
              cell: (props: any) => (
                <td 
                  {...props} 
                  className="dark:bg-[#0e1726] dark:text-gray-300 dark:border-dark"
                />
              )
            }
          }}
          locale={{ emptyText: <Empty description="No Data" /> }}
        />
        </ConfigProvider>
      </div>
      <div className="w-full bg-white dark:bg-[#0e1726] dark:border-0 dark:text-dark-light p-2 shadow-sm border mt-5">
      <div className="flex justify-between px-5 py-5">
        <h1 className="text-base ">Inventory summary</h1>
        <div className="grid grid-cols-2 grid-flow-col gap-5 text-lg">
          <button onClick={()=>handleExportToExcel('inventory')} className="flex items-center justify-center gap-2 btn btn-primary btn-sm"><IconFile className="w-5 h-5" />
          <span>EXCEL</span></button>
          <button onClick={()=>handleExportToPdf('inventory')} className="flex items-center justify-center gap-2 btn btn-primary btn-sm"><IconFile className="w-5 h-5" />
          <span>PDF</span></button>
        </div>
        </div>
        <ConfigProvider renderEmpty={renderEmpty}>
        <Table 
          columns={columns} 
          dataSource={inventory} 
          onChange={onChange}
          className="dark:dark-table"
          components={{
            header: {
              row: (props: any) => (
                <tr {...props} className="dark:bg-[#0e1726]" />
              ),
              cell: (props: any) => (
                <th
                  {...props} 
                  className="dark:bg-[#0e1726] dark:text-gray-200"
                />
              )
            },
            body: {
              cell: (props: any) => (
                <td 
                  {...props} 
                  className="dark:bg-[#0e1726] dark:text-gray-300 dark:border-[#0e1726]"
                />
              )
            },
            
          }}
          locale={{ emptyText: <Empty description="No Data" /> }}
        />
        </ConfigProvider>
      </div>
    </>
  )
};
export default Reports;