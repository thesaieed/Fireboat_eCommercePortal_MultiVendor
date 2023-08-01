import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Card, Input, List, Button, Typography, Layout, message } from "antd";
import {
  SearchOutlined,
  EyeFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
  QuestionCircleFilled,
} from "@ant-design/icons";
import useAllContext from "../../../../context/useAllContext";
import axios from "axios";
import CommonNavbar from "../../../layout/CommonNavbar";
import Footer from "../../../layout/Footer";
const UserOrders = () => {
  const { appUser, isValidToken } = useAllContext();
  const [search, setSearch] = useState("");
  const [allOrders, setAllOrders] = useState();
  const [filteredOrders, setFilteredOrders] = useState();
  const [orderProducts, setOrderProducts] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const getAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      var orders = await axios.post("http://localhost:5000/allorders", {
        user_id: appUser.id,
      });

      setAllOrders(orders.data.orders);
      setFilteredOrders(orders.data.orders);
      setOrderProducts(orders.data.products);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, [appUser.id]);

  useEffect(() => {
    if (!isValidToken && !appUser.id) {
      message.info("You need to be Logged In!");
      navigate("/auth/login");
    } else {
      getAllOrders();
    }
  }, [getAllOrders, appUser.id, navigate, isValidToken]);
  useEffect(() => {
    const result = allOrders?.filter((order) => {
      return Object.keys(order)[0]
        .toLocaleLowerCase()
        .match(search.toLocaleLowerCase());
    });
    setFilteredOrders(result);
  }, [search, allOrders]);

  const getOrderDetails = async (order) => {
    const order_id = Object.keys(order)[0];
    const orderProducts = order[order_id];
    const completeProductsWithAllDetails = await Promise.all(
      orderProducts.map(async (product) => {
        try {
          const { data } = await axios.post(
            "http://localhost:5000/orders/getOrderProductDetails",
            {
              address_id: product.address_id,
              payment_details_id: product.payment_details_id,
              user_id: product.user_id,
              product_id: product.product_id,
              order_id,
            }
          );
          return { ...product, ...data };
        } catch (error) {
          console.error(error);
        }
      })
    );
    navigate("/orderdetails", {
      state: { completeProductsWithAllDetails },
    });
    // setModalDataLoading(false);
  };
  const handleSearch = (e) => {
    navigate(`/browse/?search=${e.target.value}`);
  };
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
      name: <div style={{ width: "100%", textAlign: "center" }}>Order ID</div>,
      selector: (row) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button
            type="link"
            onClick={() => {
              getOrderDetails(row);
            }}
            icon={<EyeFilled style={{ fontSize: 16 }} />}
          >
            {Object.keys(row)[0]}
          </Button>

          <Typography.Text
            type="secondary"
            style={{
              textAlign: "center",
              textTransform: "capitalize",
              display:
                Object.values(row)[0][0].payment_status !== "success" && "none",
            }}
          >
            {Object.values(row)[0].find((o) => {
              if (o.order_status !== "delivered") {
                return true;
              } else return false;
            })
              ? "Pending"
              : "Delivered"}
          </Typography.Text>
        </div>
      ),
      width: "150px",
      style: { display: "flex", justifyContent: "center" },
    },
    {
      name: (
        <div style={{ width: "100%", textAlign: "center" }}>Ordered On</div>
      ),
      selector: (row) => {
        // console.log("ROW", row);
        const key = Object.keys(row)[0];

        const date = new Date(row[key][0]?.created_at);
        return date.toLocaleDateString("en-US", dateOptions);
      },
      width: "250px",
      style: { display: "flex", justifyContent: "center" },
    },
    {
      name: <div style={{ width: "100%", textAlign: "center" }}>Products</div>,
      selector: (row) => {
        const key = Object.keys(row)[0];
        // console.log(row[key]);
        var productNames = new Set();
        row[key].map((order) => {
          orderProducts.forEach((product) => {
            if (product.id === order.product_id) productNames.add(product.name);
          });
          return null;
        });

        return (
          <List
            // bordered
            dataSource={productNames}
            renderItem={(item) => <List.Item>&#x2022; {item}</List.Item>}
          />
        );
      },
      width: "auto",
      style: { display: "flex", justifyContent: "start" },
    },
    {
      name: (
        <div style={{ width: "100%", textAlign: "center" }}>Payment Status</div>
      ),
      selector: (row) => {
        // console.log("ROW", row);
        const key = Object.keys(row)[0];

        if (row[key][0]?.payment_status === "success") {
          return (
            <span
              style={{
                color: "green",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              <CheckCircleFilled style={{ fontSize: 16, marginRight: 4 }} />
              {row[key][0]?.payment_status}
            </span>
          );
        } else if (row[key][0]?.payment_status === "failure") {
          return (
            <span
              style={{
                color: "red",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              <ExclamationCircleFilled
                style={{ fontSize: 16, marginRight: 4 }}
              />{" "}
              {row[key][0]?.payment_status}
            </span>
          );
        } else {
          return (
            <span
              style={{
                color: "orange",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              <QuestionCircleFilled style={{ fontSize: 16, marginRight: 4 }} />
              {row[key][0]?.payment_status}
            </span>
          );
        }
      },

      width: "200px",
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
        // height: "100px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "7px",
      },
    },
    cells: {
      style: {
        height: "100%",
        width: "100%",
      },
    },
  };

  return (
    <Layout className="layout-default">
      <CommonNavbar handleSearch={handleSearch} />
      <Card loading={loading}>
        {/* <Header search={search} setSearch={setSearch} /> */}
        <DataTable
          columns={columns}
          data={filteredOrders}
          customStyles={customStyles}
          // selectableRows
          // selectableRowsHighlight
          highlightOnHover
          title={
            <h2 style={{ color: "#7cb028", fontWeight: "bold" }}>All Orders</h2>
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
                placeholder="Search Orders by ID"
                style={{ width: "100%" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <p className="productsscrollformore">{"Scroll for More -->"}</p>
            </div>
          }
          subHeaderAlign="right"
        />
      </Card>
      <Footer />
    </Layout>
  );
};

export default UserOrders;
