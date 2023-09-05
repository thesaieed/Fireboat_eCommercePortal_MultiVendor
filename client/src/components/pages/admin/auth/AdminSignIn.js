import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Layout, Button, Row, Col, Typography, Form, Input, Alert } from "antd";

import signinbg from "../../../../assets/images/vendorSigin.png";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../../../assets/images/logo.png";
import axios from "axios";
import useAllContext from "../../../../context/useAllContext";
import { FaUserAlt } from "react-icons/fa";
import { LuShieldQuestion } from "react-icons/lu";
import vendorIcon from "../../../../assets/images/vendorsIcon.png";
import jwt_decode from "jwt-decode";
import Footer from "../../../layout/Footer";
const { Title } = Typography;
const { Content } = Layout;

function AdminSignIn() {
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);
  const {
    setAppUser,
    appUser,
    generateRandomString,
    setIsValidToken,
    setUserToken,
    isValidToken,
    setUserTokenIsAdmin,
    api,
  } = useAllContext();

  useEffect(() => {
    if (isValidToken) {
      if (appUser.isadmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isValidToken, appUser.isadmin, navigate]);

  const [errorMessage, setErrorMessage] = useState("");
  const [errorDescription, setErrorDescription] = useState();

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // console.log("Success:", values);
    setButtonLoading(true);
    const res = await axios.post(`${api}/vendor/login`, values);
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
          await axios.post(`${api}/addusersloggedintokens`, {
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
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    setErrorMessage("Form Could not be Submitted!");
  };
  const handleGoogleauthCallback = useCallback(
    async (response) => {
      // console.log("Success:", values);
      let user = jwt_decode(response.credential);
      // console.log("User:", user);
      const values = {
        googlename: user.name,
        email: user.email,
        email_verified: user.email_verified,
      };
      setButtonLoading(true);
      const res = await axios.post(`${api}/vendor/googlelogin`, values);
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
            await axios.post(`${api}/addusersloggedintokens`, {
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
      api,
      navigate,
      form,
      generateRandomString,
      setAppUser,
      setIsValidToken,
      setUserToken,
      setUserTokenIsAdmin,
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
              xl={{ span: 9, offset: 0 }}
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
              <Title level={3}>Vendor Login</Title>
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
                      required: true,
                    },
                  ]}
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
                        overflow: "auto",
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
                    Login
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
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ marginTop: -15, marginBottom: 10 }}
                >
                  <p
                    className="font-semibold text-muted"
                    style={{ marginTop: 15 }}
                  >
                    <Link to="/auth/login" className="text-dark font-bold">
                      <FaUserAlt
                        fontSize={14}
                        style={{ marginRight: 5, marginTop: -6 }}
                      />
                      Login as User
                    </Link>
                  </p>

                  <Link
                    to="/auth/admin/forgotpassword"
                    className="text-dark font-bold"
                    style={{ marginLeft: 5 }}
                  >
                    <LuShieldQuestion fontSize={16} style={{ marginTop: -5 }} />{" "}
                    Forgot Password!
                  </Link>
                </div>
                <p className="font-semibold text-muted d-flex justify-content-end">
                  <Link
                    to="/auth/admin/signup"
                    className="text-dark font-bold"
                    style={{ marginLeft: 5 }}
                  >
                    <img
                      src={vendorIcon}
                      height={22}
                      width={22}
                      style={{ marginTop: -5 }}
                      alt="vendorIcon"
                    />{" "}
                    Register as Vendor
                  </Link>
                </p>
              </Form>
            </Col>

            <Col
              className="sign-img"
              style={{ padding: 12 }}
              xs={{ span: 24 }}
              lg={{ span: 11 }}
              md={{ span: 11 }}
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

export default AdminSignIn;
