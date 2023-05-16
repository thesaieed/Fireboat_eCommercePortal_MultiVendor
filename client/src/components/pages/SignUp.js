import { React, useState } from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Card,
  Form,
  Input,
  Checkbox,
  Alert,
} from "antd";

import {
  TwitterOutlined,
  InstagramOutlined,
  FacebookOutlined,
  UserOutlined,
  IdcardOutlined,
  MobileOutlined,
  // ShoppingCartOutlined,
  LockOutlined,
} from "@ant-design/icons";

// import logo1 from "../assets/images/logos-facebook.svg";
// import logo2 from "../assets/images/logo-apple.svg";
// import logo3 from "../assets/images/Google__G__Logo.svg.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAllContext from "../../context/useAllContext";

const { Title } = Typography;
const { /*Header,*/ Footer, Content } = Layout;

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState("");
  const [form] = Form.useForm();
  const { setAppUser } = useAllContext();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Success:", values);

    try {
      // const response = await fetch("http://localhost:5000/signup", {
      //   method: "Post",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(values),
      // });
      const response = await axios.post("http://localhost:5000/signup", values);

      // console.log("Responce : ", response);

      if (response.status === 200) {
        // setErrorMessage(
        //   <p style={{ color: "green", textAlign: "center" }}>
        //     {result.message}
        //   </p>
        // );
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setAppUser(response.data.user);
        form.resetFields();
        navigate("/admin/dashboard");
      } else {
        setErrorMessage("Something went Wrong !");
      }
    } catch (error) {
      // console.error("Error : ", error);
      if (error.response.status === 401) {
        form.resetFields();
        setErrorMessage("Email already registered !");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    setErrorMessage("Something went Wrong !");
    // console.log("Failed:", errorInfo);
  };
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
                name="name"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  prefix={<IdcardOutlined className="site-form-item-icon" />}
                  placeholder="Name"
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
                  placeholder="Phone Number"
                />
              </Form.Item>

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
                    type="error"
                    showIcon
                    closable
                    onClose={() => setErrorMessage("")}
                  />
                </Form.Item>
              )}

              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                >
                  SIGN UP
                </Button>
              </Form.Item>
            </Form>

            <p className="font-semibold text-muted text-center">
              Already have an account? {/* add link to signpage */}
              <Link to="/login" className="font-bold text-dark">
                Sign In
              </Link>
            </p>
          </Card>
        </Content>
        <Footer className="signupFooter">
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
      </div>
    </>
  );
}
