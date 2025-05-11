import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, extname, basename, resolve, relative } from 'node:path'
import fm from 'front-matter'
import { DefaultTheme } from 'vitepress'

type SidebarsGetterParams = {
  rootDir: string
  docDirs: string[]
}

type ArticleFontMatterAttributes = {
  title?: string
  sidebar_position?: number
}

type GroupData = {
  title?: string
  defaultCollapsed?: boolean
  sidebarPosition?: number
}

type SidebarItemWithPos = DefaultTheme.SidebarItem &
  Pick<ArticleFontMatterAttributes, 'sidebar_position'>

function findMarkdownFiles(dir: string): { files: string[]; subdirs: string[] } {
  const files: string[] = []
  const subdirs: string[] = []
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      subdirs.push(resolve((entry as any).parentPath, entry.name))
    } else if (entry.isFile() && extname(entry.name) === '.md') {
      files.push(path)
    }
  }

  return { files, subdirs }
}

function markdownFilesToArticles(files: string[], rootDir: string): DefaultTheme.SidebarItem[] {
  const articles: SidebarItemWithPos[] = []

  for (const filePath of files) {
    const content = readFileSync(filePath, 'utf-8')
    const { attributes, body } = fm<ArticleFontMatterAttributes>(content)

    const title = attributes.title || body.split('\n')[0].replace(/#+\s+/g, '').trim()

    if (!title) {
      console.warn(`Missing title in ${filePath}`)
    }

    const relativeMarkdownPath = relative(rootDir, filePath)

    articles.push({
      text: title || basename(filePath),
      link: `/${relativeMarkdownPath.replace(extname(filePath), '')}`,
      sidebar_position: attributes.sidebar_position,
    })
  }

  return articles
}

function readGroup(directory: string): GroupData | null {
  const groupFilePath = resolve(directory, '_group.json')
  if (!existsSync(groupFilePath)) {
    return null
  }
  const content = readFileSync(groupFilePath, 'utf-8')
  return JSON.parse(content)
}

const sortByPosition = (items: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem[] => {
  return items
    .sort((a, b) => {
      const aPos = (a as SidebarItemWithPos).sidebar_position ?? Number.MAX_SAFE_INTEGER
      const bPos = (b as SidebarItemWithPos).sidebar_position ?? Number.MAX_SAFE_INTEGER
      return aPos - bPos
    })
    .map((item) => {
      if ('items' in item && item.items) {
        return { ...item, items: sortByPosition(item.items) }
      }
      return item
    })
}

export function getSidebars({ rootDir, docDirs }: SidebarsGetterParams) {
  const resultArticles: SidebarItemWithPos[] = []
  for (const directory of docDirs.map((dir) => resolve(rootDir, dir))) {
    const group = readGroup(directory)
    const { files, subdirs } = findMarkdownFiles(directory)
    const articles = markdownFilesToArticles(files, rootDir)

    if (group) {
      const item: SidebarItemWithPos = {
        text: group.title,
        items: articles,
        collapsed: group.defaultCollapsed ?? false,
        sidebar_position: group.sidebarPosition ?? 0,
      }
      if (subdirs.length) {
        const subItems = getSidebars({ rootDir, docDirs: subdirs })
        item.items = [...(item.items ?? []), ...subItems]
      }
      resultArticles.push(item)
    } else {
      resultArticles.push(...articles)
    }
  }

  return sortByPosition(resultArticles)
}
