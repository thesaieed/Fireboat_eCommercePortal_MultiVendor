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

const CommonNavbar = ({ handleSearch }) => {
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const showDrawer = () => {
    setVisible(!visible);
  };

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

      <div className="logo">
        <Link to="/">
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
          >
            <Menu.SubMenu title={<>{<SearchOutlined />}</>}>
              <Menu.Item style={{ height: 60 }} key="searchItem">
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
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>

          <div className="navSearch">
            <Input
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
