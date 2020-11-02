import { Event } from './Event'

import { EventEmitter as NEE } from 'events'

type EventCb<E extends Event<any> = Event<any>> = (event: E) => void
type StaticEventCb<T, E extends Event<any> = Event<any>> = (obj: T, event: E) => void

export type EKey = string | symbol
export type EventDict = Record<EKey, Event<any>>

interface IEventEmitter<Events extends EventDict> {
  on(key: keyof Events, cb: EventCb<Events[typeof key]>): this,
  emit(key: keyof Events, event: Events[typeof key]): this,
}

interface Constructor<M> {
  new (...args: any[]): M,
}

export abstract class EventEmitter<Events extends EventDict> implements IEventEmitter<Events> {

  private static emitter: NEE = new NEE()
  private emitter: NEE = new NEE()

  public on(key: keyof Events, cb: EventCb<Events[typeof key]>): this {
    this.emitter.on(key as EKey, cb)

    return this
  }

  public emit(key: keyof Events, event: Event<any>): this {
    this.emitter.emit(key as EKey, event)
    this.static.emitter.emit(key as EKey, this, event)

    return this
  }

  public static on<T extends EventEmitter<any>>(this: Constructor<T>, key: string, cb: StaticEventCb<T>): void {
    ((this as any).emitter as NEE).on(key as EKey, cb)
  }

  private get static() {
    return this.constructor as {
      emitter: NEE,
      new(): any,
    }
  }

  private get emitters() {
    return [this.emitter, this.static.emitter]
  }

}
