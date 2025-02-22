<script>
import RattusProvider from '../../components/RattusProvider.svelte'

export let connection = 'entities'
export let database = undefined
export let plugins = []
export let customRepositories = []
export let slotContent
export let slotProps = {}

let child

export function getChild() {
  return child
}
</script>

<RattusProvider {connection} {database} {plugins} {customRepositories}>
  <svelte:component bind:this={child} this={slotContent} {...slotProps} />
</RattusProvider>
