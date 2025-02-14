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
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const products = watch("products");
  const discount = watch("discount");
  const tax = watch("tax");

  useEffect(() => {
    calculateTotal();
  }, [products, discount, tax]);

  const calculateTotal = () => {
    const subtotal = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountAmount = subtotal * (discount / 100);
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (tax / 100);
    const total = taxableAmount + taxAmount;
    setValue("totalAmount", total);
  };

  const handleBarcodeChange = async (value: string) => {
    setScanningBarcode(value);

    if (value.trim().length === 0) {
      setSimilarProducts([]);
      return;
    }

    try {
      const response: any = await scanBarcode(value);

      if (
        response.message ===
        "Product not found by barcode, but here are some similar products."
      ) {
        setSimilarProducts(response.similarProducts);

        return;
      }

      const product = response;

      // Prevent adding product with 0 stock
      if (product.quantity === 0) {
        toast.error(t("pos.productOutOfStock", { product: product.name }));
        return;
      }

      // Check if product already exists in cart
      const existingItemIndex = fields.findIndex(
        (item) => item.product === product._id
      );
      if (existingItemIndex >= 0) {
        const existingItem = fields[existingItemIndex];
        const newQuantity = Math.min(
          existingItem.quantity + 1,
          product.quantity
        );
        update(existingItemIndex, { ...existingItem, quantity: newQuantity });
      } else {
        append({
          product: product._id,
          name: product.name,
          quantity: 1,
          price: product.price,
          maxQuantity: product.quantity,
        });
      }

      setScanningBarcode("");
      setSimilarProducts([]);
    } catch (error) {}
  };

  return (
    <div className="flex">
      <div className="w-2/3 p-4">
        <h1 className="text-xl font-semibold mb-4">{t("pos.productsTitle")}</h1>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={t("pos.scanBarcodeOrSearch")}
            value={scanningBarcode}
            onChange={(e) => handleBarcodeChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
          />

          {similarProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 shadow-lg rounded-md z-10 max-h-60 overflow-y-auto">
              {similarProducts.map((product) => (
                <div
                  key={product._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex flex-col gap-1"
                  onClick={() => {
                    if (product.quantity === 0) {
                      toast.error(
                        t("pos.productOutOfStock", { product: product.name })
                      );
                      return;
                    }
                    append({
                      product: product._id,
                      name: product.name,
                      quantity: 1,
                      price: product.price,
                      maxQuantity: product.quantity,
                    });
                    setScanningBarcode("");
                    setSimilarProducts([]);
                  }}
                >
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(product.price, rate)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {fields.map((item, index) => (
            <div
              key={item.product}
              className="p-2 border rounded-md flex flex-col text-sm shadow-sm"
            >
              <h3 className="font-semibold">{item.name}</h3>
              <div className="flex justify-between mt-1">
                <p className="text-gray-600">
                  {formatCurrency(item.price, rate)}
                </p>
                <p className="text-gray-600">
                  {t("pos.availableQuantity")}: {item.maxQuantity}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() =>
                    update(index, {
                      ...item,
                      quantity: Math.max(1, item.quantity - 1),
                    })
                  }
                  className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  className="w-12 text-center p-1 border rounded-md"
                  value={item.quantity}
                  onChange={(e) =>
                    update(index, {
                      ...item,
                      quantity: Math.min(
                        parseInt(e.target.value) || 1,
                        item.maxQuantity
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    update(index, {
                      ...item,
                      quantity: Math.min(item.quantity + 1, item.maxQuantity),
                    })
                  }
                  className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  <FaPlus />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1 text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
              <input
                type="number"
                className="w-full text-center p-1 border rounded-md mt-2"
                value={item.price}
                onChange={(e) =>
                  update(index, {
                    ...item,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/3 p-4">
        <h2 className="text-xl font-semibold">{t("pos.orderSummaryTitle")}</h2>
        <form
          onSubmit={handleSubmit(async (data) => {
            await createOrder(data);
            reset();
          })}
        >
          <input
            {...register("customer", { required: true })}
            className="w-full p-2 border rounded-md"
          
            placeholder={t("pos.customerNameLabel")}
          />
          <label htmlFor="Discount(%)" className="mt-4">Discount(%)</label>
          <input
            type="text"
            {...register("discount")}
            className="w-full p-2 border rounded-md "
            placeholder={t("pos.discountLabel")}
          />
          <label htmlFor="Tax(%)" className=" mt-4">TAX(%)</label>
          <input
            type="text"
            {...register("tax")}
            className="w-full p-2 border rounded-md "
            placeholder={t("pos.taxLabel")}
          />
          <h3 className="mt-2">
            {t("pos.totalLabel")}: {formatCurrency(watch("totalAmount"), rate)}
          </h3>
          <button type="submit" className="btn btn-primary mt-2">
            {t("pos.placeOrderButton")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default POS;
