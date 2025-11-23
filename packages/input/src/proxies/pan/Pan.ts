import EventBus from '@anylab/eventbus';
import { HandsProxy } from '~/proxies/common/HandsProxy';
import { PanEventManagerByTouch } from './PanEventManagerByTouch';
import { PanEvent, PanEventType } from './PanEvent';
import { PanEventManager } from './PanEventManager';
import { HandsSource, MOUSE_SOURCE_ID, TOUCH_SOURCE_ID } from '~/sources';
import { PanEventManagerByMouse } from './PanEventManagerByMouse';

export interface PanEventSpecification {
  input: PanEvent;
}

export class Pan extends EventBus<PanEventSpecification> implements HandsProxy {
  private _source: HandsSource | null = null;
  private _eventManager: PanEventManager | null = null;
  private _disabled = false;

  destroy(): void {
    this._disabled = false;
    this._source?.destroy();
    this._source = null;
  }

  enable(): this {
    this._disabled = false;

    return this;
  }

  disable(): this {
    this._disabled = true;

    return this;
  }

  bind(source: HandsSource): this {
    this._source = source;
    this._source.init();
    this._source.on('input', this._handleInput);
    switch (this._source.id) {
      case MOUSE_SOURCE_ID:
        this._eventManager = new PanEventManagerByMouse();
        break;
      case TOUCH_SOURCE_ID:
        this._eventManager = new PanEventManagerByTouch();
        break;
    }

    return this;
  }

  private readonly _handleInput = (source: HandsSource) => {
    if (!this._eventManager) {
      return;
    }

    this._eventManager.process(source);

    const event = this._eventManager.current;
    if (event) {
      this.emit('input', event);
      if (event.type === PanEventType.end) {
        this._eventManager.clear();
      }
    }
  };
}
