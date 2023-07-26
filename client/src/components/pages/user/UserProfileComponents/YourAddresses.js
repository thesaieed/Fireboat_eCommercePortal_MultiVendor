import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Layout,
  Row,
  Col,
  message,
  Modal,
  Form,
  Select,
  Input,
  Button,
  Popconfirm,
} from "antd";
import CommonNavbar from "../../../layout/CommonNavbar";
import Footer from "../../../layout/Footer";
import "@splidejs/react-splide/css";
import useAllContext from "../../../../context/useAllContext";
import axios from "axios";
import { BiLocationPlus } from "react-icons/bi";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { BiSolidEditAlt, BiSolidPhone } from "react-icons/bi";
function YourAddresses() {
  const navigate = useNavigate();
  const { appUser } = useAllContext();
  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };
  const [addresses, setAddresses] = useState();
  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
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
  const isValidIndianPincode = (pincode) => {
    // Regular expression to match Indian PIN code format (6 digits)
    const pincodePattern = /^[1-9][0-9]{5}$/;
    return pincode === "" || pincodePattern.test(pincode);
  };
  const getAddresses = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/youraddresses", {
        params: {
          user_id: appUser.id,
        },
      });
      //   console.log(response.data);
      setAddresses(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [appUser.id]);
  useEffect(() => {
    if (!appUser.id) {
      message.info("You need to be Logged In!");
      navigate("/auth/login");
    }

    if (appUser.id !== null && appUser.id !== undefined) {
      getAddresses();
    }
  }, [appUser.id, getAddresses, navigate]);

  //editing address
  const handleEditAddress = (address) => {
    // console.log(address);
    setEditAddress(address);
    setShowModal(true);
    form.setFieldsValue({
      country: address.country,
      full_name: address.full_name,
      phone_number: address.phone_number,
      pincode: address.pincode,
      house_no_company: address.house_no_company,
      area_street_village: address.area_street_village,
      landmark: address.landmark,
      town_city: address.town_city,
      state: address.state,
    });
  };

  const handleEditModalOk = async () => {
    const values = form.getFieldsValue();
    values.id = appUser.id;
    try {
      const response = await axios.put(
        `http://localhost:5000/editshippingaddress/${editAddress.id}`,
        values
      );
      if (response.status === 200) {
        getAddresses();
        setShowModal(false);
        message.success("Address updated successfully");
      }
    } catch (error) {
      console.log(error);
      message.error("Server error");
    }
  };
  //new address adding
  const handleAddNewAddress = () => {
    setShowModal(true);
  };
  const handleModalCancel = () => {
    setShowModal(false);
    form.resetFields();
    setEditAddress("");
  };
  const handleModalOk = async () => {
    const values = form.getFieldsValue();
    values.id = appUser.id;
    try {
      const response = await axios.post(
        "http://localhost:5000/addshippingaddress",
        values
      );
      // console.log(response.status);
      if (response.status === 200) {
        getAddresses();
        setShowModal(false);
        message.success("Address added successfully");
      }
    } catch (error) {
      console.log(error);
      message.error("server error");
    }
  };
  const removeAddress = async (id) => {
    // console.log(id);
    try {
      // Make a DELETE request to your server API endpoint to delete the item from the cart
      const response = await axios.delete(
        `http://localhost:5000/removeaddress/${id}`
      );

      if (response.status === 200) {
        message.success("successfully removed address");
        getAddresses();
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      message.error("Server error in deleting address");
    }
  };

  return (
    <Layout className="layout-default">
      <CommonNavbar handleSearch={handleSearch} />
      <Card title="Your Addresses" style={{ minHeight: "85vh" }}>
        <Button
          onClick={handleAddNewAddress}
          type="primary"
          style={{ marginRight: 0 }}
        >
          <BiLocationPlus fontSize={18} /> Add New Address
        </Button>
        <Row>
          {addresses &&
            addresses.map((address, index) => (
              <Col
                key={`Col${address.id}`}
                xs={24}
                sm={12}
                md={8}
                lg={8}
                xl={8}
              >
                <Card
                  key={`Card${address.id}${index}`}
                  style={{ margin: "20px 20px 20px 0" }}
                >
                  <b>{address.full_name}</b>
                  <p style={{ marginBottom: "0px" }}>
                    {address.house_no_company},&nbsp;
                    {address.area_street_village}
                  </p>
                  <p style={{ marginBottom: "0px" }}>
                    {address.town_city},&nbsp;{address.state},&nbsp;
                    {address.pincode}
                  </p>
                  <p style={{ marginBottom: "0px" }}>{address.country}</p>
                  <p>
                    <BiSolidPhone fontSize={18} />
                    +91 {address.phone_number}
                  </p>
                  <div style={{ float: "right" }}>
                    <Button onClick={() => handleEditAddress(address)}>
                      <BiSolidEditAlt fontSize={16} />
                      Edit
                    </Button>
                    <Popconfirm
                      title="Are you sure you want to remove this address?"
                      onConfirm={() => removeAddress(address.id)}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{
                        style: {
                          height: 40,
                          // width: 40,
                          background: "#f53131",
                          color: "white",
                        },
                      }}
                      cancelButtonProps={{
                        style: { height: 40, width: 40 },
                        type: "default",
                      }}
                    >
                      <Button danger type="link">
                        <IoMdRemoveCircleOutline fontSize={16} />
                        Remove
                      </Button>
                    </Popconfirm>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
      </Card>
      <Modal
        title={
          editAddress ? (
            <>
              <BiLocationPlus />
              Edit Address
            </>
          ) : (
            <>
              <BiLocationPlus />
              Add New Address
            </>
          )
        }
        open={showModal}
        onOk={editAddress ? handleEditModalOk : handleModalOk}
        onCancel={handleModalCancel}
        okText={editAddress ? "Edit" : "Add"}
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
                rules={[{ required: true, message: "Please select a state" }]}
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
        </Form>
      </Modal>
      <Footer />
    </Layout>
  );
}

export default YourAddresses;
