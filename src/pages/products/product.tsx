import { TInventory } from "../../types/inventory";
import style from "./product.module.css";

type Props = {
  art_id: string;
  amount_of: string;
  inventory: TInventory[];
};
/*
Here we show the list of child articles of the product.
Using child article id we can get the article name from the inventory
*/
const Product: React.FC<Props> = ({ art_id, amount_of, inventory }) => {
  const foundArticle = inventory.find(
    (article: TInventory) => article.art_id === art_id.toString()
  );
  if (foundArticle) {
    const artName =
      foundArticle.name.charAt(0).toUpperCase() + foundArticle.name.slice(1);
    return (
      <li className={`list-group-item ${style.articleWrapper}`}>
        <span className={style.articleQtyWidth}> {amount_of}</span> x{" "}
        <span className={style.articleName}> {artName}</span>
      </li>
    );
  } else {
    return <li className="list-group-item">Article not available</li>;
  }
};

export default Product;
