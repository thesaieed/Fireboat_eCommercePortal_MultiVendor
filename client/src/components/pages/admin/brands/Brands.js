import { Row, Col, Button } from "antd";
import { useState, useCallback } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import NewBrand from "./NewBrand";
import UpdateBrands from "./UpdateBrands";
import useAllContext from "../../../../context/useAllContext";
const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const { appUser } = useAllContext();
  const [loading, setLoading] = useState(false);
  const getBrands = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/brands");
      const allVendors = await axios.get("http://localhost:5000/allvendors");
      var brands = [];
      response.data.map((brand) => {
        brands.push({
          ...brand,
          vendor: allVendors.data.find((vendor) => {
            if (vendor.id === brand.vendor_id) return true;
            else return false;
          }),
        });
        return null;
      });

      setBrands(brands);
      // console.log(response.data);
      setFilteredBrands(response.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);
  // const getBrands = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/brands");
  //     setBrands(response.data);
  //     // console.log(response.data);
  //     setFilteredBrands(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={18}>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            <PlusCircleOutlined />
            Add New Brand
          </Button>
          <NewBrand
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            getBrands={getBrands}
            appUser={appUser}
          />
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col className="mt-20 cardAddProduct">
          <UpdateBrands
            brands={brands}
            setBrands={setBrands}
            filteredBrands={filteredBrands}
            setFilteredBrands={setFilteredBrands}
            getBrands={getBrands}
            appUser={appUser}
            loading={loading}
          />
        </Col>
      </Row>
    </>
  );
};
export default Brands;
