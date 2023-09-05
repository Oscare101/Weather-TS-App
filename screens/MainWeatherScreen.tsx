import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import { GetTheme } from '../functions/functions'
import colors from '../constans/colors'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { setTheme } from '../redux/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setTemperature } from '../redux/temperature'
import TodayBlock from '../components/TodayBlock'
import RenderThemeSettings from '../components/RenderThemeSettings'
import RenderPeriodItem from '../components/RenderPeriodItem'
import RenderForecast from '../components/RenderForecast'

const width = Dimensions.get('window').width

const key = '560acc0035e34065aa1131102230509'

export default function MainWeatherScreen() {
  const systemTheme = useColorScheme()
  const dispatch = useDispatch()
  const { theme } = useSelector((state: RootState) => state.theme)

  const [location, setLocation] = useState<any>({})
  const [period, setPeriod] = useState<number>(1)

  const [weatherForecast, setWeatherForecast] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [modal, setModal] = useState<boolean>(false)

  const weatherForecastPeriodData = [
    {
      title: 'today',
      state: 1,
      action: () => setPeriod(1),
    },
    {
      title: '3 days',
      state: 3,
      action: () => setPeriod(3),
    },
    {
      title: 'week',
      state: 7,
      action: () => setPeriod(7),
    },
    {
      title: '2 weeks',
      state: 14,
      action: () => setPeriod(14),
    },
  ]

  const themeSettingsData = [
    {
      title: 'System',
      state: 'system',
      icon: 'phone-portrait-outline',
      action: () => {
        dispatch(setTheme('system'))
        AsyncStorage.setItem('theme', 'system')
      },
    },
    {
      title: 'Dark',
      state: 'dark',
      icon: 'moon-outline',
      action: () => {
        dispatch(setTheme('dark'))
        AsyncStorage.setItem('theme', 'dark')
      },
    },
    {
      title: 'Light',
      state: 'light',
      icon: 'sunny-outline',
      action: () => {
        dispatch(setTheme('light'))
        AsyncStorage.setItem('theme', 'light')
      },
    },
  ]

  async function GetLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied')
      return
    }

    let location = await Location.getCurrentPositionAsync({})
    setLocation(location)
  }

  async function GetWeatherForecast() {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location.coords.latitude},${location.coords.longitude}&days=${period}`
    )
    const data = await response.json()
    setWeatherForecast(data)
    setLoading(false)
  }

  useEffect(() => {
    GetLocation()
  }, [])

  useEffect(() => {
    if (location.coords) {
      GetWeatherForecast()
    }
  }, [location, period])

  return (
    <View
      style={{
        backgroundColor:
          GetTheme(systemTheme, theme) === 'dark'
            ? colors.DarkBG
            : colors.LightBG,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <View
        style={{
          width: '100%',
          borderBottomWidth: 1,
          padding: 10,
          paddingHorizontal: '4%',
          borderBottomColor:
            GetTheme(systemTheme, theme) === 'dark'
              ? colors.DarkBorder
              : colors.LightBorder,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ width: 24 }} />
        <Text
          style={{
            fontSize: 30,
            fontWeight: '100',

            color:
              GetTheme(systemTheme, theme) === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
          }}
        >
          Weather
        </Text>
        <TouchableOpacity
          onPress={() => {
            setModal(true)
          }}
        >
          <Ionicons
            name="ios-color-palette-outline"
            size={24}
            color={
              GetTheme(systemTheme, theme) === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText
            }
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, width: '100%' }}>
        {weatherForecast.current ? (
          <TodayBlock weatherForecast={weatherForecast} />
        ) : (
          <></>
        )}
        <View
          style={{
            width: '92%',
            alignSelf: 'center',
          }}
        >
          <FlatList
            style={{ marginVertical: width * 0.92 * 0.02 }}
            horizontal
            scrollEnabled={false}
            data={weatherForecastPeriodData}
            renderItem={(item: any) => (
              <RenderPeriodItem
                item={item.item}
                period={period}
                setLoading={() => setLoading(true)}
              />
            )}
          />
          {!loading && weatherForecast.forecast ? (
            <FlatList
              scrollEnabled={false}
              data={weatherForecast.forecast.forecastday}
              renderItem={(item: any) => (
                <RenderForecast item={item.item} period={period} />
              )}
            />
          ) : (
            <View
              style={{
                height: 60,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator
                size={'large'}
                color={
                  GetTheme(systemTheme, theme) === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                }
              />
            </View>
          )}
        </View>
        {/* MODAL */}
        <Modal visible={modal} transparent={true} style={{ flex: 1 }}>
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setModal(false)}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor:
                    GetTheme(systemTheme, theme) === 'dark'
                      ? colors.DarkBGComponent
                      : colors.LightBGComponent,
                  padding: 20,
                  position: 'absolute',
                  top: 50,
                  right: 15,
                  borderRadius: 8,
                  elevation: 5,
                  paddingVertical: 20,
                  paddingHorizontal: 16,
                }}
              >
                <FlatList
                  scrollEnabled={false}
                  data={themeSettingsData}
                  renderItem={(item: any) => (
                    <RenderThemeSettings
                      item={item.item}
                      closeModal={() => setModal(false)}
                    />
                  )}
                  ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </View>
  )
}
