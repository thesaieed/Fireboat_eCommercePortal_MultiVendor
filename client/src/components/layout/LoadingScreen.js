import { Spin } from "antd";
const LoadingScreen = () => {
  return (
    <div className="vh-100 d-flex align-items-center justify-content-center ">
      <Spin size="large" />
    </div>
  );
};
export default LoadingScreen;
