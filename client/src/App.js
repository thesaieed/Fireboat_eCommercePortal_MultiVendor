import { Route, Routes } from "react-router-dom";
import LoadingScreen from "./components/layout/LoadingScreen";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Main from "./components/layout/Main";
import Dashboard from "./components/pages/admin/Dashboard";
import Profile from "./components/pages/admin/Profile";
import Home from "./components/pages/user/Home";
import AddProduct from "./components/pages/admin/products/AddProduct";
import AllCategories from "./components/pages/admin/categories/AllCategories";
import Browse from "./components/pages/user/Browse";

import ShowProduct from "./components/pages/admin/products/ShowProduct";

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
        <Route path="allproduct" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/admin" element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products">
            <Route index element={<AddProduct />} />

            <Route path="addproduct" element={<AddProduct />} />
            <Route path="*" element={<AddProduct />} />
          </Route>
          <Route path="categories" element={<AllCategories />} />
        </Route>
        <Route path="/product" element={<ShowProduct />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
