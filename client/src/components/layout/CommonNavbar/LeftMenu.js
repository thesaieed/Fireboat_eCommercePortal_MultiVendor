import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const LeftMenu = ({ mode }) => {
  return (
    <Menu mode={mode}>
      <Menu.Item key="1">
        <Link to="/">
          <span> Home</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="">
          <span>Our Products</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="">
          <span>About Us</span>
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default LeftMenu;
