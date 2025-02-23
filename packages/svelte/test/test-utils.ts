import { RattusOrmInstallerOptions } from '@rattus-orm/core/utils/integrationsHelpers'
import { render } from '@testing-library/svelte'
import FuncExecutor from './components/FuncExecutor.svelte'
import RattusProviderTest from './components/RattusProviderTest.svelte'

export const renderWithContext = (
  component: any,
  contextProps: RattusOrmInstallerOptions = {},
  slotProps = {},
): any => {
  return render(RattusProviderTest, {
    props: { slotContent: component, slotProps, ...contextProps } as any,
  })
}

export const renderFunction = <R>(cb: () => R, contextProps: RattusOrmInstallerOptions = {}): R => {
  const rendered = renderWithContext(FuncExecutor, contextProps, { callbackFunction: cb })
  return rendered.component.getChild().getResult()
}
