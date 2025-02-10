import React, { useState, useEffect } from "react";
import { usePOS } from "@/hooks/api/sales";
import { useForm, useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash, FaMinus } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import { useExchangeRate } from "@/hooks/api/exchangeRate";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type OrderForm = {
  customer: string;
  products: {
    product: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    maxQuantity: number;
  }[];
  totalAmount: number;
  discount: number;
  tax: number;
};

const POS = () => {
  const { rate } = useExchangeRate();
  const { scanBarcode, createOrder } = usePOS();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrderForm>({
    defaultValues: {
      customer: "",
      products: [],
      totalAmount: 0,
      discount: 0,
      tax: 0,
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "products",
  });

  const [scanningBarcode, setScanningBarcode] = useState<string>("");

  // Watch form fields for changes
  const products = watch("products");
  const discount = watch("discount");
  const tax = watch("tax");

  // Automatically recalculate total whenever products, discount, or tax changes
  useEffect(() => {
    calculateTotal();
  }, [products, discount, tax]);

  const calculateTotal = () => {
    const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = subtotal * (discount / 100);
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (tax / 100);
    const total = taxableAmount + taxAmount;
    setValue("totalAmount", total);
  };
  
  const handleBarcodeChange = async () => {
    if (scanningBarcode.trim()) {
      try {
        const product: any = await scanBarcode(scanningBarcode);

        if (product) {
          if (product.quantity === 0) {
            toast.error(t("pos.productOutOfStock", { product: product.name }));
            return;
          }

          const existingItemIndex = fields.findIndex((item) => item.product === product._id);
          if (existingItemIndex >= 0) {
            const existingItem = fields[existingItemIndex];
            const newQuantity = Math.min(existingItem.quantity + 1, product.quantity);
            update(existingItemIndex, { ...existingItem, quantity: newQuantity });
          } else {
            append({
              product: product._id,
              name: product.name,
              quantity: 1,
              price: product.price,
              image: product.image,
              maxQuantity: product.quantity,
            });
          }
        }
      } catch (error) {
        toast.error(t("pos.errorScanningBarcode"));
      } finally {
        setScanningBarcode("");
      }
    }
  };

  const onIncrementQuantity = (index: number) => {
    const item = fields[index];
    const newQuantity = Math.min(item.quantity + 1, item.maxQuantity);
    update(index, { ...item, quantity: newQuantity });
  };

  const onDecrementQuantity = (index: number) => {
    const item = fields[index];
    const newQuantity = Math.max(1, item.quantity - 1);
    update(index, { ...item, quantity: newQuantity });
  };

  const handlePriceChange = (index: number, price: number) => {
    if (price >= 0) {
      const item = fields[index];
      update(index, { ...item, price });
    } else {
      toast.error(t("pos.priceCannotBeNegative"));
    }
  };

  const onSubmit = async (data: OrderForm) => {
    if (data.products.length === 0) {
      toast.error(t("pos.noProductsError"));
      return;
    }
    await createOrder(data);
    reset();
  };

  return (
    <div className="flex">
      {/* Products Section */}
      <div className="w-2/3 p-4">
        <h1 className="text-2xl font-semibold mb-4">{t("pos.productsTitle")}</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder={t("pos.scanBarcodePlaceholder")}
            value={scanningBarcode}
            onChange={(e) => setScanningBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleBarcodeChange();
              }
            }}
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        {fields.map((item, index) => (
          <div key={item.product} className="p-4 border rounded-md mb-2 flex items-center justify-between">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
            <div className="ml-4">
              <h3 className="font-semibold">{item.name}</h3>
              <div className="flex items-center gap-2">
                <span>{t("pos.priceLabel")} (USD):</span>
                <input
                  type="number"
                  value={item.price}
                  min={0}
                  onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                  className="w-20 p-2 border rounded-md text-right"
                />
              </div>
              <p className="mt-1">{formatCurrency(item.price, rate)} x {item.quantity}</p>
              <p className="text-gray-600 text-sm">
                {t("pos.availableQuantity")}: {item.maxQuantity}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => onDecrementQuantity(index)} className="p-2 rounded-md bg-gray-200 hover:bg-gray-300">
                <FaMinus />
              </button>

              <input
                type="number"
                className="w-12 text-center p-2 border rounded-md"
                value={item.quantity}
                onChange={(e) => {
                  const inputQuantity = Math.max(1, parseInt(e.target.value) || 1);
                  const finalQuantity = Math.min(inputQuantity, item.maxQuantity);
                  update(index, { ...item, quantity: finalQuantity });
                }}
              />

              <button type="button" onClick={() => onIncrementQuantity(index)} className="p-2 rounded-md bg-gray-200 hover:bg-gray-300">
                <FaPlus />
              </button>

              <button type="button" onClick={() => remove(index)} className="p-2 text-red-500">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary Section */}
      <div className="w-1/3 p-4">
        <h2 className="text-2xl font-semibold">{t("pos.orderSummaryTitle")}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>{t("pos.customerNameLabel")}</label>
            <input {...register("customer", { required: true })} className="w-full p-2 border rounded-md" />
            {errors.customer && <p className="text-red-500">{t("pos.customerNameRequired")}</p>}
          </div>

          <div className="mt-4">
            <label>{t("pos.discountLabel")}</label>
            <input type="number" {...register("discount")} className="w-full p-2 border rounded-md" />
          </div>

          <div className="mt-4">
            <label>{t("pos.taxLabel")}</label>
            <input type="number" {...register("tax")} className="w-full p-2 border rounded-md" />
          </div>

          <div className="mt-4">
            <h3>{t("pos.totalLabel")}: {formatCurrency(watch("totalAmount"), rate)}</h3>
          </div>

          <button type="submit" className="btn btn-primary mt-4">{t("pos.placeOrderButton")}</button>
        </form>
      </div>
    </div>
  );
};

export default POS;
