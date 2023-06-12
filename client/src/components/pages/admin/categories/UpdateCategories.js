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
import { SearchOutlined } from "@ant-design/icons";

function Updatecategories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [search, setSearch] = useState("");
  const getCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/updatecategories"
      );
      setCategories(response.data);
      console.log(response.data)
      setFilteredCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const result = categories.filter((category) => {
      return category.name
        .toLocaleLowerCase()
        .match(search.toLocaleLowerCase());
    });
    setFilteredCategories(result);
  }, [search, categories]);

  const deleteItemFromCategories = async (itemId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/updatecategories/${itemId}`
      );

      if (response.status === 200) {
        setCategories((prevData) =>
          prevData.filter((item) => item.id !== itemId)
        );
        message.success("Category Type deleted successfully");
      }
    } catch (error) {
      console.error("Error Deleting Item", error);
    }
  };

  const openModal = (row) => {
    setSelectedRowId(row.id);
    form.setFieldsValue({
      categoryType: row.name,
    });
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const onFinish = async (values) => {
    // console.log(values);
    // const { categoryType } = values;

    try {
      const response = await axios.put(
        `http://localhost:5000/updatecategories/${selectedRowId}`,
        values
      );
      if (response.status === 200) {
        closeModal();
        message.success("Category Type updated successfully");
      }
    } catch (error) {
      console.error("Error updating category type", error);
      message.error("Could not update the category type");
    }
  };

  const onFinishFailed = (errorInfo) => {
    setErrorMessage("Form submission failed. Please check the fields");
    console.log("Failed", errorInfo);
  };
  const columns = [
    {
      name: "Category Type",
      selector: (row) => row.name,
    },
    {
      name: "Update",
      width: "100px",
      cell: (row) => (
        <div>
          <Button
            style={{ width: "100%", margin: "3px 0px" }}
            type="primary"
            onClick={() => openModal(row)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this Product?"
            onConfirm={() => deleteItemFromCategories(row.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ width: "100%", marginBottom: "3px" }}
              type="danger"
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        color: "orange",
        fontSize: "1rem",
      },
    },
  };

  return (
    <>
      <Card style={{ padding: "20px 100px" }}>
        <DataTable
          columns={columns}
          data={filteredCategories}
          customStyles={customStyles}
          pagination
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          highlightOnHover
          //   fixedHeader
          //   fixedHeaderScrollHeight="500px"
          title={
            <h2 style={{ color: "orange", fontWeight: "bold" }}>
              Category Types
            </h2>
          }
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
          title="Edit Category"
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
        >
          <h1 style={{ textAlign: "center", color: "orange" }}>
            Edit Category Type Details here!
          </h1>

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
              label="Category Type"
              name="categoryType"
              rules={[
                { required: true, message: "Please Enter Category Type" },
              ]}
            >
              <Input placeholder="Enter Category Type" />
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
              <Popconfirm
                title="Are you sure you want to update this category type?"
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

export default Updatecategories;
