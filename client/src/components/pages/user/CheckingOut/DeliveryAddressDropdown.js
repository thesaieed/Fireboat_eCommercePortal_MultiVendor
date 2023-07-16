import React, { useState } from "react";
import { Button, Radio, Row, Col, Card } from "antd";

function DeliveryAddressDropdown({
  addresses,
  onAddNewAddress,
  onSelectAddress,
  selectedAddress,
  setSelectedAddressId,
  selectedAddressId,
}) {
  const handleAddressChange = (event) => {
    setSelectedAddressId(event.target.value);
  };

  return (
    <div>
      <Card>
        <Radio.Group onChange={handleAddressChange} value={selectedAddressId}>
          {addresses.map((address) => (
            <Row
              key={address.id}
              style={{
                marginBottom: 10,
                backgroundColor: "transparent", // Highlight the card if selected
              }}
            >
              <Col span={24}>
                <Card style={{ borderRadius: "15px" }}>
                  <Radio value={address.id}>
                    {/* Radio button's value will be the address ID */}
                    <div className="">
                      <span>{address.full_name}, </span>
                      <span>{address.house_no_company}, </span>
                      <span>Near- {address.landmark}, </span>
                      <span>{address.area_street_village}, </span>
                      <span> {address.town_city},</span>
                      <span> {address.state}, </span>
                      <span> {address.pincode}, </span>
                      <span> {address.phone_number}, </span>
                      <span> {address.country}</span>
                    </div>
                  </Radio>
                </Card>
              </Col>
            </Row>
          ))}
        </Radio.Group>
        <Row>
          <Col span={24}>
            <Button
              onClick={onAddNewAddress}
              type="default"
              style={{ marginRight: 10 }}
            >
              Add New Address
            </Button>
          </Col>
        </Row>
      </Card>
      <hr />
    </div>
  );
}

export default DeliveryAddressDropdown;
