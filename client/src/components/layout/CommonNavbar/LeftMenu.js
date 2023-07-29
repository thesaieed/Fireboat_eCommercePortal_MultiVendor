import { Menu } from "antd";
import { Link } from "react-router-dom";

const LeftMenu = ({ mode, randomCategories }) => {
  const items = [
    {
      label: (
        <Link
          to={`/browse/?search=categoryProducts&category=${randomCategories[0]?.name}`}
        >
          <span> {randomCategories[0]?.name} </span>
        </Link>
      ),
      key: randomCategories[0]?.name,
    },
    {
      label: (
        <Link
          to={`/browse/?search=categoryProducts&category=${randomCategories[1]?.name}`}
        >
          <span> {randomCategories[1]?.name} </span>
        </Link>
      ),
      key: randomCategories[1]?.name,
    },
    {
      label: <Link to="/aboutus">About Us</Link>,
      key: "aboutus",
    },
  ];

  return <Menu mode={mode} items={items} disabledOverflow={true} />;
};

export default LeftMenu;
