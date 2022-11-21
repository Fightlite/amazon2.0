import { StarIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Currency from 'react-currency-formatter'
import { addToBasket, increaseItem, selectItems } from '../slices/basketSlice'

function Product({ id, title, price, description, category, image, rating }) {
  const items = useSelector(selectItems)
  const [hasPrime, setHasPrime] = useState(Math.random() < 0.5)
  const dispatch = useDispatch()

  const addItemToBasket = () => {
    const productExist = items.find((item) => item.id === id)

    if (productExist) {
      dispatch(increaseItem({ id }))
    } else {
      const product = {
        id,
        title,
        price,
        description,
        category,
        image,
        rating,
        hasPrime,
        quantity: 1,
      }
      // send the product as an action to the Redux store
      dispatch(addToBasket(product))
    }
  }

  return (
    <div className="relative flex flex-col m-5 bg-white p-10 z-30 rounded-md">
      <p className="absolute top-2 right-3 text-xs italic text-gray-400">
        {category}
      </p>

      <Image src={image} height={200} width={200} objectFit="contain" />

      <h4 className="my-3">{title}</h4>

      <div className="flex">
        {Array(Math.round(rating.rate))
          .fill()
          .map((_, i) => (
            <StarIcon key={i} className="h-5 text-yellow-500" />
          ))}
      </div>

      <p className="text-xs my-2 line-clamp-2">{description}</p>

      <div className="mb-5">
        <Currency quantity={price} currency="USD" />
      </div>

      {hasPrime && (
        <div className="flex items-center space-x-2 -mt-5">
          <img className="w-12" src="https://links.papareact.com/fdw" alt="" />
          <p className="text-xs text-gray-500">Free Next-day Delivery</p>
        </div>
      )}

      <button className="button mt-auto" onClick={addItemToBasket}>
        Add to Basket
      </button>
    </div>
  )
}

export default Product
