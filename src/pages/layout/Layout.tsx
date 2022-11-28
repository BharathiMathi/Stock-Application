import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import HomeComponent from "../../components/home/home";
import Header from "../../components/header/header";
import SideBar from "../../components/sidebar/sidebar";
import style from "./Layout.module.css";
import Products from "../products/products";
import Articles from "../articles-inventory/articles";
import ErrorBoundaryComponent from "../../components/errorboundary/errorboundary";
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import rootReducer from "../../reducer";
import ProductInventory from "../products-inventory/ProductInventory";
import NotFound from "../404/NotFound";


const store = configureStore({ reducer: rootReducer })


const Layout: React.FC = () => {
  /*
  While reload the application we have to clear the storage values
  */
  useEffect(() => {
    sessionStorage.clear()
  }, []);
  return (
    <>
     <Router>
      <Header />
      <div className={style.homeContainer}>
        <SideBar />
        <div className={style.routesContainer}>
        <ErrorBoundary FallbackComponent={ErrorBoundaryComponent}>
         <Provider store={store}>
          <Routes>
            <Route path="/" element={<HomeComponent />}></Route>
            <Route path="/products" element={<Products />}></Route>
            <Route path="/article-inventory" element={<Articles />}></Route>
            <Route path="/product-inventory" element={<ProductInventory />}></Route>
            <Route path='*' element={<NotFound />}></Route>
          </Routes>
          </Provider>
        </ErrorBoundary>
        </div>
      </div>
      </Router>
    </>
  );
};

export default Layout;
