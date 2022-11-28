import style from "./articles.module.css";
import { useErrorHandler } from "react-error-boundary";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventory,
  inventorySelector,
  updateInventory,
} from "../../reducer/inventorySlice";
import UpdateInventoryDetails from "../../components/update-article-inventory/updateInventory";
import ExcelImport from "../../components/excel-import/ExcelImport";
import { CONSTANTS } from "../../constants/constants";

const Articles = () => {
  const dispatch = useDispatch();
  const { inventory, loading, error } = useSelector(inventorySelector);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleError = useErrorHandler();
  if (error) {
    handleError(error);
  }

  if (loading) return <p>Loading...</p>;

  /*
  Call Update inventory API
  */
  const updateQuantity = (action, id, quantity) => {
    dispatch(updateInventory({ action, id, quantity }));
  };

  /*
  Update inventory data which is received from Excel File
  */
  const handleFileUploaded = (inventory) => {
    dispatch(
      updateInventory({ action: CONSTANTS.FILE_UPLOAD, inventory })
    );
  };

  return (
    <div className={style.articleContainer}>
      <ExcelImport onFileUploaded={(e) => handleFileUploaded(e)} />
      <table className="table table-bordered table-hover ">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Stock</th>
            <th>Update Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventory?.map((article) => (
            <tr key={article.art_id} className={style.rowWrapper}>
              <th>{article.art_id}</th>
              <td className={style.articleName}>{article.name}</td>
              <td>{article.stock}</td>
              <td className={style.updateStock}>
                <UpdateInventoryDetails
                  {...article}
                  updateQuantity={updateQuantity}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Articles;
