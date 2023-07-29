import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Typography,
  Card,
  Button,
  Spin,
  message,
  Form,
  Input,
  Alert,
} from "antd";
import {
  LoadingOutlined,
  ExclamationOutlined,
  LockOutlined,
} from "@ant-design/icons";
import logo from "../../../../assets/images/logo.png";
import Footer from "../../../layout/Footer";
export const ResetPasswordAdmin = () => {
  const { Content } = Layout;
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorDescription, setErrorDescription] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [successfulReset, setSuccessfulReset] = useState(false);
  const { Title } = Typography;
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");
  const email = searchParams.get("email");
  const isVendor = searchParams.get("iv");
  const onFinish = async (values) => {
    setButtonLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/resetpassword", {
        ...values,
        useremail: email,
        token,
        is_vendor: true,
      });
      // console.log("Responce : ", response);
      //if signup is successfull
      if (response.data.status === 200) {
        setErrorMessage("");
        setSuccessMessage("Password Reset Successful");
        form.resetFields();
        setSuccessfulReset(true);
      } else {
        setSuccessMessage("");
        setErrorMessage("Couldn't Reset Password! ");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMessage("Something went wrong!");
        setSuccessMessage("");
      }
    }
    form.resetFields();
    setButtonLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    setErrorMessage(
      "Details not submitted, check form details and try again !"
    );
  };
  const navigate = useNavigate();

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 50,
      }}
      spin
    />
  );

  const verifyToken = useCallback(async () => {
    setIsVerifying(true);
    const res = await axios.post("http://localhost:5000/verifyresettoken", {
      token: token,
      useremail: email,
      is_vendor: isVendor,
    });
    // console.log(res);
    if (res.data.status === 200) {
      setIsVerified(true);
    } else {
      message.error("Invalid Credentials");
      setIsVerified(false);
    }
    setIsVerifying(false);
  }, [email, token, isVendor]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <>
      <div
        className="layout-default ant-layout layout-sign-up"
        style={{ height: "100vh" }}
      >
        <Content className="signupContent ">
          <div className="sign-up-header">
            <div className="content">
              <div className="d-flex justify-content-center align-items-center">
                <Link
                  to="/"
                  className="d-flex justify-content-start align-items-baseline"
                >
                  <img src={logo} alt="logo" height={55} />
                  <Title
                    id="brand-font"
                    level={3}
                    style={{
                      fontSize: 75,
                      fontFamily: "poppins",
                      fontWeight: 400,
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    NILE
                  </Title>
                </Link>
              </div>
              <Title> Reset Password</Title>
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
                </Title>
              </div>
            ) : (
              <>
                {isVerified ? (
                  <Form
                    form={form}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="row-col p-15"
                  >
                    {!successfulReset && (
                      <>
                        {" "}
                        <Form.Item
                          name="password"
                          rules={[
                            {
                              pattern:
                                /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{4,}$/,
                              min: 8,
                              required: true,
                              message:
                                "Password must be greater than 8 chars and include special characters, numbers and a upper case letter",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input.Password
                            prefix={
                              <LockOutlined className="site-form-item-icon" />
                            }
                            placeholder="New Password"
                          />
                        </Form.Item>
                        <Form.Item
                          name="confirmPassword"
                          dependencies={["password"]}
                          rules={[
                            {
                              required: true,
                              message: "Password does not match",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    "The two passwords that you entered do not match!"
                                  )
                                );
                              },
                            }),
                          ]}
                          hasFeedback
                        >
                          <Input.Password
                            prefix={
                              <LockOutlined className="site-form-item-icon" />
                            }
                            placeholder="Confirm New Password"
                          />
                        </Form.Item>
                      </>
                    )}

                    {errorMessage && (
                      <Form.Item>
                        <Alert
                          message={errorMessage}
                          description={errorDescription}
                          type="error"
                          showIcon
                          closable
                          onClose={() => {
                            setErrorMessage("");
                            setErrorDescription();
                          }}
                        />
                      </Form.Item>
                    )}
                    {successMessage && (
                      <Form.Item>
                        <Alert
                          message={successMessage}
                          type="success"
                          showIcon
                          closable
                          onClose={() => setSuccessMessage("")}
                        />
                      </Form.Item>
                    )}
                    {!successfulReset && (
                      <Form.Item>
                        <Button
                          style={{ width: "100%" }}
                          type="primary"
                          htmlType="submit"
                          loading={buttonLoading}
                        >
                          Reset Password
                        </Button>
                      </Form.Item>
                    )}
                    {successfulReset && (
                      <Form.Item>
                        <Button
                          style={{ width: "100%" }}
                          type="primary"
                          onClick={() => navigate("/auth/admin/login")}
                        >
                          Login
                        </Button>
                      </Form.Item>
                    )}
                  </Form>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <Title level={4}>
                      <ExclamationOutlined
                        style={{ color: "red", fontSize: 30 }}
                      />
                      Invalid Credentials
                      <br />
                      <br />
                      Try Resetting the Password again!
                    </Title>
                  </div>
                )}
              </>
            )}
          </Card>
          <Footer />
        </Content>
      </div>
    </>
  );
};
