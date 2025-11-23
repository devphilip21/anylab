# `@anylab/slider`

- slider module (like `swiper.js`)
- use only css on animation (not using js computing resources)
- small output size

## Installation

```sh
npm install @anylab/slider --save
```

## Getting Started [(Demo)](https://devphilip21.github.io/philip21.js/packages/slider/examples/)

```html
<div id="slider">
  <ul class="camera">
    <li class="panel">1</li>
    <li class="panel">2</li>
    <li class="panel">3</li>
  </ul>
</div>
```

```css
.slider {
  overflow: hidden;
}
.camera {
  white-space: nowrap;
  font-size: 0;
}
.panel {
  display: inline-block;
  width: 100%;
  font-size: 16px;
  vertical-align: top;
}
```

```js
import Slider from '@anylab/slider'

const element = document.getElementById('slider');
const slider = new Slider(element).on({
  'changed': (e) => {
    console.log(e);
  },
});

setTimeout(() => {
  // no animation
  slider.moveTo(2);
  // with animation
  slider.moveTo(2, { duration: 2000, timingFunction: 'ease' });
}, 1000);
```
