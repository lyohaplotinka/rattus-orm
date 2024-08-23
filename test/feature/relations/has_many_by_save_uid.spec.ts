import { assertState, createStore, mockUid } from '@func-test/utils/Helpers'

import { AttrField, HasManyBy, StringField, UidField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/relations/has_many_by_insert_uid', () => {
  beforeEach(() => {
    ModelTestEdition.clearRegistries()
  })

  it('inserts "has many by" relation with parent having "uid" field as the primary key', () => {
    class Node extends ModelTestEdition {
      static entity = 'nodes'

      @AttrField() id!: number
      @StringField('') name!: string
    }

    class Cluster extends ModelTestEdition {
      static entity = 'clusters'

      @UidField() id!: number
      @AttrField() nodeIds!: number[]
      @StringField('') name!: string

      @HasManyBy(() => Node, 'nodeIds')
      nodes!: Node[]
    }

    mockUid(['uid1'])

    const store = createStore()

    store.$repo(Cluster).save({
      name: 'Cluster 01',
      nodes: [
        { id: 1, name: 'Node 01' },
        { id: 2, name: 'Node 02' },
      ],
    })

    assertState(store, {
      nodes: {
        1: { id: 1, name: 'Node 01' },
        2: { id: 2, name: 'Node 02' },
      },
      clusters: {
        uid1: { id: 'uid1', nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })
  })

  it('inserts "has many by" relation with child having "uid" as the owner key', () => {
    class Node extends ModelTestEdition {
      static entity = 'nodes'

      @UidField() id!: number
      @StringField('') name!: string
    }

    class Cluster extends ModelTestEdition {
      static entity = 'clusters'

      @UidField() id!: number
      @AttrField() nodeIds!: number[]
      @StringField('') name!: string

      @HasManyBy(() => Node, 'nodeIds')
      nodes!: Node[]
    }

    mockUid(['uid1', 'uid2', 'uid3'])

    const store = createStore()

    store.$repo(Cluster).save({
      name: 'Cluster 01',
      nodes: [{ name: 'Node 01' }, { name: 'Node 02' }],
    })

    assertState(store, {
      nodes: {
        uid2: { id: 'uid2', name: 'Node 01' },
        uid3: { id: 'uid3', name: 'Node 02' },
      },
      clusters: {
        uid1: { id: 'uid1', nodeIds: ['uid2', 'uid3'], name: 'Cluster 01' },
      },
    })
  })
})
