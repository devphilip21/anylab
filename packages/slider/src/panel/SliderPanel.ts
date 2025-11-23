import idom, { type IDom } from '@anylab/idom';
import { SliderContext } from '~/models';

export abstract class SliderPanel {
  protected _dom: IDom;
  protected _gap: [number, number] = [0, 0];
  protected _width: number = 0;

  constructor(
    element: HTMLElement,
    protected _prev: SliderPanel | null,
    protected _index: number,
    protected _context: SliderContext
  ) {
    this._dom = idom(element);
  }

  get index(): number {
    return this._index;
  }

  get dom(): IDom {
    return this._dom;
  }

  get prev(): IDom {
    return this._dom;
  }

  get gap(): [number, number] {
    return this._gap;
  }

  get width(): number {
    return this._width;
  }

  get leftGap(): number {
    return this._gap[0];
  }

  get rightGap(): number {
    return this._gap[1];
  }

  setLeftGap(pxValue: number): this {
    this._gap[0] = pxValue;

    return this;
  }

  setRightGap(pxValue: number): this {
    this._gap[1] = pxValue;

    return this;
  }

  abstract get x(): number;
}
