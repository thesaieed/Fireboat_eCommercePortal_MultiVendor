import { Menu } from "antd";
import { Link } from "react-router-dom";

const LeftMenu = ({ mode }) => {
  const items = [
    {
      label: (
        <Link to="/">
          <span> Home </span>
        </Link>
      ),
      key: "Home",
    },
    {
      label: (
        <Link to="/browse/?search=allProducts">
          <span>Our Products</span>
        </Link>
      ),
      key: "allproducts",
    },
    {
      label: (
        <Link to="/aboutus">
          <span>About Us</span>
        </Link>
      ),
      key: "aboutus",
    },
  ];
  return <Menu mode={mode} items={items} />;
};

export default LeftMenu;