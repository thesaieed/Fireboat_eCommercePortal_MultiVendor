import React, { useEffect, useState } from "react";
import axios from "axios";
import useAllContext from "../../../context/useAllContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Layout,
  message,
  Row,
  Typography,
  Descriptions,
  Image,
} from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import vendorIcon from "../../../assets/images/vendorsIcon.png";
import brandIcon from "../../../assets/images/brandIcon.png";
import categoryIcon from "../../../assets/images/categoryIcon.png";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";

function ShowProductDetails() {
  const [productDetails, setProductDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  // const [showFullDescription, setShowFullDescription] = useState(false);
  const [quantity, setQuantity] = useState(1);
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const { appUser, updateNumberOfCartItems } = useAllContext();
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);
  // const productId = 29;
  // const { productId } = useParams();
  // console.log(productId);
  // const productId = props.match.params.id;
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const { Title } = Typography; // console.log(productId);
  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };
  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/productdetails",
          { params: { id: productId } }
        );
        setProductDetails(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          navigate("/404");
        } else {
          console.error(error);
        }
      }
    };

    fetchProductDetails();
  }, [navigate, productId]);

  // Set image URL
  useEffect(() => {
    if (productDetails) {
      const imageSrc =
        "http://localhost:5000/" + productDetails.image.replace(/\\/g, "/");
      setImageUrl(imageSrc);
    }
  }, [productDetails]);

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // const handleAddToCart = async () => {
  //   try {
  //     await axios.post("http://localhost:5000/addtocart", {
  //       user_id: appUser.appUser.id,
  //       product_id: productId,
  //       quantity: quantity,
  //     });
  //     message.success("Added to cart");
  //   } catch (error) {
  //     console.error("Error adding product to cart:", error);
  //   }
  // };
  const handleAddToCart = async () => {
    setButtonLoading(true);
    if (!appUser || !appUser.id) {
      message.info("Please login to add products to the cart.");
      setButtonLoading(false);
      return;
    }
    if (appUser.is_admin) {
      message.info("Admin not Allowed to add to Cart Yet!");
      setButtonLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/addtocart", {
        user_id: appUser.id,
        product_id: productId,
        quantity: quantity,
      });
      message.success("Added to cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
    updateNumberOfCartItems();
    setButtonLoading(false);
  };

  // const showModal = () => {
  //   setIsModalVisible(true);
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };
  // console.log(productDetails);
  if (productDetails === null) {
    return <p>Loading</p>;
  }

  if (productDetails) {
    return (
      <Layout className="layout-default">
        <CommonNavbar handleSearch={handleSearch} />
        <Card style={{ height: "100%" }}>
          <Row justify="center" align="middle">
            <Col className="spd-col" xs={24} sm={12} md={8} lg={8} xl={8}>
              <Image
                style={{ maxWidth: "250px" }}
                src={imageUrl}
                alt="Product" /*onClick={showModal}*/
              />
            </Col>

            <Col className="spd-col" xs={24} sm={12} md={8} lg={8} xl={8}>
              <div>
                {productDetails ? (
                  <div>
                    <h1> {productDetails.name}</h1>
                    <span>Price:</span>
                    <strong> &#8377; {productDetails.price}</strong>
                    <Descriptions column={1} style={{ marginTop: 25 }}>
                      <Descriptions.Item>
                        <div>
                          <img
                            src={brandIcon}
                            alt="brandIcon"
                            style={{
                              height: 25,
                              width: 25,
                              marginRight: 5,
                            }}
                          />
                          {productDetails.brand}
                        </div>
                      </Descriptions.Item>
                      <Descriptions.Item>
                        <div>
                          <img
                            src={categoryIcon}
                            alt="categoryIcon"
                            style={{
                              height: 25,
                              width: 25,
                              marginRight: 5,
                            }}
                          />
                          {productDetails.category}
                        </div>
                      </Descriptions.Item>
                      <Descriptions.Item>
                        <div>
                          <img
                            src={vendorIcon}
                            alt="vendonIcon"
                            style={{
                              height: 25,
                              width: 25,
                              marginRight: 5,
                            }}
                          />
                          <span> {productDetails.vendor}</span>
                        </div>
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </Col>

            <Col className="spd-col" xs={24} sm={12} md={8} lg={8} xl={8}>
              <div className="quantity-container">
                <div className="quantity-section">
                  <p style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Quantity{" "}
                  </p>
                  <Button type="default" onClick={decrementQuantity}>
                    <MinusOutlined />
                  </Button>
                  <span style={{ padding: "5px" }}>{quantity}</span>
                  <Button type="default" onClick={incrementQuantity}>
                    <PlusOutlined />
                  </Button>
                </div>
                <Button
                  className="add-to-cart-button"
                  type="default"
                  onClick={handleAddToCart}
                  loading={buttonLoading}
                >
                  Add to Cart
                </Button>

                <Button type="primary" className="buy-now-button">
                  Buy Now
                </Button>
              </div>
            </Col>
          </Row>
          <Row style={{ padding: "20px 40px" }}>
            <Col
              className="column-spd"
              style={{ paddingTop: 0 }}
              // style={{ background: "#f5f5f5", padding: 10 }}
            >
              <Title level={3}>Description </Title>
              <hr />
              <div
                dangerouslySetInnerHTML={{ __html: productDetails.description }}
              ></div>
              {/* <Collapse items={items} defaultActiveKey={["1"]} /> */}
            </Col>
          </Row>
        </Card>

        <Footer />
      </Layout>
    );
  }
}

export default ShowProductDetails;
