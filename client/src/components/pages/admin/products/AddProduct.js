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
import TextEditor from "./TextEditor";

function AddProduct() {
  const [errorMessage, setErrorMessage] = useState("");
  const [prodImgPreview, setProdImgPreview] = useState(cardImage);
  const [form] = Form.useForm();
  const { categories, fetchCategories } = useAllContext();
  const [brands, setBrands] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  // const navigate = useNavigate();
  const [textDesc, setTextDesc] = useState("");

  //get request to get the categories available stored in db
  const { Option } = Select;
  const getBrands = async () => {
    try {
      const brands = await axios.get("http://localhost:5000/brands");
      setBrands(brands.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getBrands();
    fetchCategories();
  }, [fetchCategories]);

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
      formData.append("stock_available", values.stock_available);
      formData.append("image", values.image?.[0]?.originFileObj); // ?. to prevent any errors from being thrown and simply accessing the actual file from fileList we use values.image[0].originFileObj

      console.log("formData : ", formData);
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
        message.success("Product added Successfully");
        form.resetFields();
        setProdImgPreview(cardImage);
      } else {
        setErrorMessage("Something went Wrong");
      }
    } catch (error) {
      form.resetFields();
      console.log(error);
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
            }}
          >
            Add Product
          </h5>
        }
        bordered="false"
        cover={
          <Upload
            // className="d-flex flex-column justify-content-center align-items-center"
            name="image"
            showUploadList={false}
            accept="image/*"
            beforeUpload={(event) => {
              setProdImgPreview(URL.createObjectURL(event));
              return false;
            }}
          >
            <img
              style={{ width: "100%", margin: "auto", padding: 5 }}
              id="prod_img_preview"
              alt="example"
              src={prodImgPreview}
            />
          </Upload>
        }
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
                <Input placeholder="Product Name" />
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
                <Select className="ant-input " placeholder="Brand">
                  {brands.map((brand) => (
                    <Option key={brand.id} value={brand.id}>
                      {brand.brand}
                    </Option>
                  ))}
                </Select>
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
                <Select className="ant-input " placeholder="Category">
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
            <Col span={12}>
              <Form.Item
                //   label="Price"
                name="price"
                rules={[
                  { required: true, message: "Please input product price!" },
                ]}
              >
                <Input placeholder="Product Price" type="number" min="0" />
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
                <Input placeholder="Stock Available" type="number" min="0" />
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
                <Upload
                  name="image"
                  accept="image/*"
                  beforeUpload={(event) => {
                    setProdImgPreview(URL.createObjectURL(event));
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />} className="w-100">
                    Product Image
                  </Button>
                </Upload>
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

              {/* <Form.List name="description">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        className="d-flex justify-content-evenly align-items-baseline"
                      >
                        <Form.Item
                          {...restField}
                          style={{ width: "100%" }}
                          name={[name]}
                          // name={[""]}
                          rules={[
                            {
                              required: true,
                              message: "Missing Description List Item",
                            },
                          ]}
                        >
                          <Input
                            style={{ width: "98%" }}
                            placeholder="Description List Item"
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </div>
                    ))}
                    <Form.Item key="descr">
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Description Item
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List> */}
            </Col>
          </Row>
          {/* <Form.Item
            //   label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input product description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter product description" />
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
