import { Route, Routes } from "react-router-dom";
import { LoadingScreen } from "./components/layout/LoadingScreen";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Main from "./components/layout/Main";
import Dashboard from "./components/pages/admin/Dashboard";
import Profile from "./components/pages/admin/Profile";
import AllProducts from "./components/pages/admin/products/AllProducts";
import AddProduct from "./components/pages/admin/products/AddProduct";
import AllCategories from "./components/pages/admin/categories/AllCategories";

import Home from "./components/pages/Home";
import "antd/dist/antd.min.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { useEffect } from "react";
import useAllContext from "./context/useAllContext";

function App() {
  const { validateUserToken, isLoading, userToken } = useAllContext();

  useEffect(() => {
    validateUserToken();
  }, [validateUserToken, userToken]);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/admin" element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products">
            <Route index element={<AllProducts />} />
            <Route path="allproduct" element={<AllProducts />} />
            <Route path="addproduct" element={<AddProduct />} />
            <Route path="*" element={<AllProducts />} />
          </Route>
          <Route path="categories" element={<AllCategories />} />
        </Route>
        <Route index path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
