import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Typography, Layout, Card, Button, message } from "antd";

import { DownOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
import LoadingScreen from "../../layout/LoadingScreen";
import useAllContext from "../../../context/useAllContext";

// import Carousel from "react-grid-carousel";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import brandIcon from "../../../assets/images/brandIcon.png";
import categoryIcon from "../../../assets/images/categoryIcon.png";
import { PiShootingStarFill } from "react-icons/pi";

const Home = () => {
  const { appUser, updateNumberOfCartItems } = useAllContext();
  const [suggestedProducts, setSuggestedProducts] = useState();
  const [responseStatus, setResponseStatus] = useState();
  const [allProducts, setAllProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity] = useState(1);

  const navigate = useNavigate();

  const { Paragraph, Title, Text } = Typography;
  const { Content } = Layout;
  const baseImgUrl = "http://localhost:5000/";

  //quick buy
  const handleQuickBuy = async (productId) => {
    if (!appUser || !appUser.id) {
      message.info("Please login for quick buy");
      setLoading(false);
      return;
    }
    if (appUser.is_admin) {
      message.info("Admin not allowed this feature");
      return;
    }

    try {
      await axios.post("http://localhost:5000/addtocart", {
        user_id: appUser.id,
        product_id: productId,
        quantity: quantity,
      });
      navigate("/cart");
    } catch (error) {
      console.error("Error in quick buy:", error);
    }
    updateNumberOfCartItems();
  };

  //fetch suggested products
  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      // console.log(productDetails.brand_id);
      try {
        const response = await axios.get(
          "http://localhost:5000/searchproducts",
          {
            params: {
              user_id: appUser.id,
            },
          }
        );
        // console.log(response.status);
        // console.log(response.data);
        setSuggestedProducts(response.data);
        setResponseStatus(response.status);
      } catch (error) {
        console.error(error);
      }
    };
    if (appUser) {
      fetchSuggestedProducts();
    }
  }, [appUser.id, appUser]);

  const getHomeData = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/homedata");
      // console.log(data.homeData);
      const brands = await axios.get("http://localhost:5000/brands");
      setBrands(brands.data);
      setAllProducts(data.homeData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getHomeData();
  }, []);

  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };
  const suggestedRow = (categoryObject) => {
    const products = categoryObject;
    const key =
      responseStatus === 201 ? "Top Rated Products" : "Items You May Like";
    if (!products.length) return null;
    else {
      return (
        <>
          <hr style={{ margin: "0px 40px" }}></hr>
          <Row
            key={`RowMain${key}`}
            style={{
              background: "#fff",
              marginTop: 20,
              marginRight: 0,
              padding: 0,
            }}
          >
            <Col
              xs={24}
              sm={6}
              md={4}
              lg={3}
              style={{
                display: "flex",
                alignItems: "stretch",
                justifyContent: "center",
                margin: 0,
                padding: 0,
              }}
              className="homeRowColumn categoryColHome"
            >
              <div
                key={`CardMain${key}`}
                className="d-flex flex-column align-items-center justify-content-center"
                // hoverable
                id="categoryNameCard"
                style={{
                  margin: 10,
                  marginRight: 0,
                  minWidth: "100%",
                  overflow: "hidden",
                }}
              >
                <PiShootingStarFill fontSize={80} style={{ rotate: "45deg" }} />
                <span
                  id="categoryName"
                  // className="one-line"
                  style={{
                    fontWeight: 500,
                    color: "#000",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginRight: 0,
                    overflowWrap: "anywhere",
                    textAlign: "center",
                  }}
                >
                  {key}
                </span>
              </div>
            </Col>
            <Col
              xs={24}
              sm={18}
              md={20}
              lg={21}
              className="homeRowColumn"
              style={{ marginRight: 0, padding: 0 }}
            >
              <Splide
                key={`CarouselMain${key}`}
                aria-label="CategoryProducts"
                options={{
                  rewind: true,
                  autoWidth: true,
                  gap: 4,
                  pagination: false,
                }}
                className="splide"
              >
                {products.map((product, index) => {
                  if (index > 8) return null;
                  return (
                    <SplideSlide key={`Carousel${key}${index}`}>
                      <Card
                        key={`Card${key}${index}`}
                        className="productContainer"
                        // onClick={() => {
                        //   navigate(`/product/?id=${product.id}`);
                        //   window.scroll(0, 0);
                        // }}
                        style={{ width: 300, margin: 10, marginRight: 0 }}
                      >
                        <img
                          // width="100%"
                          className="productImg"
                          style={{ minWidth: 200, height: 200, maxWidth: 200 }}
                          alt="productImage"
                          src={baseImgUrl + product.image[0]}
                        />
                        <Row>
                          <Link to={`/product/?id=${product.id}`}>
                            <Title className="one-line" level={5}>
                              {product.name}
                            </Title>
                          </Link>
                        </Row>
                        <Row>
                          <Paragraph
                            strong
                            type="secondary"
                            // level={5}
                            className="d-flex one-line"
                            style={{ margin: 0, padding: 2 }}
                          >
                            <img
                              src={brandIcon}
                              alt="brandIcon"
                              style={{
                                height: 20,
                                width: 20,
                                marginRight: 3,
                              }}
                            />
                            {product.brand}
                          </Paragraph>
                        </Row>
                        <Row style={{ marginTop: 2 }}>
                          <Paragraph
                            style={{ margin: 0, padding: 2 }}
                            type="secondary"
                            className="m-0 p-0 d-flex one-line"
                          >
                            <img
                              src={categoryIcon}
                              alt="categoryIcon"
                              style={{
                                height: 24,
                                width: 24,
                                marginRight: 3,
                              }}
                            />
                            {product.category}
                          </Paragraph>
                        </Row>

                        <Row style={{ marginTop: 14 }}>
                          <div>
                            <StarRatings
                              rating={product.avg_rating}
                              starRatedColor="#86c61f"
                              numberOfStars={5}
                              name="mainAvgRating"
                              starDimension="20px"
                              starSpacing="1px"
                            />
                            <strong> ({product.avg_rating.toFixed(1)}) </strong>
                          </div>
                        </Row>
                        <Row
                          style={{ marginTop: 6 }}
                          align="middle"
                          justify="space-between"
                        >
                          <Col>
                            <Paragraph
                              className="productPrice"
                              style={{ margin: 0, padding: 0 }}
                            >
                              &#8377; {product.price}
                            </Paragraph>
                          </Col>
                          <Col>
                            <Button
                              onClick={() => handleQuickBuy(product.id)}
                              type="primary"
                              shape="round"
                              icon={<ThunderboltOutlined />}
                            >
                              Quick Buy
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    </SplideSlide>
                  );
                })}
              </Splide>
            </Col>
          </Row>
        </>
      );
    }
  };
  const categoryRow = (categoryObject) => {
    // console.log(categoryObject);
    const key = Object.keys(categoryObject)[0];
    const products = Object.values(categoryObject)[0];
    // console.log(key, " products :", products);
    if (!products.length) return null;
    else {
      return (
        <Row
          key={`RowMain${key}`}
          style={{
            background: "#fff",
            marginTop: 20,
            marginRight: 0,
            padding: 0,
          }}
        >
          <Col
            xs={24}
            sm={6}
            md={4}
            lg={3}
            style={{
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
              margin: 0,
              padding: 0,
            }}
            className="homeRowColumn categoryColHome"
          >
            <div
              key={`CardMain${key}`}
              className="d-flex flex-column align-items-center justify-content-center"
              // hoverable
              id="categoryNameCard"
              onClick={() =>
                navigate(`/browse/?search=categoryProducts&category=${key}`)
              }
              style={{
                margin: 10,
                marginRight: 0,
                minWidth: "100%",
              }}
            >
              <img src={categoryIcon} alt="categoryIcon"></img>
              <span
                id="categoryName"
                className="one-line"
                style={{
                  fontWeight: 500,
                  color: "#000",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginRight: 0,
                }}
              >
                {key}
              </span>
            </div>
          </Col>
          <Col
            xs={24}
            sm={18}
            md={20}
            lg={21}
            className="homeRowColumn"
            style={{ marginRight: 0, padding: 0 }}
          >
            <Splide
              key={`CarouselMain${key}`}
              aria-label="CategoryProducts"
              options={{
                rewind: true,
                autoWidth: true,
                gap: 4,
                pagination: false,
              }}
              className="splide"
            >
              {products.map((product, index) => {
                if (index > 4) return null;
                return (
                  <SplideSlide key={`Carousel${key}${index}`}>
                    <Card
                      key={`Card${key}${index}`}
                      className="productContainer"
                      // onClick={() => {
                      //   navigate(`/product/?id=${product.id}`);
                      //   window.scroll(0, 0);
                      // }}
                      style={{ width: 300, margin: 10, marginRight: 0 }}
                    >
                      <img
                        // width="100%"
                        className="productImg"
                        style={{ minWidth: 200, height: 200, maxWidth: 200 }}
                        alt="productImage"
                        src={baseImgUrl + product.image[0]}
                      />
                      <Row>
                        <Link to={`/product/?id=${product.id}`}>
                          <Title className="one-line" level={5}>
                            {product.name}
                          </Title>
                        </Link>
                      </Row>
                      <Row>
                        <Paragraph
                          strong
                          type="secondary"
                          // level={5}
                          className="d-flex one-line"
                          style={{ margin: 0, padding: 2 }}
                        >
                          <img
                            src={brandIcon}
                            alt="brandIcon"
                            style={{
                              height: 20,
                              width: 20,
                              marginRight: 3,
                            }}
                          />
                          {brands.map((brand) => {
                            return brand.id === product.brand_id
                              ? brand.brand
                              : null;
                          })}
                        </Paragraph>
                      </Row>
                      <Row style={{ marginTop: 2 }}>
                        <Paragraph
                          style={{ margin: 0, padding: 2 }}
                          type="secondary"
                          className="m-0 p-0 d-flex one-line"
                        >
                          <img
                            src={categoryIcon}
                            alt="categoryIcon"
                            style={{
                              height: 24,
                              width: 24,
                              marginRight: 3,
                            }}
                          />
                          {product.category}
                        </Paragraph>
                      </Row>

                      <Row style={{ marginTop: 14 }}>
                        <div>
                          <StarRatings
                            rating={product.avg_rating}
                            starRatedColor="#86c61f"
                            numberOfStars={5}
                            name="mainAvgRating"
                            starDimension="20px"
                            starSpacing="1px"
                          />
                          <strong> ({product.avg_rating.toFixed(1)}) </strong>
                        </div>
                      </Row>
                      <Row
                        style={{ marginTop: 6 }}
                        align="middle"
                        justify="space-between"
                      >
                        <Col>
                          <Paragraph
                            className="productPrice"
                            style={{ margin: 0, padding: 0 }}
                          >
                            &#8377; {product.price}
                          </Paragraph>
                        </Col>
                        <Col>
                          <Button
                            onClick={() => handleQuickBuy(product.id)}
                            type="primary"
                            shape="round"
                            icon={<ThunderboltOutlined />}
                          >
                            Quick Buy
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </SplideSlide>
                );
              })}
            </Splide>
          </Col>
        </Row>
      );
    }
  };
  return (
    <Layout className="layout-default m-0 p-0 ">
      {loading ? (
        <LoadingScreen />
      ) : (
        <Content>
          <section id="homeMainSection">
            <CommonNavbar handleSearch={handleSearch} />
            <div className="mainHeading">
              <Title
                level={1}
                id="homeMainTitle"
                style={{ margin: 0, padding: 0, letterSpacing: 35 }}
              >
                NILE
              </Title>
              <Text id="homeMainText">ONE STOP FOR YOUR STATIONARY</Text>
            </div>
            <div id="homeBrowseButtonContainer">
              <Button
                type="default"
                id="homeBrowseProductButton"
                onClick={() => navigate("/browse/?search=allProducts")}
              >
                BROWSE PRODUCTS
              </Button>
            </div>
            <div>
              <DownOutlined id="homeDownArrow" />
            </div>
          </section>
          {suggestedProducts !== undefined && suggestedProducts.length > 0 && (
            <>{suggestedRow(suggestedProducts)}</>
          )}
          {allProducts.map((categoryObject) => {
            //{Pencil: Array[...]}
            return categoryRow(categoryObject);
          })}
        </Content>
      )}

      <Footer />
    </Layout>
  );
};
export default Home;
