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
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAllContext from "../context/useAllContext";
import { Card, Col, Row, Typography, Button } from "antd";

function Home() {
  const { Title, Text } = Typography;
  const { appUser, setAppUser } = useAllContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!appUser.id) {
      navigate("/login");

      return () => {
        setAppUser({});
      };
    }
  });

  return (
    <>
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          <Col xs={24} md={12} sm={24} lg={12} xl={10} className="mb-24">
            <Card bordered={true} className="criclebox card-info-2 h-full">
              <div className="gradent h-full col-content">
                <div className="card-content">
                  <Title level={5}>Logged in as</Title>
                  <Text>{appUser?.isadmin ? "Admin" : "User"}</Text>
                </div>
                <div className="card-footer">
                  <Button
                    size="large"
                    type="danger"
                    onClick={() => setAppUser({})}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
