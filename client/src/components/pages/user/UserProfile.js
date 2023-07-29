import { React, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Layout, Row, Col, message, Avatar } from "antd";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
import useAllContext from "../../../context/useAllContext";
import { BsFillBoxFill } from "react-icons/bs";
import { FcLock } from "react-icons/fc";
import { ImLocation } from "react-icons/im";
import { CustomerServiceFilled } from "@ant-design/icons";
// import { MdSupportAgent } from "react-icons/md";
function UserProfile() {
  const navigate = useNavigate();
  const { appUser } = useAllContext();
  useEffect(() => {
    if (!appUser.id) {
      message.info("You need to be Logged In!");
      navigate("/auth/login");
    }
  }, [appUser.id, navigate]);

  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };
  return (
    <Layout className="layout-default">
      <CommonNavbar handleSearch={handleSearch} />
      <Row style={{ margin: 20, marginTop: 50 }} justify="space-evenly">
        <Col xs={24} sm={24} md={12}>
          <Row gutter={[25, 25]} justify="center">
            <Col xs={20} sm={20} md={24} lg={12} xl={12}>
              <Link to="/orders">
                <Card
                  hoverable
                  style={{
                    width: "100%",
                  }}
                >
                  <Card.Meta
                    avatar={
                      <BsFillBoxFill style={{ fontSize: 50, color: "green" }} />
                    }
                    title="Track Orders"
                    description="View and Tract yours Orders"
                  />
                </Card>
              </Link>
            </Col>
            <Col xs={20} sm={20} md={24} lg={12} xl={12}>
              <Link to="/loginandsecurity">
                <Card
                  hoverable
                  style={{
                    width: "100%",
                  }}
                >
                  <Card.Meta
                    // avatar={<Avatar src={<FcLock />} />}
                    avatar={<FcLock style={{ fontSize: 50 }} />}
                    title="Login & security"
                    description="Edit Login, Name and Mobile Number"
                  />
                </Card>
              </Link>
            </Col>
            <Col xs={20} sm={20} md={24} lg={12} xl={12}>
              <Link to="/youraddresses">
                <Card
                  hoverable
                  style={{
                    width: "100%",
                  }}
                >
                  <Card.Meta
                    avatar={
                      <ImLocation style={{ fontSize: 50, color: "green" }} />
                    }
                    title="Your Address"
                    description="Edit Shippping Address for your Orders"
                  />
                </Card>
              </Link>
            </Col>{" "}
            <Col xs={20} sm={20} md={24} lg={12} xl={12}>
              <Link to="/aboutus">
                <Card
                  hoverable
                  style={{
                    width: "100%",
                  }}
                >
                  <Card.Meta
                    avatar={
                      <CustomerServiceFilled
                        style={{ fontSize: 50, color: "orange" }}
                      />
                    }
                    title="Contact Us"
                    description="Contact us for any of your queries"
                  />
                </Card>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Footer />
    </Layout>
  );
}

export default UserProfile;
