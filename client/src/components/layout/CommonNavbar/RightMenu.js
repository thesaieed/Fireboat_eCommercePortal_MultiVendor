import React from "react";
import { Menu, Button, Dropdown, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import useAllContext from "../../../context/useAllContext";

const RightMenu = ({ mode }) => {
  const { appUser, logout } = useAllContext();
  const navigate = useNavigate();
  const dashboardIcon = [
    <svg
      width="15"
      height="15"
      viewBox="5 2 15 15"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill="grey"
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill="grey"
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill="grey"
      ></path>
    </svg>,
  ];

  const items = [
    appUser.is_admin
      ? {
          label: <Link to="/admin/dashboard">Dashboard</Link>,
          key: "dashboard",
          icon: dashboardIcon,
        }
      : null,
    {
      label: <Link to="/profile">Profile</Link>,
      key: "Profile",
      icon: <UserOutlined />,
    },
    {
      label: (
        <Button
          type="primary"
          danger
          block
          onClick={() => {
            logout();
          }}
        >
          <LogoutOutlined /> Logout
        </Button>
      ),
      key: "Logout",
      style: { padding: 0 },
    },
  ];
  const loginMenuItem = [
    {
      label: (
        <Link to="/login">
          <UserOutlined style={{ fontWeight: 600 }} />
          <span style={{ fontWeight: 600 }}>Login</span>
        </Link>
      ),
      key: "loginLink",
      style: { background: "transparent" },
    },
  ];
  const navMenuItems = [
    appUser?.id
      ? {
          label: (
            <>
              {<UserOutlined />}
              <span className="navUsername">{appUser.name}</span>
            </>
          ),
          key: "navMenuUserName",
          children: [
            appUser.is_admin && {
              label: (
                <Link to="/admin/dashboard">{dashboardIcon} Dashboard</Link>
              ),
              key: "dashboardlink",
            },

            {
              label: (
                <Link to="/profile">
                  <UserOutlined /> Profile
                </Link>
              ),
              key: "profilelink",
            },
            {
              label: (
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    logout();
                  }}
                  style={{ marginLeft: -5, width: "100%" }}
                >
                  <LogoutOutlined /> Logout
                </Button>
              ),
              key: "logoutbutton",
            },
          ],
        }
      : {
          label: (
            <Button
              className="navLoginBtn"
              type="primary"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
          ),
          key: "loginbutton",
        },
  ];

  const menuProps = {
    items,
  };

  return appUser.id ? (
    <>
      <Dropdown menu={menuProps} className="Dropdown">
        <Space>
          {<UserOutlined />}
          <span className="navUsername">{appUser.name}</span>
          <DownOutlined />
        </Space>
      </Dropdown>

      <Menu mode={mode} className="navMenu" items={navMenuItems} />
    </>
  ) : (
    <>
      <Menu mode={mode} className="navMenu" items={loginMenuItem} />
      <Link to="/login">
        <Button
          type="link"
          className="Dropdown"
          style={{
            background: "transparent",
            color: "#000",
            fontWeight: 600,
            letterSpacing: 1,
          }}
          icon={<UserOutlined style={{ color: "#000" }} />}
        >
          Login
        </Button>
      </Link>
    </>
  );
};

export default RightMenu;
