import type { Locale } from '@/i18n/runtime'
import { link } from 'ansi-escapes'
import { github, twitter } from '@/config'
import { m } from '@/i18n/messages'

export function goodbye(locale: Locale) {
  return m.goodbye({
    github,
    GitHub: link('GitHub', github),
    twitter,
    Twitter: link('𝕏 / Twitter', twitter),
  }, { locale })
}
