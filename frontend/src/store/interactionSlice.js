import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  interactions: [],
}

const interactionSlice = createSlice({
  name: "interactions",

  initialState,

  reducers: {

    setInteractions: (state, action) => {
      state.interactions = action.payload
    },

    addInteraction: (state, action) => {
      state.interactions.unshift(action.payload)
    },

    deleteInteractionState: (state, action) => {
      state.interactions =
        state.interactions.filter(
          (item) => item.id !== action.payload
        )
    },

    updateInteractionState: (state, action) => {

      state.interactions =
        state.interactions.map((item) =>

          item.id === action.payload.id
            ? action.payload
            : item
        )
    }
  },
})

export const {
  setInteractions,
  addInteraction,
  deleteInteractionState,
  updateInteractionState
} = interactionSlice.actions

export default interactionSlice.reducer