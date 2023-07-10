import React, { useState } from "react";
import { Button, Radio, Row, Col, Card } from "antd";

function DeliveryAddressDropdown({
  addresses,
  onAddNewAddress,
  onSelectAddress,
  selectedAddress,
}) {
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.length > 0 ? addresses[0].id : null
  );

  const handleAddressChange = (event) => {
    setSelectedAddressId(event.target.value);
  };

  const handleUseAddress = () => {
    const address = addresses.find(
      (address) => address.id === selectedAddressId
    );
    if (address) {
      // Call the parent's handleSelectAddress only when the button is clicked
      onSelectAddress(address);
    }
  };

  return (
    <div>
      <Card title="Select Delivery Address">
        <Radio.Group onChange={handleAddressChange} value={selectedAddressId}>
          {addresses.map((address) => (
            <Row
              key={address.id}
              style={{
                marginBottom: 10,
                backgroundColor:
                  selectedAddressId === address.id ? "orange" : "transparent", // Highlight the card if selected
              }}
            >
              <Col span={24}>
                <Card style={{ borderRadius: "15px" }}>
                  <Radio value={address.id}>
                    {/* Radio button's value will be the address ID */}
                  </Radio>
                  <p>
                    {address.full_name}, {address.house_no_company},
                    {address.area_street_village}, {address.landmark},
                    {address.town_city}, {address.state}, {address.pincode},
                    {address.phone_number}, {address.country}
                  </p>
                </Card>
              </Col>
            </Row>
          ))}
        </Radio.Group>
        <Row>
          <Col span={24}>
            <Button onClick={onAddNewAddress} style={{ marginRight: 10 }}>
              Add New Address
            </Button>
            <Button
              style={{ marginTop: "10px" }}
              onClick={handleUseAddress} // Call handleUseAddress on button click
              type="primary"
              disabled={!selectedAddressId}
            >
              Use this Address
            </Button>
          </Col>
        </Row>
      </Card>
      <hr />
    </div>
  );
}

export default DeliveryAddressDropdown;
