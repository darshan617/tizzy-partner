import CustomerDetail from "@/components/customers/customers-details/CustomersDetails";
import OrderSummaryCard from "@/components/customers/renew-plans/order-summary/OrderSummaryCard";
import RenewCart from "@/components/customers/renew-plans/renew-cart/RenewCart";
import React, { useState } from "react";

const CommonOrderSummary = () => {
  const [lisceneCounter, setLisceneCounter] = useState(1);
  const pricePerUser = 1000;
  const total = pricePerUser * lisceneCounter;
  return (
    <div className="d-flex align-items-start gap-3">
      <RenewCart
        lisceneCounter={lisceneCounter}
        setLisceneCounter={setLisceneCounter}
        pricePerUser={pricePerUser}
        total={total}
      />
      <OrderSummaryCard
        lisceneCounter={lisceneCounter}
        setLisceneCounter={setLisceneCounter}
        pricePerUser={pricePerUser}
        total={total}
      />
    </div>
  );
};

export default CommonOrderSummary;
