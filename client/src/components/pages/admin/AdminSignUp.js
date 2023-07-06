import { React, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Button,
  Typography,
  Card,
  Form,
  Input,
  Checkbox,
  Alert,
  message,
} from "antd";

import {
  UserOutlined,
  IdcardOutlined,
  LockOutlined,
  MobileOutlined,
} from "@ant-design/icons";

import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import useAllContext from "../../../context/useAllContext";

const { Title } = Typography;
const { /*Header,*/ Footer, Content } = Layout;

export default function AdminSignUp() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorDescription, setErrorDescription] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [form] = Form.useForm();
  const {
    isValidToken,
    appUser,
    setAppUser,
    generateRandomString,
    setIsValidToken,
    setUserToken,

    setUserTokenIsAdmin,
  } = useAllContext();

  const navigate = useNavigate();
  useEffect(() => {
    if (isValidToken) {
      if (appUser.isadmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isValidToken, appUser.isadmin, navigate]);

  const onFinish = async (values) => {
    setButtonLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/vendor/newvendor",
        values
      );
      // console.log("Responce : ", response);
      //if signup is successfull
      if (response.data.status === 200) {
        setErrorMessage("");
        setSuccessMessage(response.data.message);
        form.resetFields();
      } else {
        setErrorMessage(response.data.message);
        setSuccessMessage("");
      }
    } catch (error) {
      // console.error("Error : ", error);
      if (error.response?.status === 409) {
        form.resetFields();
        setErrorMessage("Email already registered!");
        setSuccessMessage("");
      } else {
        setErrorMessage("Something went wrong!");
        setSuccessMessage("");
      }
    }
    setButtonLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    setErrorMessage(
      "Details not submitted, check form details and try again !"
    );
    // console.log("Failed:", errorInfo);
  };
  const handleGoogleauthCallback = useCallback(
    async (response) => {
      // console.log("Success:", values);
      let user = jwt_decode(response.credential);
      console.log("User:", user);
      const values = {
        googlename: user.name,
        email: user.email,
        email_verified: user.email_verified,
      };
      setButtonLoading(true);
      const res = await axios.post(
        "http://localhost:5000/vendor/googlelogin",
        values
      );
      switch (res.data.loginStatus) {
        case 200:
          const userToken = generateRandomString(12);
          // console.log("Res.data.user : ", res.data.user);
          // console.log("Login UserToken : ", userToken);
          localStorage.setItem("userToken", userToken);
          localStorage.setItem("isa", true);
          setUserToken(userToken);
          setUserTokenIsAdmin(true);
          setAppUser(res.data.user);
          try {
            await axios.post("http://localhost:5000/addusersloggedintokens", {
              token: userToken,
              id: res.data.user.id,
              isvendor: true,
            });
            setIsValidToken(true);
          } catch (err) {
            console.error(err);
          }
          // console.log(res.data);
          if (res.data.user.is_admin === true) {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }

          break;
        case 401:
          // console.log("Invalid Credentials");
          setErrorMessage("Invalid Credentials");
          form.resetFields();
          break;
        case 404:
          // console.log("User doesn't exist");
          setErrorMessage("User not Found ! Please SignUp.");
          form.resetFields();
          break;
        case 102:
          // console.log("User doesn't exist");
          message.success(
            <code>
              Your Approval is in Process!
              <br /> Please check your email for status!
            </code>
          );
          setErrorMessage(
            <code>
              Your Approval is in Process!
              <br /> Please check your email for status!
            </code>
          );
          form.resetFields();
          break;
        case 406:
          // console.log("User doesn't exist");
          setErrorMessage(
            <code>
              You have not been Approved!
              <br /> Please check your email for status!
            </code>
          );
          form.resetFields();
          break;
        case 407:
          // console.log("User doesn't exist");
          setErrorMessage("Please Verify your Email");
          setErrorDescription(
            <code>
              Verification Link has
              <br /> been sent to your email.
            </code>
          );
          form.resetFields();
          break;
        default:
          // console.log("Something went wrong!");
          setErrorMessage("Something went wrong!");
      }
      setButtonLoading(false);
    },
    [
      form,
      generateRandomString,
      setAppUser,
      setIsValidToken,
      setUserToken,
      setUserTokenIsAdmin,
      navigate,
    ]
  );
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "596752826368-2boo2fuobene9ibr1snijhbhgt20i1vc.apps.googleusercontent.com",
      callback: handleGoogleauthCallback,
    });
    google.accounts.id.renderButton(
      document.getElementById("googleLoginButton"),
      { theme: "outline", size: "large" }
    );
    google.accounts.id.prompt();
  }, [handleGoogleauthCallback]);
  return (
    <>
      <div className="layout-default ant-layout layout-sign-up">
        {/* <Header>
          <div className="header-col header-brand">
            <h5 className="brandText">AlSaleels</h5>
          </div>
          <div className="header-col header-nav">
            <Menu mode="horizontal" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1">
                <Link to="/">
                  <span> Home</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="">
                  <span>Our Products</span>
                </Link>
              </Menu.Item>
            </Menu>
          </div>
          <div className="header-col header-btn">
            <Button type="primary">
              <ShoppingCartOutlined />
              Cart
            </Button>
          </div>
        </Header> */}

        <Content className="signupContent">
          <div className="sign-up-header vendor-sign-up-header">
            <div className="content">
              <Title>Vendor Sign Up</Title>
            </div>
          </div>

          <Card
            className="card-signup header-solid h-full ant-card pt-0  mb-2"
            title={<h5>Register With</h5>}
            bordered="false"
          >
            {/* <div className="sign-up-gateways">
              <Button type="false">
                <img src={logo1} alt="logo 1" />
              </Button>
              <Button type="false">
                <img src={logo2} alt="logo 2" />
              </Button>
              <Button type="false">
                <img src={logo3} alt="logo 3" />
              </Button>
            </div>
            <p className="text-center my-25 font-semibold text-muted">Or</p> */}
            <div
              id="googleLoginButton"
              style={{ width: "100%", textAlign: "center" }}
            ></div>
            <p className="text-center my-25 font-semibold text-muted">Or</p>
            {/* Form starts */}
            <Form
              form={form}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="row-col p-15"
            >
              <Form.Item
                name="businessname"
                rules={[{ required: true, message: "Business Name Required!" }]}
              >
                <Input
                  prefix={<IdcardOutlined className="site-form-item-icon" />}
                  placeholder="Business Name"
                />
              </Form.Item>
              <Form.Item
                name="email"
                type="email"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Please input valid email!",
                  },
                ]}
                hasFeedback
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                type="phone"
                rules={[
                  {
                    min: 10,
                    max: 10,
                    required: true,
                    message: "Please input your valid number!",
                  },
                ]}
                hasFeedback
              >
                <Input
                  prefix={<MobileOutlined className="site-form-item-icon" />}
                  placeholder=" Phone Number (10 Digit)"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    min: 6,
                    required: true,
                    message: "Please input password greater than 5 characters",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Password does not match" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
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
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Confirm Password"
                />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Please accept the terms and conditions")
                          ),
                  },
                ]}
              >
                <Checkbox>
                  I agree the{" "}
                  <a href="#pablo" className="font-bold text-dark">
                    Terms and Conditions
                  </a>
                </Checkbox>
              </Form.Item>

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

              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  loading={buttonLoading}
                >
                  SIGN UP
                </Button>
              </Form.Item>
            </Form>

            <p className="font-semibold text-muted text-center">
              Already have a Vendor? {/* add link to signpage */}
              <Link to="/adminlogin" className="font-bold text-dark">
                Sign In
              </Link>
            </p>
          </Card>
        </Content>
        <Footer className="signupFooter">
          <p className="copyright"> Copyright © 2021</p>
        </Footer>
      </div>
    </>
  );
}
