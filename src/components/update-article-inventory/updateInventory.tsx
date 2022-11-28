import React, { useState } from "react";
import { CONSTANTS } from "../../constants/constants";

const UpdateInventory: React.FC = ({ art_id, updateQuantity }: any) => {
  const [quantity, setQuantity] = useState<string | null>();
  const updateQuantityHandler = () => {
    updateQuantity(CONSTANTS.UPDATE_QUANTITY, art_id, quantity);
    setQuantity("");
  };
  const onHandleChangeNumeric = (quantity: string) => {
    const re = /^[0-9\b]+$/;
    if (quantity === "" || re.test(quantity)) {
      setQuantity(quantity);
    }
  };

  return (
    <div className="row">
      <input
        type="text"
        className="form-control"
        onChange={(e) => onHandleChangeNumeric(e.target.value)}
        placeholder="Quantity"
      />
      <button
        disabled={!quantity}
        className="btn btn-primary"
        onClick={updateQuantityHandler}
      >
        Update
      </button>
    </div>
  );
};

export default UpdateInventory;
