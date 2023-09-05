import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import { GetTheme } from '../functions/functions'
import colors from '../constans/colors'
import { setTemperature } from '../redux/temperature'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
const width = Dimensions.get('window').width

export default function TodayBlock(props: any) {
  const systemTheme = useColorScheme()
  const dispatch = useDispatch()
  const { theme } = useSelector((state: RootState) => state.theme)
  const { temperature } = useSelector((state: RootState) => state.temperature)

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
            uri: `https:${props.weatherForecast.current.condition.icon}`,
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
            ? props.weatherForecast.current.temp_c
            : props.weatherForecast.current.temp_f}{' '}
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
            dispatch(
              setTemperature(
                temperature === 'celcius' ? 'fahrenheit' : 'celcius'
              )
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
          humidity {props.weatherForecast.current.humidity} %
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
            ? props.weatherForecast.current.feelslike_c
            : props.weatherForecast.current.feelslike_f}{' '}
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
          wind {props.weatherForecast.current.wind_kph} km/h
        </Text>
      </View>
    </View>
  )
}
