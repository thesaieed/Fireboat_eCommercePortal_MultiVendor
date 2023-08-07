import {
  Row,
  Col,
  Descriptions,
  Typography,
  Card,
  Form,
  Input,
  Popconfirm,
  message,
  Button,
  Alert,
  Avatar,
  Modal,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  ExclamationOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { BsCreditCard2FrontFill } from "react-icons/bs";
import useAllContext from "../../../../context/useAllContext";
import DataTable from "react-data-table-component";
import axios from "axios";
const CheckoutDetails = () => {
  const location = useLocation();
  var dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const transaction = useMemo(
    () => location.state?.row || [],
    [location.state?.row]
  );

  const { Title } = Typography;
  const [form] = Form.useForm();
  const [denyform] = Form.useForm();
  const { appUser } = useAllContext();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [denyErrorMessage, setDenyErrorMessage] = useState("");
  const [denySuccessMessage, setDenySuccessMessage] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [denyButtonLoading, setDenyButtonLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [denyReason, setDenyReason] = useState("");
  const [newDenialReason, setNewDenialReason] = useState("");
  const [denyReasonModalVisible, setDenyReasonModalVisible] = useState("");
  const [payStats, setPayStats] = useState({
    totalSales: 0,
    checkedOut: 0,
    currentBalance: 0,
  });
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [transactionID, setTransactionID] = useState("");
  const navigate = useNavigate();
  const onFinish = async () => {
    setButtonLoading(true);

    if (transactionID.length > 0) {
      try {
        const { data } = await axios.post(
          "https://nile-server-a3fg.onrender.com/payments/approvecheckout",
          {
            transactionID,
            vendor_id: transaction.vendor_id,
            checkoutID: transaction.id,
          }
        );
        setTransactionID(0);
        if (data.status === 200) {
          setSuccessMessage("Payment Updated Successfully! ");
          form.resetFields();
          message.success("Payment Updated Successfully!");
          navigate("/admin/superadmin/payments");
        } else {
          setErrorMessage("Server Error!");
        }
      } catch (error) {
        form.resetFields();
        console.log(error);
        message.error("Please Check the Field again!");
      }
    } else {
      setErrorMessage("Transaction ID Required!");
    }
    getPaymentStats();
    setButtonLoading(false);
  };
  const onFinishFailed = (errorInfo) => {
    setErrorMessage("Something went wrong");
    // console.log("Failed", errorInfo);
  };
  const denyPayment = async () => {
    setDenyButtonLoading(true);
    if (newDenialReason.length > 0) {
      try {
        const { data } = await axios.post(
          "https://nile-server-a3fg.onrender.com/payments/denycheckout",
          {
            newDenialReason,
            vendor_id: transaction.vendor_id,
            checkoutID: transaction.id,
          }
        );
        setNewDenialReason("");
        if (data.status === 200) {
          setDenySuccessMessage("Payment Denied! ");
          denyform.resetFields();
          message.success("Payment Denied!");
          navigate("/admin/superadmin/payments");
        } else {
          setDenyErrorMessage("Server Error!");
        }
      } catch (error) {
        denyform.resetFields();
        console.log(error);
        message.error("Please Check the Field again!");
      }
    } else {
      setDenyErrorMessage("Denial Reason Required!");
    }
    setDenyButtonLoading(false);
  };
  const denyPaymentFailed = (errorInfo) => {
    setDenyErrorMessage("Something went wrong");
    // console.log("Failed", errorInfo);
  };
  const getPaymentStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await axios.post(
        "https://nile-server-a3fg.onrender.com/payments/vendorpaymentstats",
        {
          vendor_id: transaction.vendor_id,
        }
      );
      const resTransactions = await axios.post(
        "https://nile-server-a3fg.onrender.com/payments/previoustransactions",
        {
          vendor_id: transaction.vendor_id,
        }
      );
      setPayStats({
        ...data,
        currentBalance: data.totalSales - data.checkedOut,
      });
      setTransactions(resTransactions.data);
      setFilteredTransactions(resTransactions.data);
    } catch (error) {
      console.log(error);
    }
    setStatsLoading(false);
  }, [transaction.vendor_id]);
  useEffect(() => {
    getPaymentStats();
  }, [getPaymentStats]);

  const columns = [
    {
      name: <div style={{ width: "100%", textAlign: "start" }}>Order</div>,
      minWidth: "330px",
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cell: (row) => (
        <div
          style={{
            maxHeight: "100%",
            minWidth: "100%",
            overflow: "hidden",
            lineHeight: "1.5",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          <div className="d-flex justify-content-start align-items-center">
            <Button
              type="link"
              size="small"
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                navigate("/admin/superadmin/checkoutdetails", {
                  state: { row },
                });
              }}
            >
              <strong style={{ fontSize: 14, fontWeight: 700 }}>
                {row.order_id}
              </strong>
            </Button>
            {row.status === "denied" && (
              <Tooltip title="Reason for Denial" color={"#9edd38"}>
                <Button
                  shape="circle"
                  size="small"
                  style={{
                    marginLeft: 5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  danger
                  icon={<ExclamationOutlined style={{ fontSize: 10 }} />}
                  onClick={() => {
                    setDenyReason(row.denyreason);
                    setDenyReasonModalVisible(true);
                  }}
                />
              </Tooltip>
            )}
          </div>
          <div style={{ marginTop: 10, marginLeft: 10 }} className="text-muted">
            <div>
              Initiated on{" "}
              {new Date(row?.created_at).toLocaleDateString(
                "en-US",
                dateOptions
              )}
            </div>
            {row.status !== "pending" && (
              <div>
                Responded on{" "}
                {new Date(row?.modified_at).toLocaleDateString(
                  "en-US",
                  dateOptions
                )}
              </div>
            )}
            {row.status === "approved" && (
              <div style={{ fontWeight: 700 }}>
                Payment Reciept ID :{row.transaction_id}
              </div>
            )}
          </div>
        </div>
      ),
    },

    {
      name: <div style={{ width: "100%", textAlign: "start" }}>Status</div>,
      selector: (row) => {
        if (row.status === "denied") {
          return (
            <div>
              <Avatar
                size={24}
                style={{ background: "red" }}
                icon={
                  <CloseOutlined style={{ fontSize: 12, color: "white" }} />
                }
              />
              <span style={{ textTransform: "capitalize", marginLeft: 5 }}>
                {row.status}
              </span>
            </div>
          );
        }
        if (row.status === "approved") {
          return (
            <div>
              <Avatar
                size={24}
                style={{ background: "green" }}
                icon={<PlusOutlined style={{ fontSize: 12, color: "white" }} />}
              />
              <span style={{ textTransform: "capitalize", marginLeft: 5 }}>
                {row.status}
              </span>
            </div>
          );
        }
        if (row.status === "pending") {
          return (
            <div>
              <Avatar
                style={{ background: "orange" }}
                size={24}
                icon={
                  <ExclamationOutlined
                    style={{ fontSize: 12, color: "white" }}
                  />
                }
              />
              <span style={{ textTransform: "capitalize", marginLeft: 5 }}>
                {row.status}
              </span>
            </div>
          );
        }
      },
      width: "200px",
      style: { display: "flex", justifyContent: "start" },
    },
    {
      name: (
        <div style={{ width: "100%", textAlign: "center" }}>
          Amount Requested
        </div>
      ),
      selector: (row) => <div>&#8377; {row.amount}</div>,
      // width: "100px",
      style: { display: "flex", justifyContent: "center" },
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
        height: "130px",
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
  useEffect(() => {
    const result = transactions.filter((transaction) => {
      return transaction?.order_id
        ?.toLocaleLowerCase()
        .match(search?.toLocaleLowerCase());
    });
    setFilteredTransactions(result);
  }, [search, transactions]);
  return (
    <Card>
      <Row justify="space-evenly" align="top">
        <Col xs={24} sm={24} md={13} lg={15}>
          <Row justify="space-between" align="middle">
            <Col>
              <Typography.Title level={4} style={{ marginLeft: 10 }}>
                <span className="text-muted"> ORDER : </span>
                {transaction.order_id}
              </Typography.Title>
            </Col>{" "}
            <Col>
              <Typography.Title level={4} style={{ marginLeft: 10 }}>
                {transaction.business_name}
              </Typography.Title>
            </Col>
            <Row
              className="rowgap-vbox"
              gutter={[12, 0]}
              align="stretch"
              justify="space-around"
            >
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                <Card
                  loading={statsLoading}
                  bordered={false}
                  className="criclebox "
                  style={{ height: "100%" }}
                >
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={18}>
                        <span>{"Total Sales"}</span>
                        {/* <Title level={3}>&#8377; {topStats.totalSales}</Title> */}
                        <Title level={3}>&#8377; {payStats.totalSales}</Title>
                      </Col>
                      <Col xs={5} sm={5}>
                        <div className="icon-box">
                          <FaIndianRupeeSign
                            fontSize={24}
                            style={{ marginTop: -6 }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                <Card
                  loading={statsLoading}
                  bordered={false}
                  className="criclebox "
                  style={{ height: "100%" }}
                >
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={18}>
                        <span>{"Total Amount Checked Out"}</span>
                        {/* <Title level={3}>&#8377;{topStats.weeklySales}</Title> */}
                        <Title level={3}>&#8377;{payStats.checkedOut}</Title>
                      </Col>
                      <Col xs={5} sm={5}>
                        <div className="icon-box">
                          <FaIndianRupeeSign
                            fontSize={24}
                            style={{ marginTop: -10 }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                <Card
                  loading={statsLoading}
                  bordered={false}
                  className="criclebox "
                  style={{ height: "100%" }}
                >
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={18}>
                        <span>{"Current Balance"}</span>
                        {/* <Title level={3}>&#8377;{topStats.weeklySales}</Title> */}
                        <Title level={3}>
                          &#8377;{payStats.currentBalance}
                        </Title>
                      </Col>
                      <Col xs={5} sm={5}>
                        <div className="icon-box">
                          <FaIndianRupeeSign
                            fontSize={24}
                            style={{ marginTop: -10 }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                <Card
                  loading={statsLoading}
                  bordered={false}
                  className="criclebox "
                  style={{ height: "100%" }}
                >
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={18}>
                        <span>{"Checkout Amount Requested"}</span>
                        {/* <Title level={3}>&#8377;{topStats.weeklySales}</Title> */}
                        <Title level={3}>&#8377;{transaction.amount}</Title>
                      </Col>
                      <Col xs={5} sm={5}>
                        <div className="icon-box">
                          <FaIndianRupeeSign
                            fontSize={24}
                            style={{ marginTop: -10 }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
              {transaction.status === "pending" && (
                <>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    className="mb-24"
                  >
                    <Card
                      loading={statsLoading}
                      bordered={false}
                      className="criclebox "
                      style={{ height: "100%" }}
                    >
                      <Row>
                        <Col span={24}>
                          <div className="number">
                            <span>Update Payment</span>
                          </div>
                        </Col>
                      </Row>
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
                        <Row align="stretch" justify="space-evenly">
                          <Col
                            xs={23}
                            sm={23}
                            md={10}
                            lg={11}
                            xl={11}
                            style={{ marginTop: 10 }}
                          >
                            <Form.Item
                              name="transactionID"
                              rules={[
                                {
                                  required: true,
                                  message: "Transaction ID required!",
                                },
                              ]}
                              validateTrigger="onBlur"
                            >
                              <Input
                                placeholder="Transaction ID"
                                value={transactionID}
                                onChange={(e) =>
                                  setTransactionID(e.target.value)
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col
                            style={{ marginTop: 10, marginLeft: 10 }}
                            xs={23}
                            sm={23}
                            md={10}
                            lg={10}
                            xl={10}
                          >
                            <Form.Item
                              style={{ height: "100%", width: "100%" }}
                            >
                              <Popconfirm
                                title="Are you sure you want to Update Payment?"
                                onConfirm={() => form.submit()}
                                okText="Yes"
                                cancelText="No"
                                okButtonProps={{
                                  style: {
                                    height: 40,
                                    background: "#86c61f",
                                    color: "white",
                                  },
                                  loading: buttonLoading,
                                }}
                                cancelButtonProps={{
                                  style: { height: 40 },
                                  type: "default",
                                }}
                              >
                                <Button
                                  type="primary"
                                  // className="float-end"
                                  loading={buttonLoading}
                                  style={{ height: "100%", width: "100%" }}
                                  icon={
                                    <BsCreditCard2FrontFill fontSize={18} />
                                  }
                                >
                                  Approve Payment
                                </Button>
                              </Popconfirm>
                            </Form.Item>
                          </Col>

                          {errorMessage && (
                            <Col span={24}>
                              <Form.Item>
                                <Alert
                                  message={errorMessage}
                                  type="error"
                                  showIcon
                                  closable
                                  onClose={() => setErrorMessage("")}
                                />
                              </Form.Item>
                            </Col>
                          )}
                          {successMessage && (
                            <Col span={24}>
                              <Form.Item>
                                <Alert
                                  message={successMessage}
                                  type="success"
                                  showIcon
                                  closable
                                  onClose={() => setSuccessMessage("")}
                                />
                              </Form.Item>
                            </Col>
                          )}
                        </Row>
                      </Form>
                    </Card>
                  </Col>{" "}
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    className="mb-24"
                  >
                    <Card
                      loading={statsLoading}
                      bordered={false}
                      className="criclebox "
                      style={{ height: "100%" }}
                    >
                      <Row>
                        <Col span={24}>
                          <div className="number">
                            <span>Deny Payment</span>
                          </div>
                        </Col>
                      </Row>
                      <Form
                        form={denyform}
                        name="basic"
                        labelCol={{ span: 5 }}
                        initialValues={{ remember: true }}
                        onFinish={denyPayment}
                        onFinishFailed={denyPaymentFailed}
                        className="row-col"

                        // encType="multipart/form-data"
                      >
                        <Row align="stretch" justify="space-evenly">
                          <Col
                            xs={23}
                            sm={23}
                            md={14}
                            lg={14}
                            xl={14}
                            style={{ marginTop: 10 }}
                          >
                            <Form.Item
                              name="denyReason"
                              rules={[
                                {
                                  required: true,
                                  message: "Denial Reason is Required!",
                                },
                              ]}
                              validateTrigger="onBlur"
                            >
                              <Input.TextArea
                                placeholder="Denial Reason"
                                value={newDenialReason}
                                onChange={(e) =>
                                  setNewDenialReason(e.target.value)
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col
                            style={{ marginTop: 10, marginLeft: 10 }}
                            xs={23}
                            sm={23}
                            md={8}
                            lg={8}
                            xl={8}
                          >
                            <Form.Item
                              style={{ height: "100%", width: "100%" }}
                            >
                              <Popconfirm
                                title="Are you sure you want to Deny this Payment?"
                                onConfirm={() => denyform.submit()}
                                okText="Yes"
                                cancelText="No"
                                okButtonProps={{
                                  style: {
                                    height: 40,
                                    background: "#c9383a",
                                    color: "white",
                                  },
                                  loading: denyButtonLoading,
                                }}
                                cancelButtonProps={{
                                  style: { height: 40 },
                                  type: "default",
                                }}
                              >
                                <Button
                                  type="primary"
                                  // className="float-end"
                                  danger
                                  loading={denyButtonLoading}
                                  style={{ height: "100%", width: "100%" }}
                                  icon={
                                    <BsCreditCard2FrontFill fontSize={18} />
                                  }
                                >
                                  Deny
                                </Button>
                              </Popconfirm>
                            </Form.Item>
                          </Col>

                          {denyErrorMessage && (
                            <Col span={24}>
                              <Form.Item>
                                <Alert
                                  message={denyErrorMessage}
                                  type="error"
                                  showIcon
                                  closable
                                  onClose={() => setDenyErrorMessage("")}
                                />
                              </Form.Item>
                            </Col>
                          )}
                          {denySuccessMessage && (
                            <Col span={24}>
                              <Form.Item>
                                <Alert
                                  message={denySuccessMessage}
                                  type="success"
                                  showIcon
                                  closable
                                  onClose={() => setDenySuccessMessage("")}
                                />
                              </Form.Item>
                            </Col>
                          )}
                        </Row>
                      </Form>
                    </Card>
                  </Col>
                </>
              )}
            </Row>
            <Row justify="center" style={{ width: "100%" }}>
              <Col span={24}>
                <Card
                  loading={statsLoading}
                  bordered={false}
                  bodyStyle={{ paddingTop: 0 }}
                  className="header-solid h-full  ant-list-yes"
                >
                  <DataTable
                    columns={columns}
                    data={filteredTransactions}
                    customStyles={customStyles}
                    // selectableRows
                    // selectableRowsHighlight
                    highlightOnHover
                    title={
                      <h2
                        style={{
                          color: "#7cb028",
                          fontWeight: "bold",
                          marginTop: 20,
                          marginBottom: 0,
                        }}
                      >
                        {!appUser.is_super_admin
                          ? "All Transactions"
                          : " Vendor Transactions"}
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
                          placeholder="Search by OrderID "
                          style={{ width: "100%" }}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <p className="productsscrollformore">
                          {"Scroll for More -->"}
                        </p>
                      </div>
                    }
                    subHeaderAlign="right"
                  />
                </Card>
              </Col>
            </Row>
            <Modal
              title="Reason for Denial"
              open={denyReasonModalVisible}
              onCancel={() => setDenyReasonModalVisible("")}
              centered
              footer={null}
            >
              {denyReason}
            </Modal>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={7} lg={8}>
          <Row>
            <Typography.Title level={4} style={{ marginLeft: 10 }}>
              Vendor
            </Typography.Title>
            <Descriptions layout="vertical" bordered style={{ width: "100%" }}>
              <Descriptions.Item label="Name" span={2}>
                {transaction.business_name}
              </Descriptions.Item>
              <Descriptions.Item label="Phone" span={1}>
                +91 {transaction.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {transaction.email}
              </Descriptions.Item>
            </Descriptions>
          </Row>
          <Row>
            <Typography.Title
              level={4}
              style={{ marginLeft: 10, marginTop: 15 }}
            >
              Current Checkout Details
              {appUser.is_super_admin && (
                <Typography.Text
                  style={{ color: "#0ac20e", textTransform: "uppercase" }}
                >
                  &nbsp; [{transaction?.status}]
                </Typography.Text>
              )}
            </Typography.Title>
            <Descriptions layout="vertical" bordered style={{ width: "100%" }}>
              <Descriptions.Item label="Initiated On" span={2}>
                {new Date(transaction.created_at).toLocaleDateString(
                  "en-US",
                  dateOptions
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                {transaction.amount}
              </Descriptions.Item>
              <Descriptions.Item label="UPI Address" span={3}>
                {transaction.upi_address}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Payment Mode">
                {transaction[0]?.payment?.mode}
              </Descriptions.Item> */}

              <Descriptions.Item label="Transaction ID" span={3}>
                {transaction.transaction_id}
              </Descriptions.Item>
              <Descriptions.Item label="Paid Amount" span={1}>
                {transaction.status === "approved" && (
                  <span>&#8377; {transaction?.amount}</span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                {transaction.status === "approved" && (
                  <span
                    style={{
                      color: "green",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {transaction.status}
                  </span>
                )}
                {transaction.status === "denied" && (
                  <span
                    style={{
                      color: "red",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {transaction.status}
                  </span>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default CheckoutDetails;
