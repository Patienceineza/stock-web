import { useEffect, useState } from "react";
import DataTableV2, { TableColumnV2 } from "@/components/datatable";
import { FaTimes, FaCheck, FaDownload } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import { useSales } from "@/hooks/api/payments";
import ConfirmCompleteModal from "./complete";
import ReceiptModal from "./receipt";
import { useExchangeRate } from "@/hooks/api/exchangeRate";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const SalesList = () => {
  const { t } = useTranslation();  
  const { sales, loading, fetchSales, confirmPayment } = useSales();
  const { rate } = useExchangeRate();
  const [searchParams]:any = useSearchParams();
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);

  useEffect(() => {
    fetchSales(searchParams);
  }, [searchParams]);

  const handleConfirmPayment = async (paymentMethod: string) => {
    try {
      await confirmPayment(selectedSale.order._id, paymentMethod);
      fetchSales();
      setIsCompleteModalOpen(false);
    } catch (error) {
      console.error(t("salesList.confirmPaymentError"));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="badge bg-green-500 text-white">{t("salesList.paid")}</span>;
      case "pending":
        return <span className="badge bg-yellow-500 text-white">{t("salesList.pending")}</span>;
      case "refunded":
        return <span className="badge bg-red-500 text-white">{t("salesList.refunded")}</span>;
      default:
        return <span className="badge bg-gray-500 text-white">{t("salesList.unknown")}</span>;
    }
  };

  const columns: TableColumnV2<any>[] = [
    {
      title: t("salesList.customer"),
      accessor: "order.customer",
      render: (row) => <p>{row.order.customer}</p>,
    },
    {
      title: t("salesList.totalAmount"),
      accessor: "totalAmount",
      render: (row) => <p>{formatCurrency(row.totalAmount, rate)}</p>,
    },
    {
      title: t("salesList.paymentMethod"),
      accessor: "paymentMethod",
      render: (row) => (
        <p>
          {row.paymentMethod.charAt(0).toUpperCase() + row.paymentMethod.slice(1)}
        </p>
      ),
    },
    {
      title: t("salesList.status"),
      accessor: "status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      title: t("salesList.products"),
      accessor: "order.products",
      render: (row) => (
        <ul>
          {row.order.products.map((product: any, index: number) => (
            <li key={index} className="mb-2">
              <strong>{t("salesList.product")}:</strong> {product.product.name} ({product.product.barcode}) <br />
              <strong>{t("salesList.quantity")}:</strong> {product.quantity} <br />
              <strong>{t("salesList.price")}:</strong> {formatCurrency(product.price, rate)}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: t("salesList.actions"),
      accessor: "actions",
      render: (row) => (
        <div className="flex space-x-2">
          {row.status === "pending" && (
            <button
              onClick={() => {
                setSelectedSale(row);
                setIsCompleteModalOpen(true);
              }}
              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
            >
              <FaCheck className="w-5 h-5" />
            </button>
          )}

          {/* Download Receipt Button */}
          <button
            onClick={() => {
              setSelectedSale(row);
              setIsReceiptModalOpen(true);
            }}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <FaDownload className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">{t("salesList.title")}</h1>

      <DataTableV2
        columns={columns}
        data={sales?.list ?? []}
        isLoading={loading}
        currentPage={sales?.currentPage ?? 0}
        total={sales?.total}
        lastPage={sales?.totalPages + 1}
        previousPage={sales?.previousPage}
        nextPage={sales?.nextPage}
        tableName={t("salesList.tableName")}
      />

      {isCompleteModalOpen && (
        <ConfirmCompleteModal
          isOpen={isCompleteModalOpen}
          onClose={() => setIsCompleteModalOpen(false)}
          handleConfirm={handleConfirmPayment}
        />
      )}

      {isReceiptModalOpen && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          order={selectedSale.order}
        />
      )}
    </div>
  );
};

export default SalesList;
