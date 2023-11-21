import {
  Layout,
  Button,
  Drawer,
  Row,
  Col,
  Typography,
  Pagination,
  message,
  Card,
} from "antd";
import CommonNavbar from "../../layout/CommonNavbar";
import LoadingScreen from "../../layout/LoadingScreen";
import { useState, useEffect, useCallback } from "react";
import useAllContext from "../../../context/useAllContext";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";
import axios from "axios";
import BrowseSidebar from "./BrowseSidebar";
import { FilterOutlined } from "@ant-design/icons";
import brandIcon from "../../../assets/images/brandIcon.png";
import categoryIcon from "../../../assets/images/categoryIcon.png";
import vendorIcon from "../../../assets/images/vendorsIcon.png";
import { BiError } from "react-icons/bi";
import Footer from "../../layout/Footer";
const Browse = () => {
  const [browseProducts, setBrowseProducts] = useState([]);
  const [shownProducts, setShownProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [noProductMessage, setNoProductMessage] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartButtonLoading, setCartButtonLoading] = useState([]);

  const navigate = useNavigate();
  const { appUser, updateNumberOfCartItems, api } = useAllContext();

  //Filter States and functions
  const [sortValue, setSortValue] = useState(null);
  const [sortAvgRating, setSortAvgRating] = useState(null);
  const [priceRange, setPriceRange] = useState({
    minPrice: null,
    maxPrice: null,
  });
  const [sliderRange, setSliderRange] = useState({
    min: null,
    max: null,
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState();
  const [selectedBrands, setSelectedBrands] = useState();
  const [selectedVendors, setSelectedVendors] = useState();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };
  const onSortChange = (e) => {
    setSortValue(e.target.value);
  };
  const onsortAvgRatingChange = (e) => {
    setSortAvgRating(e.target.value);
  };

  const onCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };
  const onBrandChange = (selectedOptions) => {
    setSelectedBrands(selectedOptions);
  };
  const onVendorChange = (selectedOptions) => {
    setSelectedVendors(selectedOptions);
  };
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedVendors([]);
    setSortValue(0);
    priceRangeSet(browseProducts);
    setSortAvgRating(-1);
  };
  const [category, setCategory] = useState(searchParams.get("category"));
  const [searchTerms, setSearchTerms] = useState(
    searchParams.get("search")?.match(/("[^"]+"|[^"\s]+)/g)
  );
  useEffect(() => {
    scrollToTop();
    setSearchTerms(searchParams.get("search")?.match(/("[^"]+"|[^"\s]+)/g));
    setCategory(searchParams.get("category"));
  }, [searchParams]);

  const { Paragraph, Title } = Typography;

  const { Content, Sider } = Layout;

  const onPageChange = (page) => {
    scrollToTop();
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

  const getSearchResults = useCallback(
    async (params) => {
      setLoading(true);
      try {
        // console.log(params);
        const res = await axios.post(`${api}/search`, {
          searchTerms: params,
          category: category?.length ? category : null,
          user_id: appUser.id,
        });
        // console.log("search", appUser);
        const brands = await axios.get(`${api}/brands`);
        // console.log("brands.data : ", brands.data);

        const allVendors = await axios.get(`${api}/allvendors`);

        // console.log(allVendors);

        if (!res.data?.length) {
          setNoProductMessage(true);
          setBrowseProducts([]);
          setShownProducts([]);
        } else {
          let products = [];
          res.data.map((product) => {
            products.push({
              ...product,
              brand: brands.data.find((brand) => {
                if (brand.id === product.brand_id) return true;
                else return false;
              }),
              vendor: allVendors.data.find((vendor) => {
                if (vendor.id === product.vendor_id) return true;
                else return false;
              }),
            });
            return null;
          });
          setNoProductMessage(false);
          setBrowseProducts(products);
          setShownProducts(products);
          setCategories([...new Set(products.map((x) => x.category))]);
          setBrands([...new Set(products.map((x) => x.brand.brand))]);
          setVendors([...new Set(products.map((x) => x.vendor.business_name))]);
          priceRangeSet(products);
        }
      } catch (error) {
        // console.log(error);
      }
      setLoading(false);
    },
    [category, appUser.id, api]
  );

  const applyFilters = useCallback(() => {
    setCurrentPage(1);
    var filteredArray = [];

    //Filter by category First
    if (selectedCategories?.length) {
      filteredArray = browseProducts.filter(function (product) {
        return selectedCategories.includes(product.category);
      });
    } else {
      filteredArray = browseProducts;
    }
    //Filter new array by Brand
    if (selectedBrands?.length) {
      filteredArray = filteredArray.filter(function (product) {
        return selectedBrands.includes(product.brand.brand);
      });
    }
    //Filter new array by Vendor
    if (selectedVendors?.length) {
      filteredArray = filteredArray.filter(function (product) {
        return selectedVendors.includes(product.vendor.business_name);
      });
    }

    //filter by ratings
    filteredArray = filteredArray.filter(
      (product) => product.avg_rating >= sortAvgRating
    );

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
  }, [
    browseProducts,
    priceRange.maxPrice,
    priceRange.minPrice,
    selectedBrands,
    selectedVendors,
    selectedCategories,
    sortValue,
    sortAvgRating,
  ]);

  const handleAddToCart = async (product_id) => {
    setCartButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[product_id] = true;
      return newLoadings;
    });
    if (!appUser || !appUser.id) {
      message.info("Please login to add products to the cart.");
      setCartButtonLoading((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[product_id] = false;
        return newLoadings;
      });
      return;
    }
    if (appUser.is_admin) {
      message.info("Admin not Allowed to add to Cart Yet!");
      setCartButtonLoading((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[product_id] = false;
        return newLoadings;
      });
      return;
    }

    try {
      await axios.post(`${api}/addtocart`, {
        user_id: appUser.id,
        product_id,
        quantity: 1,
      });
      message.success("Added to cart");

      updateNumberOfCartItems();
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
    setCartButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[product_id] = false;
      return newLoadings;
    });
  };

  const showProducts = () => {
    return shownProducts.map((product, index) => {
      if (index >= (currentPage - 1) * 9 && index < currentPage * 9) {
        return (
          <Col
            className="gutter-row productShow"
            xs={22}
            sm={11}
            md={11}
            lg={11}
            xl={7}
            key={index}
          >
            <Card
              className="productContainer"
              hoverable
              cover={
                <img
                  className="productImg"
                  height={300}
                  alt="example"
                  src={product.image[0]}
                />
              }
            >
              <Row
                style={{ height: 55 }}
                className="d-flex flex-column justify-content-center align-items-start"
              >
                <Link to={`/product/?id=${product.id}`} className="two-lines">
                  <Title level={5}>{product.name}</Title>
                </Link>
              </Row>
              <Row
                justify="space-between"
                style={{ paddingRight: 15, marginTop: 10 }}
              >
                <Paragraph strong type="secondary" level={5} className="d-flex">
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

                <Paragraph type="secondary" className="m-0 p-0 d-flex">
                  <img
                    src={categoryIcon}
                    alt="categoryIcon"
                    style={{
                      height: 25,
                      width: 25,
                      marginRight: 5,
                    }}
                  />
                  {product.category}
                </Paragraph>
                <Paragraph type="secondary" className="d-flex">
                  <img
                    src={vendorIcon}
                    alt="vendorIcon"
                    style={{
                      height: 25,
                      width: 25,
                      marginRight: 5,
                    }}
                  />
                  <strong>{product.vendor.business_name}</strong>
                </Paragraph>
              </Row>
              <Row>
                <Paragraph className="productPrice ">
                  &#8377; {product.price}
                </Paragraph>
              </Row>
              <Row>
                <div>
                  <StarRatings
                    rating={product.avg_rating}
                    starRatedColor="#86c61f"
                    numberOfStars={5}
                    name="mainAvgRating"
                    starDimension="25px"
                    starSpacing="1px"
                  />
                  <strong> ({product.avg_rating.toFixed(1)}) </strong>
                </div>
              </Row>

              <Row
                style={{ height: 41 }}
                className="two-lines"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
              <Row className="d-flex mt-20">
                <Button
                  onClick={() => {
                    handleAddToCart(product.id);
                  }}
                  type="primary"
                  loading={cartButtonLoading[product.id]}
                >
                  Add to Cart
                </Button>
              </Row>
            </Card>
          </Col>
        );
      } else {
        return null;
      }
    });
  };

  useEffect(() => {
    getSearchResults(searchTerms);
  }, [searchTerms, getSearchResults]);

  useEffect(() => {
    applyFilters();
  }, [
    sortAvgRating,
    sortValue,
    selectedCategories,
    priceRange,
    selectedBrands,
    applyFilters,
  ]);

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
              sortAvgRating={sortAvgRating}
              sortValue={sortValue}
              onsortAvgRatingChange={onsortAvgRatingChange}
              onSortChange={onSortChange}
              categories={categories}
              brands={brands}
              vendors={vendors}
              onCategoryChange={onCategoryChange}
              onBrandChange={onBrandChange}
              onVendorChange={onVendorChange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sliderRange={sliderRange}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              selectedVendors={selectedVendors}
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
              sortAvgRating={sortAvgRating}
              sortValue={sortValue}
              onsortAvgRatingChange={onsortAvgRatingChange}
              onSortChange={onSortChange}
              categories={categories}
              brands={brands}
              vendors={vendors}
              onCategoryChange={onCategoryChange}
              onBrandChange={onBrandChange}
              onVendorChange={onVendorChange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sliderRange={sliderRange}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              selectedVendors={selectedVendors}
              clearAllFilters={clearAllFilters}
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

            <Row justify="left" style={{ marginTop: 7, marginLeft: 25 }}>
              <Col>
                {!category?.length && (
                  <Title level={3}>
                    Search Results for{" "}
                    <span style={{ color: "#689125" }}>
                      "{searchTerms.join(" ")}"{" "}
                    </span>
                  </Title>
                )}
              </Col>
            </Row>
            <Row
              justify={"start"}
              // gutter={{
              //   xs: 8,
              //   sm: 16,
              //   md: 24,
              //   lg: 150,
              // }}
              // className="justify-content-evenly"
            >
              {noProductMessage && (
                <Row
                  style={{ width: "100vw" }}
                  justify={"center"}
                  align={"middle"}
                >
                  <Col>
                    <Title>
                      {" "}
                      <BiError style={{ marginTop: -10, color: "red" }} /> No
                      Products found !
                    </Title>
                  </Col>
                </Row>
              )}
              {!noProductMessage && showProducts()}
            </Row>
            {browseProducts?.length > 9 && (
              <Row justify="center">
                <Col>
                  <Pagination
                    defaultCurrent={1}
                    current={currentPage}
                    total={shownProducts?.length}
                    pageSize={9}
                    onChange={onPageChange}
                    responsive
                  />
                </Col>
              </Row>
            )}
          </Content>
        </Layout>
      )}
      <Footer />
    </Layout>
  );
};

export default Browse;
