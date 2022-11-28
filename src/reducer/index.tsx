
import { combineReducers } from 'redux'
import InventoryReducer from "./inventorySlice";
import ProductReducer from "./productSlice";


const rootReducer = combineReducers({
  inventory: InventoryReducer,
  products: ProductReducer
})

export default rootReducer