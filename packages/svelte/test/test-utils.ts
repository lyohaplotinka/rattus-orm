import { render } from '@testing-library/svelte'
import RattusProviderTest from './components/RattusProviderTest.svelte'
import { RattusOrmInstallerOptions } from '@rattus-orm/core'
import { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import FuncExecutor from './components/FuncExecutor.svelte'
import { useRattusContext } from '../dist/rattus-orm-svelte-provider'

export const renderWithContext = (
  component: any,
  contextProps: RattusOrmInstallerOptions = {},
  slotProps = {},
): any => {
  return render(RattusProviderTest, { props: { slotContent: component, slotProps, ...contextProps } as any })
}

export const renderAndGetContext = (contextProps: RattusOrmInstallerOptions = {}): RattusContext => {
  const rendered = renderWithContext(FuncExecutor, contextProps, { callbackFunction: () => useRattusContext() })
  return rendered.component.getChild().getResult()
}

export const renderFunction = <R>(cb: () => R, contextProps: RattusOrmInstallerOptions = {}): R => {
  const rendered = renderWithContext(FuncExecutor, contextProps, { callbackFunction: cb })
  return rendered.component.getChild().getResult()
}
