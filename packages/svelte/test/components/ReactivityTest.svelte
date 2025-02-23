<script>
import { Model } from '@rattus-orm/core'
import { createNumberField, createStringField } from '@rattus-orm/core/field-types'
import { useRepository } from '../../dist/rattus-orm-svelte-provider'

class User extends Model {
  static entity = 'users'

  static fields() {
    return {
      id: createStringField(this, ''),
      age: createNumberField(this, 0),
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
