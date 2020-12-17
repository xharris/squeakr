import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext
} from "react"

const default_settings = {
  postview: {
    size: "small",
    following: false,
    tag_exact: false
  },
  postview_ui: {
    showcontrols: true
  }
}

const SettingsContext = createContext({
  settings: default_settings,
  setSettings: () => {}
})

export const useSettingsContext = group => {
  const { settings, setSetting } = useContext(SettingsContext)
  const set = (k, v) => setSetting(group, k, v)
  return [settings[group] || default_settings[group], set]
}

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem("settings")) || { ...default_settings }
  )

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSetting: (group, k, v) =>
          setSettings({ ...settings, [group]: { ...settings[group], [k]: v } })
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
