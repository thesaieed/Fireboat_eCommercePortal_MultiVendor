import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../../layout/Footer";
import CommonNavbar from "../../../layout/CommonNavbar";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  List,
  Modal,
  Select,
  Alert,
  Button,
  theme,
  Layout,
  Steps,
  message,
} from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import DeliveryAddressDropdown from "./DeliveryAddressDropdown";
import PaymentModeDropdown from "./PaymentModeDropdown";
import ReviewItemsDropdown from "./ReviewItemsDropdown";
import useAllContext from "../../../../context/useAllContext";
import axios from "axios";

import payIcon from "../../../../assets/images/paymentIcon.png";

const isValidIndianPincode = (pincode) => {
  // Regular expression to match Indian PIN code format (6 digits)
  const pincodePattern = /^[1-9][0-9]{5}$/;
  return pincode === "" || pincodePattern.test(pincode);
};
const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [itemDetails, setItemDetails] = useState([]);
  const [discountPercentage] = useState(0);
  const [deliveryCharge] = useState(0); //for time being static
  const [totalPrice, setTotalPrice] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [address, setAddress] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState();

  //
  // after Payment
  const [searchParams] = useSearchParams();
  const paymentdone = JSON.parse(searchParams.get("paymentdone"));
  const status = searchParams.get("status");
  const txnid = searchParams.get("t");

  //order summary for cart items
  const location = useLocation();

  const productData = useMemo(
    () => location.state?.productData || [],
    [location.state?.productData]
  );

  // console.log(productData);

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
  ];
  const countries = ["India"];
  const [form] = Form.useForm();
  const { appUser, generateRandomString, isValidToken } = useAllContext();

  const fetchAddress = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/shippingaddress",
        {
          params: {
            id: appUser.id,
          },
        }
      );

      // console.log(response.data);
      setAddress(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [appUser.id]);
  const fetchQuantity = useCallback(async () => {
    try {
      const ids = productData.map((item) => item.id);
      const response = await axios.get("http://localhost:5000/checkout", {
        params: { ids },
      });
      const updatedQuantity = response.data;

      const updatedItemDetails = itemDetails.map((item) => {
        const matchingItem = updatedQuantity.find(
          (updatedItem) => updatedItem.id === item.id
        );
        if (matchingItem) {
          return {
            ...item,
            quantity: matchingItem.quantity,
            product_id: matchingItem.product_id,
          };
        }
        return item;
      });
      // console.log(updatedItemDetails);
      setItemDetails(updatedItemDetails);
    } catch (error) {
      console.error("server error", error);
    }
  }, [itemDetails, productData]);
  const handleUseAddress = () => {
    const userselectedaddress = address.find(
      (address) => address.id === selectedAddressId
    );
    if (address) {
      // Call the parent's handleSelectAddress only when the button is clicked
      handleSelectAddress(userselectedaddress);
    }
  };

  const updateQuantityInDatabase = async (itemId, quantity) => {
    try {
      await axios.put(`http://localhost:5000/cart/${itemId}`, { quantity });
    } catch (error) {
      console.error("server error", error);
    }
    fetchQuantity();
  };
  const handleIncrement = (index) => {
    setItemDetails((prevItemDetails) => {
      const updatedItemDetails = [...prevItemDetails];
      updatedItemDetails[index].quantity += 1;
      // console.log(updatedItemDetails[index].quantity);
      updateQuantityInDatabase(
        updatedItemDetails[index].id,
        updatedItemDetails[index].quantity
      );
      return updatedItemDetails;
    });
  };
  const handleDecrement = (index) => {
    setItemDetails((prevItemDetails) => {
      const updatedItemDetails = [...prevItemDetails];
      if (updatedItemDetails[index].quantity > 1) {
        updatedItemDetails[index].quantity -= 1;
      }

      updateQuantityInDatabase(
        updatedItemDetails[index].id,
        updatedItemDetails[index].quantity
      );
      return updatedItemDetails;
    });
  };

  //finalising order checkout

  const handleAddNewAddress = () => {
    setShowModal(true);
  };
  const handleModalOk = async () => {
    // try {
    //   // Validate the form fields
    //   await form.validateFields();

    // Form submission logic here (if the form is valid)
    const values = form.getFieldsValue();
    values.id = appUser.id;
    try {
      const response = await axios.post(
        "http://localhost:5000/addshippingaddress",
        values
      );
      // console.log(response.status);
      if (response.status === 200) {
        fetchAddress();
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Server error");
    }
    // } catch (error) {
    //   console.error("Form validation failed:", error);
    //   setErrorMessage("Form validation failed");
    // }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    form.resetFields();
  };
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    // console.log(address);
    // setShowDeliveryDropdown(false);
    // setShowPaymentDropdown(true)
  };
  useEffect(() => {
    if (!isValidToken && !appUser.id) {
      navigate("/auth/login");
      message.info("You need to be Logged In to Checkout from Cart!");
    }
  });
  //end for cart summary
  useEffect(() => {
    if (paymentdone === true) setCurrent(2);
    if (productData) {
      setItemDetails(productData);
    }
  }, [productData, paymentdone, status]);

  // console.log(itemDetails);

  useEffect(() => {
    if (itemDetails.length > 0) {
      fetchQuantity();
    }
    // eslint-disable-next-line
  }, [itemDetails.length]);

  useEffect(() => {
    const totalCost = itemDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(totalCost);
  }, [itemDetails]);
  useEffect(() => {
    if (appUser.id) {
      fetchAddress();
    }
  }, [appUser.id, fetchAddress]);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: "Delivery Address",
      content: (
        <DeliveryAddressDropdown
          addresses={address}
          onAddNewAddress={handleAddNewAddress}
          onSelectAddress={handleSelectAddress}
          selectedAddress={selectedAddress}
          setSelectedAddressId={setSelectedAddressId}
          selectedAddressId={selectedAddressId}
        />
      ),
    },
    {
      title: "Review Order",
      content: (
        <ReviewItemsDropdown
          itemDetails={itemDetails}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      ),
    },
    {
      title: "Payment",
      content: (
        <PaymentModeDropdown
          status={status}
          paymentdone={paymentdone}
          address={address}
          itemDetails={itemDetails}
          txnid={txnid}
          appUser={appUser}
        />
      ),
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    // lineHeight: "260px",
    // textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorSuccess}`,
    marginTop: 16,
  };
  const navigate = useNavigate();
  const { Content } = Layout;

  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
    window.location.reload();
  };
  const data = [
    <>
      Items <span style={{ float: "right" }}>&#8377;{totalPrice}</span>
    </>,
    <>
      Delivery <span style={{ float: "right" }}>&#8377;{deliveryCharge}</span>
    </>,
    <>
      Total
      <span style={{ float: "right" }}>
        &#8377;{totalPrice + deliveryCharge}
      </span>
    </>,
    <>
      Discount
      <strong style={{ float: "right" }}>
        -&#8377;
        {Math.floor((totalPrice + deliveryCharge) * (discountPercentage / 100))}
      </strong>
    </>,
    <>
      <h3 style={{ color: token.colorPrimaryBorder, width: "100%" }}>
        Order Total{" "}
        <span style={{ float: "right" }}>
          &#8377;
          {totalPrice +
            deliveryCharge -
            Math.floor(
              (totalPrice + deliveryCharge) * (discountPercentage / 100)
            )}
        </span>
      </h3>
    </>,
  ];

  const getPaymentData = async () => {
    setLoading(true);
    const products = itemDetails.map((item) => {
      return {
        productID: item.product_id,
        quantity: item.quantity,
        amount: item.price * item.quantity,
        vendor_id: item.vendor_id,
      };
    });
    var transactionID = generateRandomString(10);
    var orderID = generateRandomString(7);
    transactionID = `${transactionID}${Date.now()}`;
    var { id, name, email } = appUser;
    try {
      const getdata = await axios.post(
        "http://localhost:5000/payments/initpayment",
        {
          user_id: id,
          products,
          transactionID,
          orderID,
          fullname: name,
          address_id: selectedAddress.id,
          email,
          phone: selectedAddress.phone_number,
          amount: Number(
            totalPrice +
              deliveryCharge -
              Math.floor(
                (totalPrice + deliveryCharge) * (discountPercentage / 100)
              )
          ).toFixed(2),
        }
      );
      if (getdata.data?.url?.length) {
        setPaymentFormData({
          url: getdata.data.url,
          data: getdata.data.data,
        });
        setLoading(false);

        return true;
      } else {
        setPaymentFormData({});
        setLoading(false);
        return false;
      }

      // console.log(paymentRes);
    } catch (error) {
      console.log(error);
      setPaymentFormData({});
      setLoading(false);
      return false;
    }
  };
  return (
    <Layout className="layout-default ">
      <CommonNavbar handleSearch={handleSearch} />

      <Layout className="layout-default ">
        <Content style={{ padding: 16, overflow: "auto" }}>
          <Row justify="space-evenly" align="top">
            <Col xs={23} sm={23} md={15}>
              <Card
                loading={loading}
                title="Checkout"
                headStyle={{ textAlign: "center", fontSize: 22 }}
              >
                <Steps current={current} items={items} />
                <div style={contentStyle}>{steps[current].content}</div>
                <div
                  style={{
                    marginTop: 24,
                    textAlign: "end",
                  }}
                >
                  {/* {current < steps.length - 1 && current > 0 && (
                      <Button type="primary" onClick={() => next()}>
                        Next
                      </Button>
                    )} */}
                  {current === 0 && (
                    <Button
                      type="primary"
                      onClick={() => {
                        handleUseAddress();
                        next();
                      }}
                      disabled={!selectedAddressId}
                      style={{ marginTop: "10px" }}
                    >
                      Use this Address
                    </Button>
                  )}

                  {/* {current === steps.length - 1 && (
                      <Button
                        type="primary"
                        onClick={() => message.success("Processing complete!")}
                      >
                        Done
                      </Button>
                    )} */}
                  {current > 0 && !paymentdone && (
                    <Button
                      style={{
                        margin: "0 8px",
                      }}
                      onClick={() => prev()}
                    >
                      Go Back
                    </Button>
                  )}
                  {current === 2 && paymentdone && (
                    <Button
                      type="primary"
                      style={{
                        margin: "0 8px",
                      }}
                      onClick={() => navigate("/orders")}
                    >
                      My Orders
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
            {!paymentdone && (
              <Col xs={23} sm={23} md={8}>
                <List
                  loading={loading}
                  style={{
                    background: "#fff",
                    borderRadius: 4,
                    border: "1px solid #ededed",
                  }}
                  header={
                    <div
                      style={{
                        margin: "14px 0",
                        fontWeight: 700,
                        fontSize: 20,
                        fontFamily: "Nunito",
                        textAlign: "center",
                      }}
                    >
                      Order Summary
                    </div>
                  }
                  footer={null}
                  bordered
                  dataSource={data}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
                {current === 1 && (
                  <Button
                    loading={loading}
                    block
                    style={{ marginTop: 10, height: 55 }}
                    onClick={async () => {
                      const gotData = await getPaymentData();
                      if (gotData) next();
                      else
                        message.error(
                          "Couldn't Complete the request, please try again!"
                        );
                    }}
                    type="primary"
                    icon={<img src={payIcon} alt="icon" height={35} />}
                  >
                    Continue to Payment
                  </Button>
                )}
                {current === 2 && !paymentdone && (
                  <form action={paymentFormData?.url} method="post">
                    <input
                      type="hidden"
                      name="key"
                      value={paymentFormData?.data.key}
                    />
                    <input
                      type="hidden"
                      name="txnid"
                      value={paymentFormData?.data.txnid}
                    />
                    <input
                      type="hidden"
                      name="productinfo"
                      value={paymentFormData?.data.productinfo}
                    />
                    <input
                      type="hidden"
                      name="amount"
                      value={paymentFormData?.data.amount}
                    />
                    <input
                      type="hidden"
                      name="email"
                      value={paymentFormData?.data.email}
                    />
                    <input
                      type="hidden"
                      name="firstname"
                      value={paymentFormData?.data.firstname}
                    />
                    <input
                      type="hidden"
                      name="surl"
                      value={paymentFormData?.data.surl}
                    />
                    <input
                      type="hidden"
                      name="furl"
                      value={paymentFormData?.data.furl}
                    />
                    <input
                      type="hidden"
                      name="phone"
                      value={paymentFormData?.data.phone}
                    />
                    <input
                      type="hidden"
                      name="hash"
                      value={paymentFormData?.data.hash}
                    />
                    {paymentFormData.url?.length && (
                      <Button
                        loading={payLoading}
                        block
                        style={{ marginTop: 10, height: 55 }}
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                          setPayLoading(true);
                        }}
                        icon={<img src={payIcon} alt="icon" height={35} />}
                      >
                        Pay Now
                      </Button>
                    )}
                  </form>
                )}
              </Col>
            )}
          </Row>

          {/* modal for adding new address */}
          <Modal
            title="Add New Address"
            open={showModal}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
          >
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 24 }}
              className="row-col"
              layout="verticle"
            >
              <Form.Item
                label="Country"
                name="country"
                rules={[
                  { required: true, message: "Please select a country!" },
                ]}
              >
                <Select
                  placeholder="Select a Country"
                  className="ant-input"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={countries.map((country) => {
                    return { value: country, label: country };
                  })}
                ></Select>
              </Form.Item>
              <Form.Item
                label="Full Name"
                name="full_name"
                rules={[
                  {
                    required: true,
                    message: "Please input a valid name!",
                    pattern: /^[A-Za-z][A-Za-z0-9\s]*$/,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone Number"
                name="phone_number"
                rules={[
                  {
                    min: 10,
                    max: 10,
                    required: true,
                    message: "Please input valid phone number",
                    pattern: /^[9876]\d{9}$/,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Row>
                <Col span={12} style={{ paddingRight: "2px" }}>
                  <Form.Item
                    label="Pincode"
                    name="pincode"
                    rules={[
                      {
                        required: true,
                        message: "Please enter correct pincode",
                      },

                      {
                        validator: (_, value) =>
                          isValidIndianPincode(value)
                            ? Promise.resolve()
                            : Promise.reject(
                                "Enter a Valid 6 digit Indian Zip or postal code"
                              ),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ paddingLeft: "2px" }}>
                  <Form.Item
                    label="Flat/House No./Company"
                    name="house_no_company"
                    rules={[
                      {
                        required: true,
                        message: "Please input Flat/House No./Company name",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} style={{ paddingRight: "2px" }}>
                  <Form.Item
                    label="Area/Street/Village"
                    name="area_street_village"
                    rules={[
                      {
                        required: true,
                        message: "Please input Area/Street/Village address",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ paddingLeft: "2px" }}>
                  <Form.Item
                    label="Landmark"
                    name="landmark"
                    rules={[
                      { required: true, message: "Please input a landmark" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col style={{ paddingRight: "2px" }} span={12}>
                  <Form.Item
                    label="Town/City"
                    name="town_city"
                    rules={[
                      {
                        required: true,
                        message: "Please input your valid town/city name!",
                        pattern: /^[A-Za-z]+$/,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col style={{ paddingLeft: "2px" }} span={12}>
                  <Form.Item
                    label="State"
                    name="state"
                    rules={[
                      { required: true, message: "Please select a state" },
                    ]}
                  >
                    <Select
                      className="ant-input"
                      placeholder="Select a state"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={states.map((state) => {
                        return { value: state, label: state };
                      })}
                    ></Select>
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
            </Form>
          </Modal>
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default Checkout;
