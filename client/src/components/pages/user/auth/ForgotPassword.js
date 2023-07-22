import React, { useState } from "react";

import { Layout, Button, Row, Col, Typography, Form, Input, Alert } from "antd";
import signinbg from "../../../../assets/images/1.png";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { Footer, Content } = Layout;

function ForgotPassword() {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDescription, setErrorDescription] = useState();

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setButtonLoading(true);
    const res = await axios.post(
      "http://localhost:5000/sendresetpasswordlink",
      { email: values.email }
    );
    // console.log(res.data);
    switch (res.data.status) {
      case 200:
        setSuccessMessage("Reset Link sent to email!");
        break;

      case 404:
        // console.log("User doesn't exist");
        setErrorMessage("User not Found !");
        form.resetFields();
        break;
      default:
        // console.log("Something went wrong!");
        setErrorMessage("Something went wrong!");
    }
    form.resetFields();
    setButtonLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    form.resetFields();
    setErrorMessage("Form Could not be Submitted!");
  };

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
              <Title className="mb-15">Forgot Password</Title>
              <Title className="font-regular text-muted" level={5}>
                Enter your registered email
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
                {successMessage && (
                  <Form.Item>
                    <Alert
                      message={successMessage}
                      description={errorDescription}
                      type="success"
                      showIcon
                      closable
                      onClose={() => {
                        setSuccessMessage("");
                        setErrorDescription("");
                      }}
                      style={{
                        width: "100%",

                        overflow: "hidden",
                      }}
                    />
                  </Form.Item>
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
                    Submit
                  </Button>
                </Form.Item>
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
          <p className="copyright"> Copyright © 2021</p>
        </Footer>
      </Layout>
    </>
  );
}

export default ForgotPassword;
