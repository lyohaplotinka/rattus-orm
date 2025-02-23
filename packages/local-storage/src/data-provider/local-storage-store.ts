import type { Elements, ModulePath, State } from '@rattus-orm/core'
import { RattusOrmError } from '@rattus-orm/core/utils/feedback'
import { isUnknownRecord } from '@rattus-orm/core/utils/isUnknownRecord'

export const RATTUS_LS_PREFIX = '$rattusorm-lsprefix$'
const CHUNK_SIZE = 1024 * 1024
const WARNING_LIMIT = 4_500_000

export class LocalStorageStore {
  protected readonly key: string
  protected state: State

  constructor(modulePath: ModulePath, initialState: State = { data: {} }) {
    this.key = `${RATTUS_LS_PREFIX}-${modulePath.join('/')}`
    if (this.getChunksNumber() === null) {
      this.state = initialState
      this.writeState()
    } else {
      this.readState()
    }
  }

  public flush() {
    this.state = { data: {} }
    this.writeState()
  }

  public fresh(records: Elements) {
    this.state = {
      data: records,
    }
    this.writeState()
  }

  public getData() {
    return this.state
  }

  public save(records: Elements) {
    this.state = {
      data: {
        ...this.state.data,
        ...records,
      },
    }
    this.writeState()
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

  protected writeState(): void {
    const serialized = JSON.stringify(this.state)
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

  protected readState(): void {
    const chunksNumber = this.getChunksNumber()
    if (!chunksNumber) {
      throw new RattusOrmError(
        `Cannot read chunksNumber for ${this.key}`,
        'RattusLocalStorageStore',
      )
    }

    let result = ''
    for (let i = 0; i < chunksNumber; i++) {
      const key = this.getChunkNameKey(i)
      const chunk = localStorage.getItem(key)
      if (chunk === null) {
        throw new RattusOrmError(`Missing chunk ${key}`, 'RattusLocalStorageStore')
      }
      result += chunk
    }

    const parsed = JSON.parse(result)
    if (!isUnknownRecord(parsed) || !isUnknownRecord(parsed.data)) {
      throw new RattusOrmError('Data is malformed', 'RattusLocalStorageStore')
    }

    this.state = parsed as State
  }

  protected getChunksNumber() {
    const numberRaw = localStorage.getItem(this.getChunksNumberStoreKey())
    if (!numberRaw) {
      return null
    }
    const parsed = Number.parseInt(numberRaw)
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
