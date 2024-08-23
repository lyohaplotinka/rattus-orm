import { assertState, createStore } from '@func-test/utils/Helpers'

import { AttrField, HasManyBy, StringField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/relations/has_many_by_save_custom_key', () => {
  beforeEach(() => {
    ModelTestEdition.clearRegistries()
  })

  it('inserts "has many by" relation with custom primary key', () => {
    class Node extends ModelTestEdition {
      static entity = 'nodes'

      @AttrField() id!: number
      @StringField('') name!: string
    }

    class Cluster extends ModelTestEdition {
      static entity = 'clusters'

      static primaryKey = 'clusterId'

      @AttrField() clusterId!: number
      @AttrField() nodeIds!: number[]
      @StringField('') name!: string

      @HasManyBy(() => Node, 'nodeIds')
      nodes!: Node[]
    }

    const store = createStore()

    store.$repo(Cluster).save({
      clusterId: 1,
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
        1: { clusterId: 1, nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })
  })

  it('inserts "has many by" relation with custom owner key', () => {
    class Node extends ModelTestEdition {
      static entity = 'nodes'

      @AttrField() id!: number
      @AttrField() nodeId!: number
      @StringField('') name!: string
    }

    class Cluster extends ModelTestEdition {
      static entity = 'clusters'

      @AttrField() id!: number
      @AttrField() nodeIds!: number[]
      @StringField('') name!: string

      @HasManyBy(() => Node, 'nodeIds', 'nodeId')
      nodes!: Node[]
    }

    const store = createStore()

    store.$repo(Cluster).save({
      id: 1,
      name: 'Cluster 01',
      nodes: [
        { id: 1, nodeId: 1, name: 'Node 01' },
        { id: 2, nodeId: 2, name: 'Node 02' },
      ],
    })

    assertState(store, {
      nodes: {
        1: { id: 1, nodeId: 1, name: 'Node 01' },
        2: { id: 2, nodeId: 2, name: 'Node 02' },
      },
      clusters: {
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })
  })
})
