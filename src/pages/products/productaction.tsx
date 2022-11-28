import { useState } from "react";
import style from "./products.module.css";
import { CONSTANTS } from "../../constants/constants";
import { IProductDetails, TArticle } from "../../types/products";
import { TInventory } from "../../types/inventory";

const ProductAction = ({
  product,
  inventory,
  onProductActionHandler,
}: {
  product: IProductDetails;
  inventory:TInventory[];
  onProductActionHandler: Function;
}) => {
  const [quantity, setProductQuantity] = useState<string | null>();

  const quantityChangeHandler = (quantity: string) => {
    const re = /^[0-9\b]+$/;
    if (quantity === "" || re.test(quantity)) {
      setProductQuantity(quantity);
      onProductActionHandler("check stock status", quantity, product);
    }
  };

  const sellHandler = () => {
    onProductActionHandler("sell", quantity, product);
    setProductQuantity("");
  };


  const foundAllArticles = product.contain_articles.every((c_art:TArticle)=>{
   return inventory.find(
      (article: TInventory) => article.art_id === c_art.art_id.toString()
    );
  } )

  return (
    <>
     {foundAllArticles ? (
    <div className={style.inputGroup}>
      
    {product.status !== CONSTANTS.OUT_OF_STOCK && (
        <div className={style.inputGroup}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Quantity"
            onChange={(e) => quantityChangeHandler(e.target.value)}
          />
        </div>
      )}
      {!product.status ? (
        <button
          disabled={!quantity}
          className="btn btn-primary"
          onClick={sellHandler}
        >
          Sell
        </button>
      ) : (
        <div className={`${style.warningText} text-danger fw-bold`}>
          {product.status}
        </div>
      )}
    </div>
     ) : <div className={`${style.warningText} text-danger fw-bold`}>
    {CONSTANTS.NO_SALE}
   </div> }
    </>
  );
};

export default ProductAction;
