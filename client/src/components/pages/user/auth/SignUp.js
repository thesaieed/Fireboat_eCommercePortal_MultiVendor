import { React, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {
  Layout,
  Button,
  Typography,
  Card,
  Form,
  Input,
  Checkbox,
  Alert,
} from "antd";

import { UserOutlined, IdcardOutlined, LockOutlined } from "@ant-design/icons";

// import logo1 from "../assets/images/logos-facebook.svg";
// import logo2 from "../assets/images/logo-apple.svg";
// import logo3 from "../assets/images/Google__G__Logo.svg.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAllContext from "../../../../context/useAllContext";

const { Title } = Typography;
const { /*Header,*/ Footer, Content } = Layout;

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorDescription, setErrorDescription] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [form] = Form.useForm();
  const {
    isValidToken,
    setAppUser,
    appUser,
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
      const response = await axios.post("http://localhost:5000/signup", values);
      // console.log("Responce : ", response);
      //if signup is successfull
      if (response.data.status === 200) {
        setErrorMessage("");
        setSuccessMessage(response.data.message);
        //keep a userToken saved locally and in database to keep loggedIn
        // const userToken = generateRandomString(12);
        //set userToken in local Storage
        // localStorage.setItem("userToken", userToken);
        // localStorage.setItem("isa", false);
        // setUserToken(userToken);
        // setAppUser(response.data.user);
        //add userToken to database
        // try {
        //   await axios.post("http://localhost:5000/addusersloggedintokens", {
        //     token: userToken,
        //     id: response.data.user.id,
        //   });
        //   setIsValidToken(true);
        // } catch (err) {
        //   console.error(err);
        // }
        form.resetFields();

        //   if (response.data.user.isadmin === true) {
        //     navigate("/admin/dashboard");
        //   } else {
        //     navigate("/");
        //   }
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
      // console.log(response);
      let user = jwt_decode(response.credential);
      console.log("User:", user);
      const values = {
        googlename: user.name,
        email: user.email,
        email_verified: user.email_verified,
      };
      setButtonLoading(true);
      const res = await axios.post("http://localhost:5000/googlelogin", values);
      switch (res.data.loginStatus) {
        case 200:
          const userToken = generateRandomString(12);
          // console.log("Res.data.user : ", res.data.user);
          // console.log("Login UserToken : ", userToken);
          localStorage.setItem("userToken", userToken);
          localStorage.setItem("isa", false);
          setUserToken(userToken);
          setUserTokenIsAdmin(false);
          setAppUser(res.data.user);
          try {
            await axios.post("http://localhost:5000/addusersloggedintokens", {
              token: userToken,
              id: res.data.user.id,
              isvendor: false,
            });
            setIsValidToken(true);
          } catch (err) {
            console.error(err);
          }
          navigate("/");

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
        "402186760945-tk052016gctjgnh0cj8ido7elii6uuur.apps.googleusercontent.com",
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
          <div className="sign-up-header">
            <div className="content">
              <Title>Sign Up</Title>
            </div>
          </div>

          <Card
            className="card-signup header-solid h-full ant-card pt-0  mb-2"
            title={<h5>Register With</h5>}
            bordered="false"
          >
            {/* Form starts */}

            <div
              id="googleLoginButton"
              style={{ width: "100%", textAlign: "center" }}
            ></div>
            <p className="text-center my-25 font-semibold text-muted">Or</p>
            <Form
              form={form}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="row-col p-15"
            >
              <Form.Item
                name="fullname"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  prefix={<IdcardOutlined className="site-form-item-icon" />}
                  placeholder="Full Name"
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

              {/* <Form.Item
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
                  placeholder="Phone Number"
                />
              </Form.Item> */}

              <Form.Item
                name="password"
                rules={[
                  {
                    min: 4,
                    required: true,
                    message: "Please input password greater than 4 characters",
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
              Already have an account? {/* add link to signpage */}
              <Link to="/auth/login" className="font-bold text-dark">
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
