import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm, message, Input, Card } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import useAllContext from "../../../../context/useAllContext";
import LoadingScreen from "../../../layout/LoadingScreen";

function AllUsers() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { appUser } = useAllContext();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const allUsers = await axios.get("http://localhost:5000/allusers", {
        is_super_admin: appUser.is_super_admin,
      });
      //   console.log(allUsers.data);
      setUsers(allUsers.data);
    } catch (err) {
      setUsers([]);
    }
    setLoading(false);
  }, [appUser.is_super_admin]);
  useEffect(() => {
    if (!appUser.is_super_admin) {
      navigate("/admin/dashboard");
    }
    fetchUsers();
  }, [fetchUsers, appUser.is_super_admin, navigate]);

  useEffect(() => {
    const result = users.filter((user) => {
      return user.name.toLocaleLowerCase().match(search.toLocaleLowerCase());
    });
    setFilteredUsers(result);
  }, [search, users]);

  const deleteUserFromUsers = async (userId) => {
    setButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[userId] = true;
      return newLoadings;
    });

    try {
      const results = await axios.delete(
        `http://localhost:5000/deleteuser/${userId}`
      );

      //   console.log(userId);
      if (results.status === 200) {
        setUsers((prevData) => prevData.filter((item) => item.id !== userId));
        message.success("User Deleted successfully");
      } else {
        throw new Error("Failed to delete User");
      }
    } catch (error) {
      console.error("server error", error);
      message.error("server error, error code 500");
    }
    setButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[userId] = false;
      return newLoadings;
    });
  };
  //handle disable
  const disableUserFromUsers = async (userId) => {
    setButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[userId] = true;
      return newLoadings;
    });
    // console.log(userId);
    try {
      const results = await axios.put(
        `http://localhost:5000/disableuser/${userId}`
      );

      //   console.log(userId);
      if (results.status === 200) {
        // setUsers((prevData) => prevData.filter((item) => item.id !== userId));
        message.success("User Disabled successfully");
        fetchUsers();
      } else {
        throw new Error("Failed to Disable User");
      }
    } catch (error) {
      console.error("server error", error);
      message.error("server error, error code 500");
    }
    setButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[userId] = false;
      return newLoadings;
    });
  };

  //handle enable user
  const enableUserFromUsers = async (userId) => {
    setButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[userId] = true;
      return newLoadings;
    });
    // console.log(userId);
    try {
      const results = await axios.put(
        `http://localhost:5000/enableuser/${userId}`
      );

      //   console.log(userId);
      if (results.status === 200) {
        // setUsers((prevData) => prevData.filter((item) => item.id !== userId));
        message.success("User Enabled successfully");
        fetchUsers();
      } else {
        throw new Error("Failed to Enable User");
      }
    } catch (error) {
      console.error("server error", error);
      message.error("server error, error code 500");
    }
    setButtonLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[userId] = false;
      return newLoadings;
    });
  };

  const columns = [
    {
      name: "User",

      width: "20%",
      cell: (row) => (
        <div
          style={{
            maxHeight: "100%",
            minWidth: "100%",
            overflow: "hidden",
            lineHeight: "1.5",
            textDecoration: row.isactive ? "none" : "underline",
            textDecorationColor: row.isactive ? "none" : "red",
          }}
        >
          <strong style={{ marginTop: 10 }} className="two-lines">
            {row.name}
          </strong>
        </div>
      ),
    },

    {
      name: <div style={{ width: "100%", textAlign: "center" }}>Email</div>,
      selector: (row) => row.email,
      width: "30%",
      style: { display: "flex", justifyContent: "center" },
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      width: "20%",
    },

    {
      name: <div style={{ width: "100%", textAlign: "center" }}>Actions</div>,
      style: { display: "flex", justifyContent: "center" },
      width: "200px",
      cell: (row) => (
        <>
          {row.isactive ? (
            <Popconfirm
              title="Are you sure you want to disable this user?"
              onConfirm={() => disableUserFromUsers(row.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                style: {
                  height: 40,
                  width: 40,
                  background: "#f53131",
                  color: "white",
                },
              }}
              cancelButtonProps={{
                style: { height: 40, width: 40 },
                type: "default",
              }}
            >
              <Button
                id={row.id}
                style={{
                  width: "51%",
                  marginLeft: 10,
                  background: "orange",
                  color: "#fff",
                }}
                type="primary"
                icon={<CloseCircleOutlined />}
                loading={buttonLoading[row.id]}
              >
                Disable
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to enable this user?"
              onConfirm={() => enableUserFromUsers(row.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                style: {
                  height: 40,
                  width: 40,
                  background: "#f53131",
                  color: "white",
                },
              }}
              cancelButtonProps={{
                style: { height: 40, width: 40 },
                type: "default",
              }}
            >
              <Button
                id={row.id}
                style={{
                  width: "51%",
                  marginLeft: 10,
                  background: "green",
                  color: "#fff",
                }}
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={buttonLoading[row.id]}
              >
                Enable
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => deleteUserFromUsers(row.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: {
                height: 40,
                width: 40,
                background: "#f53131",
                color: "white",
              },
            }}
            cancelButtonProps={{
              style: { height: 40, width: 40 },
              type: "default",
            }}
          >
            <Button
              id={row.id}
              style={{
                width: "51%",
                marginLeft: 10,
                background: "#9e2426",
                color: "#fff",
              }}
              danger
              type="primary"
              icon={<DeleteOutlined />}
              loading={buttonLoading[row.id]}
            >
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
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
        height: "100px",
        width: "100%",
      },
    },
    cells: {
      style: {
        height: "100%",
        width: "100%",
        fontSize: 14,
      },
    },
  };

  return !loading ? (
    <>
      <Card>
        {/* <Header search={search} setSearch={setSearch} /> */}
        <DataTable
          columns={columns}
          data={filteredUsers}
          customStyles={customStyles}
          // selectableRows
          // selectableRowsHighlight
          highlightOnHover
          title={
            <h2 style={{ color: "#ff8400", fontWeight: "bold" }}>All users</h2>
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
                placeholder="Search Users"
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
    </>
  ) : (
    <LoadingScreen />
  );
}
export default AllUsers;
