import React, { useState, useEffect } from "react";
import RightMenu from "./RightMenu";
import LeftMenu from "./LeftMenu";
import { Layout, Button, Drawer, Input, Menu, Badge } from "antd";
import {
  MenuOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLocation, Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import useAllContext from "../../../context/useAllContext";

const CommonNavbar = ({ handleSearch }) => {
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { numberOfProductsInCart, appUser, categories } = useAllContext();
  const showDrawer = () => {
    setVisible(!visible);
  };
  // const navCategories = categories;
  const randomCategories = categories.slice(0, 3);

  const searchMenuItem = [
    {
      label: "",
      icon: <SearchOutlined />,
      key: "searchButton",
      children: [
        {
          label: (
            <Input
              id="searchBtn"
              style={{ background: "transparent", borderColor: "#86c61f" }}
              autoFocus
              placeholder="Search Products..."
              value={searchTerm}
              prefix={<SearchOutlined />}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              onPressEnter={handleSearch}
            />
          ),
          key: "searchInput",
          id: "searchMenuItem",
          style: { height: 60, background: "transparent" },
        },
      ],
      style: { background: "transparent" },
    },
  ];

  // If you do not want to auto-close the mobile drawer when a path is selected
  // Delete or comment out the code block below
  // From here
  let { pathname: location } = useLocation();
  useEffect(() => {
    setVisible(false);
  }, [location]);
  // Upto here

  return (
    <Layout.Header id="commonNavbar" className="nav-header">
      <Button className="menuButton" type="text" onClick={showDrawer}>
        <MenuOutlined />
      </Button>
      <div className="logo">
        <Link
          to="/"
          className="d-flex justify-content-start align-items-center"
          style={{ margin: 0, padding: 0 }}
        >
          <img
            src={logo}
            alt="logo"
            style={{ marginBottom: 19, marginLeft: -10, marginRight: 3 }}
          />
          <h3
            id="brand-font"
            style={{
              fontSize: 35,
              fontFamily: "poppins",
              fontWeight: 400,
            }}
          >
            NILE
          </h3>
        </Link>
      </div>
      <div className="navbar-menu">
        <div className="leftMenu">
          <LeftMenu mode={"horizontal"} randomCategories={randomCategories} />
        </div>

        <div
          className="rightMenu"
          style={{ display: "flex", justifyContent: "end" }}
        >
          <Menu
            style={{
              background: "transparent",
              borderColor: "#86c61f",
              padding: 0,
              marginLeft: 10,
            }}
            mode="horizontal"
            // className="navMenu
            id="searchBtn"
            multiple
            key="search"
            items={searchMenuItem}
          />

          <div className="navSearch bg-none ">
            <Input
              style={{ background: "transparent", borderColor: "#86c61f" }}
              id="navSearchInput"
              key="search"
              placeholder="Search Products..."
              value={searchTerm}
              prefix={<SearchOutlined />}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              onPressEnter={handleSearch}
            />
          </div>
          <RightMenu mode={"horizontal"} />
        </div>

        <Drawer
          title={"AlSaleels"}
          placement="left"
          closable={true}
          onClose={showDrawer}
          open={visible}
          style={{ zIndex: 99999 }}
        >
          <LeftMenu mode={"inline"} randomCategories={randomCategories} />
          <RightMenu mode={"inline"} />
        </Drawer>
      </div>
      {appUser.id && !appUser.is_admin && (
        <div style={{ marginLeft: 10, marginRight: 15 }}>
          <Link to="/cart">
            <Badge
              count={numberOfProductsInCart}
              color="#689125"
              title="Number of Items in Cart"
              offset={[-5, 5]}
            >
              <Button type="primary" shape="round">
                <ShoppingCartOutlined />
                Cart
              </Button>
            </Badge>
          </Link>
        </div>
      )}
    </Layout.Header>
  );
};
export default CommonNavbar;
