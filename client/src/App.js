//Libraries
import { Route, Routes } from "react-router-dom";
import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { useEffect } from "react";

// Common Components
import { VerifyEmail } from "./components/pages/user/auth/VerifyEmail";
import LoadingScreen from "./components/layout/LoadingScreen";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import useAllContext from "./context/useAllContext";
import { ConfigProvider } from "antd";
import appTheme from "./eCommerseTheme.json";
//Common Components End

//SuperAdmin Components
import AllVendors from "./components/pages/admin/superAdmin/allVendors";
import ApproveVendors from "./components/pages/admin/superAdmin/approveVendors";
//SuperAdmin Components ends

//Admin Components
import Main from "./components/layout/Main";
import AdminSignIn from "./components/pages/admin/AdminSignIn";
import AdminSignUp from "./components/pages/admin/AdminSignUp";
import Dashboard from "./components/pages/admin/Dashboard";
import Profile from "./components/pages/admin/Profile";
import AddProduct from "./components/pages/admin/products/AddProduct";
import AllProducts from "./components/pages/admin/products/AllProducts";
import AllCategories from "./components/pages/admin/categories/AllCategories";
import Brands from "./components/pages/admin/brands/Brands";
//Admin Components Ends

//User Components
import Home from "./components/pages/user/Home";
import ShowProductDetails from "./components/pages/user/ShowProductDetails";
import Cart from "./components/pages/user/Cart";
import Browse from "./components/pages/user/Browse";
import Updatecategories from "./components/pages/admin/categories/UpdateCategories";
import CheckOut from "./components/pages/user/CheckOut";
//User Components End

function App() {
  const { userToken, validateUserToken, isLoading } = useAllContext();

  useEffect(() => {
    validateUserToken();
  }, [validateUserToken, userToken]);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <ConfigProvider theme={appTheme}>
      <div className="App">
        <Routes>
          <Route index element={<Home />} />
          <Route path="auth">
            <Route path="verifyemail" element={<VerifyEmail />}></Route>
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          {/* user routes Start*/}
          <Route path="/browse" element={<Browse />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product" element={<ShowProductDetails />} />
          <Route path="/checkout" element={<CheckOut />} />
          {/* user routes end */}

          {/* Admin Routes start */}
          <Route path="/adminsignup" element={<AdminSignUp />} />
          <Route path="/adminlogin" element={<AdminSignIn />} />
          <Route path="/admin" element={<Main />}>
            <Route path="superadmin">
              <Route path="allvendors" element={<AllVendors />} />
              <Route path="approvevendors" element={<ApproveVendors />} />
            </Route>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
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
    </ConfigProvider>
  );
}

export default App;
