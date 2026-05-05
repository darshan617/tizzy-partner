import Image from 'next/image'
import React from 'react'
import bag from '@/assets/images/bag.png'
import invoice from '@/assets/images/invoice.png'
import styles from '@/components/customers/order-complete/OrderComplete.module.css'

const OrderComplete = () => {
    return (
        <div>
            <div className="col">
                <div className="row align-items-end">
                    <div className="col">
                        <nav className={`${styles.breadcrumb}`}>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className={styles.breadcrumbItem}
                            >
                                Dashboard 
                            </button>{" "}
                             /
                            <button
                                onClick={() => router.push("/customers")}
                                className={styles.breadcrumbItem}
                            >
                                Customers
                            </button>
                            /
                            <button
                                onClick={() => router.push("/customers")}
                                className={styles.breadcrumbItem}
                            >
                                Customers 00024
                            </button>
                            /
                            <h1 className="breadcrumb-item active" aria-current="page">
                                Renew plan
                            </h1>
                        </nav>
                    </div>
                </div>
            </div>
            <div className={`${styles.orderCard}`}>
                <div className="d-flex flex-column align-items-center justify-content-center">
                    <div className="mb-3">
                        <Image src={bag} alt="bag" width={50} height={50} />
                    </div>
                    <div className={`${styles.orderMainHead} mb-2`}>
                        YOUR ORDER PURCHASE IS SUCCESSFUL.
                    </div>
                    <div className={`${styles.orderHead}  mb-3 text-center`}>
                        <div><span className={`${styles.value}`}>₹19,938.8 </span>
                            <span className={`${styles.valueContent}`}>deducted from your credits</span>
                        </div>
                        <div className={`${styles.BalInfo}`}>
                           <span>Credit Balance - </span><span className={`${styles.CreditValue}`}>₹1,979.8</span>
                        </div>
                    </div>
                    <div className={`${styles.InvoiceImg} my-4`}>
                        <Image
                            src={invoice}
                            alt="Tax Invoice" width={300} height={425}
                           
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderComplete