import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      state.items = [...state.items, action.payload]
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      )

      if (index !== -1) {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        )
      } else {
        console.warn(`Cant remove product as its not in the basket`)
      }
    },
    emptyBasket: (state) => {
      state.items = []
    },
    increaseItem: (state, action) => {
      const updatedBasket = state.items.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, quantity: item.quantity + 1 }
        }
        return item
      })

      state.items = updatedBasket
    },
    decreaseItem: (state, action) => {
      const updatedBasket = state.items
        .map((item) => {
          if (item.id === action.payload.id && item.quantity > 0) {
            return { ...item, quantity: item.quantity - 1 }
          }
          return item
        })
        .filter((item) => item.quantity !== 0)

      state.items = updatedBasket
    },
  },
})

export const {
  addToBasket,
  removeFromBasket,
  emptyBasket,
  increaseItem,
  decreaseItem,
} = basketSlice.actions

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items
export const selectTotal = (state) =>
  state.basket.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

export default basketSlice.reducer
