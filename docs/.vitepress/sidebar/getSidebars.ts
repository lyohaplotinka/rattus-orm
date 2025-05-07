import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
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
}

type SidebarItemWithPos = DefaultTheme.SidebarItem &
  Pick<ArticleFontMatterAttributes, 'sidebar_position'>

async function findMarkdownFiles(dir: string, rootDir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(path, rootDir)))
    } else if (entry.isFile() && extname(entry.name) === '.md') {
      files.push(path)
    }
  }

  return files
}

async function markdownFilesToArticles(
  files: string[],
  rootDir: string,
): Promise<DefaultTheme.SidebarItem[]> {
  const articles: SidebarItemWithPos[] = []

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf-8')
    const { attributes, body } = fm<ArticleFontMatterAttributes>(content)
    console.log(body)

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

  return articles.toSorted((a, b) => (a.sidebar_position ?? 0) - (b.sidebar_position ?? 0))
}

async function readGroup(directory: string): Promise<GroupData | null> {
  const groupFilePath = resolve(directory, '_group.json')
  if (!existsSync(groupFilePath)) {
    return null
  }
  const content = await readFile(groupFilePath, 'utf-8')
  return JSON.parse(content)
}

export async function getSidebars({ rootDir, docDirs }: SidebarsGetterParams) {
  const resultArticles: DefaultTheme.SidebarItem[] = []
  for (const directory of docDirs.map((dir) => resolve(rootDir, dir))) {
    const group = await readGroup(directory)
    const mdFiles = await findMarkdownFiles(directory, rootDir)
    const articles = await markdownFilesToArticles(mdFiles, rootDir)

    if (group) {
      resultArticles.push({
        text: group.title,
        items: articles,
        collapsed: group.defaultCollapsed ?? false,
      })
    } else {
      resultArticles.push(...articles)
    }
  }
  return resultArticles
}
