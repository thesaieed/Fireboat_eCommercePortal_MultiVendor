import { React, useState, useEffect } from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  Card,
  Select,
  Upload,
  Row,
  Col,
  message,
} from "antd";

import axios from "axios";
// import { useNavigate } from "react-router-dom";
import useAllContext from "../../../../context/useAllContext";
import { UploadOutlined } from "@ant-design/icons";
import cardImage from "../../../../assets/images/addproductCardImg.png";

function AddProduct() {
  const [errorMessage, setErrorMessage] = useState("");
  const [form] = Form.useForm();
  const { categories, fetchCategories } = useAllContext();
  // const navigate = useNavigate();

  //get request to get the categories available stored in db
  const { Option } = Select;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("category", values.category);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("stock_available", values.stock_available);
      formData.append("image", values.image?.[0]?.originFileObj); // ?. to prevent any errors from being thrown and simply accessing the actual file from fileList we use values.image[0].originFileObj

      const response = await axios.post(
        "http://localhost:5000/admin/addproduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        //add required navigation
        // navigate("/admin/dashboard");
        message.success("Product added Successfully")
        form.resetFields();
      } else {
        setErrorMessage("Something went Wrong");
      }
    } catch (error) {
      form.resetFields();
      console.log(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    setErrorMessage("Something went wrong");
    console.log("Failed", errorInfo);
  };

  return (
    <>
      <Card
        className=" cardAddProduct header-solid ant-card"
        title={
          <h5
            style={{
              fontWeight: "bold",
              fontSize: "1.3rem",
            }}
          >
            Add Product
          </h5>
        }
        bordered="false"
        cover={<img alt="example" src={cardImage} />}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 5 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="row-col"
          // encType="multipart/form-data"
        >
          <Row>
            <Col style={{ paddingRight: ".5rem" }} span={16}>
              <Form.Item
                //   label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please input product name!" },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>

            <Col style={{ paddingLeft: ".5rem" }} span={8}>
              <Form.Item
                name="category"
                // label="Category"
                rules={[
                  {
                    required: true,
                    message: "Please select a category",
                  },
                ]}
              >
                <Select className="ant-input " placeholder="Select a category">
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col style={{ paddingRight: ".5rem" }} span={12}>
              <Form.Item
                //   label="Price"
                name="price"
                rules={[
                  { required: true, message: "Please input product price!" },
                ]}
              >
                <Input
                  placeholder="Enter product price"
                  type="number"
                  min="0"
                />
              </Form.Item>
            </Col>
            <Col style={{ paddingLeft: ".5rem" }} span={12}>
              <Form.Item
                //   label="Stock Available"
                name="stock_available"
                rules={[
                  {
                    required: true,
                    message: "Please input the number of stock available!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter stock available"
                  type="number"
                  min="0"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            //   label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input product description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter product description" />
          </Form.Item>
          <Row>
            <Col span={24}>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
                rules={[{ required: true, message: "Image is required!" }]}
                hasFeedback
              >
                <Upload
                  name="image"
                  accept="image/*"
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />} className="w-100">
                    Upload image
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
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
              style={{ width: 150 }}
              type="primary"
              htmlType="submit"
              className="float-end"
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default AddProduct;
