import { ChangelogMarkdownService } from './changelogMarkdownService'
import { getChangelogElements } from './getChangelogElements'

const changes = await getChangelogElements()
const changelog = await new ChangelogMarkdownService().boot()
changelog.setElements(changes).write()
