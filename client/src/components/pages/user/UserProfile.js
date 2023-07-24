import { React } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Layout, Row, Col } from "antd";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
import "@splidejs/react-splide/css";
import useAllContext from "../../../context/useAllContext";
import { BsFillBoxFill } from "react-icons/bs";
import { FcLock } from "react-icons/fc";
import { ImLocation } from "react-icons/im";
// import { MdSupportAgent } from "react-icons/md";
function UserProfile() {
  const navigate = useNavigate();
  const { appUser } = useAllContext();
  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };
  return (
    <Layout className="layout-default">
      <CommonNavbar handleSearch={handleSearch} />
      <Card
        style={{ textAlign: "center", color: "green" }}
        className="profile-cards"
      >
        <h1>Hello {appUser.name}! </h1>
      </Card>
      <Row style={{ padding: "20px" }}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Link to="/yourorders">
            <Card className="profile-cards">
              <BsFillBoxFill
                style={{ width: "50px", height: "50px", color: "green" }}
              />
              <h2>Your Orders</h2>
              <span>Track , return or buy again</span>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Link to="/loginandsecurity">
            <Card className="profile-cards">
              <FcLock style={{ width: "50px", height: "50px" }} />
              <h2>Login & security</h2>
              <span>Edit login, name and mobile number</span>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Link to="/youraddresses">
            <Card className="profile-cards">
              <ImLocation
                style={{ width: "50px", height: "50px", color: "#AED6F1" }}
              />
              <h2>Your Address</h2>
              <span>Edit address for orders and gifts</span>
            </Card>
          </Link>
        </Col>
        {/* <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Link to="/yourorders">
            <Card className="profile-cards">
              <MdSupportAgent
                style={{ width: "50px", height: "50px", color: "purple" }}
              />
              <h2>Contact Us</h2>
              <span>Edit address for orders and gifts</span>
            </Card>
          </Link>
        </Col> */}
      </Row>
      <Footer />
    </Layout>
  );
}

export default UserProfile;