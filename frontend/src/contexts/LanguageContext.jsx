import { createContext, useContext, useMemo, useState } from 'react'
import { LANGUAGE_DATA } from '../data/languageData.js'

const LANGUAGE_KEY = 'smart-bus-language'
const AVAILABLE_LANGUAGES = ['EN', 'SI', 'TA']

const defaultLanguageContext = {
  language: 'EN',
  setLanguage: () => {},
  messages: LANGUAGE_DATA.EN,
  availableLanguages: AVAILABLE_LANGUAGES
}

const LanguageContext = createContext(defaultLanguageContext)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const stored = localStorage.getItem(LANGUAGE_KEY)
    return AVAILABLE_LANGUAGES.includes(stored) ? stored : 'EN'
  })

  const setLanguage = (value) => {
    if (!AVAILABLE_LANGUAGES.includes(value)) return
    localStorage.setItem(LANGUAGE_KEY, value)
    setLanguageState(value)
  }

  const value = useMemo(() => ({
    language,
    setLanguage,
    messages: LANGUAGE_DATA[language] || LANGUAGE_DATA.EN,
    availableLanguages: AVAILABLE_LANGUAGES
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return defaultLanguageContext
  }
  return context
}
