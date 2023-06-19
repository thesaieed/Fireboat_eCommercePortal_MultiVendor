import React, { useState, useEffect } from "react";
import RightMenu from "./RightMenu";
import LeftMenu from "./LeftMenu";
import { Layout, Button, Drawer, Input, Menu } from "antd";
import {
  MenuOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLocation, Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png";

const CommonNavbar = ({ handleSearch }) => {
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const showDrawer = () => {
    setVisible(!visible);
  };
  const searchMenuItem = [
    {
      label: "",
      icon: <SearchOutlined />,
      key: "searchButton",
      children: [
        {
          label: (
            <Input
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
          style: { height: 60, background: "none" },
        },
      ],
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
    <Layout.Header className="nav-header bg-none">
      <Button className="menuButton" type="text" onClick={showDrawer}>
        <MenuOutlined />
      </Button>

      <div className="logo ">
        <Link
          to="/"
          className="d-flex justify-content-start align-items-center"
        >
          <img
            src={logo}
            alt="logo"
            style={{ marginBottom: 19, marginLeft: -10, marginRight: 3 }}
          />
          <h3 className="brand-font">AlSaleels</h3>
        </Link>
      </div>

      <div className="navbar-menu">
        <div className="leftMenu">
          <LeftMenu mode={"horizontal"} />
        </div>

        <div className="rightMenu ">
          <Menu
            mode="horizontal"
            // className="navMenu
            id="searchBtn"
            multiple
            key="search"
            items={searchMenuItem}
          />

          <div className="navSearch">
            <Input
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
          <LeftMenu mode={"inline"} />
          <RightMenu mode={"inline"} />
        </Drawer>
      </div>

      <div className="header-col header-btn">
        <Link to="/cart">
          <Button type="primary">
            <ShoppingCartOutlined />
            Cart
          </Button>
        </Link>
      </div>
    </Layout.Header>
  );
};
export default CommonNavbar;
