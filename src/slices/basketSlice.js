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
  },
})

export const { addToBasket, removeFromBasket } = basketSlice.actions

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items
export const selectTotal = (state) =>
  state.basket.items.reduce((total, item) => total + item.price, 0)

export default basketSlice.reducer
