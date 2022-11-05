import { getSession, useSession } from 'next-auth/react'
import React from 'react'
import Header from '../components/Header'
import moment from 'moment'
import * as admin from 'firebase-admin'
import Order from '../components/Order'
// secure a connection to Firebase from the backend
const serviceAccount = require('../../firebase-permissions.json')

function Orders({ orders }) {
  const { data: session } = useSession()

  return (
    <div>
      <Header />

      <main className="max-w-screen mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>

        {session ? (
          <h2 className="text-">{orders.length} Order(s)</h2>
        ) : (
          <h2 className="text-">Please sign in to check your order(s)</h2>
        )}

        <div className="mt-5 space-y-4">
          {orders &&
            orders.map(
              ({
                id,
                amount,
                amountShipping,
                amountDiscount,
                items,
                timestamp,
                images,
              }) => (
                <Order
                  key={id}
                  id={id}
                  amount={amount}
                  amountShipping={amountShipping}
                  amountDiscount={amountDiscount}
                  items={items}
                  timestamp={timestamp}
                  images={images}
                />
              )
            )}
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

  const session = await getSession(context)

  if (!session) {
    return {
      props: {},
    }
  }

  const app = !admin.apps.length
    ? admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    : admin.app()

  const stripeOrders = await app
    .firestore()
    .collection('users')
    .doc(session.user.email)
    .collection('orders')
    .orderBy('timestamp', 'desc')
    .get()

  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      amountDiscount: order.data().amount_discount,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: (
        await stripe.checkout.sessions.listLineItems(order.id, {
          limit: 100,
        })
      ).data,
    }))
  )

  return {
    props: { orders: orders },
  }
}

export default Orders
