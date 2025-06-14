import { Box, Text } from 'ink'
import { memo } from 'react'
import env from '@/config/env'
import { useGlobal } from '@/context/global'

export const Header = memo(() => {
  const server = env.SERVER_NAME
  const { user } = useGlobal()
  return (
    <Box
      flexShrink={0}
      paddingX={1}
      borderStyle="classic"
      borderColor="blue"
      borderLeft={false}
      borderRight={false}
      borderTop={false}
    >
      <Text bold wrap="truncate">
        {`ssh ${user.username}@${server}`}
        :~$ /chat
      </Text>
    </Box>
  )
})
