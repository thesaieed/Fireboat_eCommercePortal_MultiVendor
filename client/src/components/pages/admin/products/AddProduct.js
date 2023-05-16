import { React, useState, useEffect, useCallback } from "react";
import { Alert, Button, Form, Input, Card, Select,Upload,Row,Col } from "antd";

import axios from "axios";
import { useNavigate } from "react-router-dom";
// import useAllContext from "../../../context/useAllContext";
import { UploadOutlined } from "@ant-design/icons";

function AddProduct() {
  const [errorMessage, setErrorMessage] = useState("");
  const [form] = Form.useForm();
  // const { setAppUser } = useAllContext();
  const navigate = useNavigate();
  //.
  const [categories, setCategories] = useState([]);
  //get request to get the categories available stored in db
  const { Option } = Select;

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/categories"
      );
      console.log(response.data);
      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const onFinish = async (values) => {
    // console.log("Success", values);
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
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.status === 200) {
        //add required navigation
        navigate("/admin/dashboard");
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
        //class name card-signup header-solid h-full ant-card pt-0  mb-2
        className=" cardAddProduct header-solid ant-card"
        title={ 
          <h5 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            Enter Product Details
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
        
          
    <Form.Item
        name="image"
        valuePropName="fileList"
        getValueFromEvent={(e) => e.fileList}
      >
        <Upload name="image" accept="image/*" beforeUpload={() => false}>
          <Button  icon={<UploadOutlined />}>Upload image</Button>
        </Upload>
    </Form.Item>

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
              style={{ fontWeight: "normal" }}
              placeholder="Select a category"
            >
              {categories.map((category) => (
                <Option key={category.name} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item
            //   label="Name"
            name="name"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            //   label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input product description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter product description" />
          </Form.Item>

          <Form.Item
            //   label="Price"
            name="price"
            rules={[{ required: true, message: "Please input product price!" }]}
          >
            <Input placeholder="Enter product price" type="number" min="0" />
          </Form.Item>

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
            <Input placeholder="Enter stock available" type="number" min="0" />
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
            <Button style={{marginLeft:'25.5rem'}} type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default AddProduct;
