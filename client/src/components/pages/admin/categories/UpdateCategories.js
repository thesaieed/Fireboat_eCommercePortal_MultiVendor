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

function Updatecategories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [search, setSearch] = useState("");
  const [refreshPage,setRefreshPage] = useState(false)
  const getCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/updatecategories"
      );
      setCategories(response.data);
      // console.log(response.data)
      setFilteredCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategories();
  }, [refreshPage]);

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
        setRefreshPage(true)
        closeModal();
        message.success("Category Type updated successfully");
        if(refreshPage){
          setRefreshPage(false)
        }
       
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
            title="Are you sure you want to delete this Category?"
            onConfirm={() => deleteItemFromCategories(row.id)}
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
        color: "orange",
        fontSize: "1rem",
      },
    },
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ padding: "20px 100px", marginTop: "20px", width: "80%" }}>
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
              All Categories
            </h2>
          }
          subHeader
          subHeaderComponent={
            <Input
              prefix={<SearchOutlined />}
              type="text"
              placeholder="Search here"
              style={{ width: "40%" }}
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
              label="Category Name"
              name="categoryType"
              rules={[
                { required: true, message: "Please Enter Category Name" },
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
                title="Are you sure you want to update this category?"
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
    </div>
  );
}

export default Updatecategories;
