import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
  Button,
  Modal,
  Popconfirm,
  message,
  Form,
  Input,
  Alert,
  Card,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

function UpdateBrands({
  brands,
  getBrands,
  setFilteredBrands,
  filteredBrands,
  appUser,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [search, setSearch] = useState("");
  const [refreshPage, setRefreshPage] = useState(false);
  const [buttonLoading, setButtonLoading] = useState([]);
  const [editButtonLoading, setEditButtonLoading] = useState(false);

  useEffect(() => {
    getBrands();
  }, [refreshPage, getBrands]);

  useEffect(() => {
    if (!appUser.is_super_admin) {
      const vendorBrands = brands.filter((brand) => {
        return brand.vendor_id === appUser.id;
      });
      const result = vendorBrands.filter((brand) => {
        return brand.brand
          ?.toLocaleLowerCase()
          .match(search.toLocaleLowerCase());
      });
      setFilteredBrands(result);
    } else if (appUser.is_super_admin) {
      const result = brands.filter((brand) => {
        return brand.brand
          ?.toLocaleLowerCase()
          .match(search.toLocaleLowerCase());
      });
      setFilteredBrands(result);
    }
  }, [search, brands, setFilteredBrands, appUser.is_super_admin, appUser.id]);
  // console.log(brands);
  const deleteItemFromCategories = async (itemId) => {
    setButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[itemId] = true;
      return newLoadings;
    });
    try {
      const response = await axios.delete(
        `http://localhost:5000/updatebrands/${itemId}`
      );

      if (response.status === 200) {
        getBrands();
        message.success("Brand Deleted Successfully!");
      }
    } catch (error) {
      // console.error("Error Deleting Brand", error);
      message.error("Couldn't Delete the Brand");
    }
    setButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[itemId] = false;
      return newLoadings;
    });
  };

  const openModal = (row) => {
    setSelectedRowId(row.id);
    form.setFieldsValue({
      brand: row.brand,
    });
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const onFinish = async (values) => {
    // console.log(values);
    // const { categoryType } = values;
    setEditButtonLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/updatebrands/${selectedRowId}`,
        values
      );
      if (response.status === 200) {
        setRefreshPage(true);
        closeModal();
        message.success("Brand updated successfully");
        if (refreshPage) {
          setRefreshPage(false);
        }
      }
    } catch (error) {
      // console.error("Error updating category type", error);
      message.error("Could not update the category type");
    }
    setEditButtonLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    setErrorMessage("Form submission failed. Please check the fields");
    console.log("Failed", errorInfo);
  };
  const columns = [
    {
      name: "Brand",
      width: "100px",
      selector: (row) => row.brand,
    },
    appUser.is_super_admin && {
      name: "Seller",
      selector: (row) => row.vendor?.business_name,
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
              onClick={() => openModal(row)}
              icon={<EditOutlined />}
            >
              Edit
            </Button>
          )}

          <Popconfirm
            title="Are you sure you want to delete this Category?"
            onConfirm={() => deleteItemFromCategories(row.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: {
                height: 40,
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
              style={{
                width: "51%",
                marginLeft: 10,
                background: "#9e2426",
                color: "#fff",
              }}
              type="primary"
              danger
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
        height: "60px",
        width: "100%",
      },
    },
    cells: {
      style: {
        height: "100%",
        // width: "100%",
      },
    },
  };

  return (
    // <div className="d-flex justify-content-center">
    <Card className="categoryCard">
      <DataTable
        columns={columns}
        data={filteredBrands}
        customStyles={customStyles}
        pagination
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        highlightOnHover
        //   fixedHeader
        //   fixedHeaderScrollHeight="500px"
        title={
          <h2 style={{ color: "#7cb028", fontWeight: "bold" }}>
            {appUser.is_super_admin ? "All Brands" : " Your Brands"}
          </h2>
        }
        subHeader
        subHeaderComponent={
          <div style={{ width: "50%" }}>
            <Input
              prefix={<SearchOutlined />}
              type="text"
              placeholder="Search here"
              style={{ width: "100%" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <p className="scrollformore">{"Scroll for More -->"}</p>
          </div>
        }
        subHeaderAlign="right"
      />

      <Modal
        title="Edit Brand"
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="row-col"
        >
          <Form.Item
            label="Brand Name"
            name="brand"
            rules={[{ required: true, message: "Please Enter Brand Name" }]}
          >
            <Input placeholder="Enter Brand Name" />
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
            {/* <Popconfirm
                title="Are you sure you want to update this category?"
                onConfirm={() => onFinish(form.getFieldsValue())}
                okText="Yes"
                cancelText="No"
              > */}
            <Button
              style={{ width: 150 }}
              type="primary"
              htmlType="submit"
              className="float-end"
              loading={editButtonLoading}
            >
              Update
            </Button>
            {/* </Popconfirm> */}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
    // </div>
  );
}

export default UpdateBrands;
