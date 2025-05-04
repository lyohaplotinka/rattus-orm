import { assertState, createStore } from '@func-test/utils/Helpers'

import { createHasManyByRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/has_many_by_save', () => {
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
        nodes: createHasManyByRelation(() => Node, 'nodeIds'),
      }
    }

    declare id: number
    declare nodeIds: number[]
    declare name: string
    declare nodes: Node[]
  }

  it('inserts a record to the store with "has many by" relation', () => {
    const store = createStore()

    store.$repo(Cluster).save({
      id: 1,
      name: 'Cluster 01',
      nodeIds: [1, 2],
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
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })
  })

  it('generates missing foreign keys', () => {
    const store = createStore()

    store.$repo(Cluster).save({
      id: 1,
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
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })
  })

  it('generates partially missing foreign keys', () => {
    const store = createStore()

    store.$repo(Cluster).save({
      id: 1,
      name: 'Cluster 01',
      nodeIds: [2],
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
        1: { id: 1, nodeIds: [2, 1], name: 'Cluster 01' },
      },
    })
  })

  it('can insert a record with missing relational key', () => {
    const store = createStore()

    store.$repo(Cluster).save({
      id: 1,
      name: 'Cluster 01',
      nodeIds: [1, 2],
    })

    assertState(store, {
      nodes: {},
      clusters: {
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })
  })
})
