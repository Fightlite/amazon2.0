import { buffer } from 'micro'
import * as admin from 'firebase-admin'
// secure a connection to Firebase from the backend
const serviceAccount = require('../../../firebase-permissions.json')
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app()

// create a connection to Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const endpointSecret = process.env.STRIPE_SIGNING_SECRET

const fulfillOrder = async (session) => {
  // console.log('fulfilling the order', session)
  return app
    .firestore()
    .collection('users')
    .doc(session.metadata.email)
    .collection('orders')
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping,
      amount_discount: session.total_details.amount_discount,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`Successful save order ${session.id} to the database`)
    })
}

export default async (req, res) => {
  if (req.method === 'POST') {
    // get the raw data from the request
    const requestBuffer = await buffer(req)
    const payload = requestBuffer.toString()
    const sig = req.headers['stripe-signature']

    let event

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    } catch (err) {
      console.log('ERROR', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object

        // fulfill the order to the database
        return fulfillOrder(session)
          .then(() => res.status(200))
          .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`))
        // console.log('Checkout session was successful!')
        break
      case 'payment_method.attached':
        const paymentMethod = event.data.object
        console.log('PaymentMethod was attached to a Customer!')
        break
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    // Return a response to acknowledge receipt of the event
    // res.json({ received: true })
  }

  //   if (request.method === 'GET') {
  //   }
}

// make sure get the raw data from the request
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}
