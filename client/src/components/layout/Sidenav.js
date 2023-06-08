/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { PlusCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import useAllContext from "../../context/useAllContext";

function Sidenav({ color }) {
  const dashboard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const profile = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const signup = [
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      key={0}
    >
      <path
        d="M0,2A2,2,0,0,1,2,0H8a2,2,0,0,1,2,2V8a2,2,0,0,1-2,2H2A2,2,0,0,1,0,8Z"
        transform="translate(4 4)"
        fill={color}
      />
      <path
        d="M2,0A2,2,0,0,0,0,2V8a2,2,0,0,0,2,2V4A2,2,0,0,1,4,2h6A2,2,0,0,0,8,0Z"
        fill={color}
      />
    </svg>,
  ];

  const { logout } = useAllContext();

  const sidenavItems = [
    {
      label: (
        <NavLink to="/admin/dashboard">
          <span
            className="icon"
            style={{
              background: color,
            }}
          >
            {dashboard}
          </span>
          <span className="label">Dashboard</span>
        </NavLink>
      ),
      key: "adminDashboard",
    },
    {
      label: <span className="label menu-item-header">Products</span>,
      key: "productHeading",
    },
    {
      label: (
        <NavLink to="/admin/products/allproducts">
          <span
            className="icon"
            style={{
              background: color,
            }}
          >
            <UnorderedListOutlined />
          </span>
          <span className="label">All Products</span>
        </NavLink>
      ),
      key: "allProducts",
    },
    {
      label: (
        <NavLink to="/admin/products/addproduct">
          <span
            className="icon"
            style={{
              background: color,
            }}
          >
            <PlusCircleOutlined />
          </span>
          <span className="label">Add Product</span>
        </NavLink>
      ),
      key: "addProducts",
    },
    {
      label: <span className="label menu-item-header">Categories</span>,
      key: "categoriesHeading",
    },
    {
      label: (
        <NavLink to="/admin/categories">
          <span
            className="icon"
            style={{
              background: color,
            }}
          >
            <UnorderedListOutlined />
          </span>
          <span className="label">All Categories</span>
        </NavLink>
      ),
      key: "allcategories",
    },
    {
      label: <span className="label menu-item-header">Accounts</span>,
      key: "accountHeading",
    },
    {
      label: (
        <NavLink to="/admin/profile">
          <span
            className="icon"
            style={{
              background: color,
            }}
          >
            {profile}
          </span>
          <span className="label">Profile</span>
        </NavLink>
      ),
      key: "profile",
    },
  ];

  const logoutItem = [
    {
      label: (
        <NavLink
          onClick={() => {
            logout();
          }}
        >
          <span className="icon">{signup}</span>
          <span className="label text-danger">Logout</span>
        </NavLink>
      ),
      key: "logout",
    },
  ];

  return (
    <>
      <div className="brand">
        <img src={logo} alt="" />
        <span>Dashboard</span>
      </div>
      <hr />
      <Menu theme="light" mode="inline" items={sidenavItems} />
      <Menu className="SidebarlogoutMenu" items={logoutItem} />
      {/* <div className="aside-footer">
        <div
          className="footer-box"
          style={{
            background: color,
          }}
        >
          <span className="icon" style={{ color }}>
            {dashboard}
          </span>
          <h6>Need Help?</h6>
          <p>Please check our docs</p>
          <Button type="primary" className="ant-btn-sm ant-btn-block">
            DOCUMENTATION
          </Button>
        </div>
      </div> */}
    </>
  );
}

export default Sidenav;
