import { Row, Col, Typography } from "antd";

import { useNavigate } from "react-router-dom";

const FeaturedProduct = ({ product }) => {
  const { Title, Paragraph } = Typography;
  const baseUrl = "http://localhost:5000/";
  const navigate = useNavigate();
  const contentStyle = {
    height: "23rem",
    color: "#fff",
    // lineHeight: "300px",
    textAlign: "center",
    // background: "#fff",
    background: "#0d181e",
  };
  return (
    <div style={contentStyle}>
      <Row
        className="featuredProductsRow"
        onClick={() => {
          navigate(`/product/?id=${product.id}`);
        }}
      >
        <Col className="featuredproductsColumn">
          <img
            src={`${baseUrl}${product.image}`}
            alt=""
            className="featuredImg"
          />
        </Col>
        <Col span={12} className="featuredproductsColumn">
          <Title level={1} className="featuredproductsTitle">
            {product.name}
          </Title>
          <Paragraph level={1} className="featuredproductsDescription">
            {product.description}
          </Paragraph>
        </Col>
      </Row>
    </div>
  );
};

export default FeaturedProduct;
