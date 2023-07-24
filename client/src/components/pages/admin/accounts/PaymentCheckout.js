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
  List,
  Avatar,
  InputNumber,
  Input,
  Tooltip,
  Modal,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  ExclamationOutlined,
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
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [upiAddress, setUpiAddress] = useState("");
  const [denyReasonModalVisible, setDenyReasonModalVisible] = useState("");
  const [form] = Form.useForm();
  const { Title } = Typography;
  const { appUser } = useAllContext();

  const getPaymentStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/payments/vendorpaymentstats",
        {
          vendor_id: appUser.id,
        }
      );
      const resTransactions = await axios.post(
        "http://localhost:5000/payments/previoustransactions",
        {
          vendor_id: appUser.id,
        }
      );
      setPayStats(data);
      setTransactions(resTransactions.data);
    } catch (error) {
      console.log(error);
    }
    setStatsLoading(false);
  }, [appUser.id]);

  const onFinish = async () => {
    setButtonLoading(true);
    if (
      checkoutAmount &&
      checkoutAmount <= payStats.currentBalance &&
      checkoutAmount > 0 &&
      upiAddress.length > 3
    ) {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/payments/initiatevendorpayment",
          {
            checkoutAmount,
            upiAddress,
            vendor_id: appUser.id,
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
  const newest = transactions.map((transaction) => {
    if (transaction.status === "approved") {
      return {
        avatar: <PlusOutlined style={{ fontSize: 14 }} />,
        title: `Approved on  ${new Date(
          transaction.modified_at
        ).toLocaleDateString("en-US", dateOptions)}`,
        description: (
          <span>
            <div>
              Initiated on{" "}
              {new Date(transaction.created_at).toLocaleDateString(
                "en-US",
                dateOptions
              )}
            </div>
            <div>Transaction ID : {transaction.transaction_id}</div>
          </span>
        ),
        amount: transaction.amount,
        textclass: "text-fill",
        amountcolor: "text-success",
      };
    } else if (transaction.status === "pending") {
      return {
        avatar: <ExclamationOutlined style={{ fontSize: 16 }} />,
        title: "Approval Pending",
        description: `Initiated on ${new Date(
          transaction.created_at
        ).toLocaleDateString("en-US", dateOptions)}`,
        amount: transaction.amount,
        textclass: "text-light-danger",
        amountcolor: "text-light-danger-amount",
      };
    } else if (transaction.status === "denied") {
      return {
        avatar: <CloseOutlined style={{ fontSize: 14, color: "red" }} />,
        title: (
          <span className="d-flex align-items-center justify-content-start">
            Denied on
            <span style={{ marginLeft: 4 }}>
              {new Date(transaction.modified_at).toLocaleDateString(
                "en-US",
                dateOptions
              )}
            </span>
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
                  setDenyReason(transaction.denyreason);
                  setDenyReasonModalVisible(true);
                }}
              />
            </Tooltip>
          </span>
        ),
        description: `Initiated on ${new Date(
          transaction.created_at
        ).toLocaleDateString("en-US", dateOptions)}`,
        amount: transaction.amount,
        textclass: "fill-danger",
        amountcolor: "text-danger",
      };
    } else {
      return null;
    }
  });

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
            title={<h6 className="font-semibold m-0">Your Transactions</h6>}
          >
            <List
              header={<h6>NEWEST</h6>}
              className="transactions-list ant-newest"
              itemLayout="horizontal"
              dataSource={newest}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar size="small" className={item.textclass}>
                        {item.avatar}
                      </Avatar>
                    }
                    title={item.title}
                    description={item.description}
                  />
                  <div className="amount">
                    <span className={item.amountcolor}>
                      {" "}
                      &#8377; {item.amount}
                    </span>
                  </div>
                </List.Item>
              )}
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