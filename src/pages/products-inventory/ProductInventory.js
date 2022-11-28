import style from "./ProductInventory.module.css";
import { useErrorHandler } from "react-error-boundary";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExcelImport from "../../components/excel-import/ExcelImport";
import { CONSTANTS } from "../../constants/constants";
import {
  fetchProducts,
  productSelector,
  updateProductInventory
} from "../../reducer/productSlice";
import { NotFoundImg } from "../../assets/images";

const ProductInventory = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(productSelector);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleError = useErrorHandler();
  if (error) {
    handleError(error);
  }

  if (loading) return <p>Loading...</p>;

  /*
  Update product data which is received from Excel File
  */
  const handleFileUploaded = (product) => {
    dispatch(
      updateProductInventory({ action: CONSTANTS.FILE_UPLOAD, product })
    );
  };

  return (
    <div className={style.productContainer}>
      <ExcelImport onFileUploaded={(e) => handleFileUploaded(e)} />
      <table className="table table-bordered table-hover ">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Product Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((item, index) => (
            <tr key={item.name}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={item.image ? item.image : NotFoundImg}
                  className={style.productImage}
                  alt="product"
                />
              </td>
              <td className={style.productName}>{item.name}</td>
              <td>
                {item.priceIncludingTax} {item.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductInventory;
