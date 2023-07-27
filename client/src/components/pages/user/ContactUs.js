import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Layout, Row, Col, Typography } from "antd";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { CiLocationOn } from "react-icons/ci";
const { Title, Text } = Typography;
function ContactUs() {
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
      <Row justify="space-between" align="stretch">
        <Col xs={24} sm={24} md={12} id="aboutUsText">
          <Card
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              background: "transparent",
            }}
            className="card"
          >
            <Title level={1} className=" text-center">
              About Us
            </Title>
            <Text style={{ lineHeight: "2", letterSpacing: "1px" }}>
              NILE is an online marketplace for stationary products, offering a
              wide range of high-quality items from multiple vendors. Our
              platform is designed to provide a seamless shopping experience,
              with an easy-to-use interface and advanced search capabilities
              that make it simple to find exactly what you are looking for.
              Whether you are in need of pens, pencils, notebooks, or art
              supplies, NILE has you covered. Shop with us today and discover
              the best in stationary!
            </Text>
          </Card>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          style={{
            minHeight: "46vh",
          }}
          id="aboutUsCover"
        ></Col>
      </Row>
      <Row justify="space-between" align="stretch">
        <Col
          xs={24}
          sm={24}
          md={12}
          style={{
            minHeight: "46vh",
          }}
          id="contactUsCover"
        ></Col>
        <Col xs={24} sm={24} md={12} id="contactUsText">
          <Card
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
            }}
            className="card"
          >
            <Title level={1} className=" text-center">
              Contact Us
            </Title>
            <Row>
              <Col
                span={14}
                className="d-flex align-items-center justify-content-start"
              >
                <Text
                  className="text-muted"
                  style={{ marginRight: 5, marginTop: 5 }}
                >
                  <MailOutlined style={{ fontSize: 22 }} />
                </Text>
                nile.ecomportal@gmail.com
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col
                span={14}
                className="d-flex align-items-center justify-content-start"
              >
                <Text
                  className="text-muted"
                  style={{ marginRight: 5, marginTop: 5 }}
                >
                  <PhoneOutlined style={{ fontSize: 22 }} />
                </Text>
                +91 9876543210
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col span={24} className="d-flex align-items-center">
                <Text
                  className="text-muted"
                  style={{ marginRight: 5, marginTop: 5 }}
                >
                  <CiLocationOn style={{ fontSize: 22 }} />
                </Text>
                18, KP Road Anantnag, Jammu and Kashmir, India, 192401
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Footer />
    </Layout>
  );
}

export default ContactUs;
