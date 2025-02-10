import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useReactToPrint } from "react-to-print";
import { useTranslation } from "react-i18next";
import { useExchangeRate } from "@/hooks/api/exchangeRate";

const ReceiptModal = ({ isOpen, onClose, order }: any) => {
  const printRef = useRef(null);
  const { rate } = useExchangeRate();
  const { t } = useTranslation();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={onClose}>
        <div className="fixed inset-0 bg-black/60 z-[999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Panel className="panel p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark bg-white">
              <div ref={printRef} className="p-6">
                <h1 className="text-3xl font-bold text-center mb-2">{t("receipt.title")}</h1>

                {/* Company Info */}
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{t("company.name")}</h2>
                    <p className="text-gray-500">{t("company.addressLine1")}</p>
                    <p className="text-gray-500">{t("company.addressLine2")}</p>
                    <p className="text-gray-500">{t("company.email")}</p>
                    <p className="text-gray-500">{t("company.phone")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">
                      <strong>{t("receipt.orderId")}:</strong> {order._id}
                    </p>
                    <p className="text-gray-600">
                      <strong>{t("receipt.date")}:</strong> {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <strong>{t("receipt.customer")}:</strong> {order.customer}
                    </p>
                  </div>
                </div>

                {/* Product Table */}
                <table className="w-full mt-4 border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border border-gray-300 text-left">{t("receipt.product")}</th>
                      <th className="p-2 border border-gray-300 text-right">{t("receipt.quantity")}</th>
                      <th className="p-2 border border-gray-300 text-right">{t("receipt.price")}</th>
                      <th className="p-2 border border-gray-300 text-right">{t("receipt.total")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product: any, index: number) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="p-2">{product.product.name} ({product.product.barcode})</td>
                        <td className="p-2 text-right">{product.quantity}</td>
                        <td className="p-2 text-right">{formatCurrency(product.price, rate)}</td>
                        <td className="p-2 text-right">{formatCurrency(product.price * product.quantity, rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total Breakdown */}
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">{t("receipt.subtotal")}:</p>
                  <p className="text-gray-800">{formatCurrency(order.totalAmount, rate)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">{t("receipt.discount")}:</p>
                  <p className="text-gray-800">{order.discount}%</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">{t("receipt.tax")}:</p>
                  <p className="text-gray-800">{order.tax}%</p>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <p>{t("receipt.total")}:</p>
                  <p>{formatCurrency(order.totalAmount, rate)}</p>
                </div>
                <p className="text-center mt-4 text-gray-500">{t("receipt.thankYouMessage")}</p>
              </div>

              {/* Footer Buttons */}
              <div className="p-4 flex justify-end space-x-4 bg-gray-50">
                <button onClick={onClose} className="btn btn-outline-danger">
                  {t("receipt.close")}
                </button>
                <button onClick={handlePrint} className="btn btn-primary">
                  {t("receipt.download")}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReceiptModal;
