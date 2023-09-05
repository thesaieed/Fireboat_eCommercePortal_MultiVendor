import React, { useCallback, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Form,
  message,
  Alert,
  Button,
  Popconfirm,
  InputNumber,
  Input,
  Tooltip,
  Modal,
  Avatar,
} from "antd";
import DataTable from "react-data-table-component";
import {
  PlusOutlined,
  CloseOutlined,
  ExclamationOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import useAllContext from "../../../../context/useAllContext";
import { FaIndianRupeeSign, FaRegAddressBook } from "react-icons/fa6";
import { BsCreditCard2FrontFill } from "react-icons/bs";
import axios from "axios";
const PaymentCheckout = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [payStats, setPayStats] = useState({
    totalSales: 0,
    checkedOut: 0,
    currentBalance: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [upiAddress, setUpiAddress] = useState("");
  const [denyReasonModalVisible, setDenyReasonModalVisible] = useState("");
  const [form] = Form.useForm();
  const { Title } = Typography;
  const [search, setSearch] = useState("");
  const { appUser, generateRandomString, api } = useAllContext();

  const getPaymentStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await axios.post(`${api}/payments/vendorpaymentstats`, {
        vendor_id: appUser.id,
      });
      const resTransactions = await axios.post(
        `${api}/payments/previoustransactions`,
        {
          vendor_id: appUser.id,
        }
      );
      setPayStats(data);
      setTransactions(resTransactions.data);
      setFilteredTransactions(resTransactions.data);
    } catch (error) {
      console.log(error);
    }
    setStatsLoading(false);
  }, [appUser.id, api]);

  const onFinish = async () => {
    setButtonLoading(true);
    if (
      checkoutAmount &&
      checkoutAmount <= payStats.currentBalance &&
      checkoutAmount > 0 &&
      upiAddress.length > 3
    ) {
      try {
        const order_id = generateRandomString(10);
        const { data } = await axios.post(
          `${api}/payments/initiatevendorpayment`,
          {
            checkoutAmount,
            upiAddress,
            vendor_id: appUser.id,
            order_id,
          }
        );
        setCheckoutAmount(0);
        if (data.status === 200) {
          setSuccessMessage(
            "Payment initiated Successfully. Please wait for us to approve your Request! "
          );
          form.resetFields();
        } else if (data.status === 403) {
          setErrorMessage(
            "Checkout Amount exceedes Current Balance or is Empty"
          );
        } else if (data.status === 500) {
          setErrorMessage("Server Error!");
        }
      } catch (error) {
        form.resetFields();
        console.log(error);
        message.error("Please Check the Field again!");
      }
    } else {
      setErrorMessage(
        "Checkout Amount should be greater than 0 and less than Current Balance and UPI Address should be Valid"
      );
    }
    getPaymentStats();
    setButtonLoading(false);
  };
  const onFinishFailed = (errorInfo) => {
    setErrorMessage("Something went wrong");
    // console.log("Failed", errorInfo);
  };

  useEffect(() => {
    getPaymentStats();
  }, [getPaymentStats]);
  var dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

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
            <strong style={{ fontSize: 14, fontWeight: 700 }}>
              {row.order_id}
            </strong>
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
    <>
      <Row
        className="rowgap-vbox"
        gutter={[12, 0]}
        align="stretch"
        justify="space-around"
      >
        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-24">
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
        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-24">
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
        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-24">
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
                  <Title level={3}>&#8377;{payStats.currentBalance}</Title>
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
      </Row>
      <Row
        className="rowgap-vbox"
        gutter={[12, 0]}
        align="stretch"
        justify="space-around"
      >
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card
            loading={statsLoading}
            bordered={false}
            className="criclebox "
            style={{ height: "100%" }}
          >
            <Row>
              <Col span={24}>
                <div className="number">
                  <span>Apply for Checkout</span>
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
              <Row align="stretch" justify="space-between">
                <Col
                  xs={23}
                  sm={23}
                  md={7}
                  lg={8}
                  xl={8}
                  style={{ marginTop: 10 }}
                >
                  <Form.Item
                    name="upi_address"
                    rules={[
                      {
                        //eslint-disable-next-line
                        pattern: /^[a-zA-Z0-9\.\-_]+@[a-zA-Z0-9]+$/,
                        message: "Enter Valid UPI Address",
                      },
                      {
                        required: true,
                        message: "UPI Address is Required",
                      },
                    ]}
                    validateTrigger="onBlur"
                  >
                    <Input
                      placeholder=" UPI Address to which amount should be sent"
                      type="text"
                      prefix={<FaRegAddressBook fontSize={16} />}
                      style={{
                        width: "100%",
                        height: 43,
                        display: "flex",
                        alignItems: "center",
                      }}
                      value={upiAddress}
                      onChange={(e) => setUpiAddress(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col
                  xs={23}
                  sm={23}
                  md={7}
                  lg={8}
                  xl={8}
                  style={{ marginTop: 10 }}
                >
                  <Form.Item
                    name="checkout_amount"
                    rules={[
                      {
                        pattern: /^(?:\d*)$/,
                        message: "Value should contain just number",
                      },
                      {
                        required: true,
                        message: "Amount is Required!",
                      },
                    ]}
                    validateTrigger="onBlur"
                  >
                    <InputNumber
                      placeholder="Checkout Amount"
                      type="number"
                      min={0}
                      prefix={<FaIndianRupeeSign />}
                      style={{
                        width: "100%",
                        height: 43,
                        display: "flex",
                        alignItems: "center",
                      }}
                      value={checkoutAmount}
                      onChange={(e) => setCheckoutAmount(e)}
                    />
                  </Form.Item>
                </Col>{" "}
                <Col
                  style={{ marginTop: 10 }}
                  xs={24}
                  sm={24}
                  md={8}
                  lg={6}
                  xl={6}
                >
                  <Form.Item style={{ height: "100%", width: "100%" }}>
                    <Popconfirm
                      title="Are you sure you want to Initiate Payment?"
                      onConfirm={() => form.submit()}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{
                        style: {
                          height: 40,
                          background: "#86c61f",
                          color: "white",
                        },
                      }}
                      style={{ width: "100%" }}
                      cancelButtonProps={{
                        style: { height: 40 },
                        type: "default",
                      }}
                      // disabled={
                      //   checkoutAmount === 0 ||
                      //   checkoutAmount === null ||
                      //   checkoutAmount > payStats.currentBalance
                      // }
                    >
                      <Button
                        type="primary"
                        // className="float-end"
                        loading={buttonLoading}
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                        icon={<BsCreditCard2FrontFill fontSize={18} />}
                        // disabled={
                        //   checkoutAmount === 0 ||
                        //   checkoutAmount === null ||
                        //   checkoutAmount > payStats.currentBalance
                        // }
                      >
                        Initiate Payment
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
        </Col>
      </Row>
      <Row justify="center">
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
                    : " Vendor Transactiion"}
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
    </>
  );
};

export default PaymentCheckout;
