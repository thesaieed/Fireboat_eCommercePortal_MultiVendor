import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Typography, Layout, Card, Button } from "antd";

import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
import LoadingScreen from "../../layout/LoadingScreen";

import Carousel from "react-grid-carousel";

import brandIcon from "../../../assets/images/brandIcon.png";
import categoryIcon from "../../../assets/images/categoryIcon.png";

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { Paragraph, Title, Text } = Typography;
  const { Content } = Layout;
  const baseImgUrl = "http://localhost:5000/";

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
          // gutter={[24, 0]}
          justify="start"
          align="middle"
          style={{
            marginBottom: 20,
            maxWidth: "100%",
            flexWrap: "nowrap",
            padding: 5,
            // background: "lightblue",
          }}
        >
          <Card
            key={`CardMain${key}`}
            className="d-flex align-items-center justify-content-center"
            hoverable
            id="categoryNameCard"
            onClick={() =>
              navigate(`/browse/?search=categoryProducts&category=${key}`)
            }
          >
            <Row className="d-flex  justify-content-center align-items-center">
              <Title
                className="one-line"
                level={5}
                style={{
                  height: "100%",
                }}
              >
                {key}
              </Title>
            </Row>
          </Card>

          <Carousel
            key={`CarouselMain${key}`}
            cols={5}
            rows={1}
            gap={10}
            mobileBreakpoint={500}
            responsiveLayout={[
              { breakpoint: 1380, cols: 4 },
              { breakpoint: 1150, cols: 3 },
              { breakpoint: 850, cols: 2 },
              { breakpoint: 650, cols: 1 },
            ]}
          >
            {products.map((product, index) => {
              if (index > 5) return null;
              return (
                <Carousel.Item key={`Carousel${key}${index}`}>
                  <Card
                    key={`Card${key}${index}`}
                    // className="productContainer"

                    onClick={() => navigate(`/product/?id=${product.id}`)}
                    hoverable
                    cover={
                      <img
                        // width="100%"
                        className="productImg"
                        height={200}
                        alt="example"
                        src={baseImgUrl + product.image}
                      />
                    }
                  >
                    <Row style={{ height: 30 }}>
                      <Title className="one-line" level={5}>
                        {product.name}
                      </Title>
                    </Row>
                    <Row
                      justify="space-between"
                      // align="middle"
                      style={{ paddingRight: 0, marginTop: 2 }}
                    >
                      <Paragraph
                        strong
                        type="secondary"
                        // level={5}
                        className="d-flex one-line"
                      >
                        <img
                          src={brandIcon}
                          alt="brandIcon"
                          style={{
                            height: 17,
                            width: 17,
                            marginRight: 2,
                          }}
                        />
                        {brands.map((brand) => {
                          return brand.id === product.brand_id
                            ? brand.brand
                            : null;
                        })}
                      </Paragraph>

                      <Paragraph
                        type="secondary"
                        className="m-0 p-0 d-flex one-line"
                      >
                        <img
                          src={categoryIcon}
                          alt="categoryIcon"
                          style={{
                            height: 17,
                            width: 17,
                            marginRight: 2,
                          }}
                        />
                        {product.category}
                      </Paragraph>
                      {/* <Paragraph type="secondary" className="d-flex">
                  <img
                    src={vendorIcon}
                    alt="vendorIcon"
                    style={{
                      height: 25,
                      width: 25,
                      marginRight: 5,
                    }}
                  />
                  <strong>Product vendor</strong>
                </Paragraph> */}
                    </Row>{" "}
                    <Row>
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
                    <Row>
                      <Paragraph className="productPrice ">
                        &#8377; {product.price}
                      </Paragraph>
                    </Row>
                  </Card>
                </Carousel.Item>
              );
            })}
          </Carousel>
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
                style={{ margin: 0, padding: 0 }}
              >
                ALSALEELS
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
          <Row>
            <Col>
              {allProducts.map((categoryObject) => {
                //{Pencil: Array[...]}
                return categoryRow(categoryObject);
              })}
            </Col>
          </Row>
        </Content>
      )}

      <Footer />
    </Layout>
  );
};
export default Home;
