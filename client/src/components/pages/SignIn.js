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
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Alert,
} from "antd";

import signinbg from "../../assets/images/1.png";

import {
  TwitterOutlined,
  InstagramOutlined,
  FacebookOutlined,
  // ShoppingCartOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import useAllContext from "../../context/useAllContext";

const { Title } = Typography;
const { /*Header,*/ Footer, Content } = Layout;

function SignIn() {
  const navigate = useNavigate();
  useEffect(() => {
    if (isValidToken) {
      navigate("/admin/dashboard");
    }
  }, [isValidToken]);

  const [errorMessage, setErrorMessage] = useState("");

  const {
    setAppUser,
    generateRandomString,
    setIsValidToken,
    setUserToken,
    isValidToken,
  } = useAllContext();

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // console.log("Success:", values);

    const res = await axios.post("http://localhost:5000/login", values);
    switch (res.data.loginStatus) {
      case 200:
        const userToken = generateRandomString(12);
        // console.log("Res.data.user : ", res.data.user);
        console.log("Login UserToken : ", userToken);
        localStorage.setItem("userToken", userToken);
        setUserToken(userToken);
        setAppUser(res.data.user);
        try {
          await axios.post("http://localhost:5000/addusersloggedintokens", {
            token: userToken,
            id: res.data.user.id,
          });
          setIsValidToken(true);
        } catch (err) {
          console.error(err);
        }
        navigate("/admin/dashboard");
        break;
      case 401:
        // console.log("Invalid Credentials");
        setErrorMessage("Invalid Credentials");
        form.resetFields();
        break;
      case 404:
        // console.log("User doesn't exist");
        setErrorMessage("User not Found ! Please SignUp first.");
        form.resetFields();
        break;
      default:
        // console.log("Something went wrong!");
        setErrorMessage("Something went wrong!");
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    setErrorMessage("Form Could not be Submitted!");
  };

  return (
    <>
      <Layout className="layout-default layout-signin bg-none">
        {/* <Header>
          <div className="header-col header-brand">
            <h5>AlSaleels</h5>
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
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              className=""
              id="loginColumn"
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Sign In</Title>
              <Title className="font-regular text-muted" level={5}>
                Enter your email and password to sign in
              </Title>
              <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
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
                      min: 4,
                      required: true,
                      message: "Password should be greater than 4 characters",
                    },
                  ]}
                  hasFeedback
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
                      type="error"
                      showIcon
                      closable
                      onClose={() => setErrorMessage("")}
                    />
                  </Form.Item>
                )}

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    SIGN IN
                  </Button>
                </Form.Item>
                <p className="font-semibold text-muted">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-dark font-bold">
                    Sign Up
                  </Link>
                </p>
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
        <Footer>
          {/* <Menu mode="horizontal">
            <Menu.Item key="13">About Us</Menu.Item>

            <Menu.Item key="15">Products</Menu.Item>
            <Menu.Item key="16">Blogs</Menu.Item>
            <Menu.Item key="17">Pricing</Menu.Item>
          </Menu> */}
          <Menu mode="horizontal" className="menu-nav-social">
            <Menu.Item key="19">
              <Link to="#">{<TwitterOutlined />}</Link>
            </Menu.Item>
            <Menu.Item key="20">
              <Link to="#">{<InstagramOutlined />}</Link>
            </Menu.Item>
            <Menu.Item key="21">
              <Link to="#">{<FacebookOutlined />}</Link>
            </Menu.Item>
          </Menu>
          <p className="copyright"> Copyright © 2021</p>
        </Footer>
      </Layout>
    </>
  );
}

export default SignIn;
