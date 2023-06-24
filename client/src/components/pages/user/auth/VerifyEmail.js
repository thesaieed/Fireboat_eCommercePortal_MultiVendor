import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Layout, Typography, Card, Button, Spin, message } from "antd";
import {
  LoadingOutlined,
  ExclamationOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Footer from "../../../layout/Footer";
export const VerifyEmail = () => {
  const { /*Header,*/ Content } = Layout;
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [extraMessage, setExtraMessage] = useState("");
  const [showMailInfo, setShowMailInfo] = useState(true);

  const [loading, setIsLoading] = useState(false);
  const { Title } = Typography;
  const [searchParams] = useSearchParams();
  const token = searchParams.get("verify");
  const email = searchParams.get("email");

  const navigate = useNavigate();
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 50,
      }}
      spin
    />
  );

  const verifyToken = async () => {
    setIsVerifying(true);
    const res = await axios.post("http://localhost:5000/verifyEmail", {
      token: token,
      email: email,
    });
    console.log(res);
    if (res.data.status === 200) {
      message.success(res.data.message);
      setIsVerified(true);
      //   navigate("/");
    } else if (res.data.status === 404) {
      // message.error(res.data.message);
      setExtraMessage("User Not Found");
      setShowMailInfo(false);
      setIsVerified(false);
      setMailSent(true);
    } else {
      message.error(res.data.message);
      setExtraMessage(res.data.message);
      setIsVerified(false);
    }
    setIsVerifying(false);
  };
  const handleReVerify = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/resendEmailverification",
        { email: email }
      );
      console.log(res);
      if (res.data.status === 200) {
        setMailSent(true);
      } else if (res.data.status === 202) {
        // navigate("/login");
        setIsVerifying(false);
        setIsVerified(true);
      } else {
        message.error("Failed to send Email. please try again");
        setMailSent(false);
      }
    } catch (err) {
      setMailSent(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <>
      <div
        className="layout-default ant-layout layout-sign-up"
        style={{ height: "100vh" }}
      >
        <Content className="signupContent ">
          <div className="sign-up-header">
            <div className="content">
              <Title> Email Verification</Title>
            </div>
          </div>

          <Card
            className="card-verify header-solid h-full ant-card pt-0  mb-2"
            // title={<h5>Register With</h5>}
            bordered="false"
          >
            {isVerifying ? (
              <div className="text-center">
                <Title level={4}>
                  <Spin indicator={antIcon} />
                  <span style={{ marginLeft: 10 }}>Verifying Email</span>
                </Title>
              </div>
            ) : (
              <>
                {isVerified ? (
                  <>
                    <div className="d-flex justify-content-evenly">
                      <CheckCircleOutlined
                        style={{ color: "green", fontSize: 60 }}
                      />
                      <Title level={4}>
                        Email Verified Successfully !<br /> Please Login to
                        continue
                      </Title>
                    </div>
                    <Button
                      type="primary"
                      onClick={() => {
                        navigate("/login");
                      }}
                      style={{ float: "right" }}
                    >
                      Login
                    </Button>
                  </>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <Title level={4}>
                      <ExclamationOutlined
                        style={{ color: "red", fontSize: 30 }}
                      />
                      Email Verification Failed!
                      <br />
                      <br />
                      {extraMessage}
                    </Title>
                    {mailSent && showMailInfo ? (
                      <Title level={5}>
                        ReVerification Email sent Successfully!
                        <br /> Please Check your email
                      </Title>
                    ) : (
                      <>
                        {showMailInfo ? (
                          <Button
                            type="primary"
                            onClick={handleReVerify}
                            loading={loading}
                          >
                            Click to send Verification Email again
                          </Button>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </Card>
        </Content>
        <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <div className="d-flex justify-content-center">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};