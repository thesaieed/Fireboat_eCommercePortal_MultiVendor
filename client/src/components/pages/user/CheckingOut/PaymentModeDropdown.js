// PaymentModeDropdown.js
import React, { useState } from "react";
import { Button, Radio, Row, Col, Card } from "antd";

function PaymentModeDropdown({
  paymentOptions,
  onSelectPaymentMode,
  selectedPaymentMode,
}) {
  const [selectedMode, setSelectedMode] = useState(selectedPaymentMode);

  const handleModeChange = (event) => {
    setSelectedMode(event.target.value);
  };

  const handleUsePaymentMode = () => {
    onSelectPaymentMode(selectedMode);
  };

  return (
    <div>
      <Card title="Select Payment Mode">
        <Radio.Group onChange={handleModeChange} value={selectedMode}>
          {paymentOptions.map((option) => (
            <Row
              key={option}
              style={{
                marginBottom: 10,
                backgroundColor:
                  selectedMode === option ? "orange" : "transparent",
              }}
            >
              <Col span={24}>
                <Card style={{ borderRadius: "15px" }}>
                  <Radio value={option}>{option} </Radio>
                </Card>
              </Col>
            </Row>
          ))}
        </Radio.Group>
        <Row>
          <Col span={24}>
            <Button
              onClick={handleUsePaymentMode}
              type="primary"
              disabled={!selectedMode}
            >
              Use this Payment Mode
            </Button>
          </Col>
        </Row>
      </Card>
      <hr />
    </div>
  );
}

export default PaymentModeDropdown;
