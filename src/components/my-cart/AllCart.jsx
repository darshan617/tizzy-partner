import React, { useMemo } from "react";
import CommonOrderSummary from "@/common-components/common-order-summary/CommonOrderSummary";
import styles from "./AllCart.module.css";
import { useRouter } from "next/router";

const CART_TABS = [
  { id: "microsoft", label: "Microsoft 365" },
  { id: "tizzy", label: "Tizzy Mail" },
];

const AllCart = () => {
  return (
    <div>
      <div>
        <CommonOrderSummary />
      </div>
    </div>
  );
};

export default AllCart;
