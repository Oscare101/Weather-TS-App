import { Dimensions, Image, Text, View, useColorScheme } from 'react-native'
import { GetTheme } from '../functions/functions'
import colors from '../constans/colors'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

const width = Dimensions.get('window').width

export default function RenderHourForecast(props: any) {
  const systemTheme = useColorScheme()
  const { theme } = useSelector((state: RootState) => state.theme)
  const { temperature } = useSelector((state: RootState) => state.temperature)
  return (
    <View style={{ padding: 5, flexDirection: 'column', alignItems: 'center' }}>
      <Image
        source={{
          uri: `https:${props.item.condition.icon}`,
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
        {temperature === 'celcius' ? props.item.temp_c : props.item.temp_f}{' '}
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
        {props.item.time.split(' ')[1]}
      </Text>
    </View>
  )
}
