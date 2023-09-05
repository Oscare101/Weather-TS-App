import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './theme'
import temperatureReducer from './temperature'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    temperature: temperatureReducer,
  },
})
