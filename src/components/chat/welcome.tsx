import { link } from 'ansi-escapes'
import { Box, Text, Transform } from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import { memo } from 'react'
import { github, sponsor } from '@/config'
import { useGlobal } from '@/context/global'
import { m } from '@/i18n/messages.js'

export const Welcome = memo(() => {
  const { locale } = useGlobal()

  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <Gradient name="instagram">
        <BigText text="SSH AI Chat" font="chrome" />
      </Gradient>
      <Box>
        <Text color="blue">{m['chat.tips'](null, { locale })}</Text>
      </Box>
      <Box gap={4} marginLeft={-4}>
        <Transform transform={children => link(children, github)}>
          <Text bold color="blueBright">
            {m['chat.source'](null, { locale })}
          </Text>
        </Transform>
        <Transform transform={children => link(children, sponsor)}>
          <Text bold color="blueBright">
            {m['chat.sponsor'](null, { locale })}
          </Text>
        </Transform>
      </Box>
    </Box>
  )
})
