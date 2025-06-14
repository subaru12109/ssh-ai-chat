import type { BoxProps } from 'ink'
import { Box, Text } from 'ink'
import { memo } from 'react'

export const Avatar = memo(({ text, ...props }: { text?: string } & BoxProps) => {
  return (
    <Box borderStyle="classic" borderColor="blue" paddingX={1} {...props}>
      <Text>
        {text}
      </Text>
    </Box>
  )
})
