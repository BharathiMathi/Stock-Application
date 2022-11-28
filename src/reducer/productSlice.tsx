import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { CONSTANTS } from "../constants/constants";
import { TInventory } from "../types/inventory";
import { IProductDetails, TArticle, TProduct } from "../types/products";
import {NotFoundImg}  from '../assets/images';

const PRODUCT_URI = process.env.REACT_APP_PRODUCT_URI || 'api/products'

type State = {
  loading: boolean;
  error?: Error;
  products: IProductDetails[];
};
export const initialState = {
  loading: false,
  error: undefined,
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    getProducts: (state: State) => {
      state.loading = true;
    },
    getProductSuccess: (state: State, { payload }) => {
      state.products = payload;
      state.loading = false;
      state.error = undefined;
    },
    getProductsFailure: (state: State, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    getProductStatus: (state: State, { payload }) => {
      /*
      Fetch the status of the product when quantity has updated in article inventory page
      */
      state.loading = false;
      state.error = undefined;
      state.products.forEach((product:IProductDetails) => {
        product.contain_articles.forEach((article: TArticle) => {
          const foundInventory = payload.find(
            (inventory: TInventory) => inventory.art_id === article.art_id
          );
          if (foundInventory) {
            if (+foundInventory.stock < +article.amount_of) {
              product.status = CONSTANTS.OUT_OF_STOCK;
            }
          }
        });
      });
    },
    getProductStockStatus: (state: State, { payload }) => {
      /*
      To find the available stock when quantity has entered in product page
      */
      state.loading = false;
      state.error = undefined;
      const { quantity, inventory, product:currentProduct } = payload;

      const foundProduct = state.products.find(
        (productState:IProductDetails) => productState.name === currentProduct.name
      );
      if (foundProduct) {
        foundProduct.status = "";
        foundProduct.contain_articles.forEach((article: TArticle) => {
          const foundInventory= inventory.find(
            (inventory: TInventory) => inventory.art_id === article.art_id
          );
          if (foundInventory) {
            if (+foundInventory.stock < +article.amount_of * quantity) {
              foundProduct.status = CONSTANTS.NO_AVAILABLE_STOCK;
            }
          }
        });
      }
    },
    updateProductInventorySuccess: (state: State, { payload })=>{
      state.loading = false;
      state.error = undefined;

      let {
        product
      }: {
        product: TProduct[];
      } = payload;

         /*
        Update the product inventory from the uploaded file.
        If product is already exist then update the product
        Else add new product
        */
       
        const groupedProduct = product.reduce(function (r, a) {
            r[a.name] = r[a.name] || [];
            r[a.name].push(a);
            return r;
        }, Object.create(null));

        for (const name in groupedProduct) {
          const foundProduct = state.products.find(
            (stateProduct: TProduct) => stateProduct.name === name
          );
          if (foundProduct) {
            foundProduct.priceIncludingTax = groupedProduct[name][0].priceIncludingTax.toString();
            foundProduct.image = groupedProduct[name][0].image ?groupedProduct[name].image  : NotFoundImg;
            foundProduct.currency = groupedProduct[name][0].currency;
            groupedProduct[name].forEach((article:TArticle)=>{
              const foundChildArticle = foundProduct.contain_articles.find((c_art:TArticle)=>c_art.art_id === article.art_id.toString())
              if(foundChildArticle){
               foundChildArticle.amount_of = (+foundChildArticle.amount_of + +article.amount_of).toString();
              }
            })
           
          } else{
            const childArticles:TArticle[] = [];
            groupedProduct[name].forEach((article:TArticle)=>{
              childArticles.push({art_id:article.art_id.toString(),amount_of:article.amount_of.toString()})
            })
            state.products.push({name: groupedProduct[name][0].name,
              image:  groupedProduct[name][0].image,
              currency:  groupedProduct[name][0].currency,
              priceIncludingTax: groupedProduct[name][0].priceIncludingTax.toString(),
              contain_articles:childArticles
            })
          }
        }
        sessionStorage.setItem("products", JSON.stringify(state.products));
    }
  },
});

export const {
  getProducts,
  getProductSuccess,
  getProductsFailure,
  getProductStatus,
  getProductStockStatus,
  updateProductInventorySuccess
} = productSlice.actions;
export const productSelector = (state: State) => state.products;
export default productSlice.reducer;

export function fetchProducts() {
  return async function (dispatch: any) {
    dispatch(getProducts());
    try {
      /*
        1. Store products data in sessionStorage since Middleware and DB connection not implemented
        2. Get updated products data from sessionStorage since Middleware and DB connection not implemented
        3. session storage code should be removed after  Middleware and DB connection implemented
        */
      if (await sessionStorage.getItem("products")) {
        dispatch(
          getProductSuccess(
            JSON.parse(sessionStorage.getItem("products") || "{}")
          )
        );
      } else {
        const response = await axios.get(`${PRODUCT_URI}/products.json`);
        sessionStorage.setItem(
          "products",
          JSON.stringify(response.data.products)
        );
        dispatch(getProductSuccess(response.data.products));
      }
    } catch (error) {
      dispatch(getProductsFailure(error));
    }
  };
}

/*
  Add Products data 
  The URI needs to be changed before move to production
  */
  export function updateProductInventory(payload: {
    action: string;
    product: TProduct[];
  }) {
    return async (dispatch: any) => {
      dispatch(getProducts());
      try {
        /*
          1. Update product inventory data in sessionStorage since Middleware and DB connection not implemented
          2. Get updated inventory data from sessionStorage since Middleware and DB connection not implemented
          3. session storage code should be removed after  Middleware and DB connection implemented
          */
        if (await sessionStorage.getItem("products")) {
          dispatch(updateProductInventorySuccess(payload));
        } else {
          const response = await axios.put(PRODUCT_URI, payload);
          dispatch(updateProductInventorySuccess(response.data.product));
        }
      } catch (error) {
        dispatch(getProductsFailure(error));
      }
    };
  }