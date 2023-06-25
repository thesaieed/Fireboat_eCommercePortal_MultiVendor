import { Row, Col, Button } from "antd";
import { useState, useCallback } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import NewBrand from "./NewBrand";
import UpdateBrands from "./UpdateBrands";
const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState([]);

  const getBrands = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/brands");
      setBrands(response.data);
      // console.log(response.data);
      setFilteredBrands(response.data);
    } catch (error) {
      console.log(error);
    }
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
          />
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col className="mt-20">
          <UpdateBrands
            brands={brands}
            setBrands={setBrands}
            filteredBrands={filteredBrands}
            setFilteredBrands={setFilteredBrands}
            getBrands={getBrands}
          />
        </Col>
      </Row>
    </>
  );
};
export default Brands;
