<script>
  import { setContext } from 'svelte'
  import { createRattusContext } from '@rattus-orm/core/utils/rattus-context'
  import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'
  import { rattusContextKey } from '../dist/rattus-orm-svelte-provider.mjs'

  export let connection = 'entities'
  export let database = undefined
  export let plugins = []
  export let customRepositories = []

  const context = createRattusContext({ connection, database, plugins, customRepositories }, new ObjectDataProvider())
  setContext(rattusContextKey, context)
</script>
<slot />
