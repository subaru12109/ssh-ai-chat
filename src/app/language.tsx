import type { Locale as LocaleType } from '@/i18n/runtime'
import SelectInput from 'ink-select-input'
import { useMemo } from 'react'
import { useGlobal } from '@/context/global'
import { locales } from '@/i18n/runtime'
import { track } from '@/utils/track'

export default function Locale() {
  const { locale, setLocale, navigate, path, user } = useGlobal()
  const initialIndex = locales.indexOf(locale)

  const handleSelect = (item: { value: LocaleType }) => {
    setLocale(item.value)
    track(Object.assign({ event: 'language-change', path, locale }, user), { language: item.value })
    navigate('/chat')
  }

  const languages = useMemo(() => locales.map((l) => {
    const region = (l.split('-')[1] || l.split('-')[0]).toUpperCase()
    const regionNames = new Intl.DisplayNames([l, region], { type: 'language' })
    const label = `${regionNames.of(l)}`
    return {
      label,
      value: l,
    }
  }), [])

  return <SelectInput items={languages} initialIndex={initialIndex} isFocused={path === '/language'} onSelect={handleSelect} />
}
