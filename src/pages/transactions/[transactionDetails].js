import Layout from '@/components/layout/Layout'
import TransactionDetail from '@/components/transactions/transaction-details/TransactionDetail'
import React from 'react'

const transactionDetails = ({ orderId, partnerId }) => {
  console.log(orderId, partnerId);
  return (
    <Layout>
        <TransactionDetail orderId={orderId} partnerId={partnerId} />
    </Layout>
  )
}

export default transactionDetails