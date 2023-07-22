import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Layout, Row, Col } from "antd";
import CommonNavbar from "../../../layout/CommonNavbar";
import Footer from "../../../layout/Footer";
import "@splidejs/react-splide/css";
import useAllContext from "../../../../context/useAllContext";
import axios from "axios";
function UserProfile() {
  const navigate = useNavigate();
  const { appUser } = useAllContext();
  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return dateObj.toLocaleDateString("en-US", options);
  };

  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };
  const [orders, setOrders] = useState();
  const baseImgUrl = "http://localhost:5000/";
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/yourorders", {
          params: {
            user_id: appUser.id,
          },
        });
        console.log(response.data);
        setOrders(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (appUser.id !== null && appUser.id !== undefined) {
      getOrders();
    }
  }, [appUser.id]);

  return (
    <Layout className="layout-default">
      <CommonNavbar handleSearch={handleSearch} />
      <Card>Your orders</Card>
      <div>
        {orders &&
          orders.map((order, index) => (
            <Card key={`Card${order.id}${index}`}>
              <Row style={{ textAlign: "right", display: "unset" }}>
                <p>Order Id:{order.order_id}</p>
                <p>Order placed: {formatDate(order.created_at)}</p>
                <p>Order status: {order.order_status}</p>
                <p>Total: &#8377;{order.amount}</p>
                <div className="">
                  <p>Ship to</p>
                  <span>{order.full_name}, </span>
                  <span>{order.house_no_company}, </span>
                  <span>Near- {order.landmark}, </span>
                  <span>{order.area_street_village}, </span>
                  <span> {order.town_city},</span>
                  <span> {order.state}, </span>
                  <span> {order.pincode}, </span>
                  <span> {order.phone_number}, </span>
                  <span> {order.country}</span>
                </div>
                <p>
                  Contact seller:
                  <a href={`mailto:${order.vemail}`}>&#8377;{order.vemail}</a>
                </p>
              </Row>
              <Row>
                <Col span={6}>
                  <img
                    src={baseImgUrl + order.image}
                    alt={order.name}
                    style={{ maxHeight: "200px", maxWidth: "200px" }}
                  />
                </Col>
                <Col span={8}>
                  <Link to={`../product/?id=${order.product_id}`}>
                    <h4>{order.name}</h4>
                  </Link>
                </Col>
              </Row>
            </Card>
          ))}
      </div>
      <Footer />
    </Layout>
  );
}

export default UserProfile;
