import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Row, Col, Typography, Button } from "antd";
import { BiSolidError } from "react-icons/bi";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
const { Title } = Typography;

function NotFound() {
  const navigate = useNavigate();
  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <Layout className="layout-default">
      <CommonNavbar handleSearch={handleSearch} />
      <Row style={{ height: "90vh" }} align="middle" justify="center">
        <Col span={24} className="d-flex flex-column align-items-center">
          <div>
            <Title
              level={1}
              style={{
                fontSize: 40,
                margin: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <BiSolidError fontSize={60} style={{ marginRight: 10 }} /> ERROR
              404
            </Title>
            <Title level={4} style={{ margin: 0, textAlign: "end" }}>
              Page Not Found!
            </Title>
            <Link to="/" style={{ float: "right", marginTop: 10 }}>
              <Button>Go Home</Button>
            </Link>
          </div>
        </Col>
      </Row>
      <Footer />
    </Layout>
  );
}

export default NotFound;
