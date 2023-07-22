//Libraries
import { Route, Routes, useLocation } from "react-router-dom";
import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { useEffect, useMemo } from "react";

// Common Components
import { VerifyEmail } from "./components/pages/user/auth/VerifyEmail";
import LoadingScreen from "./components/layout/LoadingScreen";

import useAllContext from "./context/useAllContext";
import { ConfigProvider } from "antd";
import appTheme from "./eCommerseTheme.json";
import { IconContext } from "react-icons";
//Common Components End

//SuperAdmin Components
import AllVendors from "./components/pages/admin/superAdmin/allVendors";
import ApproveVendors from "./components/pages/admin/superAdmin/approveVendors";
//SuperAdmin Components ends

//Admin Components
import Main from "./components/layout/Main";
import AdminSignIn from "./components/pages/admin/auth/AdminSignIn";
import AdminSignUp from "./components/pages/admin/auth/AdminSignUp";
import Dashboard from "./components/pages/admin/Dashboard";
import Profile from "./components/pages/admin/Profile";
import AddProduct from "./components/pages/admin/products/AddProduct";
import AllProducts from "./components/pages/admin/products/AllProducts";
import AllCategories from "./components/pages/admin/categories/AllCategories";
import Brands from "./components/pages/admin/brands/Brands";
import AllOrders from "./components/pages/admin/orders/AllOrders";
import OrderDetails from "./components/pages/admin/orders/OrderDetails";
import PendingOrders from "./components/pages/admin/orders/PendingOrders";
import CompletedOrders from "./components/pages/admin/orders/CompletedOrders";
import ForgotPasswordAdmin from "./components/pages/admin/auth/ForgotPasswordAdmin";
import { ResetPasswordAdmin } from "./components/pages/admin/auth/ResetPasswordAdmin";
//Admin Components Ends

//User Components
import Home from "./components/pages/user/Home";
import ShowProductDetails from "./components/pages/user/ShowProductDetails";
import Cart from "./components/pages/user/Cart";
import Browse from "./components/pages/user/Browse";
import Updatecategories from "./components/pages/admin/categories/UpdateCategories";
import Checkout from "./components/pages/user/CheckingOut/CheckOut";
import AllUsers from "./components/pages/admin/superAdmin/allUsers";
import ForgotPassword from "./components/pages/user/auth/ForgotPassword";
import { ResetPassword } from "./components/pages/user/auth/ResetPassword";
import SignIn from "./components/pages/user/auth/SignIn";
import SignUp from "./components/pages/user/auth/SignUp";
//User Components End

function App() {
  const { userToken, validateUserToken, isLoading } = useAllContext();
  const location = useLocation();
  const currentURL = useMemo(() => location.pathname, [location.pathname]);
  useEffect(() => {
    validateUserToken();
  }, [validateUserToken, userToken, currentURL]);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <ConfigProvider theme={appTheme}>
      <IconContext.Provider value={{ style: { verticalAlign: "middle" } }}>
        <div className="App">
          <Routes>
            <Route index element={<Home />} />
            <Route path="auth">
              <Route path="signup" element={<SignUp />} />
              <Route path="login" element={<SignIn />} />
              <Route path="verifyemail" element={<VerifyEmail />}></Route>
              <Route path="forgotpassword" element={<ForgotPassword />}></Route>
              <Route path="resetpassword" element={<ResetPassword />}></Route>
              <Route path="admin">
                <Route path="signup" element={<AdminSignUp />} />
                <Route path="login" element={<AdminSignIn />} />
                <Route
                  path="forgotpassword"
                  element={<ForgotPasswordAdmin />}
                />
                <Route path="resetpassword" element={<ResetPasswordAdmin />} />
              </Route>
            </Route>

            {/* user routes Start*/}
            <Route path="/browse" element={<Browse />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product" element={<ShowProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* user routes end */}

            {/* Admin Routes start */}

            <Route path="/admin" element={<Main />}>
              <Route path="superadmin">
                <Route path="allvendors" element={<AllVendors />} />
                <Route path="approvevendors" element={<ApproveVendors />} />
                <Route path="allusers" element={<AllUsers />} />
              </Route>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders">
                <Route index element={<AllOrders />} />
                <Route path="allorders" element={<AllOrders />} />
                <Route path="orderdetails" element={<OrderDetails />} />
                <Route path="completed" element={<CompletedOrders />} />
                <Route path="pending" element={<PendingOrders />} />
                <Route path="*" element={<AllOrders />} />
              </Route>
              <Route path="products">
                <Route path="addproduct" element={<AddProduct />} />
                <Route index element={<AddProduct />} />
                <Route path="allproducts" element={<AllProducts />} />
                <Route path="*" element={<AddProduct />} />
              </Route>
              <Route path="categories">
                <Route
                  index
                  element={
                    <>
                      <AllCategories /> <Updatecategories />
                    </>
                  }
                />
              </Route>
              <Route path="brands">
                <Route index element={<Brands />} />
              </Route>
            </Route>
            {/* Admin Routes end */}
            <Route path="/mainadmin" element={<Main />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route
              path="*"
              element={
                <h1
                  style={{
                    fontFamily: "cursive",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    fontSize: "5rem",
                  }}
                >
                  ! Page Not Found
                </h1>
              }
            />
          </Routes>
        </div>
      </IconContext.Provider>
    </ConfigProvider>
  );
}

export default App;
