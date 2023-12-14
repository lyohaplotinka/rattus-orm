import { isUnknownRecord } from '@rattus-orm/utils/isUnknownRecord'
import type { Elements, ModulePath, State } from '@rattus-orm/utils/sharedTypes'

export const RATTUS_LS_PREFIX = '$rattusorm-lsprefix$'
const CHUNK_SIZE = 1024 * 1024
const WARNING_LIMIT = 4_500_000

export class LocalStorageStore {
  protected readonly key: string

  constructor(modulePath: ModulePath, initialState: State = { data: {} }) {
    this.key = `${RATTUS_LS_PREFIX}-${modulePath.join('/')}`
    if (this.getChunksNumber() === null) {
      this.writeState(initialState)
    }
  }

  public flush() {
    this.writeState({ data: {} })
  }

  public fresh(records: Elements) {
    this.writeState({
      data: records,
    })
  }

  public getData() {
    return this.readState()
  }

  public save(records: Elements) {
    this.writeState({
      data: {
        ...this.readState().data,
        ...records,
      },
    })
  }

  public destroy(ids: string[]) {
    const newData: Elements = {}

    for (const [id, value] of Object.entries(this.getData().data)) {
      if (ids.includes(id)) {
        continue
      }
      newData[id] = value
    }
    this.fresh(newData)
  }

  protected writeState(state: State): void {
    const serialized = JSON.stringify(state)
    if (serialized.length >= WARNING_LIMIT) {
      console.warn(
        `[LocalStorageStore] serialized data length exceeds ${WARNING_LIMIT} characters. LocalStorage quota may be exceeded.`,
      )
    }

    const chunksNumber = Math.ceil(serialized.length / CHUNK_SIZE)

    for (let i = 0; i < chunksNumber; i++) {
      const currentPosition = i * CHUNK_SIZE
      const key = this.getChunkNameKey(i)
      const chunk = serialized.slice(currentPosition, currentPosition + CHUNK_SIZE)
      localStorage.setItem(key, chunk)
    }

    localStorage.setItem(this.getChunksNumberStoreKey(), String(chunksNumber))
  }

  protected readState(): State {
    const chunksNumber = this.getChunksNumber()
    if (!chunksNumber) {
      throw new Error(`Cannot read chunksNumber for ${this.key}`)
    }

    let result: string = ''
    for (let i = 0; i < chunksNumber; i++) {
      const key = this.getChunkNameKey(i)
      const chunk = localStorage.getItem(key)
      if (chunk === null) {
        throw new Error(`Missing chunk ${key}`)
      }
      result += chunk
    }

    const parsed = JSON.parse(result)
    if (!isUnknownRecord(parsed) || !isUnknownRecord(parsed.data)) {
      throw new Error('Data is malformed')
    }

    return parsed as State
  }

  protected getChunksNumber() {
    const numberRaw = localStorage.getItem(this.getChunksNumberStoreKey())
    if (!numberRaw) {
      return null
    }
    const parsed = parseInt(numberRaw)
    if (Number.isNaN(parsed)) {
      return null
    }
    return parsed
  }

  protected getChunkNameKey(number: number) {
    return `${this.key}-chunk${number}`
  }

  protected getChunksNumberStoreKey() {
    return `${this.key}-chunks_number`
  }
}
