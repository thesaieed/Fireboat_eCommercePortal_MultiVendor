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

import { Card, Col, Row, Avatar, Tooltip, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  UnorderedListOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  MoreOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
// import vendorsImg from "../../../assets/images/vendorsCardImage.jpg";
// import prodImg from "../../../assets/images/productsCardImage.jpg";
// import ordersImg from "../../../assets/images/ordersCardImage.jpg";
// import usersImg from "../../../assets/images/usersCard.jpg";
import prodIcon from "../../../assets/images/productsIcon.png";
import vendorIcon from "../../../assets/images/vendorsIcon.png";
import ordersIcon from "../../../assets/images/ordersIcon.png";
import usersIcon from "../../../assets/images/usersIcon.png";

import {
  BsCartPlus,
  BsCartCheck,
  // BsCartX,
  BsClockHistory,
  BsFillCalendarDateFill,
} from "react-icons/bs";
import useAllContext from "../../../context/useAllContext";
import EChart from "./charts/EChart";
import LineChart from "./charts/LineChart";
import WeekLineChart from "./charts/WeekLineChart";
import { Dropdown, Image } from "antd";
import { FaIndianRupeeSign, FaCalendarWeek } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios";
const { Meta } = Card;
function Dashboard() {
  const { Title, Text } = Typography;
  const { appUser } = useAllContext();
  const [topStats, setTopStats] = useState({});
  const [monthlySales, setMonthlySales] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);
  const [lastSevenDaySales, setLastSevenDaySales] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
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
  const getTopStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await axios.post("/topstats", {
        vendor_id: appUser.id,
        is_super_admin: appUser.is_super_admin,
      });
      setTopStats(data);
    } catch (error) {
      console.error(error);
    }
    setStatsLoading(false);
  }, [appUser.id, appUser.is_super_admin]);
  const getMonthlySales = useCallback(async () => {
    const { data } = await axios.post("/monthlysales", {
      vendor_id: appUser.id,
      is_super_admin: appUser.is_super_admin,
    });

    setMonthlySales(data);
  }, [appUser.id, appUser.is_super_admin]);
  const getWeeklySales = useCallback(async () => {
    const { data } = await axios.post("/weeklysales", {
      vendor_id: appUser.id,
      is_super_admin: appUser.is_super_admin,
    });

    setWeeklySales(data);
  }, [appUser.id, appUser.is_super_admin]);
  const getLastSevenDaySales = useCallback(async () => {
    const { data } = await axios.post("/lastsevendaysales", {
      vendor_id: appUser.id,
      is_super_admin: appUser.is_super_admin,
    });

    setLastSevenDaySales(data);
  }, [appUser.id, appUser.is_super_admin]);
  useEffect(() => {
    getTopStats();
    getMonthlySales();
    getWeeklySales();
    getLastSevenDaySales();
  }, [getTopStats, getMonthlySales, getWeeklySales, getLastSevenDaySales]);

  return (
    <>
      <Row className="rowgap-vbox" gutter={[12, 0]} align="stretch">
        <Col xs={24} sm={24} md={12} lg={12} xl={6} className="mb-24">
          <Card
            loading={statsLoading}
            bordered={false}
            className="criclebox "
            style={{ height: "100%" }}
          >
            <div className="number">
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={18}>
                  <span>{"Total Sales"}</span>
                  <Title level={3}>&#8377; {topStats.totalSales}</Title>
                </Col>
                <Col xs={5} sm={5}>
                  <div className="icon-box">
                    <FaIndianRupeeSign
                      fontSize={24}
                      style={{ marginTop: -6 }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={6} className="mb-24">
          <Card
            loading={statsLoading}
            bordered={false}
            className="criclebox "
            style={{ height: "100%" }}
          >
            <div className="number">
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={18}>
                  <span>{"Weekly Sales"}</span>
                  <Title level={3}>&#8377;{topStats.weeklySales}</Title>
                </Col>
                <Col xs={5} sm={5}>
                  <div className="icon-box">
                    <FaCalendarWeek fontSize={24} style={{ marginTop: -10 }} />
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={6} className="mb-24">
          <Card
            loading={statsLoading}
            bordered={false}
            className="criclebox "
            style={{ height: "100%" }}
          >
            <div className="number">
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={18}>
                  <span>{"Today Sales"}</span>
                  <Title level={3}>&#8377; {topStats.todaySales}</Title>
                </Col>
                <Col xs={5} sm={5}>
                  <div className="icon-box">
                    <BsFillCalendarDateFill
                      fontSize={24}
                      style={{ marginTop: -10 }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={6} className="mb-24">
          <Card
            loading={statsLoading}
            bordered={false}
            className="criclebox "
            style={{ height: "100%" }}
          >
            <div className="number">
              <Row align="middle" gutter={[24, 0]} justify="space-between">
                <Col xs={18}>
                  <span>
                    {"Top Selling Product | "}
                    <span style={{ color: "green" }}>
                      {`${topStats.topProduct?.count} Total Orders`}
                    </span>
                  </span>
                  {topStats.topProduct?.product.id && (
                    <Link
                      to={`/product/?id=${topStats.topProduct?.product.id}`}
                    >
                      <Text
                        className="two-lines"
                        style={{ color: "#000" }}
                        strong
                      >
                        {topStats.topProduct?.product?.name}
                      </Text>
                    </Link>
                  )}
                  {!topStats.topProduct?.product.id && (
                    <Text
                      className="two-lines"
                      style={{ color: "#000" }}
                      strong
                    >
                      {topStats.topProduct?.product?.name}
                    </Text>
                  )}
                </Col>
                <Col xs={5} sm={5}>
                  {/* <div className="icon-box"> */}
                  {topStats?.topProduct?.product?.image?.length > 0 && (
                    <Image
                      height={60}
                      src={`/${topStats?.topProduct?.product?.image[0]}`}
                    />
                  )}
                  {/* </div> */}
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
      <Row justify="space-between">
        <Col xs={24} sm={24} md={12} style={{ padding: 10 }}>
          <Card
            headStyle={{
              height: 50,
            }}
            title={
              <Title level={4} style={{ textAlign: "center", padding: 0 }}>
                Monthly Sales
              </Title>
            }
          >
            <EChart monthlySales={monthlySales} />
          </Card>
        </Col>{" "}
        <Col xs={24} sm={24} md={12} style={{ padding: 10 }}>
          <Card
            headStyle={{
              height: 50,
            }}
            title={
              <Title level={4} style={{ textAlign: "center" }}>
                Weekly Sales
              </Title>
            }
          >
            <LineChart weeklySales={weeklySales} />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} style={{ padding: 10 }}>
          <Card
            headStyle={{
              height: 50,
            }}
            title={
              <Title level={4} style={{ textAlign: "center" }}>
                Previous 7 Days Sales
              </Title>
            }
          >
            <WeekLineChart lastSevenDaySales={lastSevenDaySales} />
          </Card>
        </Col>
      </Row>
      <Title level={3} style={{ marginTop: 25, marginLeft: 10 }}>
        Actions
      </Title>
      <hr />

      <Row
        gutter={[24, 0]}
        // className="d-flex align-items-center justify-content-between "
        style={{ marginTop: 20 }}
        justify="space-between"
        align="stretch"
      >
        {appUser.is_super_admin && (
          <Col className=" mb-24" flex="1 0 25%">
            <Card
              style={{ height: "100%" }}
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
              ]}
            >
              <Meta
                avatar={
                  <Avatar src={vendorIcon} style={{ background: "#9edd38" }} />
                }
                title="Vendors"
                description="Manage various aspects regarding Vendors"
              />
            </Card>
          </Col>
        )}
        <Col className=" mb-24" flex="1 0 25%">
          <Card
            style={{ height: "100%" }}
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
            ]}
          >
            <Meta
              avatar={
                <Avatar src={prodIcon} style={{ background: "#9edd38" }} />
              }
              title="Products"
              description="Manage various aspects regarding Products"
            />
          </Card>
        </Col>
        <Col className="mb-24" flex="1 0 25%">
          <Card
            style={{ height: "100%" }}
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

              <Tooltip title="Order History" color={"#9edd38"}>
                <Link to="/admin/orders/allorders">
                  <BsClockHistory style={{ fontSize: 20 }} />
                </Link>
              </Tooltip>,
            ]}
          >
            <Meta
              avatar={
                <Avatar src={ordersIcon} style={{ background: "#9edd38" }} />
              }
              title="Orders"
              description="Manage various aspects regarding Orders"
            />
          </Card>
        </Col>
        {appUser.is_super_admin && (
          <Col className="mb-24" flex="1 0 25%">
            <Card
              style={{ height: "100%" }}
              actions={[
                <Tooltip title="Manage Users" color={"#9edd38"}>
                  <Link to="/admin/superadmin/allusers">
                    <SettingOutlined key="manageusers" />
                  </Link>
                </Tooltip>,
              ]}
            >
              <Meta
                avatar={
                  <Avatar src={usersIcon} style={{ background: "#9edd38" }} />
                }
                title="Users"
                description={`Manage various aspects regarding Users`}
              />
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
}

export default Dashboard;
