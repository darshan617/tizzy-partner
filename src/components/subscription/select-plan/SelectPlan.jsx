import React from 'react'
import styles from '@/components/subscription/select-plan/SelectPlan.module.css'

const SelectPlan = () => {
    return (
        <div>
            <div className="col">
                <div className="row align-items-end">
                    <div className="col">
                        <div className={`${styles.breadcrumb} mb-0`}>
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
                                Subscriptions
                            </button>
                            <h1 className="breadcrumb-item active" aria-current="page">
                               Add New Subscription
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default SelectPlan