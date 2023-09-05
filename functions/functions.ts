export function GetTheme(systemTheme: any, theme: string) {
  if (theme === 'system') {
    return systemTheme
  } else {
    return theme
  }
}
