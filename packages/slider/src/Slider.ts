import idom from '@anylab/idom';
import { SliderCamera, SliderPlainCamera } from '~/camera';
import { sliderBindRequiredError, sliderInvalidArgumentsError } from '~/error';
import { SliderPanel, SliderPlainPanel } from '~/panel';
import { SliderAnimationOption, SliderContext, SliderOption, getSliderContext, mergeSliderAnimation } from '~/models';

export class Slider {
  private _camera: SliderCamera;
  private _panels: Array<SliderPanel>;
  private _context: SliderContext;

  constructor(element: HTMLElement, option?: SliderOption) {
    const cameraElement = element.firstElementChild as HTMLElement | null;
    if (!cameraElement) {
      throw sliderBindRequiredError;
    }
    const panelElements = Array.prototype.slice.call(cameraElement.children) as HTMLElement[];
    if (panelElements.length === 0) {
      throw sliderBindRequiredError;
    }

    idom(element).css({
      'touch-action': 'none',
      'user-drag': 'none',
      '-webkit-user-drag': 'none',
      '-moz-user-drag': 'none',
    });

    this._context = getSliderContext(option);
    this._panels = this._createPanels(panelElements);
    this._camera = this._createCamera(cameraElement);
  }

  get camera(): SliderCamera {
    return this._camera;
  }

  get panels(): Array<SliderPanel> {
    return this._panels;
  }

  async moveTo(index: number, option?: SliderAnimationOption): Promise<boolean> {
    return this._camera.moveTo(index, mergeSliderAnimation(this._context.config.afterMoveEndAnimation, option));
  }

  private _createCamera(element: HTMLElement): SliderCamera {
    const panels = this._panels;
    const isValidPanels = panels.map(panel => panel instanceof SliderPlainPanel);

    if (!isValidPanels) {
      throw sliderInvalidArgumentsError;
    }

    return new SliderPlainCamera(element, this._context, panels as SliderPlainPanel[]);
  }

  private _createPanels(elements: HTMLElement[]): SliderPanel[] {
    const panels: SliderPanel[] = [];

    for (let i = 0; i < elements.length; i++) {
      panels[i] = new SliderPlainPanel(elements[i], panels[i - 1] || null, i, this._context);
    }

    return panels;
  }
}
