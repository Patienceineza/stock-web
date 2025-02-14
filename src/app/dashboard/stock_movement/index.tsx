import { useStockMovements } from "@/hooks/api/stock_movement";
import { useState, useEffect } from "react";
import DataTableV2, { TableColumnV2 } from "@/components/datatable";
import IconPlus from "@/components/Icon/IconPlus";
import IconTrash from "@/components/Icon/IconTrash";
import IconPencil from "@/components/Icon/IconPencil";
import AddStockMovementModal from "./AddStockMovement";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import UpdateStockMovementModal from "./Update";
import ConfirmDeleteModal from "./Delete";

const StockMovementsList = () => {
  const { t } = useTranslation();
  const {
    stockMovements,
    loading,
    fetchStockMovements,
    updateStockMovement,
    deleteStockMovement,
  } = useStockMovements();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStockMovement, setSelectedStockMovement] = useState<any>(null);
  const [searchParams]: any = useSearchParams();

  useEffect(() => {
    fetchStockMovements(searchParams);
  }, [searchParams]);

  const handleDelete = async () => {
    if (selectedStockMovement) {
      await deleteStockMovement(selectedStockMovement._id);
      fetchStockMovements();
      setIsDeleteModalOpen(false);
    }
  };

  const columns: TableColumnV2<any>[] = [
    {
      title: t("stockMovements.type"),
      accessor: "type",
      render: (row) => <p className="uppercase">{row?.type}</p>,
    },
    {
      title: t("stockMovements.product"),
      accessor: "product",
      render: (row) => <p>{row?.product.name}</p>,
    },
    {
      title: t("stockMovements.quantity"),
      accessor: "quantity",
      render: (row) => <p>{row?.quantity}</p>,
    },
    {
      title: t("stockMovements.actions"),
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              setSelectedStockMovement(row);
              setIsUpdateModalOpen(true);
            }}
            className=""
          >
            <IconPencil className="text-primary" />
          </button>
          <button
            onClick={() => {
              setSelectedStockMovement(row);
              setIsDeleteModalOpen(true);
            }}
            className=""
          >
            <IconTrash className="text-danger" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{t("stockMovements.title")}</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <IconPlus className="mr-2" />
          {t("stockMovements.addStockMovement")}
        </button>
      </div>
      <DataTableV2
        columns={columns}
        data={stockMovements?.list ?? []}
        isLoading={loading}
        currentPage={stockMovements?.currentPage ?? 0}
        total={stockMovements?.total}
        lastPage={stockMovements?.totalPages + 1}
        previousPage={stockMovements?.previousPage}
        nextPage={stockMovements?.nextPage}
        tableName={t("stockMovements.title")}
      />
      
      {/* Add Stock Movement Modal */}
      {isAddModalOpen && (
        <AddStockMovementModal
          onClose={() => setIsAddModalOpen(false)}
          handleRefetch={fetchStockMovements}
          isOpen={isAddModalOpen}
        />
      )}

      {/* Update Stock Movement Modal */}
      {isUpdateModalOpen && (
        <UpdateStockMovementModal
          stockMovement={selectedStockMovement}
          onClose={() => setIsUpdateModalOpen(false)}
          handleRefetch={fetchStockMovements}
          isOpen={isUpdateModalOpen}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          stock_movement={selectedStockMovement}
          title={t("common.confirmDeleteTitle")}
          description={t("stockMovements.confirmDeleteMessage")}
        />
      )}
    </div>
  );
};

export default StockMovementsList;
