export class SliderBindRequiredError extends Error {
  constructor() {
    super('[@anylab/slider] element binding required!');
  }
}

export const sliderBindRequiredError = new SliderBindRequiredError();

export class SliderInvalidArgumentsError extends Error {
  constructor() {
    super('[@anylab/slider] invalid arguments!');
  }
}

export const sliderInvalidArgumentsError = new SliderInvalidArgumentsError();
