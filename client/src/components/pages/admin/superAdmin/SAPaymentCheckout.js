import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Card, Input, Button, Avatar, Tooltip, Modal } from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  ExclamationOutlined,
  SearchOutlined,
  EyeFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import useAllContext from "../../../../context/useAllContext";
import axios from "axios";
const SAPaymentCheckout = () => {
  const [statsLoading, setStatsLoading] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [denyReasonModalVisible, setDenyReasonModalVisible] = useState("");
  const [search, setSearch] = useState("");
  const { appUser } = useAllContext();
  const navigate = useNavigate();
  const getPaymentStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:5000/payments/admintransactions"
      );

      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.log(error);
    }
    setStatsLoading(false);
  }, []);

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

  const columns = [
    {
      name: <div style={{ width: "100%", textAlign: "start" }}>Order</div>,
      width: "320px",
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cell: (row) => (
        <div
          style={{
            maxHeight: "100%",
            minWidth: "100%",
            overflow: "hidden",
            lineHeight: "1.5",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          <div className="d-flex justify-content-start align-items-center">
            <Button
              type="link"
              size="small"
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                navigate("/admin/superadmin/checkoutdetails", {
                  state: { row },
                });
              }}
              icon={<EyeFilled />}
            >
              <strong style={{ fontSize: 14, fontWeight: 700 }}>
                {row.order_id}
              </strong>
            </Button>
            {row.status === "denied" && (
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
                    setDenyReason(row.denyreason);
                    setDenyReasonModalVisible(true);
                  }}
                />
              </Tooltip>
            )}
          </div>
          <div style={{ marginTop: 10, marginLeft: 10 }} className="text-muted">
            <div>
              Initiated on{" "}
              {new Date(row?.created_at).toLocaleDateString(
                "en-US",
                dateOptions
              )}
            </div>
            {row.status !== "pending" && (
              <div>
                Responded on{" "}
                {new Date(row?.modified_at).toLocaleDateString(
                  "en-US",
                  dateOptions
                )}
              </div>
            )}
            {row.status === "approved" && (
              <div style={{ fontWeight: 700 }}>
                Payment Reciept ID :{row.transaction_id}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      name: <div style={{ width: "100%", textAlign: "center" }}>Vendor</div>,
      selector: (row) => <div> {row.business_name}</div>,
      // width: "100px",
      style: { display: "flex", justifyContent: "center" },
    },
    {
      name: <div style={{ width: "100%", textAlign: "start" }}>Status</div>,
      selector: (row) => {
        if (row.status === "denied") {
          return (
            <div>
              <Avatar
                size={24}
                style={{ background: "red" }}
                icon={
                  <CloseOutlined style={{ fontSize: 12, color: "white" }} />
                }
              />
              <span style={{ textTransform: "capitalize", marginLeft: 5 }}>
                {row.status}
              </span>
            </div>
          );
        }
        if (row.status === "approved") {
          return (
            <div>
              <Avatar
                size={24}
                style={{ background: "green" }}
                icon={<PlusOutlined style={{ fontSize: 12, color: "white" }} />}
              />
              <span style={{ textTransform: "capitalize", marginLeft: 5 }}>
                {row.status}
              </span>
            </div>
          );
        }
        if (row.status === "pending") {
          return (
            <div>
              <Avatar
                style={{ background: "orange" }}
                size={24}
                icon={
                  <ExclamationOutlined
                    style={{ fontSize: 12, color: "white" }}
                  />
                }
              />
              <span style={{ textTransform: "capitalize", marginLeft: 5 }}>
                {row.status}
              </span>
            </div>
          );
        }
      },
      width: "200px",
      style: { display: "flex", justifyContent: "start" },
    },
    {
      name: (
        <div style={{ width: "100%", textAlign: "center" }}>
          Amount Requested
        </div>
      ),
      selector: (row) => <div>&#8377; {row.amount}</div>,
      // width: "100px",
      style: { display: "flex", justifyContent: "center" },
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        color: "#41444a",
        fontSize: "1rem",
      },
    },
    rows: {
      style: {
        height: "130px",
        width: "100%",
      },
    },
    cells: {
      style: {
        height: "100%",
        width: "100%",
      },
    },
  };
  useEffect(() => {
    const result = transactions.filter((transaction) => {
      return transaction?.order_id
        ?.toLocaleLowerCase()
        .match(search?.toLocaleLowerCase());
    });
    setFilteredTransactions(result);
  }, [search, transactions]);
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
            {/* <List
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
            /> */}
            <DataTable
              columns={columns}
              data={filteredTransactions}
              customStyles={customStyles}
              // selectableRows
              // selectableRowsHighlight
              highlightOnHover
              title={
                <h2
                  style={{
                    color: "#7cb028",
                    fontWeight: "bold",
                    marginTop: 20,
                    marginBottom: 0,
                  }}
                >
                  {!appUser.is_super_admin
                    ? "All Transactions"
                    : "All Vendor Transactiions"}
                </h2>
              }
              fixedHeader
              fixedHeaderScrollHeight="700px"
              pagination
              paginationRowsPerPageOptions={[5, 10, 15, 20]}
              subHeader
              subHeaderComponent={
                <div style={{ width: "20em", marginBottom: 10 }}>
                  <Input
                    prefix={<SearchOutlined />}
                    type="text"
                    placeholder="Search by OrderID "
                    style={{ width: "100%" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <p className="productsscrollformore">
                    {"Scroll for More -->"}
                  </p>
                </div>
              }
              subHeaderAlign="right"
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
