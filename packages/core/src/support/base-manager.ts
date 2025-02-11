export abstract class BaseManager<Value, Key = string> {
  private readonly items: Map<Key, Value> = new Map()

  public add(key: Key, value: Value) {
    this.items.set(key, value)
  }

  public get(key: Key) {
    return this.items.get(key) as Value
  }

  public delete(key: Key) {
    this.items.delete(key)
  }

  public has(key: Key) {
    return this.items.has(key)
  }

  public getAllAsReadonlyRecord(): Readonly<Record<string, Value>> {
    return Object.fromEntries(this.items)
  }

  public clear() {
    this.items.clear()
  }
}
