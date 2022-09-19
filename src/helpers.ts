export function findIssueNumber(message: string): string | undefined {
  const parts = message.split(' ')
  const sameRepoRegex = new RegExp('^#\\d+$', 'g')
  const externalRepoRegex = new RegExp(`^[\\w\\-]+/[\\w\\-]+/#\\d+$`, 'g')
  for (const part of parts) {
    if (sameRepoRegex.test(part)) {
      return part
    }
    if (externalRepoRegex.test(part)) {
      return part
    }
  }
  return undefined
}

export function buildNewDescription(
  issue: string,
  descirption: string | undefined
): string {
  if (descirption && descirption !== '') {
    return `${descirption}\r\n\r\nResolve ${issue}`
  } else {
    return `Resolve ${issue}`
  }
}
