import React, { useCallback, useEffect, useState } from "react";
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
  Input,
  Avatar,
  Progress,
} from "antd";

import StarRatings from "react-star-ratings";
import {
  MinusOutlined,
  PlusOutlined,
  UserOutlined,
  EyeFilled,
  DeleteFilled,
} from "@ant-design/icons";
import vendorIcon from "../../../assets/images/vendorsIcon.png";
import brandIcon from "../../../assets/images/brandIcon.png";
import categoryIcon from "../../../assets/images/categoryIcon.png";
import LoadingScreen from "../../layout/LoadingScreen";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
import ProductReviewsModal from "./productReviewsModal";

function ShowProductDetails() {
  const [productDetails, setProductDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const { appUser, updateNumberOfCartItems } = useAllContext();
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [reviewButtonLoading, setReviewButtonLoading] = useState(false);
  const [deleteReviewButtonLoading, setDeleteReviewButtonLoading] =
    useState(false);
  const [allReviews, setAllReviews] = useState({});
  const [newReview, setNewReview] = useState({
    rating: 0,
    review: "",
  });
  // const productId = 29;
  // const { productId } = useParams();
  // console.log(productId);
  // const productId = props.match.params.id;
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const { Title, Paragraph, Text } = Typography; // console.log(productId);
  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };
  const handleRateChange = (event) => {
    setNewReview((prev) => {
      return { ...prev, rating: event };
    });
  };

  const fetchProductDetails = useCallback(async () => {
    setScreenLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/productdetails",
        { params: { productId: productId, userId: appUser.id } }
      );
      // console.log(response.data);
      setProductDetails(response.data);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        navigate("/404");
      } else {
        console.error(error);
      }
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/review/productreviews",
        { product_id: productId }
      );

      setAllReviews(response.data);
    } catch (reviewError) {
      console.error("review Error : ", reviewError);
    }
    setScreenLoading(false);
  }, [appUser.id, navigate, productId]);
  const handleNewReviewSubmit = async () => {
    // console.log(newReview);
    setReviewButtonLoading(true);
    try {
      const addReviewResponse = await axios.post(
        "http://localhost:5000/review/newreview",
        {
          ...newReview,
          user_id: appUser.id,
          product_id: productDetails.id,
        }
      );
      if (addReviewResponse.data) {
        message.success("Review Submitted");
        fetchProductDetails();
      } else message.error("Could'nt submit Review. Please try again ");
      setNewReview({ rating: 0, review: "" });
    } catch (err) {
      console.log(err);
      message.error("Could'nt submit Review. Please try again ");
    }

    setReviewButtonLoading(false);
  };
  const handleReviewDelete = async () => {
    setDeleteReviewButtonLoading(true);
    try {
      const deleteResponse = await axios.post(
        "http://localhost:5000/review/deletereview",
        { user_id: appUser.id, product_id: productId }
      );
      if (deleteResponse.data) {
        message.success("Review Deleted Successfully!");
        fetchProductDetails();
      } else {
        message.error("Failed to Delete Review. Please try again!");
      }
    } catch (err) {}
    setDeleteReviewButtonLoading(false);
  };
  // Fetch product details
  useEffect(() => {
    window.scroll(0, 0);
    fetchProductDetails();
  }, [navigate, productId, fetchProductDetails]);

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

  return (
    <Layout className="layout-default">
      <CommonNavbar handleSearch={handleSearch} />
      {screenLoading && <LoadingScreen />}
      {!screenLoading && (
        <Card
          style={{
            height: "100%",
            paddingLeft: "5%",
            paddingRight: "5%",
            marginTop: 10,
          }}
        >
          <Row justify="center" align="middle">
            <Col className="spd-col" xs={24} sm={12} md={8} lg={8} xl={8}>
              <Image
                style={{ maxWidth: "250px" }}
                src={imageUrl}
                alt="Product"
              />
            </Col>

            <Col className="spd-col" xs={24} sm={12} md={8} lg={8} xl={8}>
              <div>
                {productDetails ? (
                  <div>
                    <h1> {productDetails.name}</h1>
                    <div>
                      <StarRatings
                        rating={productDetails.avg_rating}
                        starRatedColor="#86c61f"
                        numberOfStars={5}
                        name="mainAvgRating"
                        starDimension="25px"
                        starSpacing="1px"
                      />
                      <strong>({productDetails.avg_rating?.toFixed(1)})</strong>
                    </div>
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
            </Col>
          </Row>

          <Row justify="space-evenly">
            <Col
              xs={24}
              sm={24}
              lg={8}
              xl={8}
              className="column-spd"
              style={{ paddingTop: 0 }}
              // style={{ background: "#f5f5f5", padding: 10 }}
            >
              {appUser.id &&
                productDetails.userReviewforProduct?.length !== 0 && (
                  <div>
                    <Title level={3}>Your Rating </Title>
                    <hr />
                    <div className="d-flex justify-content-start align-items-center">
                      <StarRatings
                        rating={productDetails.userReviewforProduct?.rating}
                        starRatedColor="#689125"
                        numberOfStars={5}
                        name="userRating"
                        starDimension="25px"
                        starSpacing="1px"
                      />
                      <strong>
                        (
                        {productDetails.userReviewforProduct?.rating?.toFixed(
                          1
                        )}
                        )
                      </strong>

                      <Button
                        icon={<DeleteFilled />}
                        type="link"
                        danger
                        loading={deleteReviewButtonLoading}
                        size="normal"
                        onClick={handleReviewDelete}
                      >
                        Delete
                      </Button>
                    </div>
                    <Paragraph
                      style={{ margin: 0, padding: 0 }}
                      ellipsis={{
                        rows: 3,
                        expandable: true,
                        symbol: "more",
                      }}
                    >
                      {productDetails.userReviewforProduct?.review}
                    </Paragraph>
                  </div>
                )}
              {appUser.id &&
                productDetails.userReviewforProduct?.length === 0 && (
                  <div>
                    <Title level={3}>Give Rating </Title>
                    <hr />
                    <Text>Overall Rating : </Text>{" "}
                    <StarRatings
                      rating={newReview?.rating}
                      changeRating={handleRateChange}
                      starRatedColor="#86c61f"
                      starHoverColor="#9dde35"
                      numberOfStars={5}
                      name="avgRating"
                      starDimension="25px"
                      starSpacing="1px"
                    />
                    <Input.TextArea
                      placeholder="Product Review"
                      rows={3}
                      value={newReview.review}
                      onChange={(e) => {
                        setNewReview((prev) => {
                          return { ...prev, review: e.target.value };
                        });
                      }}
                      style={{ marginTop: 10 }}
                    ></Input.TextArea>
                    <Button
                      type="primary"
                      loading={reviewButtonLoading}
                      style={{
                        marginLeft: "75%",
                        marginTop: 10,
                        width: "25%",
                      }}
                      onClick={() => handleNewReviewSubmit()}
                      disabled={newReview.rating === 0}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              <Row style={{ marginTop: appUser.id ? 20 : 0 }}>
                <Col>
                  <Title level={4}>Customer Ratings</Title>
                </Col>
              </Row>
              <hr />
              <div className="d-flex justify-content-start align-items-center ">
                <Row align="top">
                  <StarRatings
                    rating={productDetails.avg_rating}
                    starRatedColor="#86c61f"
                    numberOfStars={5}
                    name="avgRating"
                    starDimension="25px"
                    starSpacing="1px"
                  />
                  <Title level={4}>
                    &nbsp; {productDetails.avg_rating?.toFixed(1)} out of 5
                  </Title>
                </Row>
              </div>
              <Row>
                <Text>
                  <strong>{allReviews?.totalRating}</strong> Total Ratings
                </Text>
              </Row>
              <Row style={{ marginTop: 15 }}>
                <Col xs={6} sm={6}>
                  <Text> 5 Star</Text>
                </Col>
                <Col xs={18} sm={18}>
                  <Progress
                    strokeColor="#86c61f"
                    size={["100%", 15]}
                    percent={Math.round(
                      (allReviews.noOfRatings?.five / allReviews.totalRating) *
                        100
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 15 }}>
                <Col xs={6} sm={6}>
                  <Text> 4 Star</Text>
                </Col>
                <Col xs={18} sm={18}>
                  <Progress
                    strokeColor="#86c61f"
                    size={["100%", 15]}
                    percent={Math.round(
                      (allReviews.noOfRatings?.four / allReviews?.totalRating) *
                        100
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 15 }}>
                <Col xs={6} sm={6}>
                  <Text> 3 Star</Text>
                </Col>
                <Col xs={18} sm={18}>
                  <Progress
                    strokeColor="#86c61f"
                    size={["100%", 15]}
                    percent={Math.round(
                      (allReviews.noOfRatings?.three /
                        allReviews?.totalRating) *
                        100
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 15 }}>
                <Col xs={6} sm={6}>
                  <Text> 2 Star</Text>
                </Col>
                <Col xs={18} sm={18}>
                  <Progress
                    strokeColor="#86c61f"
                    size={["100%", 15]}
                    percent={Math.round(
                      (allReviews.noOfRatings?.two / allReviews?.totalRating) *
                        100
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 15 }}>
                <Col xs={6} sm={6}>
                  <Text> 1 Star</Text>
                </Col>
                <Col xs={18} sm={18}>
                  <Progress
                    strokeColor="#86c61f"
                    size={["100%", 15]}
                    percent={Math.round(
                      (allReviews.noOfRatings?.one / allReviews?.totalRating) *
                        100
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 15 }}>
                <Button
                  type="link"
                  icon={<EyeFilled />}
                  onClick={() => {
                    setIsReviewModalVisible(true);
                  }}
                >
                  View all reviews
                </Button>
                <ProductReviewsModal
                  isReviewModalVisible={isReviewModalVisible}
                  setIsReviewModalVisible={setIsReviewModalVisible}
                  allReviews={allReviews}
                />
              </Row>
            </Col>
            {allReviews.allreviews?.length > 0 &&
              allReviews.allreviews[0].review.length > 0 && (
                <Col xs={24} sm={24} lg={14} xl={14}>
                  <Title level={3}>All Reviews</Title>
                  <hr style={{ width: "100%" }} />
                  {allReviews.allreviews?.map((review, index) => {
                    return index < 4 && review.review.length ? (
                      <div style={{ marginTop: 30 }} key={`review${index}`}>
                        <Title level={5} style={{ margin: 0, padding: 0 }}>
                          <Avatar
                            icon={<UserOutlined />}
                            style={{ margin: "-4px 5px 0px 0px" }}
                          />
                          {review.username}
                        </Title>
                        <div style={{ marginLeft: 40 }}>
                          <Row align="middle">
                            {" "}
                            <Text strong>Rating : </Text>
                            <StarRatings
                              rating={review?.rating}
                              starRatedColor="#86c61f"
                              numberOfStars={5}
                              name="avgRating"
                              starDimension="25px"
                              starSpacing="1px"
                            />
                          </Row>
                          <Paragraph strong style={{ margin: 0, padding: 0 }}>
                            Review
                          </Paragraph>
                          <Paragraph
                            style={{ margin: 0, padding: 0 }}
                            ellipsis={{
                              rows: 3,
                              expandable: true,
                              symbol: "more",
                            }}
                          >
                            {review.review}
                          </Paragraph>
                        </div>
                      </div>
                    ) : null;
                  })}
                </Col>
              )}
          </Row>
        </Card>
      )}

      <Footer />
    </Layout>
  );
}

export default ShowProductDetails;
