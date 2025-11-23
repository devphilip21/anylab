interface EventHandler<P> {
  (p: P): void;
}

interface EventRegistryItem<P> {
  life: number;
  handler: EventHandler<P>;
}

type EventRegistry<D extends object> = {
  [k in keyof D]: Array<EventRegistryItem<D[k]>>;
};

type EventSpecification<D extends object> = {
  [k in keyof D]: EventHandler<D[k]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventBus<D extends object = any> {
  private _registry: EventRegistry<D> = {} as EventRegistry<D>;

  on<N extends keyof D>(eventName: N, eventHandler: EventHandler<D[N]>, life?: number): this;
  on(eventSpecification: Partial<EventSpecification<D>>): this;
  on(eventName: unknown, eventHandler?: unknown, life?: number): this {
    switch (typeof eventName) {
      case 'string': {
        if (!eventHandler) {
          throw new Error('[@anylab/hands] argument eventHandler required!');
        }

        const name = eventName as keyof D;
        const handler = eventHandler as EventHandler<unknown>;

        this._registry[name] = this._registry[name] || [];
        this._registry[name].push({
          life: life ?? -1,
          handler,
        });
        break;
      }
      case 'object': {
        if (!eventName) {
          throw new Error('[@anylab/hands] argument eventSpecification required!');
        }

        const spec = eventName as EventSpecification<D>;

        Object.entries(spec).forEach(entry => {
          const name = entry[0] as keyof D;
          const handler = entry[1] as EventHandler<unknown>;

          this.on(name, handler);
        });
        break;
      }
    }

    return this;
  }

  once<N extends keyof D>(eventName: N, eventHandler: EventHandler<D[N]>): this;
  once(eventSpecification: Partial<EventSpecification<D>>): this;
  once(eventName: unknown, eventHandler?: unknown): this {
    switch (typeof eventName) {
      case 'string': {
        if (!eventHandler) {
          throw new Error('[@anylab/hands] argument eventHandler required!');
        }

        const name = eventName as keyof D;
        const handler = eventHandler as EventHandler<unknown>;

        this.on(name, handler, 1);
        break;
      }
      case 'object': {
        const spec = eventName as EventSpecification<D>;

        Object.entries(spec).forEach(entry => {
          const name = entry[0] as keyof D;
          const handler = entry[1] as EventHandler<unknown>;

          this.on(name, handler, 1);
        });
        break;
      }
    }

    return this;
  }

  off<N extends keyof D>(eventName: N): this;
  off<N extends keyof D>(eventName: N, eventHandler: EventHandler<D[N]>): this;
  off(): this;
  off(eventName?: unknown, eventHandler?: unknown): this {
    if (!eventName) {
      this._registry = {} as EventRegistry<D>;
      return this;
    }

    switch (typeof eventName) {
      case 'string': {
        const name = eventName as keyof D;

        if (!eventHandler) {
          delete this._registry[name];
        } else if (this._registry[name]) {
          const i = (this._registry[name] || []).findIndex(({ handler }) => handler === eventHandler);

          if (i >= 0) {
            if (this._registry[name].length === 1) {
              delete this._registry[name];
            } else {
              this._registry[name].splice(i, 1);
            }
          }
        }
        break;
      }
    }

    return this;
  }

  emit<N extends keyof D>(eventName: N, eventPayload?: D[N]): void {
    const nextRegistryItems: Array<EventRegistryItem<D[N]>> = [];
    const registryItems = this._registry[eventName] || [];

    for (let i = 0; i < registryItems.length; i++) {
      const registryItem = registryItems[i];

      if (registryItem.life > 0) {
        registryItem.life--;
      }
      registryItem.handler(eventPayload!);
      if (registryItem.life !== 0) {
        nextRegistryItems.push(registryItem);
      }
    }

    if (nextRegistryItems.length > 0) {
      this._registry[eventName] = nextRegistryItems;
    } else {
      delete this._registry[eventName];
    }
  }

  has(): boolean;
  has<N extends keyof D>(eventName: N): boolean;
  has<N extends keyof D>(eventName: N, eventHandler: EventHandler<D[N]>): boolean;
  has(eventName?: unknown, eventHandler?: unknown): boolean {
    if (!eventName) {
      return Object.keys(this._registry).length > 0;
    }
    const name = eventName as keyof D;
    const isItems = !!this._registry[name] && this._registry[name].length > 0;

    if (!eventHandler) {
      return isItems;
    }
    if (isItems) {
      return this._registry[name].findIndex(item => item.handler === eventHandler) >= 0;
    }

    return false;
  }
}
