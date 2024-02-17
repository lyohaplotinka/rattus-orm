<script>
  import { useRepository } from '../../dist/rattus-orm-svelte-provider'
  import { Model } from '@rattus-orm/core'

  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.string(''),
        age: this.number(0)
      }
    }
  }

  const { find, save } = useRepository(User)
  const user = find('1')

  export function doSave(...args) {
    return save(...args)
  }
</script>

<div data-testid="maindiv">Age: {$user?.age ?? ''}</div>
