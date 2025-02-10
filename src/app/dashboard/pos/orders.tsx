import { useState, useEffect } from "react";
import DataTableV2, { TableColumnV2 } from "@/components/datatable";
import { FaTimes, FaFileInvoice } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import { usePOS } from "@/hooks/api/sales";
import { Link, useSearchParams } from "react-router-dom";
import ConfirmDeleteModal from "./cancel";
import InvoiceModal from "./invoice";
import { useExchangeRate } from "@/hooks/api/exchangeRate";
import { useTranslation } from "react-i18next";

const Orders = () => {
  const { t } = useTranslation(); // Import translation hook
  const { rate } = useExchangeRate();
  const { orders, loading, fetchOrders, cancelOrder } = usePOS();
  const [searchParams]:any = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders(searchParams);
  }, [searchParams]);

  const handleDeleteOrder = async () => {
    try {
      await cancelOrder(selectedSale._id);
      fetchOrders();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(t("orders.errorCancelOrder"));
    }
  };

  const columns: TableColumnV2<any>[] = [
    {
      title: t("orders.customer"),
      accessor: "customer",
      render: (row) => <p>{row.customer}</p>,
    },
    {
      title: t("orders.totalAmount"),
      accessor: "totalAmount",
      render: (row) => <p>{formatCurrency(row.totalAmount, rate)}</p>,
    },
    {
      title: t("orders.discount"),
      accessor: "discount",
      render: (row) => <p>{row.discount}%</p>,
    },
    {
      title: t("orders.tax"),
      accessor: "tax",
      render: (row) => <p>{row.tax}%</p>,
    },
    
    {
      title: t("orders.orderStatus"),
      accessor: "status",
      render: (row) => (
        <span
          className={`badge ${
            row.status === "pending"
              ? "bg-yellow-500"
              : row.status === "completed"
              ? "bg-green-500"
              : "bg-red-500"
          } text-white`}
        >
          {t(`orders.status.${row.status.toLowerCase()}`)}
        </span>
      ),
    },
    {
      title: t("orders.items"),
      accessor: "products",
      render: (row) => (
        <div>
          {row.products.map((item: any, index: number) => (
            <div key={index} className="mb-2">
              <p>
                <strong>{t("orders.product")}:</strong> {item.product.name}
              </p>
              <p>
                <strong>{t("orders.quantity")}:</strong> {item.quantity}
              </p>
              <p>
                <strong>{t("orders.price")}:</strong> {formatCurrency(item.price, rate)}
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t("orders.actions"),
      accessor: "actions",
      render: (row) => (
        <div className="flex space-x-2">
          {row.status === "pending" && (
            <button
              onClick={() => {
                setSelectedSale(row);
                setIsDeleteModalOpen(true);
              }}
              className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => {
              setSelectedOrder(row);
              setIsInvoiceModalOpen(true);
            }}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <FaFileInvoice className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <ol className="flex text-gray-500 mb-4 font-semibold dark:text-white-dark">
        <Link to="/account">
          <button className="hover:text-gray-500/70 dark:hover:text-white-dark/70">{t("orders.home")}</button>
        </Link>
        <li className="before:content-['/'] before:px-1.5">
          <button className="text-black dark:text-white-light hover:text-black/70 dark:hover:text-white-light/70">
            {t("orders.salesOrders")}
          </button>
        </li>
      </ol>
      <h1 className="text-2xl font-semibold mb-4">{t("orders.title")}</h1>

      <DataTableV2
        columns={columns}
        data={orders?.list ?? []}
        isLoading={loading}
        currentPage={orders?.currentPage ?? 0}
        total={orders?.total}
        lastPage={orders?.totalPages + 1}
        previousPage={orders?.previousPage}
        nextPage={orders?.nextPage}
        tableName={t("orders.tableName")}
      />

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          handleConfirm={handleDeleteOrder}
        />
      )}

      {isInvoiceModalOpen && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default Orders;
