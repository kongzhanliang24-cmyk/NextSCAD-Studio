'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'weighing-site-lang'
const DEFAULT_LANG = 'zh'
const SUPPORTED_LANGS = ['zh', 'en']

const LanguageContext = createContext(null)

function translate(value, lang) {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number') return value
  if (Array.isArray(value)) return value
  return value[lang] ?? value.zh ?? value.en ?? ''
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(DEFAULT_LANG)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved && SUPPORTED_LANGS.includes(saved)) {
        setLang(saved)
      }
    } catch (error) {
      console.error(error)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch (error) {
      console.error(error)
    }
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en'
  }, [lang, mounted])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((current) => (current === 'zh' ? 'en' : 'zh')),
      t: (input) => translate(input, lang),
      mounted,
      supportedLanguages: SUPPORTED_LANGS
    }),
    [lang, mounted]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }

  return context
}
