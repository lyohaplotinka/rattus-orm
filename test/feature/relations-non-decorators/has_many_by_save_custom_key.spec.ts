import { assertState, createStore } from '@func-test/utils/Helpers'

import { createHasManyByRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/has_many_by_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has many by" relation with custom primary key', () => {
    class Node extends Model {
      static entity = 'nodes'

      public static fields() {
        return {
          id: createAttrField(),
          name: createStringField(''),
        }
      }

      declare id: number
      declare name: string
    }

    class Cluster extends Model {
      static entity = 'clusters'

      static primaryKey = 'clusterId'

      public static fields() {
        return {
          clusterId: createAttrField(),
          nodeIds: createAttrField(),
          name: createStringField(''),
          nodes: createHasManyByRelation(() => Node, 'nodeIds'),
        }
      }

      declare clusterId: number
      declare nodeIds: number[]
      declare name: string
      declare nodes: Node[]
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
    class Node extends Model {
      static entity = 'nodes'

      public static fields() {
        return {
          id: createAttrField(),
          nodeId: createAttrField(),
          name: createStringField(''),
        }
      }

      declare id: number
      declare nodeId: number
      declare name: string
    }

    class Cluster extends Model {
      static entity = 'clusters'

      public static fields() {
        return {
          id: createAttrField(),
          nodeIds: createAttrField(),
          name: createStringField(''),
          nodes: createHasManyByRelation(() => Node, 'nodeIds', 'nodeId'),
        }
      }

      declare id: number
      declare nodeIds: number[]
      declare name: string
      declare nodes: Node[]
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
