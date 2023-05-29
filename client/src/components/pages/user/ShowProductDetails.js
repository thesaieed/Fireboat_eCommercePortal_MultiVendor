import React, { useEffect, useState } from "react";
import axios from "axios";
import useAllContext from "../../../context/useAllContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Layout, message, Modal, Row } from "antd";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";

function ShowProductDetails() {
  const [productDetails, setProductDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const appUser = useAllContext();
  const navigate = useNavigate();
  // const productId = 29;
  // const { productId } = useParams();
  // console.log(productId);
  // const productId = props.match.params.id;
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  // console.log(productId);

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
    if (!appUser.appUser || !appUser.appUser.id) {
      message.info("Please login to add products to the cart.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/addtocart", {
        user_id: appUser.appUser.id,
        product_id: productId,
        quantity: quantity,
      });
      message.success("Added to cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
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
        <CommonNavbar />
        <Card className="show-productDetails-card">
          <Row className="row-spd">
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="column-spd">
              <div className="image-container">
                <img src={imageUrl} alt="Product" onClick={showModal} />
              </div>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="column-spd">
              <div className="spd">
                {productDetails ? (
                  <div className="details-content">
                    <h1>Product: {productDetails.name}</h1>
                    <p>Price: {productDetails.price}</p>
                    <p>Category: {productDetails.category}</p>

                    <div className="quantity-controls-spd">
                      <p>Quantity: </p>
                      <button onClick={decrementQuantity}>-</button>
                      <span>{quantity}</span>
                      <button onClick={incrementQuantity}>+</button>
                    </div>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="column-spd">
              <div className="div-buttons-spd">
                <div>
                  <Button
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </div>
                <div>
                  <Button className="buy-now-button">Buy Now</Button>
                </div>
              </div>
            </Col>
          </Row>
          <p className="description-spd">
            Description:{" "}
            {showFullDescription
              ? productDetails.description
              : productDetails.description.slice(0, 100) + "..."}
            {productDetails.description.length > 100 && (
              <span
                className="description-toggle"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? " See less" : " Read more"}
              </span>
            )}
          </p>
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
