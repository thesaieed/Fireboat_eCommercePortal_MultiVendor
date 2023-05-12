import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import "antd/dist/antd.min.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import SignUp from "./components/SignUp";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/login" element={<SignIn />}></Route>
      </Routes>
    </div>
  );
}

export default App;
