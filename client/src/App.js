import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import "antd/dist/antd.min.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </div>
  );
}

export default App;
