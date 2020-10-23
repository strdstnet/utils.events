import { Event } from './Event'

import { EventEmitter as NEE } from 'events'

type EventCb<E extends Event<any>> = (event: E) => void

type EKey = string | symbol

interface IEventEmitter<Events extends Record<EKey, Event<any>>> {
  on(key: keyof Events, cb: EventCb<Events[typeof key]>): this,
  emit(key: keyof Events, event: Events[typeof key]): this,
}

interface IEventEmitterStatic<Events extends Record<EKey, Event<any>>> {
  new(): IEventEmitter<Events>,
  on(key: keyof Events, cb: EventCb<Events[typeof key]>): void,
}

export function EventEmitter<Events extends Record<EKey, Event<any>>>(): IEventEmitterStatic<Events> {
  abstract class EventEmitter implements IEventEmitter<Events> {

    private static emitter: NEE = new NEE()
    private emitter: NEE = new NEE()

    public on(key: keyof Events, cb: EventCb<Events[typeof key]>): this {
      this.emitter.on(key as EKey, cb)

      return this
    }

    public emit(key: keyof Events, event: Events[typeof key]): this {
      this.emitters.forEach(e => e.emit(key as EKey, event))

      return this
    }

    public static on(key: keyof Events, cb: EventCb<Events[typeof key]>): void {
      this.emitter.on(key as EKey, cb)
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

  return EventEmitter as any as IEventEmitterStatic<Events>
}
