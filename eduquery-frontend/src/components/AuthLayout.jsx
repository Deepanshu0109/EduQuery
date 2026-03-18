import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import './AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
