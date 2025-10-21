import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTachometerAlt, FaUser, FaQuestionCircle, FaClipboardList, FaSearch, FaSignOutAlt, FaBars } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
    // Dispatch event for AuthLayout to update main content margin
    const width = !expanded ? 220 : 70; // expanded width : collapsed width
    window.dispatchEvent(new CustomEvent("sidebarToggle", { detail: width }));
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Profile", path: "/profile", icon: <FaUser /> },
    { name: "Ask a Doubt", path: "/ask-doubt", icon: <FaQuestionCircle /> },
    { name: "Your Doubts", path: "/your-doubts", icon: <FaClipboardList /> },
    { name: "Explore Doubts", path: "/explore-doubts", icon: <FaSearch /> },
    { name: "Logout", action: () => { logout(); navigate("/login"); }, icon: <FaSignOutAlt /> }
  ];

  return (
    <div className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      
      {/* Project Name / Logo */}
      <div className="sidebar-header">
        {expanded ? <h1 className="project-name">EduQuery</h1> : <h1 className="project-name">EQ</h1>}
      </div>

      {/* Toggle button */}
      <div className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </div>

      {/* Navigation items */}
      <nav className="nav-items">
        {navItems.map(item => (
          item.path ? (
            <NavLink
              key={item.name}
              to={item.path}
              className="nav-link"
              activeclassname="active"
            >
              <span className="icon">{item.icon}</span>
              {expanded && <span className="link-text">{item.name}</span>}
            </NavLink>
          ) : (
            <button
              key={item.name}
              onClick={item.action}
              className="nav-link logout-btn"
            >
              <span className="icon">{item.icon}</span>
              {expanded && <span className="link-text">{item.name}</span>}
            </button>
          )
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
