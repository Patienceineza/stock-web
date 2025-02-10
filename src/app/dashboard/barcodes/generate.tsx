import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useRef } from "react";
import JsBarcode from "jsbarcode";

const PrintBarcodeModal = ({ product, isOpen, onClose }: any) => {
  const [numberOfBarcodes, setNumberOfBarcodes] = useState(1);
  const barcodeRefs = useRef<any[]>([]);

  useEffect(() => {
    // Generate the barcodes dynamically
    if (product?.barcode) {
      for (let i = 0; i < (product.isUnique ? 1 : numberOfBarcodes); i++) {
        if (barcodeRefs.current[i]) {
          JsBarcode(barcodeRefs.current[i], product.barcode, {
            format: "CODE128",
            lineColor: "#000",
            width: 2,
            height: 60,
            displayValue: true,
          });
        }
      }
    }
  }, [product, numberOfBarcodes]);

  const handlePrint = () => {
    const printWindow = window.open("", "Print", "width=600,height=800");
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Print Barcodes</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .barcode-container {
              margin-bottom: 20px;
            }
            canvas {
              display: block;
              margin: 10px auto;
            }
          </style>
        </head>
        <body>
          ${Array(product.isUnique ? 1 : numberOfBarcodes)
            .fill("")
            .map(
              (_, index) => `
            <div class="barcode-container">
              <canvas id="barcode-${index}"></canvas>
            </div>`
            )
            .join("")}
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            window.onload = function() {
              ${Array(product.isUnique ? 1 : numberOfBarcodes)
                .fill("")
                .map(
                  (_, index) => `
                  JsBarcode(document.getElementById('barcode-${index}'), "${product?.barcode}", {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 2,
                    height: 60,
                    displayValue: true,
                  });`
                )
                .join("")}
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={onClose}>
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-md max-w-2xl w-full">
            <Dialog.Title className="text-xl font-bold">Print Barcodes</Dialog.Title>
            <div className="mt-4">
              <p className="text-gray-700">
                Product: <strong>{product?.name}</strong>
              </p>
              <p className="text-gray-700">
                Barcode: <strong>{product?.barcode}</strong>
              </p>
            </div>
            {!product.isUnique && (
              <div className="mt-4">
                <label className="block font-semibold text-gray-700">Number of Barcodes</label>
                <input
                  type="number"
                  min={1}
                  value={numberOfBarcodes}
                  onChange={(e) => setNumberOfBarcodes(Number(e.target.value))}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
            )}
            {product.isUnique && (
              <p className="mt-4 text-sm text-gray-500">This is a unique product, so only 1 barcode can be printed.</p>
            )}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {Array(product.isUnique ? 1 : numberOfBarcodes)
                .fill("")
                .map((_, index) => (
                  <canvas
                    key={index}
                    ref={(el) => (barcodeRefs.current[index] = el)}
                    className="border p-2 mx-auto"
                  />
                ))}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={onClose} className="btn btn-outline px-4 py-2 rounded-md">
                Cancel
              </button>
              <button onClick={handlePrint} className="btn btn-primary px-4 py-2 rounded-md">
                Print
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PrintBarcodeModal;
