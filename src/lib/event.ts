'use client';

type Callback = (data?: any) => void;

class EventEmitter {
  private events: Map<string, Callback[]>;

  constructor() {
    this.events = new Map();
  }

  on(event: string, callback: Callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  off(event: string, callback: Callback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      this.events.set(
        event,
        callbacks.filter((cb) => cb !== callback)
      );
    }
  }

  emit(event: string, data?: any) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }
}

export const eventEmitter = new EventEmitter();