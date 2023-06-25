import React, { useEffect, useState } from "react";
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
  Typography,
} from "antd";
import {
  UploadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import useAllContext from "../../../../context/useAllContext";
import TextEditor from "./TextEditor";
import LoadingScreen from "../../../layout/LoadingScreen";

function AllProducts() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [descModalVisible, setDescModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { Option } = Select;
  const [form] = Form.useForm();
  const [modalDescription, setModalDescription] = useState([]);
  const [textDesc, setTextDesc] = useState("");
  const { categories, fetchCategories } = useAllContext();
  const [selectedRowData, setSelectedRowData] = useState({});
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [refreshPage, setRefreshPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState([]);

  const { Text } = Typography;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/viewproducts");
      const brands = await axios.get("http://localhost:5000/brands");
      // console.log("brands.data : ", brands.data);
      var products = [];
      response.data.map((product) => {
        products.push({
          ...product,
          brand: brands.data.find((brand) => {
            if (brand.id === product.brand_id) return true;
          }),
        });
      });
      // console.log("products : ", products);
      setProducts(products);
      setBrands(brands.data);
      setFilteredProducts(products);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    // setLoading(true);
    getProducts();
    // setLoading(false);
  }, [refreshPage]);

  useEffect(() => {
    const result = products.filter((product) => {
      return product.name.toLocaleLowerCase().match(search.toLocaleLowerCase());
    });
    setFilteredProducts(result);
  }, [search, products]);

  const openModal = (rowData) => {
    // console.log(rowData);
    setTextDesc(rowData.description);
    setSelectedRowId(rowData.id);
    const initialValues = {
      name: rowData.name,
      category: rowData.category_id,
      brand: rowData.brand.brand,
      description: textDesc,
      price: rowData.price,
      stock_available: rowData.stock_available,
    };
    setSelectedRowData(initialValues);
    setModalVisible(true);

    form.setFieldsValue(initialValues);
  };

  const openDescModal = (rowData) => {
    rowData.description
      ? setModalDescription(rowData.description)
      : setModalDescription([]);

    setDescModalVisible(true);
  };

  useEffect(() => {
    setSelectedRowData({});
  }, [modalVisible]);
  const closeModal = () => {
    setModalVisible(false);
  };
  const onFinish = async (values) => {
    setButtonLoading(true);
    // console.log("Success", values);
    try {
      // console.log(selectedRowData.id);
      const formData = new FormData();
      formData.append("category", values.category);
      formData.append("brand_id", values.brand);
      formData.append("name", values.name);
      formData.append("description", textDesc);
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
        setRefreshPage(true);
        //add required navigation
        // setErrorMessage("Details updated successfullY");
        message.success("Details Updated Successfully");
        closeModal();
        if (refreshPage) {
          setRefreshPage(false);
        }
      } else {
        setErrorMessage("Something went Wrong");
      }
    } catch (error) {
      form.resetFields();
      console.log(error);
    }
    setButtonLoading(false);
  };
  const onFinishFailed = (errorInfo) => {
    setErrorMessage("Form submission failed. Please check the fields");
    console.log("Failed", errorInfo);
  };

  const deleteItemFromProducts = async (itemId, imagePath) => {
    setButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[itemId] = true;
      return newLoadings;
    });
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
    setButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[itemId] = false;
      return newLoadings;
    });
  };

  const columns = [
    {
      name: "Image",
      width: "10%",

      selector: (row) => (
        <img
          // width={50}
          // height={50}
          src={`http://localhost:5000/${row.image.replace(/\\/g, "/")}`}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedImage(row.image);
            setImageModalVisible(true);
          }}
        ></img>
      ),
    },
    {
      name: "Product Name",
      width: "45%",
      cell: (row) => (
        <div
          style={{
            maxHeight: "100%",
            minWidth: "100%",
            overflow: "hidden",
            lineHeight: "1.5",
          }}
        >
          <strong style={{ marginTop: 10 }} className="two-lines">
            {row.name}
          </strong>
          <p className="mt-0">Description : </p>
          <p
            className="three-lines m-0"
            dangerouslySetInnerHTML={{ __html: row.description }}
          ></p>
          <p style={{ width: "100%" }} className="d-flex">
            <Button
              // style={{ width: "43%" }}
              type="link"
              onClick={() => {
                setTextDesc(row.description);
                openDescModal(row);
              }}
              onClose={() => setModalDescription("")}
              icon={<EyeOutlined />}
            >
              view more
            </Button>
          </p>
        </div>
      ),
    },

    {
      name: "Category",
      selector: (row) => row.category,
      width: "8%",
    },
    {
      name: "Brand",
      selector: (row) => row.brand.brand,
      width: "8%",
    },
    {
      name: "Price",
      selector: (row) => row.price,
      width: "6%",
    },
    {
      name: "Stock",
      selector: (row) => row.stock_available,
      width: "6%",
    },

    // {
    //   name: "Description",
    //   width: "150px",
    //   cell: (row) => (
    //     // <div
    //     //   style={{
    //     //     maxHeight: "100%",
    //     //     overflowY: "hidden",
    //     //     lineHeight: "1.5",
    //     //   }}
    //     // >
    //     //   {row.description}
    //     // </div>
    //     <Button
    //       // style={{ width: "43%" }}
    //       type="link"
    //       onClick={() => {
    //         setTextDesc(row.description);
    //         openDescModal(row);
    //       }}
    //       onClose={() => setModalDescription("")}
    //       icon={<EyeOutlined />}
    //     >
    //       View
    //     </Button>
    //   ),
    // },
    {
      name: "Actions",
      width: "200px",
      cell: (row) => (
        <>
          <Button
            style={{ width: "43%", background: "#4b7ee5", color: "#fff" }}
            type="primary"
            onClick={() => {
              openModal(row);
            }}
            icon={<EditOutlined />}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this Product?"
            onConfirm={() => deleteItemFromProducts(row.id, row.image)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: {
                height: 40,
                width: 40,
                background: "#f53131",
                color: "white",
              },
            }}
            cancelButtonProps={{
              style: { height: 40, width: 40 },
              type: "default",
            }}
          >
            <Button
              id={row.id}
              style={{
                width: "51%",
                marginLeft: 10,
                background: "#9e2426",
                color: "#fff",
              }}
              danger
              type="primary"
              icon={<DeleteOutlined />}
              loading={buttonLoading[row.id]}
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
        color: "#41444a",
        fontSize: "1rem",
      },
    },
    rows: {
      style: {
        height: "210px",
        width: "100%",
      },
    },
    cells: {
      style: {
        height: "100%",
        width: "100%",
      },
    },
  };

  return !loading ? (
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
            <h2 style={{ color: "#ff8400", fontWeight: "bold" }}>
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
              placeholder="Search Products "
              style={{ width: "20em", marginBottom: 10 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
          subHeaderAlign="right"
        />
        <Modal
          title="Description Preview"
          open={descModalVisible}
          centered
          onCancel={() => setDescModalVisible(false)}
          footer={null}
        >
          {modalDescription.length > 0 ? (
            <div dangerouslySetInnerHTML={{ __html: modalDescription }}></div>
          ) : (
            " No Description Available"
          )}
          {/* {modalDescription} */}
        </Modal>

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
          // title="Edit Product"
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
        >
          <h1 style={{ textAlign: "center", color: "orange" }}>
            Edit Product !
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
              <Col style={{ paddingRight: ".5rem" }} span={24}>
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
            </Row>
            <Row>
              <Col style={{ paddingLeft: ".5rem" }} span={12}>
                <Form.Item
                  name="brand"
                  label="Brand"
                  rules={[
                    {
                      required: true,
                      message: "Please select a Brand",
                    },
                  ]}
                >
                  <Select className="ant-input " placeholder="Select a Brand">
                    {brands.map((brand) => (
                      <Option key={brand.id} value={brand.id}>
                        {brand.brand}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col style={{ paddingLeft: ".5rem" }} span={12}>
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

            <Row>
              <Col style={{ paddingRight: ".5rem" }} span={12}>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[
                    {
                      required: true,
                      message: "Please input product price!",
                    },
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
            <Row>
              <Text>Description </Text>
              <Text italic disabled>
                (* if styling doesn't appear in the box properly, close and open
                the edit window again!)
              </Text>
              <Col
                style={{
                  padding: ".5rem",
                  marginBottom: 15,
                  border: "1px solid rgba(0, 0, 0, 0.1)",
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
                        Add Description Item
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List> */}
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
              {/* <Popconfirm
              title="Are you sure you want to update this product?"
              onConfirm={() => onFinish(form.getFieldsValue())}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                style: {
                  height: 40,
                  width: 45,
                  // background: "#f53131",
                  // color: "white",
                },
              }}
              cancelButtonProps={{
                style: { height: 40, width: 40 },
                type: "default",
              }}
            > */}
              <Button
                style={{ width: 150 }}
                type="primary"
                htmlType="submit"
                className="float-end"
                loading={buttonLoading}
              >
                Update
              </Button>
              {/* </Popconfirm> */}
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </>
  ) : (
    <LoadingScreen />
  );
}
// return (

// );

export default AllProducts;
