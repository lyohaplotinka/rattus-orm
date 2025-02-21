<script>
  import { setContext } from 'svelte'
  import { contextBootstrap } from '@rattus-orm/core/utils/integrationsHelpers'
  import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'
  import { rattusContextKey } from '../dist/rattus-orm-svelte-provider.mjs'

  export let connection = 'entities'
  export let database = undefined
  export let plugins = []
  export let customRepositories = []

  const createdDatabase = contextBootstrap({ connection, database, plugins, customRepositories }, new ObjectDataProvider())
  setContext(rattusContextKey, createdDatabase)
</script>
<slot />
