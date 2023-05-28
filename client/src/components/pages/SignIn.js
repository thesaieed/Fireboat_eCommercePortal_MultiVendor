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

  const {
    setAppUser,
    appUser,
    generateRandomString,
    setIsValidToken,
    setUserToken,
    isValidToken,
  } = useAllContext();

  useEffect(() => {
    if (isValidToken) {
      if (appUser.isadmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isValidToken, appUser.isadmin]);

  const [errorMessage, setErrorMessage] = useState("");

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // console.log("Success:", values);

    const res = await axios.post("http://localhost:5000/login", values);
    switch (res.data.loginStatus) {
      case 200:
        const userToken = generateRandomString(12);
        // console.log("Res.data.user : ", res.data.user);
        // console.log("Login UserToken : ", userToken);
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
        if (res.data.user.isadmin === true) {
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
      <Layout className="layout-default layout-signin bg-none vh-100 d-flex ">
        <Content className="signin d-flex ">
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
