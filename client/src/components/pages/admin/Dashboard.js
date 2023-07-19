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

import { Card, Col, Row, Avatar, Tooltip } from "antd";
import { useRef } from "react";
import {
  UnorderedListOutlined,
  PlusCircleOutlined,
  EyeOutlined,
  SettingOutlined,
  MoreOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import vendorsImg from "../../../assets/images/vendorsCardImage.jpg";
import prodImg from "../../../assets/images/productsCardImage.jpg";
import ordersImg from "../../../assets/images/ordersCardImage.jpg";
import usersImg from "../../../assets/images/usersCard.jpg";
import prodIcon from "../../../assets/images/productsIcon.png";
import vendorIcon from "../../../assets/images/vendorsIcon.png";
import ordersIcon from "../../../assets/images/ordersIcon.png";
import usersIcon from "../../../assets/images/usersIcon.png";

import {
  BsCartPlus,
  BsCartCheck,
  // BsCartX,
  BsClockHistory,
} from "react-icons/bs";
import useAllContext from "../../../context/useAllContext";

import { Dropdown } from "antd";

import { Link } from "react-router-dom";
const { Meta } = Card;
function Dashboard() {
  const { appUser } = useAllContext();

  const { dropdownRef } = useRef(null);
  const items = [
    {
      label: <Link to="/admin/categories">Categories</Link>,
      key: "CategoryManagement",
    },

    {
      label: <Link to="/admin/brands">Brands</Link>,
      key: "brandManagement",
    },
  ];

  return (
    <>
      <Row
        gutter={[24, 0]}
        className="d-flex align-items-center justify-content-around "
      >
        {appUser.is_super_admin && (
          <Col className=" mb-24">
            <Card
              style={{ width: 320 }}
              cover={<img alt="VendorCardCover" src={vendorsImg} />}
              actions={[
                <Tooltip title="View all Vendors" color={"#9edd38"}>
                  <Link to="/admin/superadmin/allvendors">
                    <UnorderedListOutlined key="allvendors" />
                  </Link>
                </Tooltip>,
                <Tooltip title="Approve Vendors" color={"#9edd38"}>
                  <Link to="/admin/superadmin/approvevendors">
                    <IssuesCloseOutlined key="approvevendors" />
                  </Link>
                </Tooltip>,

                // <EditOutlined key="edit" />,
                // <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src={vendorIcon} />}
                title="Vendors"
                description="Information of Vendors"
              />
            </Card>
          </Col>
        )}

        <Col className=" mb-24">
          <Card
            style={{ width: 320 }}
            cover={<img alt="ProdCardCover" src={prodImg} />}
            actions={[
              <Tooltip title="Add Product" color={"#9edd38"}>
                <Link to="/admin/products/addproduct">
                  <PlusCircleOutlined key="addproduct" />
                </Link>
              </Tooltip>,
              <Tooltip title="View all Products" color={"#9edd38"}>
                <Link to="/admin/products/allproducts">
                  <UnorderedListOutlined key="viewproducts" />
                </Link>
              </Tooltip>,
              <Tooltip title="More Options" color={"#9edd38"}>
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  ref={dropdownRef}
                >
                  <Link onClick={(e) => e.preventDefault()}>
                    <MoreOutlined key="moreprodOptions" />
                  </Link>
                </Dropdown>
              </Tooltip>,

              // <EditOutlined key="edit" />,
              // <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src={prodIcon} />}
              title="Products"
              description="Information of Products"
            />
          </Card>
        </Col>
        <Col className="mb-24">
          <Card
            style={{ width: 320 }}
            cover={<img alt="ProdCardCover" src={ordersImg} />}
            actions={[
              <Tooltip title="Pending Orders" color={"#9edd38"}>
                <Link to="/admin/orders/pending">
                  <BsCartPlus style={{ fontSize: 20 }} />
                </Link>
              </Tooltip>,
              <Tooltip title="Completed Orders" color={"#9edd38"}>
                <Link to="/admin/orders/completed">
                  <BsCartCheck style={{ fontSize: 20 }} />
                </Link>
              </Tooltip>,
              // <Tooltip title="Cancelled Orders" color={"#9edd38"}>
              //   <Link to="/admin/orders/cancelled">
              //     <BsCartX style={{ fontSize: 20 }} />
              //   </Link>
              // </Tooltip>,
              <Tooltip title="Order History" color={"#9edd38"}>
                <Link to="/admin/orders/allorders">
                  <BsClockHistory style={{ fontSize: 20 }} />
                </Link>
              </Tooltip>,
              // <EditOutlined key="edit" />,
              // <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src={ordersIcon} />}
              title="Orders"
              description="Information of Orders"
            />
          </Card>
        </Col>
        <Col className="mb-24">
          <Card
            style={{ width: 320 }}
            cover={<img alt="ProdCardCover" src={usersImg} />}
            actions={[
              <Tooltip title="View Users" color={"#9edd38"}>
                <Link to="/admin/viewusers">
                  <EyeOutlined key="viewUsers" />
                </Link>
              </Tooltip>,
              <Tooltip title="Manage Users" color={"#9edd38"}>
                <Link to="admin/manageusers">
                  <SettingOutlined key="manageusers" />
                </Link>
              </Tooltip>,
              // <EditOutlined key="edit" />,
              // <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src={usersIcon} />}
              title="Users"
              description="Information of Users"
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
