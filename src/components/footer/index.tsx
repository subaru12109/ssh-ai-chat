import { link } from 'ansi-escapes'
import { Box, Spacer, Text } from 'ink'
import { memo } from 'react'
import { github, sponsor, twitter } from '@/config'
import { useGlobal } from '@/context/global'
import { m } from '@/i18n/messages.js'
import { getKVfromENV } from '@/utils/env'

const sponsors = getKVfromENV('SPONSORS')

export default memo(() => {
  const { locale } = useGlobal()
  return (
    <Box flexDirection="row" paddingX={1}>
      <Text>
        {m['footer.followUs'](null, { locale })}
        :
        {' '}
      </Text>
      <Text color="blueBright">
        {link('GitHub', github)}
        {' '}
        {link('𝕏/Twitter', twitter)}
        {' '}
        {link('Sponsor', sponsor)}
      </Text>
      <Spacer />
      <Text>
        { m['footer.shortcuts'](null, { locale }) }
        {': '}
        { m['footer.tips'](null, { locale }) }
      </Text>
      {sponsors.length
        ? (
            <>
              <Text>
                {' '}
                {m['footer.sponsors'](null, { locale })}
                {': '}
              </Text>
              <Text color="blue">
                {
                  sponsors.map((sponsor) => {
                    return ` ${link(sponsor.key, sponsor.value)}`
                  })
                }
              </Text>
            </>
          )
        : null}
    </Box>
  )
})
