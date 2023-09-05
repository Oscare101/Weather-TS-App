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
  const [temperature, setTemperature] = useState<string>('celcius')
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

  function RenderPeriodItem({ item, index }: any) {
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          padding: 5,
          alignItems: 'center',
          justifyContent: 'center',

          borderRadius: 8,
          width: width * 0.92 * 0.235,
          marginLeft: index ? width * 0.92 * 0.02 : 0,
          borderColor:
            GetTheme(systemTheme, theme) === 'dark'
              ? colors.DarkBorder
              : colors.LightBorder,
          backgroundColor:
            period === item.state
              ? GetTheme(systemTheme, theme) === 'dark'
                ? colors.DarkBGComponent
                : colors.LightBGComponent
              : GetTheme(systemTheme, theme) === 'dark'
              ? colors.DarkBG
              : colors.LightBG,
        }}
        activeOpacity={0.8}
        onPress={() => {
          setLoading(true)
          item.action()
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color:
              period === item.state
                ? GetTheme(systemTheme, theme) === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText
                : GetTheme(systemTheme, theme) === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText,
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  function TodayBlock() {
    return (
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          width: width * 0.92,
          borderWidth: 1,
          padding: 15,
          borderRadius: 15,
          marginTop: width * 0.04,
          borderColor:
            GetTheme(systemTheme, theme) === 'dark'
              ? colors.DarkBorder
              : colors.LightBorder,
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '50%',
          }}
        >
          <Image
            source={{
              uri: `https:${weatherForecast.current.condition.icon}`,
            }}
            style={{ width: 100, height: 100 }}
          />
          <Text
            style={{
              fontSize: 24,
              paddingTop: 10,
              color:
                GetTheme(systemTheme, theme) === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
            }}
          >
            {temperature === 'celcius'
              ? weatherForecast.current.temp_c
              : weatherForecast.current.temp_f}{' '}
            {temperature === 'celcius' ? 'C°' : 'F°'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '50%',
          }}
        >
          <TouchableOpacity
            style={{
              height: 50,
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-end',
              borderRadius: 8,
              backgroundColor:
                GetTheme(systemTheme, theme) === 'dark'
                  ? colors.DarkBGComponent
                  : colors.LightBGComponent,
            }}
            onPress={() =>
              setTemperature(
                temperature === 'celcius' ? 'fahrenheit' : 'celcius'
              )
            }
          >
            <MaterialCommunityIcons
              name={
                temperature === 'celcius'
                  ? 'temperature-celsius'
                  : 'temperature-fahrenheit'
              }
              size={24}
              color={
                GetTheme(systemTheme, theme) === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText
              }
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '300',
              paddingTop: 10,
              color:
                GetTheme(systemTheme, theme) === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
            }}
          >
            humidity {weatherForecast.current.humidity} %
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '300',
              paddingTop: 10,
              color:
                GetTheme(systemTheme, theme) === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
            }}
          >
            feels like{' '}
            {temperature === 'celcius'
              ? weatherForecast.current.feelslike_c
              : weatherForecast.current.feelslike_f}{' '}
            {temperature === 'celcius' ? 'C°' : 'F°'}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '300',
              paddingTop: 10,
              color:
                GetTheme(systemTheme, theme) === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
            }}
          >
            wind {weatherForecast.current.wind_kph} km/h
          </Text>
        </View>
      </View>
    )
  }

  function RenderHourForecast({ item }: any) {
    return (
      <View
        style={{ padding: 5, flexDirection: 'column', alignItems: 'center' }}
      >
        <Image
          source={{
            uri: `https:${item.condition.icon}`,
          }}
          style={{ width: 30, height: 30 }}
        />
        <Text
          style={{
            fontSize: 14,
            color:
              GetTheme(systemTheme, theme) === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
          }}
        >
          {temperature === 'celcius' ? item.temp_c : item.temp_f}{' '}
          {temperature === 'celcius' ? 'C°' : 'F°'}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color:
              GetTheme(systemTheme, theme) === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText,
          }}
        >
          {item.time.split(' ')[1]}
        </Text>
      </View>
    )
  }

  function RenderForecast({ item }: any) {
    return (
      <View
        style={{
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',

          borderRadius: 8,
          width: '100%',
          borderColor:
            GetTheme(systemTheme, theme) === 'dark'
              ? colors.DarkBorder
              : colors.LightBorder,
          marginBottom: width * 0.92 * 0.02,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
            padding: 8,
          }}
        >
          <Image
            source={{
              uri: `https:${item.day.condition.icon}`,
            }}
            style={{ width: 50, height: 50 }}
          />
          <View style={{ flexDirection: 'column' }}>
            <Text
              style={{
                fontSize: 14,
                color:
                  GetTheme(systemTheme, theme) === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText,
              }}
            >
              day{' '}
              {temperature === 'celcius'
                ? item.day.maxtemp_c
                : item.day.maxtemp_f}{' '}
              {temperature === 'celcius' ? 'C°' : 'F°'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color:
                  GetTheme(systemTheme, theme) === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText,
              }}
            >
              night{' '}
              {temperature === 'celcius'
                ? item.day.mintemp_c
                : item.day.mintemp_f}{' '}
              {temperature === 'celcius' ? 'C°' : 'F°'}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 14,

              color:
                period === item.state
                  ? GetTheme(systemTheme, theme) === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                  : GetTheme(systemTheme, theme) === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText,
            }}
          >
            {item.date}
          </Text>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={item.hour}
          renderItem={RenderHourForecast}
        />
      </View>
    )
  }

  function RenderThemeSettingsItem({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
        activeOpacity={0.8}
        onPress={() => {
          item.action()
          setModal(false)
        }}
      >
        <Ionicons
          name={item.icon}
          size={20}
          color={
            item.state === theme
              ? GetTheme(systemTheme, theme) === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText
              : GetTheme(systemTheme, theme) === 'dark'
              ? colors.DarkCommentText
              : colors.LightCommentText
          }
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: '100',
            paddingLeft: 10,
            color:
              item.state === theme
                ? GetTheme(systemTheme, theme) === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText
                : GetTheme(systemTheme, theme) === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText,
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

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
        {weatherForecast.current ? <TodayBlock /> : <></>}
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
            renderItem={RenderPeriodItem}
          />
          {!loading && weatherForecast.forecast ? (
            <FlatList
              scrollEnabled={false}
              data={weatherForecast.forecast.forecastday}
              renderItem={RenderForecast}
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
                  renderItem={RenderThemeSettingsItem}
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
