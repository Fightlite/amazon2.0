import React from 'react'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/solid'
import Currency from 'react-currency-formatter'
import { useDispatch } from 'react-redux'
import {
  removeFromBasket,
  increaseItem,
  decreaseItem,
} from '../slices/basketSlice'

function CheckoutProduct({
  id,
  title,
  price,
  description,
  category,
  image,
  rating,
  hasPrime,
  quantity,
}) {
  const dispatch = useDispatch()

  const IncreaseItem = () => {
    dispatch(increaseItem({ id }))
  }

  const DecreaseItem = () => {
    dispatch(decreaseItem({ id }))
  }

  const removeItemFromBasket = () => {
    dispatch(removeFromBasket({ id }))
  }

  return (
    <div className="flex flex-row items-center justify-center">
      <Image src={image} height={160} width={160} objectFit="contain" />

      <div className="flex-1 ml-5">
        <p className="title">{title}</p>
        <div className="flex">
          {Array(Math.round(rating.rate))
            .fill()
            .map((_, i) => (
              <StarIcon key={i} className="h-5 text-yellow-500" />
            ))}
        </div>
        <p className="text-xs my-2 line-clamp-3">{description}</p>

        <div className="mb-1">
          <Currency quantity={price} currency="USD" />
        </div>

        {hasPrime && (
          <div className="flex items-center space-x-2">
            <img
              className="w-12"
              src="https://links.papareact.com/fdw"
              alt=""
            />
            <p className="text-xs text-gray-500">Free Next-day Delivery</p>
          </div>
        )}

        <div className="flex justify-center my-2 max-w-fit">
          <button onClick={DecreaseItem} className="btn p-2">
            -
          </button>
          <input
            type="text"
            value={quantity}
            readOnly={true}
            className="p-2"
            style={{ maxWidth: '40px' }}
          />
          <button onClick={IncreaseItem} className="btn p-2">
            +
          </button>
        </div>
        <button className="button" onClick={removeItemFromBasket}>
          Remove from Basket
        </button>
      </div>
    </div>
  )
}

export default CheckoutProduct
