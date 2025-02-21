import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useReactToPrint } from "react-to-print";
import { useTranslation } from "react-i18next";
import { useExchangeRate } from "@/hooks/api/exchangeRate";
import { isLoggedIn } from "@/hooks/api/auth";
import src from "@/assets/logo2.jpg"
const InvoiceModal = ({ isOpen, onClose, order }: any) => {
  const printRef = useRef(null);
  const { rate } = useExchangeRate();
  const { t } = useTranslation();
  const user = isLoggedIn();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const currentCurrency: any = localStorage.getItem("selectedCurrency");
    const convertAmount = (amount: number, currency: string) => {
      console.log(currency);
      console.log(amount);
      if (currency === "USD") {
        return `CDF${amount * rate}`;
      } else {
        return `$${(amount * rate) / rate}`;
      }
    };
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={onClose}>
        <div className="fixed inset-0 bg-black/60 z-[999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Panel className="panel p-0 rounded-lg overflow-hidden w-full max-w-xl my-8 text-black dark:text-white-dark bg-white">
              <div ref={printRef} className="p-6">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-center mb-2">{t("invoice.title")}</h1>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <img
                      src={src}
                      alt={t("company.logoAlt")}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold">{t("company.name")}</h2>
                    <p className="text-gray-500">{t("company.addressLine1")}</p>
                    <p className="text-gray-500">{t("company.addressLine2")}</p>
                    <p className="text-gray-500">{t("company.email")}</p>
                    <p className="text-gray-500">{t("company.phone")}</p>
                  </div>
                </div>

                <div className="my-4 border-t border-gray-300"></div>

                {/* Order Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">
                      <strong>{t("invoice.orderId")}:</strong> {order.invoiceNumber}
                    </p>
                    <p className="text-gray-600">
                      <strong>By:</strong>{user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-gray-600">
                      <strong>{t("invoice.customer")}:</strong> {order.customer}
                    </p>
                  </div>
                  <div className="text-right">
                  <p className="text-gray-600">
                      <strong>{t("invoice.date")}:</strong>{" "}
                      {new Date(order?.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(order?.createdAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  </div>
                </div>

                <table className="w-full mt-4 border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border border-gray-300 text-left">{t("invoice.product")}</th>
                      <th className="p-2 border border-gray-300 text-right">{t("invoice.quantity")}</th>
                      <th className="p-2 border border-gray-300 text-right">{t("invoice.price")}</th>
                      <th className="p-2 border border-gray-300 text-right">{t("invoice.total")}</th>
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

                <div className="my-4 border-t border-gray-300"></div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">{t("invoice.subtotal")}:</p>
                  <p className="text-gray-800">{formatCurrency(order.totalAmount, rate)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">{t("invoice.discount")}:</p>
                  <p className="text-gray-800">{order.discount}%</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">{t("invoice.tax")}:</p>
                  <p className="text-gray-800">{order.tax}%</p>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <p>{t("invoice.total")}:</p>
                  <p>{formatCurrency(order.totalAmount, rate)}</p>
                </div>
                <div className="flex justify-between font-bold text-sm">
                    <p>
                      {currentCurrency === "USD"
                        ? t("receipt.amount") + " in CDF:"
                        : t("receipt.amount") + " in USD:"}
                    </p>

                    <p>{convertAmount(order?.totalAmount, currentCurrency)}</p>
                  </div>
                <div>
                  <p className="text-center text-sm text-gray-500 mt-4">{t("invoice.thankYouMessage")}</p>
                </div>
              </div>

              <div className="p-4 flex justify-end space-x-4 bg-gray-50">
                <button onClick={onClose} className="btn btn-outline-danger">
                  {t("invoice.close")}
                </button>
                <button onClick={handlePrint} className="btn btn-primary">
                  {t("invoice.download")}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InvoiceModal;
