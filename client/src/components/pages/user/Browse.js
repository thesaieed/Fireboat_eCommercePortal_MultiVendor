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
  const [shownProducts, setShownProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [noProductMessage, setNoProductMessage] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  //Filter States and functions
  const [sortValue, setSortValue] = useState(0);
  const [priceRange, setPriceRange] = useState({
    minPrice: 0,
    maxPrice: 10000,
  });
  const [sliderRange, setSliderRange] = useState({
    min: 0,
    max: 10000,
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const onSortChange = (e) => {
    setSortValue(e.target.value);
  };

  const onCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSortValue(0);
    priceRangeSet(browseProducts);
  };

  const [searchTerms] = useState(
    searchParams.get("search")?.match(/("[^"]+"|[^"\s]+)/g)
  );
  const baseImgUrl = "http://localhost:5000/";

  const { Paragraph, Title } = Typography;

  const { Content, Sider } = Layout;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const priceRangeSet = (products) => {
    const prices = products.map((product) => {
      return product.price;
    });
    setPriceRange({
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    });
    setSliderRange({
      min: Math.min(...prices),
      max: Math.max(...prices),
    });
  };

  const getSearchResults = async (params) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/search", {
        searchTerms: params,
      });

      if (!res.data.length) {
        setNoProductMessage(true);
        setBrowseProducts([]);
        setShownProducts([]);
      } else {
        setNoProductMessage(false);
        setBrowseProducts(res.data);
        setShownProducts(res.data);
        setCategories([...new Set(res.data.map((x) => x.category))]);
        priceRangeSet(res.data);
      }
    } catch (error) {}
    setLoading(false);
  };

  const applyFilters = () => {
    var filteredArray = [];

    //Filter by category First
    if (selectedCategories.length) {
      filteredArray = browseProducts.filter(function (product) {
        return selectedCategories.includes(product.category);
      });
    } else {
      filteredArray = browseProducts;
    }

    //filter the new array by Price Range
    filteredArray = filteredArray.filter(
      (product) =>
        product.price >= priceRange.minPrice &&
        product.price <= priceRange.maxPrice
    );

    //Sort the new filteredByPrice Array
    if (sortValue === 0) {
      filteredArray = [...filteredArray].sort(function (x, y) {
        return new Date(x.created_at) > new Date(y.created_at) ? 1 : -1;
      });
    }

    //sort by Newest
    if (sortValue === 1) {
      filteredArray = [...filteredArray].sort(function (x, y) {
        return new Date(x.created_at) < new Date(y.created_at) ? 1 : -1;
      });
    }

    //sort by Low Price First
    if (sortValue === 2) {
      filteredArray = [...filteredArray].sort(function (x, y) {
        return x.price > y.price ? 1 : -1;
      });
    }

    //sort by High Price First
    if (sortValue === 3) {
      filteredArray = [...filteredArray].sort(function (x, y) {
        return x.price < y.price ? 1 : -1;
      });
    }

    // Finally set The shown products
    setShownProducts(filteredArray);
  };

  const showProducts = () => {
    return shownProducts.map((product, index) => {
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
                  <Paragraph strong>&#8377; {product.price}</Paragraph>
                </div>
              </div>
            </Link>
          </Col>
        );
      } else {
        return null;
      }
    });
  };

  useEffect(() => {
    getSearchResults(searchTerms);
  }, [searchTerms]);

  useEffect(() => {
    applyFilters();
  }, [sortValue, selectedCategories, priceRange]);

  const showDrawer = () => {
    setVisible(!visible);
  };
  const handleSearch = (e) => {
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
            <BrowseSidebar
              sortValue={sortValue}
              onSortChange={onSortChange}
              categories={categories}
              onCategoryChange={onCategoryChange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sliderRange={sliderRange}
              selectedCategories={selectedCategories}
              clearAllFilters={clearAllFilters}
            />
          </Sider>

          <Drawer
            title={"Filters"}
            placement="left"
            closable={true}
            onClose={showDrawer}
            open={visible}
            style={{ zIndex: 99990 }}
          >
            <BrowseSidebar
              sortValue={sortValue}
              onSortChange={onSortChange}
              categories={categories}
              onCategoryChange={onCategoryChange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sliderRange={sliderRange}
            />
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
            <Row justify="left" style={{ marginTop: 7, marginLeft: 25 }}>
              <Col>
                <Title level={3}>
                  Search Results for "{searchTerms.join(" ")}"
                </Title>
              </Col>
            </Row>
            <Row
              gutter={[24, 0]}
              className="d-flex align-items-center justify-content-evenly  p-15 "
            >
              {noProductMessage && <Title>No Products found !</Title>}
              {showProducts()}
            </Row>
            {browseProducts.length > 8 && (
              <Row justify="center">
                <Col>
                  <Pagination
                    defaultCurrent={1}
                    current={currentPage}
                    total={shownProducts.length}
                    pageSize={8}
                    onChange={onPageChange}
                    responsive
                  />
                </Col>
              </Row>
            )}
          </Content>
        </Layout>
      )}
    </Layout>
  );
};

export default Browse;
