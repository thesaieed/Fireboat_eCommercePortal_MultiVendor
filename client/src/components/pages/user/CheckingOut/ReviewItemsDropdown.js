import { useEffect, useState } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Image, Row } from "antd";
import React from "react";
function ReviewItemsDropdown({
  itemDetails,
  onIncrement,
  onDecrement,
  placeOrder,
}) {
  //   console.log(itemDetails);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const estimatedDeliveryDate = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    const formattedDate = estimatedDeliveryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setEstimatedDelivery(formattedDate);
  }, []);

  return (
    <>
      <Card>
        <h2>
          Estimated Delivery By:
          <span style={{ color: "green", paddingLeft: "5px" }}>
            {estimatedDelivery}
          </span>
        </h2>
        {itemDetails.map((item, index) => (
          <Row
            key={index}
            style={{ paddingBottom: "10px" }}
            gutter={20}
            justify="center"
            align={"middle"}
          >
            <Col span={8}>
              <Image
                style={{ maxWidth: "180px" }}
                src={`https://nile-server-a3fg.onrender.com/${item.image[0].replace(
                  /\\/g,
                  "/"
                )}`}
                alt="ProductImg"
              />
            </Col>
            <Col span={16}>
              <p>{item.name}</p>
              <p>&#8377;{item.price}</p>
              <Button
                onClick={() => onDecrement(index)}
                style={{
                  padding: "0 5px",
                  height: "30px",
                  lineHeight: "unset",
                }}
              >
                <MinusOutlined />
              </Button>
              <span style={{ padding: "5px" }}>{item.quantity}</span>
              <Button
                onClick={() => onIncrement(index)}
                style={{
                  padding: "0 5px",
                  height: "30px",
                  lineHeight: "unset",
                }}
              >
                <PlusOutlined />
              </Button>
            </Col>
          </Row>
        ))}
      </Card>
    </>
  );
}
export default ReviewItemsDropdown;
