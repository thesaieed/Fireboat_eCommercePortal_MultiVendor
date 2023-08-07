import { Row, Col, Descriptions, Typography, Card, Image } from "antd";
import React, { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import brandIcon from "../../../../assets/images/brandIcon.png";
import categoryIcon from "../../../../assets/images/categoryIcon.png";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import vendorsIcon from "../../../../assets/images/vendorsIcon.png";
import { FaTruckMoving } from "react-icons/fa6";
import useAllContext from "../../../../context/useAllContext";
const OrderDetails = () => {
  const location = useLocation();
  var dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const orderDetails = useMemo(
    () => location.state?.completeProductsWithAllDetails || [],
    [location.state?.completeProductsWithAllDetails]
  );
  console.log(orderDetails);
  const { appUser } = useAllContext();
  return (
    <Card>
      <Row justify="space-evenly" align="top">
        <Col xs={24} sm={24} md={13} lg={15}>
          <Row>
            <Typography.Title level={4} style={{ marginLeft: 10 }}>
              Products
            </Typography.Title>
            {orderDetails?.map((product) => {
              return (
                <Descriptions
                  key={product?.product?.id}
                  layout="vertical"
                  bordered
                  style={{
                    width: "100%",
                    marginBottom: 15,
                    boxShadow: "0 5px 5px rgb(0 0 0 / 3%)",
                    textAlign: "justify",
                  }}
                >
                  <Descriptions.Item
                    label="Images"
                    // span={1}
                    style={{ width: 160 }}
                  >
                    <Splide
                      key={`CarouselImages`}
                      options={{
                        rewind: true,
                        width: 160,
                        gap: "1rem",
                      }}
                      style={{ width: "100%", margin: "auto" }}
                    >
                      {product?.product?.image?.map((imgurl, index) => {
                        return (
                          <SplideSlide
                            key={`Carousel${index}`}
                            style={{
                              maxWidth: 160,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Image
                              src={`/${imgurl.replace(/\\/g, "/")}`}
                              style={{
                                cursor: "pointer",
                                padding: 0,
                                maxHeight: 200,
                                maxWidth: 150,
                              }}
                            />
                          </SplideSlide>
                        );
                      })}
                    </Splide>{" "}
                  </Descriptions.Item>

                  <Descriptions.Item label="Product Name">
                    <Typography.Paragraph>
                      <Link to={`/product/?id=${product?.product?.id}`}>
                        {product?.product?.name}
                      </Link>
                    </Typography.Paragraph>
                    <Typography.Paragraph
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography.Text type="secondary">
                        <img src={categoryIcon} height={22} alt="categoyIcon" />
                        {product?.product?.category}
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        <img src={brandIcon} height={20} alt="brandIcon" />
                        {" " + product?.product?.brand}
                      </Typography.Text>
                    </Typography.Paragraph>
                    {appUser.is_super_admin && (
                      <Typography.Paragraph
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography.Text type="secondary">
                          <img
                            src={vendorsIcon}
                            height={22}
                            alt="categoyIcon"
                          />
                          {product?.product?.seller?.name}
                        </Typography.Text>
                        <Typography.Text
                          type="secondary"
                          style={{ textTransform: "capitalize" }}
                        >
                          <FaTruckMoving fontSize={20} />
                          {" " + product?.product?.order_status}
                        </Typography.Text>
                      </Typography.Paragraph>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Quantity" style={{ width: 90 }}>
                    {product.quantity}
                  </Descriptions.Item>
                </Descriptions>
              );
            })}
          </Row>
        </Col>
        <Col xs={24} sm={24} md={7} lg={8}>
          <Row>
            <Typography.Title level={4} style={{ marginLeft: 10 }}>
              User
            </Typography.Title>
            <Descriptions layout="vertical" bordered style={{ width: "100%" }}>
              <Descriptions.Item label="Name" span={2}>
                {orderDetails[0]?.user?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Phone" span={1}>
                +91 {orderDetails[0]?.address?.phone_number}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {orderDetails[0]?.user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={3}>
                <div className="">
                  <span>
                    House No: {orderDetails[0]?.address?.house_no_company},{" "}
                  </span>
                  <span>Near- {orderDetails[0]?.address?.landmark}, </span>
                  <span>{orderDetails[0]?.address?.area_street_village}, </span>
                  <span> {orderDetails[0]?.address?.town_city},</span>
                  <span> {orderDetails[0]?.address?.state}, </span>
                  <span> {orderDetails[0]?.address?.country},</span>
                  <span> {orderDetails[0]?.address?.pincode} </span>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Row>
          <Row>
            <Typography.Title
              level={4}
              style={{ marginLeft: 10, marginTop: 15 }}
            >
              Order{" "}
              {!appUser.is_super_admin && (
                <Typography.Text
                  style={{ color: "#0ac20e", textTransform: "uppercase" }}
                >
                  [{orderDetails[0]?.order_status}]
                </Typography.Text>
              )}
            </Typography.Title>
            <Descriptions layout="vertical" bordered style={{ width: "100%" }}>
              <Descriptions.Item label="OrderId">
                {orderDetails[0]?.order_id}
              </Descriptions.Item>
              <Descriptions.Item label="Ordered On" span={2}>
                {new Date(orderDetails[0]?.created_at).toLocaleDateString(
                  "en-US",
                  dateOptions
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Mode">
                {orderDetails[0]?.payment?.mode}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                {orderDetails[0]?.payment?.status === "success" && (
                  <span
                    style={{
                      color: "green",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {orderDetails[0]?.payment?.status}
                  </span>
                )}
                {orderDetails[0]?.payment?.status === "failure" && (
                  <span
                    style={{
                      color: "red",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {orderDetails[0]?.payment?.status}
                  </span>
                )}
                {orderDetails[0]?.payment?.status === "In Progress" && (
                  <span
                    style={{
                      color: "orange",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {orderDetails[0]?.payment?.status}
                  </span>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="mihpayid">
                {orderDetails[0]?.payment?.mihpayid}
              </Descriptions.Item>
              <Descriptions.Item label="Transaction ID" span={2}>
                {orderDetails[0]?.payment?.transaction_id}
              </Descriptions.Item>
              <Descriptions.Item label="Paid Amount">
                {orderDetails[0]?.payment?.status === "success" && (
                  <span>
                    &#8377;{" "}
                    {orderDetails?.reduce((sum, item) => sum + item.amount, 0)}
                  </span>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default OrderDetails;
