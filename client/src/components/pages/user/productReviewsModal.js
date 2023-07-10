import { Modal, Avatar, Typography, Pagination, Row, Col } from "antd";
import { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import StarRatings from "react-star-ratings";
const ProductReviewsModal = ({
  isReviewModalVisible,
  setIsReviewModalVisible,
  allReviews,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { Title, Paragraph, Text } = Typography;
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Modal
      centered
      width="80%"
      destroyOnClose
      title="All Product Reviews"
      footer={null}
      open={isReviewModalVisible}
      onCancel={() => setIsReviewModalVisible(false)}
    >
      {allReviews.allreviews?.map((review, index) => {
        if (index >= (currentPage - 1) * 4 && index < currentPage * 4) {
          return (
            <div style={{ marginTop: 30 }} key={`review${index}${currentPage}`}>
              <Title level={5} style={{ margin: 0, padding: 0 }}>
                <Avatar
                  icon={<UserOutlined />}
                  style={{ margin: "-4px 5px 0px 0px" }}
                />
                {review.username}
              </Title>
              <div style={{ marginLeft: 40 }}>
                <Row justify="start" align="middle" style={{ marginLeft: 0 }}>
                  <Text strong>Rating : </Text>

                  <StarRatings
                    rating={review.rating}
                    starRatedColor="#86c61f"
                    numberOfStars={5}
                    name="avgRating"
                    starDimension="25px"
                    starSpacing="1px"
                  />
                </Row>
                {review.review.length > 0 && (
                  <>
                    <Paragraph strong style={{ margin: 0, padding: 0 }}>
                      Review
                    </Paragraph>
                    <Paragraph
                      style={{ margin: 0, padding: 0 }}
                      ellipsis={{
                        rows: 3,
                        expandable: true,
                        symbol: "more",
                      }}
                    >
                      {review.review}
                    </Paragraph>
                  </>
                )}
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
      <Row justify="center" key={`Pagination`}>
        <Col>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            total={allReviews.allreviews?.length}
            pageSize={4}
            onChange={onPageChange}
            // responsive
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ProductReviewsModal;
