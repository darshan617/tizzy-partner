import React, { useState } from "react";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import Sidebar from "./sidebar/Sidebar";
import styles from "./Layout.module.css";
import { useGetBalanceAndCartDetailsQuery } from "@/redux/apis/balanceAndCartApi";
import Cookies from "js-cookie";

const Layout = ({ children }) => {
  const userData = Cookies?.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies?.get("userData")))
    : {};
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: balanceAndCartData } = useGetBalanceAndCartDetailsQuery(
    { partner_id: userData?.id },
    {
      skip: !userData?.id,
    },
  );
  console.log(balanceAndCartData, "balanceAndCartData");
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          balanceAndCartData={balanceAndCartData?.data}
        />
      </div>
      <div
        style={{
          display: "flex",
          overflow: "hidden",
          // height: "calc(100vh - 75px)",
          height: "calc(100vh - 90px)",
          width: "100%",
          position: "sticky",
        }}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          balanceAndCartData={balanceAndCartData?.data}
        />
        <div className={styles.contentWrapper}>{children}</div>
      </div>
    </>
  );
};

export default Layout;
