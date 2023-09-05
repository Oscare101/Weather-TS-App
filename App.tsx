import { StatusBar, useColorScheme } from 'react-native'
import MainWeatherScreen from './screens/MainWeatherScreen'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './redux/store'
import { RootState } from './redux'
import { useEffect } from 'react'
import * as NavigationBar from 'expo-navigation-bar'
import { setTheme } from './redux/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import colors from './constans/colors'
import { GetTheme } from './functions/functions'

export default function App() {
  function InAppComponent() {
    const dispatch = useDispatch()
    const systemTheme = useColorScheme()
    const { theme } = useSelector((state: RootState) => state.theme)

    async function GetThemeFunc() {
      const theme = await AsyncStorage.getItem('theme')
      if (theme) {
        dispatch(setTheme(theme))
      }
    }

    useEffect(() => {
      GetThemeFunc()
    }, [])

    useEffect(() => {
      NavigationBar.setBackgroundColorAsync(
        GetTheme(systemTheme, theme) === 'dark' ? colors.DarkBG : colors.LightBG
      )
      NavigationBar.setButtonStyleAsync(
        GetTheme(systemTheme, theme) === 'dark' ? 'light' : 'dark'
      )
    }, [systemTheme, theme])

    return (
      <>
        <StatusBar
          barStyle={
            GetTheme(systemTheme, theme) === 'dark'
              ? 'light-content'
              : 'dark-content'
          }
          backgroundColor={
            GetTheme(systemTheme, theme) === 'dark'
              ? colors.DarkBG
              : colors.LightBG
          }
        />
        <MainWeatherScreen />
      </>
    )
  }

  return (
    <Provider store={store}>
      <InAppComponent />
    </Provider>
  )
}
