import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Layout, Button, Row, Col, Typography, Form, Input, Alert } from "antd";
import Footer from "../../../layout/Footer";
import signinbg from "../../../../assets/images/1.png";
import registerIcon from "../../../../assets/images/registerIcon.png";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import vendorIcon from "../../../../assets/images/vendorsIcon.png";
import logo from "../../../../assets/images/logo.png";
import axios from "axios";
import useAllContext from "../../../../context/useAllContext";
import { LuShieldQuestion } from "react-icons/lu";

const { Title } = Typography;
const { Content } = Layout;

function SignIn() {
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);
  const {
    setAppUser,
    generateRandomString,
    setIsValidToken,
    setUserToken,
    isValidToken,
    setUserTokenIsAdmin,
    api,
  } = useAllContext();

  useEffect(() => {
    if (isValidToken) {
      // console.log("signIn navs to home");
      navigate("/");
    }
  }, [isValidToken, navigate]);

  const [errorMessage, setErrorMessage] = useState("");
  const [errorDescription, setErrorDescription] = useState();

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // console.log("Success:", values);
    setButtonLoading(true);
    const res = await axios.post(`${api}/login`, values);
    // console.log(res.data);
    switch (res.data.loginStatus) {
      case 200:
        //check if the user has been disabled
        if (!res.data.user.isactive) {
          setErrorMessage("user has been disabled, contact admin");
          setButtonLoading(false);
          return; // Stop the execution here
        }
        const userToken = generateRandomString(12);
        // console.log("Res.data.user : ", res.data.user);
        // console.log("Login UserToken : ", userToken);
        localStorage.setItem("userToken", userToken);
        localStorage.setItem("isa", false);
        setUserToken(userToken);
        setUserTokenIsAdmin(false);
        setAppUser(res.data.user);
        try {
          await axios.post(`${api}/addusersloggedintokens`, {
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
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    setErrorMessage("Form Could not be Submitted!");
  };
  const handleGoogleauthCallback = useCallback(
    async (response) => {
      // console.log(response);
      let user = jwt_decode(response.credential);
      // console.log("User:", user);
      const values = {
        googlename: user.name,
        email: user.email,
        email_verified: user.email_verified,
      };
      setButtonLoading(true);
      const res = await axios.post(`${api}/googlelogin`, values);
      switch (res.data.loginStatus) {
        case 200:
          //check if user disabled
          if (!res.data.user.isactive) {
            setErrorMessage("user has been disabled, contact admin");
            setButtonLoading(false);
            return; // Stop the execution here
          }
          const userToken = generateRandomString(12);
          // console.log("Res.data.user : ", res.data.user);
          // console.log("Login UserToken : ", userToken);
          localStorage.setItem("userToken", userToken);
          localStorage.setItem("isa", false);
          setUserToken(userToken);
          setUserTokenIsAdmin(false);
          setAppUser(res.data.user);
          try {
            await axios.post(`${api}/addusersloggedintokens`, {
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
      api,
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
    try {
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
      // google.accounts.id.prompt();
    } catch (err) {
      console.log(err);
    }
  }, [handleGoogleauthCallback]);

  return (
    <>
      <Layout className="layout-default layout-signin bg-none vh-100 d-flex ">
        <Content className="signin d-flex ">
          <Row gutter={[24, 0]} justify="space-around" align="middle">
            <Col
              className=""
              id="loginColumn"
              xs={{ span: 22, offset: 0 }}
              md={{ span: 11, offset: 1 }}
              lg={{ span: 8, offset: 2 }}
              xl={{ span: 7, offset: 3 }}
            >
              <div className="d-flex justify-content-start align-items-center">
                <Link
                  to="/"
                  className="d-flex justify-content-start align-items-baseline"
                >
                  <img
                    src={logo}
                    alt="logo"
                    height={55}
                    style={{ background: "white" }}
                  />
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
              <Title level={3}>Login</Title>
              {/* <Title className="font-regular text-muted" level={5}>
                Enter your email and password to login
              </Title> */}
              <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  type="email"
                  // label="Email"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      required: true,
                      message: "Please enter a Valid email!",
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
                  name="password"
                  // label="Password"
                  rules={[
                    {
                      // min: 4,
                      required: true,
                      // message: "Password should be greater than 4 characters",
                    },
                  ]}
                  // hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Password"
                  />
                </Form.Item>

                {/* <Form.Item
                    name="remember"
                    className="aligin-center"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked onChange={onChange} />
                    Remember me
                  </Form.Item> */}

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
                      style={{
                        width: "100%",

                        overflow: "hidden",
                      }}
                    />
                  </Form.Item>
                )}

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    loading={buttonLoading}
                  >
                    SIGN IN
                  </Button>
                </Form.Item>

                <Form.Item>
                  <div
                    id="googleLoginButton"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  ></div>
                </Form.Item>
                <Row justify="space-between" style={{ marginTop: 15 }}>
                  <Col xs={24} sm={12} md={12}>
                    <p className="font-semibold text-muted ">
                      <Link
                        to="/auth/admin/login"
                        className="text-dark font-bold "
                      >
                        <img
                          src={vendorIcon}
                          height={21}
                          width={21}
                          alt="vendorIcon"
                        />
                        Vendor Login
                      </Link>
                    </p>
                  </Col>
                  <Col xs={24} sm={12} md={12}>
                    <Link
                      to="/auth/forgotpassword"
                      className="text-dark font-bold"
                      id="forgotPass"
                    >
                      <LuShieldQuestion
                        fontSize={15}
                        style={{ marginRight: 2, marginLeft: 5 }}
                      />
                      Forgot Password!
                    </Link>
                  </Col>
                </Row>

                <Row justify="end" style={{ marginTop: 15 }}>
                  <Col xs={24} sm={12} md={12}>
                    <p className="font-semibold text-muted d-flex justify-content-end">
                      <Link
                        to="/auth/signup"
                        className="text-dark font-bold"
                        style={{ marginLeft: 5 }}
                      >
                        <img src={registerIcon} height={20} alt="newUserIcon" />{" "}
                        Sign Up
                      </Link>
                    </p>
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col
              className="sign-img"
              style={{ padding: 12 }}
              xs={{ span: 24 }}
              lg={{ span: 12 }}
              md={{ span: 12 }}
            >
              <img src={signinbg} alt="" />
            </Col>
          </Row>
        </Content>
        <Footer />
      </Layout>
    </>
  );
}

export default SignIn;
