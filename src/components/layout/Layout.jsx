import React, { useState } from "react";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import Sidebar from "./sidebar/Sidebar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 100, }}>
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
          zIndex: 222,
        }}
      >
        <div>
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
