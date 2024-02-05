import type React from 'react'

export type PackageItem = {
  title: string
  packageName: string
  picture: string | React.ComponentType<React.ComponentProps<'svg'>>
  link: string
  description: string
  liveDemoUrl?: string
  comingSoon?: boolean
}
