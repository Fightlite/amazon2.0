const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  const { items, email } = req.body

  const transformedItems = items.map((item) => ({
    quantity: 1,
    price_data: {
      currency: 'usd',
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        description: item.description,
        images: [item.image],
      },
    },
  }))

  if (transformedItems.length > 0) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_options: [{ shipping_rate: 'shr_1M0S9JEZR5nbTE4JDeXLoWiv' }],
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB'],
        },
        line_items: transformedItems,
        mode: 'payment',
        success_url: `${process.env.HOST}/success`,
        cancel_url: `${process.env.HOST}/checkout`,
        customer_email: email,
        metadata: {
          email,
          images: JSON.stringify(items.map((item) => item.image)),
        },
      })

      res.status(200).json({ id: session.id })
    } catch (e) {
      console.log(e)
      res.status(400).send({
        error: {
          message: e.message,
        },
      })
    }
  }
  // res.redirect(303, session.url)
}
