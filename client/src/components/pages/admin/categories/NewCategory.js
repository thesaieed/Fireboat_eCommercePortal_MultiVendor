import { Button, Card, Form, Input, Alert, Modal } from "antd";

import { IdcardOutlined } from "@ant-design/icons";
import { React, useState } from "react";
import axios from "axios";
import useAllContext from "../../../../context/useAllContext";
const NewCategory = ({ modalOpen, setModalOpen }) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const { fetchCategories, appUser, api } = useAllContext();
  const onFinish = async (values) => {
    setButtonLoading(true);
    if (values.name) {
      try {
        const response = await axios.post(`${api}/addcategory`, {
          name: values.name,
          vendorId: appUser.id,
        });
        // console.log(response);
        if (response.data.id) {
          setSuccessMessage(`Category ${values.name} Created Successfully !`);
          form.resetFields();
          fetchCategories();
        } else {
          setErrorMessage("Something went Wrong !");
        }
      } catch (error) {
        // console.error("Error : ", error);
        if (error.response?.status === 409) {
          setErrorMessage(`Category '${values.name}' already Exists !`);
        } else {
          setErrorMessage(error.message);
        }
      }
      setButtonLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    setErrorMessage("Please fill the Category");
    // console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      title="Add Category"
      centered
      footer={null}
      open={modalOpen}
      onCancel={() => {
        setModalOpen(false);
        form.resetFields();
        setSuccessMessage("");
        setErrorMessage("");
      }}
      okButtonProps={{ style: { display: "none" } }}
    >
      <Card
        className="card-category header-solid h-full ant-card pt-0  mb-2"
        title={"Add a New Category"}
        bordered="true"
      >
        <Form
          form={form}
          name="addcategory"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="p-15"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter a Category" }]}
            hasFeedback
          >
            <Input
              prefix={<IdcardOutlined className="site-form-item-icon" />}
              placeholder="New Category"
            />
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
              Add Category
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};
export default NewCategory;
