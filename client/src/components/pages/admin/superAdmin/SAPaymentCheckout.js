import React, { useCallback, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Form,
  message,
  Button,
  List,
  Avatar,
  Tooltip,
  Modal,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  ExclamationOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAllContext from "../../../../context/useAllContext";
import { Link } from "react-router-dom";
import axios from "axios";
const SAPaymentCheckout = () => {
  const [statsLoading, setStatsLoading] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [denyReasonModalVisible, setDenyReasonModalVisible] = useState("");
  const { appUser } = useAllContext();
  const navigate = useNavigate();
  const getPaymentStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:5000/payments/admintransactions"
      );

      setTransactions(data);
    } catch (error) {
      console.log(error);
    }
    setStatsLoading(false);
  }, [appUser.id]);

  useEffect(() => {
    getPaymentStats();
  }, [getPaymentStats]);
  var dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const newest = transactions.map((transaction) => {
    if (transaction.status === "approved") {
      return {
        avatar: <PlusOutlined style={{ fontSize: 14 }} />,
        title: (
          <Button
            type="link"
            size="small"
            style={{
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => {
              navigate("/admin/superadmin/checkoutdetails", {
                state: { transaction },
              });
            }}
          >
            {transaction.business_name}
          </Button>
        ),
        description: (
          <span>
            <div>
              Approved on -
              {new Date(transaction.modified_at).toLocaleDateString(
                "en-US",
                dateOptions
              )}
            </div>
            Initiated on -
            {new Date(transaction.created_at).toLocaleDateString(
              "en-US",
              dateOptions
            )}
            <div></div>
          </span>
        ),
        amount: transaction.amount,
        textclass: "text-fill",
        amountcolor: "text-success",
      };
    } else if (transaction.status === "pending") {
      return {
        avatar: <ExclamationOutlined style={{ fontSize: 16 }} />,
        title: (
          <Button
            type="link"
            size="small"
            style={{
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => {
              navigate("/admin/superadmin/checkoutdetails", {
                state: { transaction },
              });
            }}
          >
            {transaction.business_name}
          </Button>
        ),
        description: (
          <span>
            Initiated on -
            {new Date(transaction.created_at).toLocaleDateString(
              "en-US",
              dateOptions
            )}
          </span>
        ),
        amount: transaction.amount,
        textclass: "text-light-danger",
        amountcolor: "text-light-danger-amount",
      };
    } else if (transaction.status === "denied") {
      return {
        avatar: <CloseOutlined style={{ fontSize: 14, color: "red" }} />,
        title: (
          <span className="d-flex align-items-center justify-content-start">
            <Button
              type="link"
              size="small"
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                navigate("/admin/superadmin/checkoutdetails", {
                  state: { transaction },
                });
              }}
            >
              {transaction.business_name}
            </Button>
            <Tooltip title="Reason for Denial" color={"#9edd38"}>
              <Button
                shape="circle"
                size="small"
                style={{
                  marginLeft: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                danger
                icon={<ExclamationOutlined style={{ fontSize: 10 }} />}
                onClick={() => {
                  setDenyReason(transaction.denyreason);
                  setDenyReasonModalVisible(true);
                }}
              />
            </Tooltip>
          </span>
        ),
        description: (
          <span>
            <div>
              Denied on -
              {new Date(transaction.modified_at).toLocaleDateString(
                "en-US",
                dateOptions
              )}
            </div>
            Initiated on -
            {new Date(transaction.created_at).toLocaleDateString(
              "en-US",
              dateOptions
            )}
            <div></div>
          </span>
        ),
        amount: transaction.amount,
        textclass: "fill-danger",
        amountcolor: "text-danger",
      };
    } else {
      return null;
    }
  });
  console.log(newest);
  return (
    <>
      <Row justify="center">
        <Col span={24}>
          <Card
            loading={statsLoading}
            bordered={false}
            bodyStyle={{ paddingTop: 0 }}
            className="header-solid h-full  ant-list-yes"
            title={<h6 className="font-semibold m-0">All Transactions</h6>}
          >
            <List
              header={<h6>NEWEST</h6>}
              className="transactions-list ant-newest"
              itemLayout="horizontal"
              dataSource={newest}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar size="small" className={item.textclass}>
                        {item.avatar}
                      </Avatar>
                    }
                    title={item.title}
                    description={item.description}
                  />
                  <div className="amount">
                    <span className={item.amountcolor}>
                      {" "}
                      &#8377; {item.amount}
                    </span>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        title="Reason for Denial"
        open={denyReasonModalVisible}
        onCancel={() => setDenyReasonModalVisible("")}
        centered
        footer={null}
      >
        {denyReason}
      </Modal>
    </>
  );
};

export default SAPaymentCheckout;
