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
  Modal,
  Row,
  Typography,
} from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";

function ShowProductDetails() {
  const [productDetails, setProductDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  // const [showFullDescription, setShowFullDescription] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  // console.log(productDetails);
  if (productDetails === null) {
    return <p>Loading</p>;
  }

  if (productDetails) {
    return (
      <Layout className="layout-default">
        <CommonNavbar handleSearch={handleSearch} />
        <Card className="show-productDetails-card">
          <Row className="row-spd" justify="space-around" align="top">
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="column-spd">
              {/* <div className="image-container"> */}
              <img src={imageUrl} alt="Product" onClick={showModal} />
              {/* </div> */}
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="column-spd">
              <div className="spd">
                {productDetails ? (
                  <div className="details-content">
                    <h1>Product: {productDetails.name}</h1>
                    <span>Price:</span>
                    <strong> &#8377; {productDetails.price}</strong>
                    <p>Category: {productDetails.category}</p>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={8}
              lg={8}
              xl={8}
              className="column-spd actionButtons-spd"
            >
              <div className="div-buttons-spd w-100 text-center">
                <div className="quantity-controls-spd d-flex justify-content-start ml-5 ">
                  <p style={{ marginRight: 10 }}>Quantity </p>
                  <Button type="default" onClick={decrementQuantity}>
                    <MinusOutlined />
                  </Button>
                  <span style={{ marginLeft: 10, marginRight: 10 }}>
                    {quantity}
                  </span>
                  <Button type="default" onClick={incrementQuantity}>
                    <PlusOutlined />
                  </Button>
                </div>
                <Button
                  className="add-to-cart-button"
                  type="primary"
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
          <Row className="row-spd" style={{ marginTop: 10 }}>
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
          {/* {showFullDescription
              ? productDetails.description
              : productDetails.description.slice(0, 150) + "..."}
            {productDetails.description.length > 150 && (
              <span
                className="description-toggle"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? " See less" : " Read more"}
              </span>
            )} */}
        </Card>
        <Modal open={isModalVisible} onCancel={handleCancel} footer={null}>
          <img src={imageUrl} alt="Product" />
        </Modal>
        <Footer />
      </Layout>
    );
  }
}

export default ShowProductDetails;
