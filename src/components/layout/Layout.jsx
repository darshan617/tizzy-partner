import React, { useState } from "react";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import Sidebar from "./sidebar/Sidebar";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div
        style={{
          display: "flex",
          overflow: "hidden",
          height: "calc(100vh - 75px)",
          width: "100%",
          position: "sticky",
        }}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className={styles.contentWrapper}>{children}</div>
      </div>
    </>
  );
};

export default Layout;
