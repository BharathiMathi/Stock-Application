import { useEffect } from "react";
import style from "./products.module.css";
import { useErrorHandler } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  productSelector,
  getProductStatus,
  getProductStockStatus,
} from "../../reducer/productSlice";
import {
  fetchInventory,
  inventorySelector,
  updateInventory,
} from "../../reducer/inventorySlice";
import Product from "./product";
import { NotFoundImg } from "../../assets/images";
import ProductAction from "./productaction";


const Products = () => {
  const dispatch = useDispatch();
  /*
   Destructure data from Product selector and Inventory selector
  */
  const { products, loading, error } = useSelector(productSelector);
  const {
    inventory,
    loading: isInventoryLoading,
    error: inventoryError,
  } = useSelector(inventorySelector);

  const handleError = useErrorHandler();

  /*
   Fetch products and inventory data once page mounted
  */
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchInventory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProductStatus(inventory));
  }, [dispatch, inventory]);

  if (error) {
    handleError(error);
  } else if (inventoryError) {
    handleError(inventoryError);
  }
  if (loading || isInventoryLoading) return <p>Loading...</p>;

  const productActionHandler = (action, quantity, product) => {
    if (action === "sell") {
      /* Update the inventory and get the status of the product */
      dispatch(updateInventory({ quantity, product }));
      dispatch(getProductStatus(inventory));

    } else {
      /* Get the stock status of the product when enter quantity*/
      dispatch(getProductStockStatus({ quantity, product, inventory }));
    }
  };

  return (
    <div className={style.productsContainer}>
      {products?.map((product) => (
        <div className="card mb-3" key={product.name}>
          <div className="card-body">
            <div className="container">
              <div className="row align-items-start">
                <div className="col-md-3">
                  <img
                    src={product.image ? product.image : NotFoundImg}
                    className="card-img-top"
                    alt="product"
                  />
                </div>
                <div className="col-md-9">
                  <div className="row">
                    <h5 className="card-title">{product.name}</h5>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="text-muted">
                        {product.priceIncludingTax} {product.currency}
                      </p>
                    </div>
                    <div className="col-md-9">
                      <ul
                        className={`list-group list-group-flush ${style.list_group}`}
                      >
                        {product.contain_articles.map((article) => (
                          <Product
                            key={article.art_id}
                            {...article}
                            inventory={inventory}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${style.actionWrapper} card-body`}>
            <ProductAction
              product={product}
              inventory={inventory}
              onProductActionHandler={productActionHandler}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
