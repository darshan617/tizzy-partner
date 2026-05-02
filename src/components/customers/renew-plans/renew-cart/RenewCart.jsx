import React, { useState } from 'react'
import styles from '@/components/customers/renew-plans/renew-cart/RenewCart.module.css'
import Link from 'next/link'
import { IoMdArrowBack } from 'react-icons/io'

const RenewCart = () => {
    const [qty, setQty] = useState(10)
    const pricePerUser = 1000
    const total = pricePerUser * qty

    return (
        <>
            
            <div className={styles.card}>
                <div className={styles.cartRow}>
                    <div className={`${styles.servBadge} ${styles.tizzy}  flex-shrink-0`} title="Tizzy Mail"></div>
                    <div className={styles.productInfo}>
                        <div className={styles.productName}>Tizzy® Mail Enterprise 100 GB</div>
                        <Link href="https://goyalinfotech.com" className={styles.productLink}>goyalinfotech.com</Link>
                        <div className={styles.productDate}>25 May, 2025 – 25 May, 2026</div>
                    </div>

                    <div className={styles.priceCol}>
                        <div className={styles.colLabel}>Price</div>
                        <div className={styles.priceVal}>₹ {pricePerUser.toFixed(2)}</div>
                        <div className={styles.priceSub}>per user/year</div>
                    </div>

                    <div className={styles.licenseCol}>
                        <div className={styles.colLabel}>License</div>
                        <div className={styles.qtyCtrl}>
                            <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => setQty(q => q + 1)}>+</button>
                        </div>
                    </div>

                    <div className={styles.totalCol}>
                        <div className={styles.colLabel}>Total</div>
                        <div className={styles.priceVal}>₹ {total.toFixed(2)}</div>
                    </div>

                    <button className={styles.removeBtn}>×</button>
                </div>

                <hr className={styles.divider} />

                <div className={styles.subtotalRow}>
                    <span className={styles.subtotalLabel}>SUBTOTAL</span>
                    <span className={styles.subtotalVal}>₹ {total.toFixed(2)}</span>
                </div>
            </div>
        </>

    )
}

export default RenewCart