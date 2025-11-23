import { IDomRect } from '@anylab/idom';
import { Pan, PanEvent, PanEventType, MouseSource, TouchSource } from '@anylab/input';
import { SliderCamera } from '~/camera';
import { SliderInvalidArgumentsError } from '~/error';
import { SliderDirection, type SliderAnimation, type SliderContext } from '~/models';
import { SliderAfterMoveEnd } from '~/models/SliderAfterMoveEnd';
import { ResizeObservable } from '~/observers';
import type { SliderPanel, SliderPlainPanel } from '~/panel';
import { checkTouchSupport } from '~/utils';

export class SliderPlainCamera extends SliderCamera {
  private _pan: Pan;
  private _resizeObservable: ResizeObservable | null;
  private _isAnimated = false;
  private _cameraX = 0;
  private _cameraWidth = 0;

  constructor(
    element: HTMLElement,
    context: SliderContext,
    private _panels: Array<SliderPlainPanel>
  ) {
    super(element, context);

    this._recognizeRects(this._dom.rect());
    this._pan = new Pan()
      .bind(checkTouchSupport() ? new TouchSource(element) : new MouseSource(element))
      .on('input', this._handleInput);
    this._resizeObservable = this._createResizeObservable(element);
  }

  get pan(): Pan {
    return this._pan;
  }

  destroy() {
    this._resizeObservable?.destroy();
    this._resizeObservable = null;
  }

  async moveTo(index: number, animation?: SliderAnimation): Promise<boolean> {
    if (this._isBlocked) {
      return true;
    }
    if (index < 0 || index >= this._panels.length) {
      throw SliderInvalidArgumentsError;
    }

    this._context.index = index;

    await this._syncWithIndex(animation);

    return false;
  }

  private _recognizeRects(cameraRect: IDomRect) {
    this._cameraX = cameraRect.left;
    this._cameraWidth = cameraRect.width;

    let prevX: number = 0;
    let prevWidth = 0;

    for (let i = 0; i < this._panels.length; i++) {
      const panel = this._panels[i];
      const rect = panel.dom.rect();
      const { left: x, width } = rect;

      const isFirst = i === 0;
      const isLast = i === this._panels.length - 1;

      const leftGap = isFirst ? x - this._cameraX : x - prevX - prevWidth - this._cameraX;
      const rightGap = isLast ? this._panels[0].leftGap : 0;

      panel.setWidth(width).setLeftGap(leftGap).setRightGap(rightGap);
      prevX = panel.x;
      prevWidth = panel.width;
    }

    console.log(this._panels);
  }

  private _resizeRects(cameraRect: IDomRect) {
    this._cameraWidth = cameraRect.width;

    for (let i = 0; i < this._panels.length; i++) {
      const panel = this._panels[i];
      const rect = panel.dom.rect();
      const { width } = rect;

      panel.setWidth(width);
    }

    const currentPanel = this._panels[this._context.index];
    const currentPanelX = currentPanel ? this._calculateStartX(currentPanel) : 0;

    this._render(currentPanelX);
  }

  private _createResizeObservable(element: HTMLElement): ResizeObservable | null {
    const observable = new ResizeObservable(element);

    observable.observe(this._handleResize);

    return observable;
  }

  private _getNextPanelByX(): SliderPanel | null {
    const prevIndex = this._context.index;
    const candidatePanels = this._panels.filter(panel =>
      this._direction === SliderDirection.LEFT ? panel.index > prevIndex : panel.index < prevIndex
    );

    if (candidatePanels.length === 0) {
      return this._panels[prevIndex] || null;
    }

    let targetI = -1;
    let distance = Infinity;
    for (let i = 0; i < candidatePanels.length; i++) {
      const panelX = candidatePanels[i].x;
      const candidateDistance = Math.abs(panelX - this._context.x);
      if (candidateDistance < distance) {
        targetI = i;
        distance = candidateDistance;
      }
    }

    if (targetI < 0) {
      return this._panels[prevIndex] || null;
    }

    return candidatePanels[targetI] || null;
  }

  private _getLastTreshold(): [number, number] {
    const treshold: [number, number] = [0, 0];

    if (this._panels.length === 0) {
      return treshold;
    }

    const startTreshold =
      typeof this._context.config.lastTreshold === 'number'
        ? this._context.config.lastTreshold
        : this._context.config.lastTreshold[0];
    treshold[0] = this._panels[0].x - startTreshold;

    const endTreshold =
      typeof this._context.config.lastTreshold === 'number'
        ? this._context.config.lastTreshold
        : this._context.config.lastTreshold[1];
    treshold[1] = this._panels[this._panels.length - 1].x + endTreshold;

    return treshold;
  }

  private _calculateStartX(panel: SliderPlainPanel): number {
    const cameraWidth = this._cameraWidth;
    const panelWidth = panel.width;
    const alignCorrection = (cameraWidth - panelWidth) / 2;

    return panel.x - alignCorrection;
  }

  private async _syncWithIndex(animation?: SliderAnimation): Promise<void> {
    const x = this._calculateStartX(this._panels[this._context.index]);

    if (animation) {
      this._renderWithAnimation(x, animation);
    } else {
      this._render(x);
    }
  }

  private _move(deltaX: number) {
    this._render(this._context.x - deltaX);
  }

  private async _afterMoveEnd(e: PanEvent): Promise<void> {
    switch (this._context.config.afterMoveEndStrategy) {
      case SliderAfterMoveEnd.CRITICAL_POINT:
        if (Math.abs(e.tdeltaX) > this._context.config.slideNextCriticalPoint) {
          const targetPanel = this._getNextPanelByX();

          if (targetPanel) {
            this._context.index = targetPanel.index;
          }
        }
        this._syncWithIndex(this._context.config.afterMoveEndAnimation);
        break;
      case SliderAfterMoveEnd.RESTORE:
        break;
    }
    this._direction = SliderDirection.STOP;
  }

  private _render(x: number) {
    const [startTreshold, endTreshold] = this._getLastTreshold();

    if (x >= startTreshold && x <= endTreshold) {
      this._context.x = x;
      this._dom.css('transform', `translate3d(${this._context.x * -1}px, 0, 0)`);
    }
  }

  private async _renderWithAnimation(x: number, animation: SliderAnimation): Promise<void> {
    if (this._context.x === x) {
      return;
    }

    this._isAnimated = true;
    this._isBlocked = true;
    this._context.x = x;

    return this._dom
      .transition('transform', `translate3d(${x * -1}px, 0, 0)`, {
        duration: animation.duration,
        timingFunction: animation.timingFunction,
      })
      .then(() => {
        this._isAnimated = false;
        this._isBlocked = false;
      });
  }

  private readonly _handleInput = (e: PanEvent) => {
    switch (e.type) {
      case PanEventType.start:
      case PanEventType.move:
        if (!this._isBlocked) {
          this._direction = e.tdeltaX > 0 ? SliderDirection.RIGHT : SliderDirection.LEFT;
          this._move(e.deltaX);
        }
        break;
      case PanEventType.end:
        if (!this._isBlocked) {
          this._move(e.deltaX);
          this._afterMoveEnd(e);
        } else if (!this._isAnimated) {
          this._isBlocked = false;
        }
        break;
    }
  };

  private readonly _handleResize = (cameraRect: IDomRect) => {
    this._resizeRects(cameraRect);
  };
}
