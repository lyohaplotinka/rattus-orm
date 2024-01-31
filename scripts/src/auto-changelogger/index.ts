import { ChangelogMarkdownService } from './changelogMarkdownService'
import { getChangelogElements } from './getChangelogElements'

export async function updateChangelog() {
  const changes = await getChangelogElements()
  const changelog = await new ChangelogMarkdownService().boot()
  await changelog.setElements(changes).write()
}
