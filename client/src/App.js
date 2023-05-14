import { Route, Routes } from "react-router-dom";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Main from "./components/layout/Main";
import Dashboard from "./components/pages/admin/Dashboard";
import Profile from "./components/pages/admin/Profile";

import AllCategories from "./components/pages/admin/categories/AllCategories";
import AllProducts from "./components/pages/admin/products/AllProducts";
import NewProduct from "./components/pages/admin/products/NewProduct";

import Home from "./components/pages/Home";
import "antd/dist/antd.min.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

function App() {
  return (
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
            <Route index path="allproduct" element={<AllProducts />} />
            <Route path="addproduct" element={<NewProduct />} />
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
