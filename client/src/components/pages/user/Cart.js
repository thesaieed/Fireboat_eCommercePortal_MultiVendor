import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  DeleteFilled,
  PlusSquareFilled,
  MinusSquareFilled,
} from "@ant-design/icons";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
import { Content } from "antd/lib/layout/layout";
import brandIcon from "../../../assets/images/brandIcon.png";
import categoryIcon from "../../../assets/images/categoryIcon.png";
import { MdShoppingCartCheckout } from "react-icons/md";
function Cart() {
  const { appUser, updateNumberOfCartItems, isValidToken } = useAllContext();
  const [productData, setProductData] = useState([]);
  const { Paragraph, Title } = Typography;
  const [productLinks, setProductLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };
  useEffect(() => {
    if (!isValidToken && !appUser.id) {
      console.log("Login check");
      navigate("/auth/login");
      message.info("You need to be Logged In to access Cart!");
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // console.log(appUser.appUser.id)
      try {
        const response = await axios.get("http://localhost:5000/cart", {
          params: {
            id: appUser.id,
          },
        });
        const brandsRes = await axios.get("http://localhost:5000/brands");

        const data1 = response.data.data1; //id, product_id,quantity from cart table
        // console.log(data1);

        let data2 = response.data.data2; //name, price image,category from products table
        const productLinks = data2.map((prod) => {
          return `/product/?id=${prod.id}`;
        });
        setProductLinks(productLinks);
        // const data3 = response.data.data3;
        var products = [];
        data2.map((product) => {
          products.push({
            ...product,
            brand: brandsRes.data.find((brand) => {
              if (brand.id === product.brand_id) return true;
              else return false;
            }),
          });
          return null;
        });
        data2 = products;
        // console.log(data1)
        // console.log("data2", data2);
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
        // console.log("merged", mergedData);
        setProductData(mergedData);
        // console.log(productData)
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
      setLoading(false);
    };

    if (appUser.id) {
      fetchData();
    }
  }, [appUser.id]);

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

  const deleteItemFromCart = async (itemId, index) => {
    // console.log(index);
    try {
      // Make a DELETE request to your server API endpoint to delete the item from the cart
      await axios.delete(`http://localhost:5000/cart/${itemId}`);

      // Remove the deleted item from the productData state
      setProductData((prevData) =>
        prevData.filter((item) => item.id !== itemId)
      );
      setProductLinks((prevData) =>
        prevData.filter((item, linkIndex) => linkIndex !== index)
      );
      updateNumberOfCartItems();
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const handleClick = () => {
    navigate("/checkout", { state: { productData } });
  };

  return (
    <Layout className="layout-default">
      <CommonNavbar handleSearch={handleSearch} />
      <Content>
        <Card
          loading={loading}
          style={{ height: "100%", marginBottom: 0, paddingBottom: 0 }}
          bodyStyle={{ paddingBottom: 0 }}
        >
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ borderBottom: "1px solid lightgrey", paddingBottom: 10 }}
          >
            <h1>Shopping Cart</h1>
            <span>
              <ShoppingCartOutlined
                style={{ color: "#86c61f", fontSize: "3rem" }}
              />
            </span>
          </div>
          {productData.length === 0 && (
            <Title
              level={4}
              style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}
            >
              Your Cart is empty!
            </Title>
          )}

          {productData.map((item, index) => (
            <Row
              key={index}
              justify="start"
              align={"middle"}
              style={{
                position: "relative",
                paddingTop: 30,
                paddingBottom: 20,
                marginLeft: "5%",
                marginRight: "5%",
                marginTop: 10,
                borderBottom: "1px solid lightgrey",
              }}
              gutter={[15, 15]}
            >
              <div
                style={{
                  position: "absolute",
                  top: 5,
                  right: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "end",
                  zIndex: 10,
                }}
              >
                <div>
                  <MinusSquareFilled
                    onClick={() => decrementQuantity(index)}
                    style={{ fontSize: 22 }}
                  />
                  <span style={{ padding: "5px" }}>{item.quantity}</span>
                  <PlusSquareFilled
                    onClick={() => incrementQuantity(index)}
                    style={{ fontSize: 22 }}
                  />
                </div>
                <div
                  id="stickyAmount"
                  style={{
                    marginTop: 5,
                  }}
                >
                  <strong style={{ fontSize: 16 }}>
                    {" "}
                    &#8377;{item.price * item.quantity}
                  </strong>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 5,
                  right: 0,
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <Popconfirm
                  title="Are you sure you want to delete this item from the cart?"
                  onConfirm={() => deleteItemFromCart(item.id, index)}
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
                  <Button
                    danger
                    icon={<DeleteFilled style={{ fontSize: 18 }} />}
                    type="link"
                  />
                </Popconfirm>
              </div>
              <Col xs={22} sm={8} md={7} lg={6} xl={6}>
                <div className="d-flex justify-content-center">
                  <Image
                    style={{ maxWidth: "180px" }}
                    src={`http://localhost:5000/${item.image[0].replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt="ProductImg"
                  />
                </div>
              </Col>

              <Col xs={22} sm={12} md={10} lg={10} xl={10}>
                <div>
                  <Paragraph>
                    <Link to={productLinks[index]}>
                      <h5>{item.name}</h5>
                    </Link>
                    <p className="d-flex justify-content-between">
                      <span>Price: &#8377;{item.price}</span>
                      <span id="nonStickyAmount">
                        <strong style={{ fontSize: 16 }}>
                          {" "}
                          &#8377;{item.price * item.quantity}
                        </strong>
                      </span>
                    </p>
                    <p>
                      <img
                        src={brandIcon}
                        alt="brandIcon"
                        style={{
                          height: 20,
                          width: 20,
                          marginRight: 5,
                        }}
                      />
                      {item.brand.brand}
                    </p>
                    <p>
                      <img
                        src={categoryIcon}
                        alt="categoryIcon"
                        style={{
                          height: 22,
                          width: 22,
                          marginRight: 5,
                        }}
                      />
                      {item.category}
                    </p>
                  </Paragraph>
                </div>
              </Col>
              <Col xs={10} sm={10} md={2} lg={0} xl={0}></Col>
            </Row>
          ))}

          {productData.length > 0 && (
            <div
              className="cart-summary"
              style={{
                position: "sticky",
                bottom: 0,
                background: "#fafafa",
                marginBottom: 0,
                paddingLeft: "10%",
                paddingRight: "10%",
                zIndex: 20,
              }}
            >
              <h1>
                Total for{" "}
                <span className="spanItems">{calculateTotalItems()}</span> items{" "}
                <span className="spanCost">&#8377;{calculateSubtotal()}</span>
              </h1>
              <Button
                onClick={handleClick}
                type="primary"
                icon={<MdShoppingCartCheckout fontSize={18} />}
              >
                Proceed To Buy
              </Button>
            </div>
          )}
        </Card>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Cart;
