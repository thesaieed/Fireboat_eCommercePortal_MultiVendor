import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Tooltip,
  Modal,
  Select,
  Alert,
  Button,
  message,
} from "antd";
import DeliveryAddressDropdown from "./DeliveryAddressDropdown";
import PaymentModeDropdown from "./PaymentModeDropdown";
import ReviewItemsDropdown from "./ReviewItemsDropdown";
import useAllContext from "../../../../context/useAllContext";
import axios from "axios";
const isValidIndianPincode = (pincode) => {
  // Regular expression to match Indian PIN code format (6 digits)
  const pincodePattern = /^[1-9][0-9]{5}$/;
  return pincode === "" || pincodePattern.test(pincode);
};
function CheckOut() {
  const [itemDetails, setItemDetails] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [deliveryCharge, setDeliveryCharge] = useState(100); //for time being static
  const [totalPrice, setTotalPrice] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState("");
  const paymentOptions = ["Credit or Debit Card", "UPI", "Cash on Delivery"];
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [address, setAddress] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(true);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showReviewItems, setShowReviewItems] = useState(false);

  //order summary for cart items
  const location = useLocation();
  const productData = location.state?.productData || [];
  // console.log(productData);

  //end for cart summary
  useEffect(() => {
    if (productData) {
      setItemDetails(productData);
    }
  }, [productData]);

  // console.log(itemDetails);

  useEffect(() => {
    const fetchQuantity = async () => {
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
            return { ...item, quantity: matchingItem.quantity };
          }
          return item;
        });
        // console.log(updatedItemDetails);
        setItemDetails(updatedItemDetails);
      } catch (error) {
        console.error("server error", error);
      }
    };

    if (itemDetails.length > 0) {
      fetchQuantity();
    }
  }, [itemDetails.length]);

  useEffect(() => {
    const totalCost = itemDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(totalCost);
  }, [itemDetails]);
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

  const { Option } = Select;
  const [form] = Form.useForm();
  const { appUser } = useAllContext();

  const fetchAddress = async () => {
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
  };

  useEffect(() => {
    if (appUser.id) {
      fetchAddress();
    }
  }, [appUser]);

  const updateQuantityInDatabase = async (itemId, quantity) => {
    try {
      await axios.put(`http://localhost:5000/cart/${itemId}`, { quantity });
    } catch (error) {
      console.error("server error", error);
    }
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
  const handlePlaceOrder = async () => {
    console.log("Order placed");
    console.log("productDetails", itemDetails);
    console.log("addressDetails", selectedAddress);
    console.log("paymentDetils", paymentDetails);
  };

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
    setShowDeliveryDropdown(false);
    setShowPaymentDropdown(true);
  };

  const handleSelectPaymentMode = (mode) => {
    setSelectedPaymentMode(mode);
    // console.log(mode);
    if (mode === "Credit or Debit Card") {
      setShowCardDetailsModal(true);
    } else if (mode === "UPI") {
      setShowUpiModal(true);
    } else {
      handleCOD(mode);
      // console.log(mode);
    }
  };
  const handleCOD = async (mode) => {
    // console.log(mode);
    setPaymentDetails(mode);
    setShowPaymentDropdown(false);
    setShowReviewItems(true);
  };

  const handleCreditCardDetails = async () => {
    const values = form.getFieldValue();
    // console.log(values);
    setPaymentDetails(values);
    setShowCardDetailsModal(false);
    form.resetFields();
    setShowPaymentDropdown(false);
    setShowReviewItems(true);
  };
  const handleVerifyUpi = async () => {
    const values = await form.validateFields(["upiId"]);
    // console.log(values);
    setPaymentDetails(values);
    form.resetFields();
    setShowUpiModal(false);
    setShowPaymentDropdown(false);
    setShowReviewItems(true);
    message.success("upi verified");
  };
  // const handleUseAddress = () => {
  //   // Implement the logic to use the selected address
  //   console.log("Selected Address:", selectedAddress);
  //   console.log("selected Payment Method", selectedPaymentMethod);
  // };
  return (
    <>
      <Row gutter={5}>
        <Col xs={24} sm={24} xl={5} lg={5}>
          <h2>Alsaleels.in</h2>
        </Col>
        <Col xs={24} sm={24} xl={10} lg={10}>
          <h1 style={{ textAlign: "center" }}>CheckOut</h1>
        </Col>
      </Row>
      <Card style={{ padding: "20px" }}>
        <Row>
          <Col xs={24} sm={24} xl={16} lg={16}>
            <h2>
              <ol>
                {/* Delivery Address section */}
                <li
                  onClick={() => setShowDeliveryDropdown(!showDeliveryDropdown)}
                  style={{ cursor: "pointer" }}
                >
                  <Tooltip>
                    Delivery Address{" "}
                    {selectedAddress && (
                      <p>
                        <span>{selectedAddress.full_name}</span>
                        <br />
                        <span>
                          {selectedAddress.house_no_company},
                          <span>{selectedAddress.area_street_village}</span>
                        </span>
                        <br />
                        <span>
                          {selectedAddress.town_city}, {selectedAddress.state}
                        </span>
                        <br />
                        <span>{selectedAddress.pincode}</span>
                      </p>
                    )}{" "}
                  </Tooltip>
                </li>
                <hr />
                {/* Conditional rendering of DeliveryAddressDropdown */}
                {showDeliveryDropdown && (
                  <DeliveryAddressDropdown
                    addresses={address}
                    onAddNewAddress={handleAddNewAddress}
                    onSelectAddress={handleSelectAddress}
                    selectedAddress={selectedAddress}
                  />
                )}

                <li
                  onClick={() =>
                    selectedAddress &&
                    setShowPaymentDropdown(!showPaymentDropdown)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <Tooltip>
                    Payment Mode <br />
                    <p>
                      {paymentDetails && (
                        <>
                          {paymentDetails.cardNumber && (
                            <>
                              <span>{paymentDetails.cardNumber}</span>
                              <br />
                            </>
                          )}
                          {paymentDetails.cardHolder && (
                            <>
                              <span>{paymentDetails.cardHolder}</span>
                              <br />
                            </>
                          )}
                          {paymentDetails.expiryDate && (
                            <>
                              <span>{paymentDetails.expiryDate}</span>
                              <br />
                            </>
                          )}
                          {paymentDetails.upiId && (
                            <>
                              <span> {paymentDetails.upiId}</span>
                              <br />
                            </>
                          )}
                          {paymentDetails === "Cash on Delivery" && (
                            <>
                              <span>{paymentDetails}</span>
                              <br />
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </Tooltip>
                </li>
                <hr />
                {/* Conditional rendering of PaymentModeDropdown */}
                {showPaymentDropdown && (
                  <PaymentModeDropdown
                    paymentOptions={paymentOptions}
                    onSelectPaymentMode={handleSelectPaymentMode}
                    selectedPaymentMode={selectedPaymentMode}
                  />
                )}
                <li
                  onClick={() =>
                    paymentDetails && setShowReviewItems(!showReviewItems)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <Tooltip>Review Items and Delivery</Tooltip>
                </li>
                <hr />
                {/* conditional rendering of ReviewitemsDropdown*/}
                {showReviewItems && (
                  <ReviewItemsDropdown
                    itemDetails={itemDetails}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    placeOrder={handlePlaceOrder}
                  />
                )}
              </ol>
            </h2>
          </Col>

          <Col
            xs={24}
            sm={24}
            xl={8}
            lg={8}
            style={{ position: "sticky", top: "20px" }}
          >
            <div
              style={{ position: "sticky", top: "20px", marginLeft: "20px" }}
            >
              <Card
                style={{ margin: "0px 15px", backgroundColor: "whitesmoke" }}
              >
                <h2> Order Summary</h2>
                <hr />
                <ul style={{ padding: "5px" }}>
                  <li>
                    items:{" "}
                    <span style={{ float: "right" }}>&#8377;{totalPrice}</span>
                  </li>
                  <li>
                    Delivery:{" "}
                    <span style={{ float: "right" }}>
                      &#8377;{deliveryCharge}
                    </span>{" "}
                  </li>
                  <li>
                    Total:{" "}
                    <span style={{ float: "right" }}>
                      &#8377;{totalPrice + deliveryCharge}
                    </span>{" "}
                  </li>
                  <li>
                    Discount:{" "}
                    <span style={{ float: "right" }}>
                      -&#8377;
                      {Math.floor(
                        (totalPrice + deliveryCharge) *
                          (discountPercentage / 100)
                      )}
                    </span>
                  </li>
                </ul>
                <hr />
                <h2 style={{ color: "red" }}>
                  Order Total{" "}
                  <span style={{ float: "right" }}>
                    &#8377;
                    {totalPrice +
                      deliveryCharge -
                      Math.floor(
                        (totalPrice + deliveryCharge) *
                          (discountPercentage / 100)
                      )}
                  </span>
                </h2>
                <hr />
              </Card>
            </div>
          </Col>
        </Row>
      </Card>
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
            rules={[{ required: true, message: "Please select a country!" }]}
          >
            <Select placeholder="Select a Country" className="ant-input">
              {countries.map((country) => (
                <Option key={country} value={country}>
                  {country}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              { required: true, message: "Please input your phone number" },
              {
                min: 10,
                max: 10,
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
                  { required: true, message: "Please enter correct pincode" },

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
                rules={[{ required: true, message: "Please input a landmark" }]}
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
                    message: "Please input your town/city name!",
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
                rules={[{ required: true, message: "Please select a state" }]}
              >
                <Select className="ant-input" placeholder="Select a state">
                  {states.map((state) => (
                    <Option key={state} value={state}>
                      {state}
                    </Option>
                  ))}
                </Select>
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

      <Modal
        title={<div className="custom-modal">Credit or Debit Card Details</div>}
        open={showCardDetailsModal}
        onCancel={() => setShowCardDetailsModal(false)}
        onOk={handleCreditCardDetails}
        width="700px"
      >
        <hr></hr>
        <Row style={{ marginLeft: "16px" }}>
          <Col span={20}>
            <Form
              labelCol={{ span: 6 }}
              labelAlign="left"
              form={form}
              name="cardDetails"
            >
              <Form.Item
                name="cardNumber"
                label="Card Number"
                rules={[
                  { required: true, message: "Please enter your card number" },
                  {
                    pattern: /^\d{16}$/,
                    message: "Card number must be 16 digits",
                  },
                ]}
              >
                <Input placeholder="Enter your 16-digit card number" />
              </Form.Item>
              <Form.Item
                name="cardHolder"
                label="Card Holder"
                rules={[
                  {
                    required: true,
                    message: "Please enter the card holder's name",
                  },
                ]}
              >
                <Input placeholder="Enter the card holder's name" />
              </Form.Item>
              <Form.Item
                name="expiryDate"
                label="Expiry Date"
                rules={[
                  {
                    required: true,
                    message: "Please enter the card's expiry date",
                  },
                  {
                    pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
                    message: "Expiry date must be in the format MM/YY",
                  },
                ]}
              >
                <Input placeholder="Enter expiry date in the format MM/YY" />
              </Form.Item>
              <Form.Item
                name="cvv"
                label="CVV"
                rules={[
                  { required: true, message: "Please enter the CVV code" },
                  { len: 3, message: "CVV must be 3 digits" },
                ]}
              >
                <Input.Password placeholder="Enter the 3-digit CVV" />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <hr></hr>
      </Modal>
      <Modal
        title="Enter your Upi id"
        open={showUpiModal}
        onCancel={() => setShowUpiModal(false)}
        // onOk={handleVerifyUpi}
        width="500px"
        footer={null}
      >
        <hr></hr>
        <Form labelCol={{ span: "7" }} form={form} name="upi id">
          <Row>
            <Col span={15}>
              <Form.Item
                name="upiId"
                label="UPI ID"
                rules={[
                  { required: true, message: "Please enter your UPI ID" },
                  {
                    /* Add any additional validation rules if needed */
                  },
                ]}
              >
                <Input placeholder="Enter your UPI ID" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item>
                <Button
                  style={{ marginLeft: "30px" }}
                  type="primary"
                  onClick={handleVerifyUpi}
                >
                  Verify
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default CheckOut;
