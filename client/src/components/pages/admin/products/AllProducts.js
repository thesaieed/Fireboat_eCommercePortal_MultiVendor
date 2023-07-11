import React, { useCallback, useEffect, useState } from "react";
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
  Image,
  Spin,
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
import StarRatings from "react-star-ratings";

function AllProducts() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [descModalVisible, setDescModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { Option } = Select;
  const [form] = Form.useForm();
  const [modalDescription, setModalDescription] = useState([]);
  const [textDesc, setTextDesc] = useState("");
  const { categories, fetchCategories, appUser } = useAllContext();
  const [selectedRowData, setSelectedRowData] = useState({});
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedImage] = useState("");
  const [refreshPage, setRefreshPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState([]);
  const [updateButtonLoading, setUpdateButtonLoading] = useState([]);

  const { Text } = Typography;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/viewproducts", {
        vendorId: appUser.id,
        is_super_admin: appUser.is_super_admin,
      });
      const allVendors = await axios.get("http://localhost:5000/allvendors");
      const brands = await axios.get("http://localhost:5000/brands");
      // console.log("brands.data : ", brands.data);
      var products = [];
      response.data.map((product) => {
        products.push({
          ...product,
          brand: brands.data.find((brand) => {
            if (brand.id === product.brand_id) return true;
            else return false;
          }),
          vendor: allVendors.data.find((vendor) => {
            if (vendor.id === product.vendor_id) return true;
            else return false;
          }),
        });
        return null;
      });
      // console.log("products : ", products);
      setProducts(products);
      setBrands(brands.data);
      setFilteredProducts(products);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [appUser.id, appUser.is_super_admin]);
  useEffect(() => {
    // setLoading(true);
    getProducts();
    // setLoading(false);
  }, [refreshPage, getProducts]);

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
      brand: rowData.brand.id,
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
    setUpdateButtonLoading(true);
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
      if (values.image) {
        values.image.forEach((file) => {
          formData.append("image", file.originFileObj);
        });
      }

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
    setUpdateButtonLoading(false);
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
        <Image
          // width={50}
          // height={50}
          src={`http://localhost:5000/${row.image[0].replace(/\\/g, "/")}`}
          alt=""
          style={{ cursor: "pointer", padding: 7, height: "80%" }}
          // onClick={() => {
          //   setSelectedImage(row.image);
          //   setImageModalVisible(true);
          // }}
        ></Image>
      ),
    },
    {
      name: (
        <div style={{ width: "100%", textAlign: "center" }}>Product Name</div>
      ),
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
          {appUser.is_super_admin && (
            <p className="mt-5">
              Seller : <strong>{row.vendor.business_name}</strong>
            </p>
          )}
          <div>
            <StarRatings
              rating={row.avg_rating}
              starRatedColor="#86c61f"
              numberOfStars={5}
              name="mainAvgRating"
              starDimension="15px"
              starSpacing="1px"
            />
            <strong> ({row.avg_rating.toFixed(1)}) </strong>
          </div>
          <p className="mt-0">Description : </p>
          <p
            style={{ marginLeft: 10 }}
            className="three-lines m-0"
            dangerouslySetInnerHTML={{ __html: row.description }}
          ></p>
          <p style={{ width: "100%" }} className="d-flex mt-0">
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
      name: <div style={{ width: "100%", textAlign: "center" }}>Category</div>,
      selector: (row) => row.category,
      width: "8%",
      style: { display: "flex", justifyContent: "center" },
    },
    {
      name: <div style={{ width: "100%", textAlign: "center" }}>Brand</div>,
      selector: (row) => row.brand.brand,
      width: "8%",
      style: { display: "flex", justifyContent: "center" },
    },
    {
      name: <div style={{ width: "100%", textAlign: "center" }}>Price</div>,
      selector: (row) => row.price,
      width: "6%",
      style: { display: "flex", justifyContent: "center" },
    },
    {
      name: <div style={{ width: "100%", textAlign: "center" }}>Stock</div>,
      selector: (row) => row.stock_available,
      width: "6%",
      style: { display: "flex", justifyContent: "center" },
    },

    {
      name: <div style={{ width: "100%", textAlign: "center" }}>Actions</div>,
      width: "200px",
      style: { display: "flex", justifyContent: "center" },
      cell: (row) => (
        <>
          {!appUser.is_super_admin && (
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
          )}

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
            {/* {console.log(row)} */}
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
        height: "250px",
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
              {appUser.is_super_admin ? "All Products" : " Your Products"}
            </h2>
          }
          fixedHeader
          fixedHeaderScrollHeight="700px"
          pagination
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          subHeader
          subHeaderComponent={
            <div style={{ width: "20em", marginBottom: 10 }}>
              <Input
                prefix={<SearchOutlined />}
                type="text"
                placeholder="Search Products "
                style={{ width: "100%" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <p className="productsscrollformore">{"Scroll for More -->"}</p>
            </div>
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

        {/* <Modal
          title="Image Preview"
          open={imageModalVisible}
          onCancel={() => setImageModalVisible(false)}
          footer={null}
        > */}
        <Image
          src={`http://localhost:5000/${selectedImage.replace(/\\/g, "/")}`}
          alt=""
          style={{ width: "100%" }}
        />
        {/* </Modal> */}

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
                  <Tooltip title="Do not fill this field if you want to keep previous Images">
                    <Upload.Dragger
                      listType="picture"
                      multiple
                      name="image"
                      accept="image/*"
                      beforeUpload={() => false}
                      onChange={(info) => {
                        const { fileList } = info;
                        form.setFieldsValue({ image: fileList });
                      }}
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
                    >
                      <Button icon={<UploadOutlined />} className="w-100">
                        Drag and drop images
                      </Button>
                    </Upload.Dragger>
                  </Tooltip>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Text>Description </Text>

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
                loading={updateButtonLoading}
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
