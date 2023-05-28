import { Layout, Button, Drawer, Row, Col, Typography, Pagination } from "antd";
import CommonNavbar from "../../layout/CommonNavbar";
import LoadingScreen from "../../layout/LoadingScreen";
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import axios from "axios";
import BrowseSidebar from "./BrowseSidebar";
import { FilterOutlined } from "@ant-design/icons";

const Browse = () => {
  const [browseProducts, setBrowseProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [noProductMessage, setNoProductMessage] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const [searchTerms] = useState(
    searchParams.get("search")?.match(/("[^"]+"|[^"\s]+)/g)
  );
  const baseImgUrl = "http://localhost:5000/";

  const { Paragraph, Title } = Typography;

  const { Content, Sider } = Layout;

  const onPageChange = (page) => {
    // console.log(page);
    setCurrentPage(page);
    // setPageElements(getPageElements());
    // console.log("page Elements : ", pageElements);
  };

  const getSearchResults = async (params) => {
    console.log("Search Terms before Search : ", params);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/search", {
        searchTerms: params,
      });
      // console.log(res);
      if (!res.data.length) {
        setNoProductMessage(true);
        setBrowseProducts([]);
      } else {
        setNoProductMessage(false);
        setBrowseProducts(res.data);
      }
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    getSearchResults(searchTerms);
  }, [searchTerms]);

  const showDrawer = () => {
    setVisible(!visible);
  };
  const handleSearch = (e) => {
    console.log(e);
    navigate(`/browse/?search=${e.target.value}`);
    window.location.reload();
  };
  return (
    <Layout className="layout-default ">
      <CommonNavbar handleSearch={handleSearch} />
      {loading ? (
        <LoadingScreen />
      ) : (
        <Layout className="layout-default ">
          <Sider
            trigger={null}
            width={250}
            theme="light"
            className="homeSidebar"
          >
            <BrowseSidebar />
          </Sider>

          <Drawer
            title={"Filters"}
            placement="left"
            closable={true}
            onClose={showDrawer}
            open={visible}
            style={{ zIndex: 99990 }}
          >
            <BrowseSidebar />
          </Drawer>
          <Content style={{ padding: 16, overflow: "auto" }}>
            <Button
              className="filterMenuButton"
              type="primary"
              onClick={showDrawer}
            >
              <FilterOutlined />
              Filters
            </Button>
            {/* <Title level={2} className="p-15">
                All Products
              </Title> */}
            <Row
              gutter={[24, 0]}
              className="d-flex align-items-center justify-content-evenly  p-15 "
            >
              {noProductMessage && <Title>No Products found !</Title>}
              {browseProducts.map((product, index) => {
                if (index >= (currentPage - 1) * 8 && index < currentPage * 8) {
                  return (
                    <Col className=" mb-24 d-flex" key={index}>
                      <Link to={`/product/?id=${product.id}`}>
                        <div className="productContainer">
                          <div className="productImg">
                            <img src={baseImgUrl + product.image} alt="img" />
                          </div>
                          <div className="productDetails">
                            <Title strong level={5}>
                              {product.name.length > 25
                                ? product.name.substr(0, 25) + " ..."
                                : product.name}
                            </Title>
                            <Paragraph>{product.category}</Paragraph>
                            <Paragraph
                              ellipsis={{
                                rows: 3,
                                expandable: false,
                              }}
                            >
                              {product.description}
                            </Paragraph>
                            <Paragraph strong>
                              &#8377; {product.price}
                            </Paragraph>
                          </div>
                        </div>
                      </Link>
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
                  total={browseProducts.length}
                  pageSize={8}
                  onChange={onPageChange}
                  responsive
                />
              </Col>
            </Row>
          </Content>
        </Layout>
      )}
    </Layout>
  );
};

export default Browse;
