import React, { useState, useEffect } from "react";
import { Card, Row, Col, message, Modal, Form, Input, Button } from "antd";
import useAllContext from "../../../../context/useAllContext";
import axios from "axios";
import { FcDataEncryption } from "react-icons/fc";
import { BiSolidEditAlt } from "react-icons/bi";
function Profile() {
  const { appUser, fetchUserDetails } = useAllContext();
  useEffect(() => {
    fetchUserDetails();
  }, [appUser, fetchUserDetails]);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  //   const [editData, setEditData] = useState(null);
  const [editType, setEditType] = useState("");
  const [form] = Form.useForm();
  const handleEditData = (data, type) => {
    // console.log(data);
    // setEditData(data);
    setEditType(type);
    setShowModal(true);
    form.setFieldsValue({
      [type]: data,
    });
  };
  const handleModalCancel = () => {
    setShowModal(false);
    form.resetFields();
    // setEditData("");
  };
  const handleNameEditOk = async () => {
    const values = form.getFieldsValue();
    try {
      const response = await axios.put(
        `/editbusinessname/${appUser.id}`,
        values
      );
      if (response.status === 200) {
        setShowModal(false);
        message.success("Name updated successfully");
      }
    } catch (error) {
      console.log(error);
      message.error("Server error");
    }
  };
  //optional code*
  const handleEmailEditOk = async () => {
    const values = form.getFieldsValue();
    // console.log(values);
    try {
      const response = await axios.put(`/editemail/${appUser.id}`, values);
      if (response.status === 200) {
        setShowModal(false);
        message.success("verification link sent to mail, please verify");
      }
    } catch (error) {
      console.log(error);
      message.error("Server error");
    }
  };
  //*end

  const handlePhoneEditOk = async () => {
    const values = form.getFieldsValue();
    try {
      const response = await axios.put(
        `/editbusinessphonenumber/${appUser.id}`,
        values
      );
      if (response.status === 200) {
        setShowModal(false);
        message.success("Phone number updated successfully");
      }
    } catch (error) {
      console.log(error);
      message.error("Server error");
    }
  };
  const handlePassword = async () => {
    const values = form.getFieldsValue();
    // console.log(values);
    try {
      const response = await axios.put(
        `/editbusinesspassword/${appUser.id}`,
        values
      );
      if (response.status === 200) {
        setShowPasswordModal(false);
        message.success(" New password added successfully");
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
      message.error("Wrong Current password");
    }
  };

  return (
    <>
      <Card
        style={{
          padding: " 30px 20px",
          width: "90%",
          margin: "auto",
          marginTop: 0,
        }}
      >
        <Card style={{ background: "#F5F5F5" }}>
          <Row justify="space-between">
            <Col>
              <p style={{ marginBottom: "0px" }}>Name:</p>
              <b>{appUser.name}</b>
            </Col>
            <Col>
              <Button
                onClick={() => {
                  handleEditData(appUser.name, "full_name");
                }}
              >
                <BiSolidEditAlt />
                Edit
              </Button>
            </Col>
          </Row>
        </Card>
        {/* <Card style={{ background: "#F5F5F5" }}>
          <Row>
            <Col span={20}>
              {" "}
              <p style={{ marginBottom: "0px" }}>E-mail:</p>
              <b>{appUser.email}</b>
            </Col>
            <Col span={4}>
              <Button
                onClick={() => {
                  handleEditData(appUser.email, "email");
                }}
              >
                <BiSolidEditAlt />
                Edit
              </Button>
            </Col>
          </Row>
        </Card> */}
        <Card style={{ background: "#F5F5F5", marginTop: 20 }}>
          <Row justify="space-between">
            <Col>
              <p style={{ marginBottom: "0px" }}>Phone number:</p>
              <b>{appUser.phone}</b>
            </Col>
            <Col>
              <Button
                onClick={() => {
                  handleEditData(appUser.phone, "phone_number");
                }}
              >
                <BiSolidEditAlt />
                Edit
              </Button>
            </Col>
          </Row>
        </Card>
        <Card style={{ background: "#F5F5F5", marginTop: 20 }}>
          <Row justify="space-between">
            <Col>
              <p style={{ marginBottom: "0px" }}>Password:</p>
              <b>*********</b>
            </Col>
            <Col>
              <Button
                onClick={() => {
                  setShowPasswordModal(true);
                }}
              >
                <BiSolidEditAlt />
                Edit
              </Button>
            </Col>
          </Row>
        </Card>
      </Card>
      <Modal
        title={
          <>
            <BiSolidEditAlt /> Edit details
          </>
        }
        open={showModal}
        onOk={() => {
          // Call the appropriate onOk function based on the editType
          if (editType === "full_name") {
            handleNameEditOk();
          } else if (editType === "email") {
            handleEmailEditOk();
          } else if (editType === "phone_number") {
            handlePhoneEditOk();
          }
        }}
        onCancel={handleModalCancel}
        okText={"Edit"}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          className="row-col"
          layout="verticle"
        >
          {editType === "full_name" && (
            <Form.Item
              label="Full Name"
              name="full_name"
              rules={[
                {
                  required: true,
                  message: "Please enter your full name",
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}
          {editType === "email" && (
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email address",
                  type: "email",
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}
          {editType === "phone_number" && (
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: "Please enter your phone number",
                  pattern: /^[9876]\d{9}$/,
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Modal
        title="Add new Password"
        open={showPasswordModal}
        onOk={() => {
          handlePassword();
        }}
        onCancel={() => {
          setShowPasswordModal(false);
          form.resetFields();
        }}
        okText={"Edit"}
      >
        <Form
          form={form}
          name="basic1"
          labelCol={{ span: 24 }}
          className="row-col"
          layout="verticle"
        >
          <Form.Item
            label="Current password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please Enter your Current password",
              },
            ]}
          >
            <Input.Password
              prefix={<FcDataEncryption className="site-form-item-icon" />}
              placeholder=" Current Password"
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                pattern:
                  /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{4,}$/,
                min: 8,
                required: true,
                message:
                  "Please inclued special characters, numbers and a upper case letter in Your password",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<FcDataEncryption className="site-form-item-icon" />}
              placeholder="New Password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm New password"
            name="confirmNewPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Password does not match" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
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
              prefix={<FcDataEncryption className="site-form-item-icon" />}
              placeholder="Confirm New Password"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Profile;
