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
} from "@ant-design/icons";
import prodImg from "../../../assets/images/productsCardImage.jpg";
import ordersImg from "../../../assets/images/ordersCardImage.jpg";
import usersImg from "../../../assets/images/usersCard.jpg";
import prodIcon from "../../../assets/images/productsIcon.png";
import ordersIcon from "../../../assets/images/ordersIcon.png";
import usersIcon from "../../../assets/images/usersIcon.png";
import queueCart from "../../../assets/images/queueCart.png";
import finishCart from "../../../assets/images/finishCart.png";
import cancelledCart from "../../../assets/images/cancelledCart.png";
import historyCart from "../../../assets/images/historyCart.png";

import { Dropdown } from "antd";

import { Link } from "react-router-dom";
const { Meta } = Card;
function Dashboard() {
  const { dropdownRef } = useRef(null);
  const items = [
    {
      label: <Link to="/admin/categories">Categories</Link>,
      key: "0",
    },
    {
      type: "divider",
    },
  ];
  return (
    <>
      <Row
        gutter={[24, 0]}
        className="d-flex align-items-center justify-content-around "
      >
        <Col className=" mb-24">
          <Card
            style={{ width: 320 }}
            cover={<img alt="ProdCardCover" src={prodImg} />}
            actions={[
              <Tooltip title="Add Product" color={"orange"}>
                <Link to="/admin/products/addproduct">
                  <PlusCircleOutlined key="addproduct" />
                </Link>
              </Tooltip>,
              <Tooltip title="View all Products" color={"orange"}>
                <Link to="/admin/products/allproducts">
                  <UnorderedListOutlined key="viewproducts" />
                </Link>
              </Tooltip>,
              <Tooltip title="More Options" color={"orange"}>
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
              <Tooltip title="In Queue Orders" color={"orange"}>
                <Link to="/admin/orders/inqueue">
                  <Avatar src={queueCart} key="inQueueOrders" />
                </Link>
              </Tooltip>,
              <Tooltip title="Completed Orders" color={"orange"}>
                <Link to="/admin/orders/completed">
                  <Avatar src={finishCart} key="finishedOrders" />
                </Link>
              </Tooltip>,
              <Tooltip title="Cancelled Orders" color={"orange"}>
                <Link to="/admin/orders/cancelled">
                  <Avatar src={cancelledCart} key="cancelled" />
                </Link>
              </Tooltip>,
              <Tooltip title="Order History" color={"orange"}>
                <Link to="/admin/orders/history">
                  <Avatar src={historyCart} key="finishedOrders" />
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
              <Tooltip title="View Users" color={"orange"}>
                <Link to="/admin/viewusers">
                  <EyeOutlined key="viewUsers" />
                </Link>
              </Tooltip>,
              <Tooltip title="Manage Users" color={"orange"}>
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
