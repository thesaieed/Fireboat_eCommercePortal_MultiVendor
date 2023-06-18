import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAllContext from "../../../context/useAllContext";
import { Button, Card, Popconfirm, Modal, Layout } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
import { Content } from "antd/lib/layout/layout";
function Cart() {
  const appUser = useAllContext();
  const [productData, setProductData] = useState([]);

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
        const mergedData = data2.map((item, index) => ({
          ...item,
          id: data1[index]?.id,
          quantity: data1[index]?.quantity || 1,
        }));
        setProductData(mergedData);
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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(image);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <Layout className="layout-default">
      <CommonNavbar handleSearch={handleSearch} />
      <Content className="cart-content">
        <Card>
          <div className="cart-header">
            <h1>
              <ShoppingCartOutlined
                style={{ color: "orange", fontSize: "4rem" }}
              />
              Shopping Cart
            </h1>
          </div>
          {productData.map((item, index) => (
            <div className="cart-item" key={index}>
              <div
                className="image-container"
                onClick={() => openModal(item.image)}
              >
                <img
                  src={`http://localhost:5000/${item.image.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt="ProductImg"
                />
              </div>
              <Modal open={modalVisible} onCancel={closeModal} footer={null}>
                {selectedImage && (
                  <img
                    src={`http://localhost:5000/${selectedImage.replace(
                      /\\/g,
                      "/"
                    )}`}
                    className="enlarged-image"
                    alt="EnlargedProductImg"
                  />
                )}
              </Modal>
              <div className="product-details">
                <h3>Product: {item.name}</h3>
                <p>Price: {item.price}</p>
                <p>Category: {item.category}</p>
              </div>
              <div className="quantity-controls">
                <p>Quantity: </p>
                <button onClick={() => decrementQuantity(index)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => incrementQuantity(index)}>+</button>
              </div>
              <div className="delete-button">
                <Popconfirm
                  title="Are you sure you want to delete this item from the cart?"
                  onConfirm={() => deleteItemFromCart(item.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button className="DelFromCartButton" type="link">
                    Delete from Cart
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h1>
              Subtotal for{" "}
              <span className="spanItems">{calculateTotalItems()}</span> items{" "}
              <span className="spanCost">&#8377;{calculateSubtotal()}</span>
            </h1>
            <Button className="proceed-button">Proceed To Buy</Button>
          </div>
        </Card>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Cart;
