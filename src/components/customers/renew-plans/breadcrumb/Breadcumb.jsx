import React from 'react'
import styles from '@/components/customers/renew-plans/breadcrumb/Breadcrumb.module.css'
import Link from 'next/link'
import { IoMdArrowBack } from 'react-icons/io'
const Breadcrumb = () => {
    return (
        <div>
            <div className="col">
                <div className="row align-items-end ">
                    <div className="col">
                        <nav className={`${styles.breadcrumb} mb-0`}>
                            <a href="index.html" className={`${styles.breadcrumbItem}`}>
                                Dashboard
                            </a>
                            <a href="customers.html" className={`${styles.breadcrumbItem}`}>
                                Customers
                            </a>
                            <span className={`${styles.breadcrumbItem}`}></span>
                            <h1 className={`${styles.breadcrumbItem} ${styles.active}`} aria-current="page">
                                Customer - 00024
                            </h1>
                        </nav>
                    </div>
                    <div className="col-auto">
                        <Link href="customers.html" className="btn small btnWhite">
                            <IoMdArrowBack />
                            <span>Back</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Breadcrumb