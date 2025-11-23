import idom, { type IDom } from '@anylab/idom';
import { SliderAnimation, SliderContext, SliderDirection } from '~/models';

export abstract class SliderCamera {
  protected _dom: IDom;
  protected _direction: SliderDirection = SliderDirection.STOP;
  protected _isBlocked = false;

  constructor(
    element: HTMLElement,
    protected _context: SliderContext
  ) {
    this._dom = idom(element);
  }

  abstract moveTo(index: number, animation?: SliderAnimation): Promise<boolean>;
}
