import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Upload,
  Alert,
  Tooltip,
  Card,
} from "antd";
import {
  UploadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

function AllProducts() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { Option } = Select;
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/categories"
      );
      // console.log(response.data);
      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/viewproducts");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const result = products.filter((product) => {
      return product.name.toLocaleLowerCase().match(search.toLocaleLowerCase());
    });
    setFilteredProducts(result);
  }, [search, products]);

  const openModal = (rowData) => {
    // console.log(rowData.id);
    setSelectedRowId(rowData.id);
    const initialValues = {
      name: rowData.name,
      category: rowData.category,
      description: rowData.description,
      price: rowData.price,
      stock_available: rowData.stock_available,
    };
    setSelectedRowData(initialValues);
    setModalVisible(true);
    form.setFieldsValue(initialValues);
  };

  useEffect(() => {
    setSelectedRowData({});
  }, [modalVisible]);
  const closeModal = () => {
    setModalVisible(false);
  };
  const onFinish = async (values) => {
    // console.log("Success", values);
    try {
      // console.log(selectedRowData.id);
      const formData = new FormData();
      formData.append("category", values.category);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("stock_available", values.stock_available);
      formData.append("image", values.image?.[0]?.originFileObj); // ?. to prevent any errors from being thrown and simply accessing the actual file from fileList we use values.image[0].originFileObj
      const response = await axios.put(
        `http://localhost:5000/admin/updateproduct/${selectedRowId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        //add required navigation
        // setErrorMessage("Details updated successfullY");
        message.success("Details Updated Successfully");
        closeModal();
      } else {
        setErrorMessage("Something went Wrong");
      }
    } catch (error) {
      form.resetFields();
      console.log(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    setErrorMessage("Form submission failed. Please check the fields");
    console.log("Failed", errorInfo);
  };

  const deleteItemFromProducts = async (itemId, imagePath) => {
    const encodedImagePath = encodeURIComponent(imagePath);
    try {
      const deleteRequests = [
        axios.delete(`http://localhost:5000/viewproducts/${itemId}`),
        axios.delete(`http://localhost:5000/deleteImage/${encodedImagePath}`),
      ];

      const results = await axios.all(deleteRequests);

      const itemDeletionStatus = results[0].status;
      const imageDeletionStatus = results[1].status;

      if (itemDeletionStatus === 200 && imageDeletionStatus === 200) {
        setProducts((prevData) =>
          prevData.filter((item) => item.id !== itemId)
        );
        message.success("Item deleted from products successfully");
      } else {
        throw new Error("Failed to delete item and image");
      }
    } catch (error) {
      console.error(
        "Error deleting item or image from products/uploads",
        error
      );
      if (error.response) {
        // Request was made and server responded with a non-2xx status code
        message.error(error.response.data.error || "Unknown error occurred");
      } else {
        // Request was made but no response received or network error occurred
        message.error("Network error occurred. Please try again later.");
      }
    }
  };

  const columns = [
    // {
    //   name: "SNo.",
    //   cell: (row, rowIndex) => rowIndex + 1,
    // },
    {
      name: "Image",
      width: "100px",
      selector: (row) => (
        <div>
          <img
            width={50}
            height={50}
            src={`http://localhost:5000/${row.image.replace(/\\/g, "/")}`}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedImage(row.image);
              setImageModalVisible(true);
            }}
          ></img>
        </div>
      ),
    },
    {
      name: "Product Name",
      width: "200px",
      cell: (row) => (
        <div
          style={{
            maxHeight: "100px",
            overflowY: "auto",
            lineHeight: "1.5",
          }}
        >
          {row.name}
        </div>
      ),
    },

    {
      name: "Category",
      selector: (row) => row.category,
      width: "100px",
    },
    {
      name: "Price",
      selector: (row) => row.price,
      width: "100px",
    },
    {
      name: "Stock",
      selector: (row) => row.stock_available,
      width: "100px",
    },

    {
      name: "Description",
      cell: (row) => (
        <div
          style={{
            maxHeight: "100px",
            overflowY: "auto",
            lineHeight: "1.5",
          }}
        >
          {row.description}
        </div>
      ),
    },
    {
      name: "Actions",
      width: "200px",
      cell: (row) => (
        <>
          <Button
            style={{ width: "43%", color: "black" }}
            type="primary"
            onClick={() => openModal(row)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this Product?"
            onConfirm={() => deleteItemFromProducts(row.id, row.image)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ width: "51%", marginLeft: 10 }}
              type="danger"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        color: "#ff9c0a",
        fontSize: "1rem",
      },
    },
  };

  return (
    <>
      <Card>
        {/* <Header search={search} setSearch={setSearch} /> */}
        <DataTable
          columns={columns}
          data={filteredProducts}
          customStyles={customStyles}
          // selectableRows
          // selectableRowsHighlight
          highlightOnHover
          title={
            <h2 style={{ color: "orange", fontWeight: "bold" }}>
              All Products
            </h2>
          }
          fixedHeader
          fixedHeaderScrollHeight="700px"
          pagination
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          subHeader
          subHeaderComponent={
            <Input
              prefix={<SearchOutlined />}
              type="text"
              placeholder="Search here"
              style={{ width: "25%" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
          subHeaderAlign="right"
        />
        <Modal
          title="Image Preview"
          open={imageModalVisible}
          onCancel={() => setImageModalVisible(false)}
          footer={null}
        >
          <img
            src={`http://localhost:5000/${selectedImage.replace(/\\/g, "/")}`}
            alt=""
            style={{ width: "100%" }}
          />
        </Modal>

        <Modal
          title="Edit Product"
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
        >
          <h1 style={{ textAlign: "center", color: "orange" }}>
            Edit Product Details here!
          </h1>

          <Form
            form={form}
            name="basic"
            labelCol={{ span: 24 }}
            initialValues={selectedRowData}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="row-col"
          >
            <Row>
              <Col style={{ paddingRight: ".5rem" }} span={16}>
                {" "}
                <Form.Item
                  label="Product Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input product name!" },
                  ]}
                >
                  <Input.TextArea placeholder="Enter product name" />
                </Form.Item>
              </Col>

              <Col style={{ paddingLeft: ".5rem" }} span={8}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[
                    {
                      required: true,
                      message: "Please select a category",
                    },
                  ]}
                >
                  <Select
                    className="ant-input "
                    placeholder="Select a category"
                  >
                    {categories.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input product description!",
                },
              ]}
            >
              <Input.TextArea placeholder="Enter product description" />
            </Form.Item>
            <Row>
              <Col style={{ paddingRight: ".5rem" }} span={12}>
                <Form.Item
                  label="Price"
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
                  label="Stock Available"
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
            <Row>
              <Col span={24}>
                <Form.Item
                  name="image"
                  label="Image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e.fileList}
                  rules={[{ required: false, message: "Image is required!" }]}
                  hasFeedback
                >
                  <Tooltip title="Do not fill this field if you want to keep previous Image">
                    <Upload
                      name="image"
                      accept="image/*"
                      beforeUpload={() => false}
                      onChange={(info) => {
                        const { fileList } = info;
                        // Remove the file from the fileList that is being uploaded
                        // and keep only the last selected file
                        const updatedFileList = fileList.slice(-1);
                        form.setFieldsValue({ image: updatedFileList });
                      }}
                    >
                      <Button icon={<UploadOutlined />} className="w-100">
                        Upload image
                      </Button>
                    </Upload>
                  </Tooltip>
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
              <Popconfirm
                title="Are you sure you want to update this product?"
                onConfirm={() => onFinish(form.getFieldsValue())}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  style={{ width: 150 }}
                  type="primary"
                  htmlType="submit"
                  className="float-end"
                >
                  Update
                </Button>
              </Popconfirm>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </>
  );
}

export default AllProducts;
