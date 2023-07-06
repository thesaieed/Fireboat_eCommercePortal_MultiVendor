import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Alert,
  Card,
} from "antd";
import {
  SearchOutlined,
  CloseCircleFilled,
  CheckCircleFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import useAllContext from "../../../../context/useAllContext";
import TextEditor from "../products/TextEditor";
import LoadingScreen from "../../../layout/LoadingScreen";

function AllVendors() {
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form] = Form.useForm();
  const [rejectReason, setRejectReason] = useState("");
  const { appUser } = useAllContext();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approveButtonLoading, setApproveButtonLoading] = useState([]);
  const [rejectButtonLoading, setRejectButtonLoading] = useState([]);
  const navigate = useNavigate();

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const allVendors = await axios.post(
        "http://localhost:5000/vendor/getapprovevendorslist",
        { is_super_admin: appUser.is_super_admin }
      );
      // console.log("allvendors : ", allVendors);
      setVendors(allVendors.data);
    } catch (err) {
      setVendors([]);
    }
    setLoading(false);
  }, [appUser.is_super_admin]);
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

  const openRejectionModal = (itemId) => {
    setSelectedRowId(itemId);
    setRejectionModalVisible(true);
  };

  const approveVendor = async (itemId) => {
    // console.log(itemId);
    //itemId = vendorID
    setApproveButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[itemId] = true;
      return newLoadings;
    });
    // const encodedImagePath = encodeURIComponent(imagePath);
    try {
      const approveRequest = await axios.post(
        "http://localhost:5000/vendor/approvevendor",
        { itemId }
      );
      // axios.delete(`http://localhost:5000/deleteImage/${encodedImagePath}`),
      const vendorApprovalStatus = approveRequest.data.status;
      //   const imageDeletionStatus = results[1].status;

      if (
        vendorApprovalStatus === 200
        // && imageDeletionStatus === 200
      ) {
        message.success("Vendor Approved successfully");
        fetchVendors();
      } else {
        message.error("Failed to Approve Vendor");
        throw new Error("Failed to Approve Vendor");
      }
    } catch (error) {
      console.error("Error Approving Vendor", error);
      if (error.response) {
        // Request was made and server responded with a non-2xx status code
        message.error(error.response.data.error || "Unknown error occurred");
      } else {
        // Request was made but no response received or network error occurred
        message.error("Network error occurred. Please try again later.");
      }
    }
    setApproveButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[itemId] = false;
      return newLoadings;
    });
  };
  const rejectVendor = async (itemId) => {
    //itemId = vendorID
    setRejectButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[selectedRowId] = true;
      return newLoadings;
    });
    // const encodedImagePath = encodeURIComponent(imagePath);
    try {
      const rejectRequest = await axios.post(
        "http://localhost:5000/vendor/rejectvendor",
        { itemId: selectedRowId, rejectionReason: rejectReason }
      );
      // axios.delete(`http://localhost:5000/deleteImage/${encodedImagePath}`),
      const rejectStatus = rejectRequest.data.status;
      //   const imageDeletionStatus = results[1].status;

      if (
        rejectStatus === 200
        // && imageDeletionStatus === 200
      ) {
        message.success("Vendor Rejected successfully");
      } else {
        setErrorMessage("Failed to Reject Vendor");
        throw new Error("Failed to Rejected Vendor");
      }
    } catch (error) {
      console.error("Error Rejecting Vendor", error);
      if (error.response) {
        // Request was made and server responded with a non-2xx status code
        setErrorMessage(error.response.data.error || "Unknown error occurred");
        // message.error(error.response.data.error || "Unknown error occurred");
      } else {
        // Request was made but no response received or network error occurred
        setErrorMessage("Unknown error occurred");
        // message.error("Network error occurred. Please try again later.");
      }
    }
    setRejectButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[selectedRowId] = false;
      return newLoadings;
    });
    fetchVendors();
    setRejectionModalVisible(false);
  };
  const columns = [
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
      width: "200px",
      cell: (row) => (
        <>
          <Popconfirm
            title="Are you sure you want to approve this Vendor?"
            onConfirm={() => approveVendor(row.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: {
                height: 40,
                minWidth: 40,
                background: "#gold",
                color: "white",
              },
            }}
            cancelButtonProps={{
              style: { height: 40, width: 40 },
              type: "default",
            }}
          >
            <Button
              style={{ width: "60%", color: "#fff" }}
              type="primary"
              icon={<CheckCircleFilled />}
              loading={approveButtonLoading[row.id]}
            >
              Approve
            </Button>
          </Popconfirm>

          <Button
            id={row.id}
            onClick={() => openRejectionModal(row.id)}
            style={{
              width: "51%",
              marginLeft: 10,
              background: "#9e2426",
              color: "#fff",
            }}
            danger
            type="primary"
            icon={<CloseCircleFilled />}
            loading={rejectButtonLoading[row.id]}
          >
            Reject
          </Button>
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
        // background: "blue",
        textAlign: "center",
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
        <DataTable
          columns={columns}
          data={filteredVendors}
          customStyles={customStyles}
          // selectableRows
          // selectableRowsHighlight
          highlightOnHover
          title={
            <h2 style={{ color: "#ff8400", fontWeight: "bold" }}>
              New Vendors
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

        <Modal
          // title="Rejection Reason"
          width={700}
          open={rejectionModalVisible}
          onCancel={() => {
            setRejectionModalVisible(false);
            setErrorMessage("");
            setSelectedRowId();
            setRejectReason("");
          }}
          footer={null}
        >
          <h1 style={{ textAlign: "center", color: "orange" }}>
            Reason for Rejection
          </h1>

          <Form
            form={form}
            name="basic"
            labelCol={{ span: 24 }}
            onFinish={rejectVendor}
            onFinishFailed={() => {
              console.log("submission failed");
            }}
            className="row-col"
          >
            <Row>
              <Col span={24}>
                <Form.Item name="description">
                  <TextEditor
                    textDesc={rejectReason}
                    setTextDesc={setRejectReason}
                    placeholder="Reason for Rejection"
                  />
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
                style={{ width: 150, background: "#9e2426", color: "#fff" }}
                type="primary"
                htmlType="submit"
                className="float-end"
                loading={rejectButtonLoading[selectedRowId]}
              >
                Reject Vendor
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </>
  ) : (
    <LoadingScreen />
  );
}

export default AllVendors;
