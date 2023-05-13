import { Button, Space } from "antd";

export const Home = () => {
  const style = {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <div style={style}>
      <Space>
        <Button type="primary" href="/login">
          Login
        </Button>
        <Button danger href="/signup">
          Signup
        </Button>
        <Button type="primary" href="admin/dashboard">
          Dashboard
        </Button>
      </Space>
    </div>
  );
};
export default Home;
