import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Typography, Carousel, Pagination, Layout } from "antd";
import { Link, useNavigate } from "react-router-dom";
import FeaturedProduct from "./FeaturedProduct";
import CommonNavbar from "../../layout/CommonNavbar";
import Footer from "../../layout/Footer";
import LoadingScreen from "../../layout/LoadingScreen";

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
      const res = await axios.get("http://localhost:5000/allproducts");
      // console.log(res);
      setAllProducts(res.data);
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
                    index >= (currentPage - 1) * 8 &&
                    index < currentPage * 8
                  ) {
                    return (
                      <Col className="productCard mb-24 d-flex" key={index}>
                        <div className="productContainer rounded-border ">
                          <div className="productImg">
                            <img src={baseImgUrl + product.image} alt="img" />
                          </div>
                          <div className="productDetails rounded-border-bottom">
                            <Link to={`/product/?id=${product.id}`}>
                              <Title strong level={5}>
                                {product.name.length > 75
                                  ? product.name.substr(0, 75) + " ..."
                                  : product.name}
                              </Title>
                            </Link>
                            <Paragraph>{product.category}</Paragraph>
                            <Paragraph
                              ellipsis={{
                                rows: 3,
                                expandable: false,
                              }}
                            >
                              {product.description}
                            </Paragraph>
                            <Paragraph className="productPrice">
                              &#8377; {product.price}
                            </Paragraph>
                          </div>
                        </div>
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
                    pageSize={8}
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
