import { assertState, createStore } from '@func-test/utils/Helpers'

import { HasManyBy } from '@/attributes/field-relations'
import { AttrField, StringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations/has_many_by_save', () => {
  class Node extends Model {
    static entity = 'nodes'

    @AttrField() id!: number
    @StringField('') name!: string
  }

  class Cluster extends Model {
    static entity = 'clusters'

    @AttrField() id!: number
    @AttrField() nodeIds!: number[]
    @StringField('') name!: string

    @HasManyBy(() => Node, 'nodeIds')
    nodes!: Node[]
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
