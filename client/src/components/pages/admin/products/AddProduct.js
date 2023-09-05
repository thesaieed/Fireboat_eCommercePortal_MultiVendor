import { React, useState, useEffect, useCallback } from "react";
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
  Spin,
} from "antd";

import axios from "axios";
// import { useNavigate } from "react-router-dom";
import useAllContext from "../../../../context/useAllContext";
import { UploadOutlined } from "@ant-design/icons";
import TextEditor from "./TextEditor";

function AddProduct() {
  const [errorMessage, setErrorMessage] = useState("");
  const [form] = Form.useForm();
  const { categories, fetchCategories, appUser, api } = useAllContext();
  const [brands, setBrands] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [textDesc, setTextDesc] = useState();

  //get request to get the categories available stored in db
  const getBrands = useCallback(async () => {
    try {
      const brands = await axios.get(`${api}/brands`);
      setBrands(brands.data);
    } catch (err) {
      console.log(err);
    }
  }, [api]);

  useEffect(() => {
    getBrands();
    fetchCategories();
  }, [fetchCategories, api, getBrands]);

  const onFinish = async (values) => {
    setButtonLoading(true);
    // console.log("values: ", values);
    try {
      const formData = new FormData();
      formData.append("category", values.category);
      formData.append("name", values.name);
      formData.append("description", textDesc);
      formData.append("price", values.price);
      formData.append("brand", values.brand);
      formData.append("vendor_id", appUser.id);
      formData.append("stock_available", values.stock_available);
      values.image.forEach((file) => {
        formData.append("image", file.originFileObj);
      });
      // console.log("formData : ", formData);
      const response = await axios.post(`${api}/admin/addproduct`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        //add required navigation
        // navigate("/admin/dashboard");
        message.success("Product added Successfully");
        form.resetFields();
      } else {
        setErrorMessage("Something went Wrong");
      }
    } catch (error) {
      form.resetFields();
      console.log(error);
      message.error("server error");
    }
    setTextDesc("");
    setButtonLoading(false);
  };
  const onFinishFailed = (errorInfo) => {
    setErrorMessage("Something went wrong");
    // console.log("Failed", errorInfo);
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
              color: "#7cb028",
            }}
          >
            Add Product
          </h5>
        }
        bordered="false"
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
            <Col
              //  style={{ paddingRight: ".5rem" }}
              span={24}
            >
              <Form.Item
                //   label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please input product name!" },
                ]}
              >
                <Input placeholder="Product Name" style={{ height: 50 }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="brand"
                // label="Category"
                rules={[
                  {
                    required: true,
                    message: "Please select a Brand",
                  },
                ]}
              >
                <Select
                  className="ant-input "
                  placeholder="Brand"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={brands.map((brand) => {
                    return { value: brand.id, label: brand.brand };
                  })}
                />
              </Form.Item>
            </Col>
            <Col style={{ paddingLeft: "0.5rem" }} span={12}>
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
                <Select
                  className="ant-input "
                  placeholder="Category"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={categories.map((category) => {
                    return { value: category.id, label: category.name };
                  })}
                ></Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                //   label="Price"
                name="price"
                rules={[
                  { required: true, message: "Please input product price!" },
                ]}
              >
                <Input
                  placeholder="Product Price"
                  type="number"
                  min="0"
                  style={{ height: 45 }}
                />
              </Form.Item>
            </Col>
            <Col style={{ paddingLeft: "0.5rem" }} span={12}>
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
                  placeholder="Stock Available"
                  type="number"
                  min="0"
                  style={{ height: 45 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
                rules={[{ required: true, message: "Image is required!" }]}
                hasFeedback
              >
                <Upload.Dragger
                  listType="picture"
                  multiple
                  maxCount={5}
                  name="image"
                  accept="image/*"
                  iconRender={() => {
                    return <Spin></Spin>;
                  }}
                  progress={{
                    strokeWidth: 3,
                    strokeColor: {
                      "0%": "#f0f",
                      100: "#ff0",
                    },
                    style: { top: 15 },
                  }}
                  customRequest={({ onSuccess }) => onSuccess("ok")}
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="w-100"
                    style={{ height: 50 }}
                  >
                    Drag and drop images (max 5)
                  </Button>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col
              style={{
                padding: ".5rem",
                // marginBottom: 15,
                // border: "1px solid rgba(0, 0, 0, 0.1)",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.15)",
                borderRadius: 7,
              }}
              span={24}
            >
              <Form.Item name="description">
                <TextEditor textDesc={textDesc} setTextDesc={setTextDesc} />
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

          <Form.Item style={{ marginTop: 17 }}>
            <Button
              style={{ width: 150 }}
              type="primary"
              htmlType="submit"
              className="float-end"
              loading={buttonLoading}
            >
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default AddProduct;
