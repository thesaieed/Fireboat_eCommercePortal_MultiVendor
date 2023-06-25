import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Typography, Carousel, Pagination, Layout, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import FeaturedProduct from "./FeaturedProduct";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
import LoadingScreen from "../../layout/LoadingScreen";
import brandIcon from "../../../assets/images/brandIcon.png";
import categoryIcon from "../../../assets/images/categoryIcon.png";

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const { Paragraph, Title } = Typography;
  const { Content } = Layout;
  const baseImgUrl = "http://localhost:5000/";

  const getAllProducts = async () => {
    try {
      const response = await await axios.get(
        "http://localhost:5000/viewproducts"
      );
      const brands = await axios.get("http://localhost:5000/brands");
      // console.log(res);
      var products = [];
      response.data.map((product) => {
        products.push({
          ...product,
          brand: brands.data.find((brand) => {
            if (brand.id === product.brand_id) return true;
            else return false;
          }),
        });
        return null;
      });
      setAllProducts(products);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllProducts();
  }, [currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };

  return (
    <Layout className="layout-default ">
      <CommonNavbar handleSearch={handleSearch} />
      {loading ? (
        <LoadingScreen />
      ) : (
        <Content>
          {/* <Title level={2}> Featured Products</Title> */}
          <Carousel effect="fade" className=" mb-24 ">
            {allProducts.map((product, index) => {
              if (index < 3) {
                return <FeaturedProduct key={index} product={product} />;
              }
              return null;
            })}
          </Carousel>

          <Layout>
            <Content>
              <Row
                gutter={[24, 0]}
                className="d-flex align-items-center justify-content-center  p-15 "
              >
                {allProducts.map((product, index) => {
                  if (
                    index >= (currentPage - 1) * 9 &&
                    index < currentPage * 9
                  ) {
                    return (
                      <Col
                        className="gutter-row productShow"
                        xs={23}
                        sm={23}
                        md={11}
                        lg={11}
                        xl={7}
                        // className="productCard mb-24 d-flex"
                        key={index}
                      >
                        <Card
                          className="productContainer"
                          hoverable
                          // style={{
                          //   width: 240,
                          // }}
                          cover={
                            <img
                              // width="100%"
                              className="productImg"
                              height={300}
                              alt="example"
                              src={baseImgUrl + product.image}
                            />
                          }
                        >
                          <Row
                            style={{ height: 55 }}
                            className="d-flex flex-column justify-content-center align-items-start"
                          >
                            <Link
                              to={`/product/?id=${product.id}`}
                              className="two-lines"
                            >
                              <Title strong level={5}>
                                {product.name}
                              </Title>
                            </Link>
                          </Row>

                          <Row
                            justify="space-between"
                            style={{ paddingRight: 15, marginTop: 10 }}
                          >
                            <Paragraph strong type="secondary" level={5}>
                              <img
                                src={brandIcon}
                                alt="brandIcon"
                                style={{
                                  height: 25,
                                  width: 25,
                                  marginRight: 5,
                                }}
                              />
                              {product.brand.brand}
                            </Paragraph>
                            <Paragraph type="secondary" className="m-0 p-0">
                              <img
                                src={categoryIcon}
                                alt="categoryIcon"
                                style={{
                                  height: 25,
                                  width: 25,
                                  marginRight: 5,
                                }}
                              />{" "}
                              {product.category}
                            </Paragraph>
                          </Row>
                          <Row>
                            <Paragraph className="productPrice">
                              &#8377; {product.price}
                            </Paragraph>
                          </Row>
                          <Row
                            style={{ height: 41 }}
                            className="two-lines"
                            dangerouslySetInnerHTML={{
                              __html: product.description,
                            }}
                          />
                        </Card>
                      </Col>
                    );
                  } else {
                    return null;
                  }
                })}
              </Row>
              <Row justify="center">
                <Col>
                  <Pagination
                    defaultCurrent={1}
                    current={currentPage}
                    total={allProducts.length}
                    pageSize={9}
                    onChange={onPageChange}
                    responsive
                  />
                </Col>
              </Row>
            </Content>
          </Layout>
        </Content>
      )}

      <Footer />
    </Layout>
  );
};
export default Home;
