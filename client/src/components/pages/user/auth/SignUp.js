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
import logo from "../../../../assets/images/logo.png";
import { UserOutlined, IdcardOutlined, LockOutlined } from "@ant-design/icons";
import Footer from "../../../layout/Footer";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAllContext from "../../../../context/useAllContext";

const { Title } = Typography;
const { Content } = Layout;

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
      const response = await axios.post("/signup", values);
      if (response.data.status === 200) {
        setErrorMessage("");
        setSuccessMessage(response.data.message);
        form.resetFields();
      } else {
        setErrorMessage(response.data.message);
        setSuccessMessage("");
      }
    } catch (error) {
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
      const res = await axios.post("/googlelogin", values);
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
            await axios.post("/addusersloggedintokens", {
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
      <div className="layout-default ant-layout layout-sign-up">
        <Content className="signupContent">
          <div className="sign-up-header">
            <div className="content ">
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
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
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
                  {
                    required: true,
                    message: "Please input valid name!",
                    pattern: /^[A-Za-z][A-Za-z\s]*$/,
                    // pattern: /^[A-Za-z][A-Za-z0-9\s]*$/, if you want numbers after characters
                  },
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
                            new Error(
                              "Please accept the terms and conditions to continue"
                            )
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
        <Footer />
      </div>
    </>
  );
}
