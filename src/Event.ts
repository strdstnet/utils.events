export class Event<T extends {}> {

  private _cancelled: boolean = false

  constructor(public data: T) {}

  public get cancelled(): boolean {
    return this._cancelled
  }

  public cancel(): this {
    this._cancelled = true

    return this
  }

  public uncancel(): this {
    this._cancelled = false

    return this
  }

  public toJSON() {
    return {
      name: this.constructor.name,
      data: this.data,
      cancelled: this.cancelled,
    }
  }

}