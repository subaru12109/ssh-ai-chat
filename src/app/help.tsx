import { link } from 'ansi-escapes'
import { Box, Text, Transform } from 'ink'
import { memo } from 'react'
import { github, sponsor, twitter } from '@/config'

export default memo(() => {
  const issuesUrl = 'https://github.com/ccbikai/ssh-ai-chat/issues'

  const shortcuts = [
    { key: 'ESC', description: 'Navigate between modes' },
    { key: 'n', description: 'Start new conversation' },
    { key: 'i', description: 'Enter input mode' },
    { key: '1-9', description: 'Switch AI models' },
    { key: '?', description: 'Show this help' },
    { key: '\\', description: 'Change language' },
  ]

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">SSH AI Chat - Help & Support</Text>

      <Box marginTop={2}>
        <Text color="green">📚 Source Code & Documentation</Text>
      </Box>
      <Box marginTop={1}>
        <Text>Explore the codebase and contribute to development:</Text>
      </Box>
      <Box marginTop={1}>
        <Transform transform={children => link(children, github)}>
          <Text bold color="blueBright">
            → View Source Code on GitHub
          </Text>
        </Transform>
      </Box>

      <Box marginTop={2}>
        <Text color="yellow">🐛 Report Issues & Feature Requests</Text>
      </Box>
      <Box marginTop={1}>
        <Text>Help improve SSH AI Chat by reporting bugs or suggesting features:</Text>
      </Box>
      <Box marginTop={1}>
        <Transform transform={children => link(children, issuesUrl)}>
          <Text bold color="blueBright">
            → Submit Issues & Requests
          </Text>
        </Transform>
      </Box>

      <Box marginTop={2}>
        <Text color="magenta">⌨️ Keyboard Shortcuts</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        {shortcuts.map(shortcut => (
          <Text key={shortcut.key}>
            •
            {' '}
            <Text bold color="cyan">{shortcut.key}</Text>
            {' '}
            -
            {' '}
            {shortcut.description}
          </Text>
        ))}
      </Box>

      <Box marginTop={2}>
        <Text color="blueBright">🌐 Follow & Support</Text>
      </Box>
      <Box marginTop={1}>
        <Transform transform={children => link(children, github)}>
          <Text color="blue">GitHub</Text>
        </Transform>
        <Text> • </Text>
        <Transform transform={children => link(children, twitter)}>
          <Text color="blue">𝕏/Twitter</Text>
        </Transform>
        <Text> • </Text>
        <Transform transform={children => link(children, sponsor)}>
          <Text color="blue">Sponsor</Text>
        </Transform>
      </Box>
    </Box>
  )
})
