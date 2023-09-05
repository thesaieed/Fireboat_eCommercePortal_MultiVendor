// PaymentModeDropdown.js
import React, { useCallback, useEffect, useState } from "react";
import { Card, Table, Typography, Image, Descriptions } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";

function PaymentModeDropdown({
  status,
  paymentdone,
  itemDetails,
  txnid,
  appUser,
  api,
}) {
  const { Text, Title } = Typography;
  const [txnDetails, setTxnDetails] = useState({});
  const getTransactionData = useCallback(async () => {
    try {
      const txnData = await axios.post(`${api}/payments/getpaydetails`, {
        user_id: appUser.id,
        txnid,
      });

      setTxnDetails(txnData.data);
    } catch (err) {
      console.log(err);
    }
  }, [appUser.id, txnid, api]);
  useEffect(() => {
    if (txnid?.length && appUser.id) {
      getTransactionData();
    }
  }, [txnid, appUser.id, getTransactionData]);

  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      width: "7%%",
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      width: "70%",
      ellipsis: true,
    },
    {
      title: "Qurantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];
  const items = itemDetails.map((item, index) => {
    return {
      key: index,
      image: (
        <Image
          style={{ maxWidth: "80px" }}
          src={`${api}/${item.image[0].replace(/\\/g, "/")}`}
          alt="ProductImg"
        />
      ),
      name: item.name,
      quantity: item.quantity,
      amount: item.price * item.quantity,
    };
  });
  const data = [
    ...items,
    {
      key: "total",

      name: (
        <Text
          style={{ textTransform: "uppercase", fontSize: 14, fontWeight: 700 }}
        >
          Total
        </Text>
      ),
      quantity: (
        <Text style={{ fontSize: 14, fontWeight: 700 }}>
          {itemDetails.reduce((sum, object) => {
            return sum + object.quantity;
          }, 0)}
        </Text>
      ),
      amount: (
        <Text style={{ fontSize: 14, fontWeight: 700 }}>
          {itemDetails.reduce((sum, object) => {
            return sum + object.price * object.quantity;
          }, 0)}
        </Text>
      ),
    },
  ];

  return !paymentdone ? (
    <div>
      <Card title="Final Review and Payment">
        <Table
          columns={columns}
          dataSource={data}
          footer={null}
          pagination={false}
        />
      </Card>
      <hr />
    </div>
  ) : (
    <div>
      <Card title="Payment Status">
        <div className="d-flex flex-column align-items-center justify-content-center">
          {status === "success" && (
            <>
              <CheckCircleOutlined
                style={{ color: "#86c61f", fontSize: 100 }}
              />
              <Title style={{ marginTop: 20, marginBottom: 25 }} level={3}>
                Payment Successful
              </Title>
              <Title level={4} style={{ color: "#86c61f" }}>
                &#8377; {txnDetails?.amount}
              </Title>
            </>
          )}
          {status === "fail" && (
            <>
              <CloseCircleOutlined
                style={{ color: "#f72a2c", fontSize: 100 }}
              />
              <Title style={{ marginTop: 20, marginBottom: 25 }} level={3}>
                Payment Failed
              </Title>
              <Title level={4} style={{ color: "#f72a2c" }}>
                &#8377; {txnDetails?.amount}
              </Title>
            </>
          )}
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Order ID">
              {txnDetails?.order_id}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction ID">
              {txnDetails?.transaction_id}
            </Descriptions.Item>
            <Descriptions.Item label="mihpayid">
              {txnDetails?.mihpayid}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
      <hr />
    </div>
  );
}

export default PaymentModeDropdown;
