import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { CONSTANTS } from "../constants/constants";
import { TInventory } from "../types/inventory";
import { IProductDetails, TArticle } from "../types/products";
const INVENTORY_URI = process.env.INVENTORY_URI || 'api/inventory';

type State = {
  loading: boolean;
  error?: Error;
  inventory: TInventory[];
};

const initialState = {
  loading: false,
  error: undefined,
  inventory: [],
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    getInventory: (state: State) => {
      state.loading = true;
    },
    getInventorySuccess: (state: State, { payload }) => {
      state.inventory = payload;
      state.loading = false;
      state.error = undefined;
    },
    getInventoryFailure: (state: State, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    updateInventorySuccess: (state: State, { payload }) => {
      state.loading = false;
      state.error = undefined;

      let {
        action,
        id,
        quantity,
        product,
        inventory,
      }: {
        action: string;
        id: string;
        quantity: number;
        product: IProductDetails;
        inventory: TInventory[];
      } = payload;

      if (product) {
        /*
        Inventory has to be updated once product has sold
        */
        product.contain_articles.forEach((productArticle: TArticle) => {
          const foundInventory = state.inventory.find(
            (inventoryArticle) =>
              inventoryArticle.art_id === productArticle.art_id
          );
          if (foundInventory) {
            if (+productArticle.amount_of * quantity <= +foundInventory.stock) {
              foundInventory.stock = (
                +foundInventory.stock -
                +productArticle.amount_of * quantity
              ).toString();
            }
          }
        });
      } else if (action === CONSTANTS.FILE_UPLOAD) {
        /*
        If inventory comes from uploaded file then we need to update the inventory.
        If inventory is already exist then update the quantity
        Else add new inventory
        */
        inventory.forEach((uploadedInventory: TInventory) => {
          const foundInventory = state.inventory.find(
            (article: TInventory) => article.name === uploadedInventory.name
          );
          if (foundInventory) {
            foundInventory.stock = (
              +foundInventory.stock + +uploadedInventory.stock
            ).toString();
          } else {
            state.inventory.push({
              art_id: (state.inventory.length + 1).toString(),
              name: uploadedInventory.name,
              stock: uploadedInventory.stock.toString(),
            });
          }
        });
      } else {
        const foundInventory = state.inventory.find(
          (article: TInventory) => article.art_id === id
        );

        if (foundInventory) {
          if (action === CONSTANTS.UPDATE_QUANTITY) {
            if (isNaN(quantity) || quantity < 0) {
              quantity = 0;
            }
            foundInventory.stock = quantity.toString();
          }
          /*
            Store inventory data in sessionStorage since Middleware and DB connection not implemented
            */
        }
      }
      sessionStorage.setItem("inventory", JSON.stringify(state.inventory));
    },
  },
});

export const {
  getInventory,
  getInventorySuccess,
  getInventoryFailure,
  updateInventorySuccess,
} = inventorySlice.actions;
export const inventorySelector = (state: State) => state.inventory;
export default inventorySlice.reducer;

/*
  Fetch Inventory data from inventory.json. 
  The URI needs to be changed before move to production
  */
export function fetchInventory() {
  return async (dispatch: any) => {
    dispatch(getInventory());
    try {
      /*
        1. Store inventory data in sessionStorage since Middleware and DB connection not implemented
        2. Get updated inventory data from sessionStorage since Middleware and DB connection not implemented
        3. session storage code should be removed after  Middleware and DB connection implemented
        */
      if (await sessionStorage.getItem("inventory")) {
        dispatch(
          getInventorySuccess(
            JSON.parse(sessionStorage.getItem("inventory") || "{}")
          )
        );
      } else {
        const response = await axios.get(`${INVENTORY_URI}/inventory.json`);
        sessionStorage.setItem(
          "inventory",
          JSON.stringify(response.data.inventory)
        );
        dispatch(getInventorySuccess(response.data.inventory));
      }
    } catch (error) {
      dispatch(getInventoryFailure(error));
    }
  };
}

/*
  Update Inventory data 
  The URI needs to be changed before move to production
  */
export function updateInventory(payload: {
  action: string;
  id: string;
  quantity: number;
  product?: IProductDetails;
  inventory?: TInventory[];
}) {
  return async (dispatch: any) => {
    dispatch(getInventory());
    try {
      /*
        1.If Inventory data been sent then have to pick the inventory data from payload then need to update in DB
        2.If Product data seen sent then have pick the contain article information from product then 
          respective inventory has to be updated in DB
        3. Update inventory data in sessionStorage since Middleware and DB connection not implemented
        4. Get updated inventory data from sessionStorage since Middleware and DB connection not implemented
        5. session storage code should be removed after  Middleware and DB connection implemented
        */
      if (await sessionStorage.getItem("inventory")) {
        dispatch(updateInventorySuccess(payload));
      } else {
        const response = await axios.put(INVENTORY_URI, payload);
        dispatch(
          updateInventorySuccess(
            response.data.inventory
              ? response.data.inventory
              : response.data.product
          )
        );
      }
    } catch (error) {
      dispatch(getInventoryFailure(error));
    }
  };
}
