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
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
const width = Dimensions.get('window').width

export default function RenderPeriodItem(props: any) {
  const systemTheme = useColorScheme()
  const { theme } = useSelector((state: RootState) => state.theme)
  return (
    <TouchableOpacity
      style={{
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 8,
        width: width * 0.92 * 0.25,

        backgroundColor:
          GetTheme(systemTheme, theme) === 'dark'
            ? colors.DarkBG
            : colors.LightBG,
      }}
      activeOpacity={0.8}
      onPress={() => {
        props.setLoading()
        props.item.action()
      }}
    >
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
        {props.item.title}
      </Text>
    </TouchableOpacity>
  )
}
