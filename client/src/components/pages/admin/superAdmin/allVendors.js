import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm, message, Input, Card } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import useAllContext from "../../../../context/useAllContext";
import LoadingScreen from "../../../layout/LoadingScreen";

function AllVendors() {
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const { appUser, api } = useAllContext();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState([]);
  const navigate = useNavigate();

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const allVendors = await axios.post(`${api}/vendor/allvendors`, {
        is_super_admin: appUser.is_super_admin,
      });
      // console.log("allvendors : ", allVendors);
      setVendors(allVendors.data);
    } catch (err) {
      setVendors([]);
    }
    setLoading(false);
  }, [appUser.is_super_admin, api]);
  useEffect(() => {
    if (!appUser.is_super_admin) {
      navigate("/admin/dashboard");
    }
    fetchVendors();
  }, [fetchVendors, appUser.is_super_admin, navigate]);

  useEffect(() => {
    const result = vendors.filter((vendor) => {
      return vendor.business_name
        .toLocaleLowerCase()
        .match(search.toLocaleLowerCase());
    });
    setFilteredVendors(result);
  }, [search, vendors]);

  const deleteItemFromVendors = async (itemId, imagePath) => {
    setButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[itemId] = true;
      return newLoadings;
    });
    // const encodedImagePath = encodeURIComponent(imagePath);
    try {
      const deleteRequests = [
        axios.delete(`${api}/vendor/editvendor/${itemId}`),
        // axios.delete(`${api}/deleteImage/${encodedImagePath}`),
      ];

      const results = await axios.all(deleteRequests);

      const itemDeletionStatus = results[0].status;
      //   const imageDeletionStatus = results[1].status;

      if (
        itemDeletionStatus === 200
        // && imageDeletionStatus === 200
      ) {
        setVendors((prevData) => prevData.filter((item) => item.id !== itemId));
        message.success("Vendor Deleted successfully");
      } else {
        throw new Error("Failed to delete Vendor");
      }
    } catch (error) {
      console.error("Error deleting Vendor", error);
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
    // {
    //   name: "Image",
    //   width: "10%",

    //   selector: (row) => (
    //     <img
    //       // width={50}
    //       // height={50}
    //       src={`${api}/${row.image.replace(/\\/g, "/")}`}
    //       alt=""
    //       style={{ cursor: "pointer" }}
    //       onClick={() => {
    //         setSelectedImage(row.image);
    //         setImageModalVisible(true);
    //       }}
    //     ></img>
    //   ),
    // },
    {
      name: "Vendor Business Name",

      width: "30%",
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
            {row.business_name}
          </strong>
        </div>
      ),
    },

    {
      name: <div style={{ width: "100%", textAlign: "center" }}>Email</div>,
      selector: (row) => row.email,
      width: "20%",
      style: { display: "flex", justifyContent: "center" },
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      width: "10%",
    },
    {
      name: "Approved?",
      selector: (row) =>
        row.is_approved ? (
          <CheckCircleOutlined style={{ color: "green", fontSize: 25 }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red", fontSize: 25 }} />
        ),
      width: "9%",
      style: { display: "flex", justifyContent: "center" },
    },
    {
      name: "Verified Email?",
      selector: (row) =>
        row.isemailverified ? (
          <CheckCircleOutlined style={{ color: "green", fontSize: 25 }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red", fontSize: 25 }} />
        ),
      width: "12%",
      style: { display: "flex", justifyContent: "center" },
    },

    {
      name: <div style={{ width: "100%", textAlign: "center" }}>Actions</div>,
      style: { display: "flex", justifyContent: "center" },
      width: "200px",
      cell: (row) => (
        <>
          <Popconfirm
            title="Are you sure you want to delete this Vendor?"
            onConfirm={() => deleteItemFromVendors(row.id)}
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
        height: "100px",
        width: "100%",
      },
    },
    cells: {
      style: {
        height: "100%",
        width: "100%",
        fontSize: 14,
      },
    },
  };

  return !loading ? (
    <>
      <Card>
        {/* <Header search={search} setSearch={setSearch} /> */}
        <DataTable
          columns={columns}
          data={filteredVendors}
          customStyles={customStyles}
          // selectableRows
          // selectableRowsHighlight
          highlightOnHover
          title={
            <h2 style={{ color: "#ff8400", fontWeight: "bold" }}>
              All Vendors
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
                placeholder="Search Vendors "
                style={{ width: "100%" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <p className="productsscrollformore">{"Scroll for More -->"}</p>
            </div>
          }
          subHeaderAlign="right"
        />

        {/* <Modal
          title="Image Preview"
          open={imageModalVisible}
          onCancel={() => setImageModalVisible(false)}
          footer={null}
        >
          <img
            src={`${api}/${selectedImage.replace(/\\/g, "/")}`}
            alt=""
            style={{ width: "100%" }}
          />
        </Modal> */}

        {/* <Modal
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
                loading={buttonLoading}
              >
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal> */}
      </Card>
    </>
  ) : (
    <LoadingScreen />
  );
}
// return (

// );

export default AllVendors;
