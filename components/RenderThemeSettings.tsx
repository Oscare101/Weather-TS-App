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
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
const width = Dimensions.get('window').width
export default function RenderThemeSettings(props: any) {
  const systemTheme = useColorScheme()
  const { theme } = useSelector((state: RootState) => state.theme)
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
      activeOpacity={0.8}
      onPress={() => {
        props.item.action()
        props.closeModal(false)
      }}
    >
      <Ionicons
        name={props.item.icon}
        size={20}
        color={
          props.item.state === theme
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
            props.item.state === theme
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
