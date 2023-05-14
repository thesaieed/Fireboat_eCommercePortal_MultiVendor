import { Row, Col, Button } from "antd";
import { useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import NewCategory from "./NewCategory";
const AllCategories = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Row gutter={[24, 0]}>
      <Col span={24} md={18}>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          <PlusCircleOutlined />
          Add New Category
        </Button>
        <NewCategory modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Col>
    </Row>
  );
};
export default AllCategories;
