import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import { GetTheme } from '../functions/functions'
import colors from '../constans/colors'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import RenderHourForecast from './RenderForecastByHour'
const width = Dimensions.get('window').width

export default function RenderForecast(props: any) {
  const systemTheme = useColorScheme()
  const { theme } = useSelector((state: RootState) => state.theme)
  const { temperature } = useSelector((state: RootState) => state.temperature)
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
            uri: `https:${props.item.day.condition.icon}`,
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
              ? props.item.day.maxtemp_c
              : props.item.day.maxtemp_f}{' '}
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
              ? props.item.day.mintemp_c
              : props.item.day.mintemp_f}{' '}
            {temperature === 'celcius' ? 'C°' : 'F°'}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 14,

            color:
              props.period === props.item.state
                ? GetTheme(systemTheme, theme) === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText
                : GetTheme(systemTheme, theme) === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText,
          }}
        >
          {props.item.date}
        </Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={props.item.hour}
        renderItem={(item: any) => <RenderHourForecast item={item.item} />}
      />
    </View>
  )
}
