import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const temperatureSlice = createSlice({
  name: 'temperature',
  initialState: {
    temperature: 'celsius', // celsius fahrenheit
  },
  reducers: {
    setTemperature(state, value: PayloadAction<string>) {
      state.temperature = value.payload
    },
  },
})

export const { setTemperature } = temperatureSlice.actions
export default temperatureSlice.reducer
