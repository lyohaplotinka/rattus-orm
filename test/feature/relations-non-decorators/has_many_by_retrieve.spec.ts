import { assertInstanceOf, assertModel, createStore, fillState } from '@func-test/utils/Helpers'

import { createHasManyByRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/has_many_by_retrieve', () => {
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

    public static fields() {
      return {
        id: createAttrField(),
        nodeIds: createAttrField(),
        name: createStringField(''),
        nodes: createHasManyByRelation(Node, 'nodeIds'),
      }
    }

    declare id: number
    declare nodeIds: number[]
    declare name: string
    declare nodes: Node[]
  }

  it('can eager load has many by relation', async () => {
    const store = createStore()

    fillState(store, {
      nodes: {
        1: { id: 1, name: 'Node 01' },
        2: { id: 2, name: 'Node 02' },
      },
      clusters: {
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })

    const cluster = store.$repo(Cluster).with('nodes').first()!

    expect(cluster).toBeInstanceOf(Cluster)
    assertInstanceOf(cluster.nodes, Node)
    assertModel(cluster, {
      id: 1,
      nodeIds: [1, 2],
      name: 'Cluster 01',
      nodes: [
        { id: 1, name: 'Node 01' },
        { id: 2, name: 'Node 02' },
      ],
    })
  })

  it('can eager load missing relation as empty array', async () => {
    const store = createStore()

    fillState(store, {
      nodes: {},
      clusters: {
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })

    const cluster = store.$repo(Cluster).with('nodes').first()!

    expect(cluster).toBeInstanceOf(Cluster)
    assertModel(cluster, {
      id: 1,
      nodeIds: [1, 2],
      name: 'Cluster 01',
      nodes: [],
    })
  })
})
