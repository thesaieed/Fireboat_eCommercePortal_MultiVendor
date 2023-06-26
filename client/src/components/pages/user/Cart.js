import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAllContext from "../../../context/useAllContext";
import {
  Button,
  Card,
  Popconfirm,
  Layout,
  Row,
  Col,
  Typography,
  Image,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
import { Content } from "antd/lib/layout/layout";
function Cart() {
  const appUser = useAllContext();
  const [productData, setProductData] = useState([]);
  const [Paragraph] = [Typography];
  const navigate = useNavigate();
  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      // console.log(appUser.appUser.id)
      try {
        const response = await axios.get("http://localhost:5000/cart", {
          params: {
            id: appUser.appUser.id,
          },
        });

        const data1 = response.data.data1; //id, product_id,quantity from cart table
        const data2 = response.data.data2; //name, price image,category from products table
        // const data3 = response.data.data3;
        // console.log(data1)
        // console.log(data2)
        // console.log(data3)
        const mergedData = data2.map((item) => {
          const matchingData1Item = data1.find(
            (data1Item) => data1Item.product_id === item.id
          );

          return {
            ...item,
            id: matchingData1Item?.id || item.id,
            quantity: matchingData1Item?.quantity || 1,
          };
        });
        setProductData(mergedData);
        // console.log(productData)
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    if (appUser.appUser.id) {
      fetchData();
    }
  }, [appUser.appUser.id]);

  const incrementQuantity = (index) => {
    setProductData((prevData) => {
      const newData = [...prevData];
      const item = newData[index];
      if (item?.quantity && item.quantity < 10) {
        const updatedItem = {
          ...item,
          quantity: item.quantity + 1,
        };
        newData[index] = updatedItem;
        // console.log(updatedItem.id)
        updateQuantityInDatabase(updatedItem.id, updatedItem.quantity);
      }
      return newData;
    });
  };

  const decrementQuantity = (index) => {
    setProductData((prevData) => {
      const newData = [...prevData];
      const item = newData[index];
      if (item?.quantity && item.quantity > 1) {
        const updatedItem = {
          ...item,
          quantity: item.quantity - 1,
        };
        newData[index] = updatedItem;
        updateQuantityInDatabase(updatedItem.id, updatedItem.quantity);
      }
      return newData;
    });
  };

  const updateQuantityInDatabase = async (itemId, quantity) => {
    try {
      await axios.put(`http://localhost:5000/cart/${itemId}`, { quantity });
      // console.log("Quantity updated in the database");
    } catch (error) {
      console.error("Error updating quantity in the database:", error);
    }
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    productData.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    return subtotal;
  };

  const calculateTotalItems = () => {
    let totalItems = 0;
    productData.forEach((item) => {
      totalItems += item.quantity;
    });
    return totalItems;
  };

  const deleteItemFromCart = async (itemId) => {
    try {
      // Make a DELETE request to your server API endpoint to delete the item from the cart
      await axios.delete(`http://localhost:5000/cart/${itemId}`);

      // Remove the deleted item from the productData state
      setProductData((prevData) =>
        prevData.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  // const [modalVisible, setModalVisible] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const openModal = (image) => {
  //   setSelectedImage(image);
  //   setModalVisible(image);
  //   setModalVisible(true);
  // };
  // const closeModal = () => {
  //   setModalVisible(false);
  // };
  const handleClick = () => {
    navigate("/checkout");
  };

  return (
    <Layout className="layout-default">
      <CommonNavbar handleSearch={handleSearch} />
      <Content>
        <Card style={{ height: "100%" }}>
          <div className="cart-header">
            <h1>
              <ShoppingCartOutlined
                style={{ color: "orange", fontSize: "4rem" }}
              />
              Shopping Cart
            </h1>
          </div>
          {productData.map((item, index) => (
            <div className="cart-container" key={index}>
              <Row justify="center" align={"middle"}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <div className="cart-col">
                    <Image
                      style={{ maxWidth: "180px" }}
                      src={`http://localhost:5000/${item.image.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt="ProductImg"
                    />
                  </div>
                </Col>

                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <div className="cart-col">
                    <Paragraph>
                      <h3>Product: {item.name}</h3>
                      <p>Price: {item.price}</p>
                      <p>Category: {item.category}</p>
                      <p>Quantity: </p>
                      <Button onClick={() => decrementQuantity(index)}>
                        -
                      </Button>
                      <span style={{ padding: "2px" }}>{item.quantity}</span>
                      <Button onClick={() => incrementQuantity(index)}>
                        +
                      </Button>
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <div className="cart-col">
                    <Popconfirm
                      title="Are you sure you want to delete this item from the cart?"
                      onConfirm={() => deleteItemFromCart(item.id)}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{
                        style: {
                          height: 40,
                          width: 40,
                          background: "#f53131",
                          color: "white",
                        },
                      }}
                      cancelButtonProps={{
                        style: { height: 40, width: 40 },
                        type: "default",
                      }}
                    >
                      <Button className="cart-delete-button" type="danger">
                        Delete from Cart
                      </Button>
                    </Popconfirm>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
          <div className="cart-summary">
            <h1>
              Subtotal for{" "}
              <span className="spanItems">{calculateTotalItems()}</span> items{" "}
              <span className="spanCost">&#8377;{calculateSubtotal()}</span>
            </h1>
            <Button onClick={handleClick} type="primary">
              Proceed To Buy
            </Button>
          </div>
        </Card>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Cart;
