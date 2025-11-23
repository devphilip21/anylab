import idom, { IDom, type IDomRect } from '@anylab/idom';

interface Observer {
  (rect: IDomRect): void;
}

export class ResizeObservable {
  private _dom: IDom;
  private _observers: Array<Observer> = [];
  private _nativeObserver: ResizeObserver | null;
  private _rect: IDomRect;

  constructor(element: HTMLElement) {
    this._dom = idom(element);
    this._rect = this._dom.rect();
    this._nativeObserver = new ResizeObserver(this._handleObserved);
    this._nativeObserver.observe(element);
  }

  observe(observer: Observer): void {
    if (!this._nativeObserver) {
      this._nativeObserver = new ResizeObserver(this._handleObserved);
    }
    if (this._observers.indexOf(observer) < 0) {
      this._observers.push(observer);
    }
  }

  unobserve(observer?: Observer) {
    if (observer) {
      const i = this._observers.indexOf(observer);
      if (i >= 0) {
        this._observers.splice(i, 1);
      }
    } else {
      this._observers = [];
    }
  }

  destroy() {
    this._observers = [];
    this._nativeObserver?.disconnect();
    this._nativeObserver = null;
  }

  private _trigger() {
    const rect = this._dom.rect();
    const isSame =
      rect.width === this._rect.width &&
      rect.height === this._rect.height &&
      rect.top === this._rect.top &&
      rect.left === this._rect.left;
    if (isSame) {
      return;
    }

    this._rect = rect;
    for (let i = 0; i < this._observers.length; i++) {
      this._observers[i](rect);
    }
  }

  private readonly _handleObserved = (entries: Array<ResizeObserverEntry>) => {
    if (entries.length === 0) {
      return;
    }

    const entry = entries[0];
    if (entry.target !== this._dom.get(0)) {
      return;
    }

    this._trigger();
  };
}
