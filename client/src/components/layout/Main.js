/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useRef } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Layout, Drawer, Affix } from "antd";
import Sidenav from "./Sidenav";
import Header from "./Header";
import Footer from "./Footer";
import useAllContext from "../../context/useAllContext";
import LoadingScreen from "./LoadingScreen";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader, Content, Sider } = Layout;

function Main() {
  const [visible, setVisible] = useState(false);
  const [placement] = useState("right");
  const [sidenavColor, setSidenavColor] = useState("#86c61f");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type) => setSidenavType(type);
  const handleSidenavColor = (color) => setSidenavColor(color);
  const handleFixedNavbar = (type) => setFixed(type);

  const {
    appUser,
    setAppUser,
    isValidToken,
    fetchUserDetails,
    userToken,
    setUserToken,
  } = useAllContext();
  const navigate = useNavigate();

  const isFirstRender = useRef(true);

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  useEffect(() => {
    if (!isValidToken) {
      navigate("/auth/admin/login");
    } else {
      // console.log("isLoading :", isLoading);
      fetchUserDetails();
      isFirstRender.current = false;

      // console.log("isLoading :", isLoading);
    }
  }, [userToken, isValidToken, fetchUserDetails, isLoading, navigate]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!appUser.id) {
      setIsLoading(true);
    } else if (!appUser.is_admin) {
      navigate("/");
      // message.error("Permission denied!");
    } else if (appUser.is_admin) {
      setIsLoading(false);
    }
  }, [appUser, navigate]);

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Layout className={`layout-dashboard`}>
      <Drawer
        title={false}
        placement={placement === "right" ? "left" : "right"}
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        key={placement === "right" ? "left" : "right"}
        width={250}
        className={` drawer-sidebar ${
          pathname === "rtl" ? "drawer-sidebar-rtl" : ""
        } `}
      >
        <Layout
          className={`layout-dashboard ${
            pathname === "rtl" ? "layout-dashboard-rtl" : ""
          }`}
        >
          <Sider
            trigger={null}
            width={250}
            theme="light"
            className={`sider-primary ant-layout-sider-primary ${
              sidenavType === "#fff" ? "active-route" : ""
            }`}
            style={{ background: sidenavType }}
          >
            <Sidenav
              color={sidenavColor}
              setAppUser={setAppUser}
              setUserToken={setUserToken}
            />
          </Sider>
        </Layout>
      </Drawer>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {
          // console.log(collapsed, type);
        }}
        trigger={null}
        width={250}
        theme="light"
        className={`border-right sider-primary ant-layout-sider-primary ${
          sidenavType === "#fff" ? "active-route" : ""
        }`}
        style={{ background: sidenavType }}
        // style={{ background: "white" }}
      >
        <Sidenav
          color={sidenavColor}
          setAppUser={setAppUser}
          setUserToken={setUserToken}
        />
      </Sider>
      <Layout>
        {fixed ? (
          <Affix>
            <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
              <Header
                setAppUser={setAppUser}
                appUser={appUser}
                onPress={openDrawer}
                name={pathname}
                subName={pathname}
                handleSidenavColor={handleSidenavColor}
                handleSidenavType={handleSidenavType}
                handleFixedNavbar={handleFixedNavbar}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
            <Header
              setAppUser={setAppUser}
              appUser={appUser}
              onPress={openDrawer}
              name={pathname}
              subName={pathname}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
            />
          </AntHeader>
        )}
        <Content className="content-ant">
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default Main;
