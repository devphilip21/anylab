# `@anylab/idom`

- provides a concise and intuitive dom manipulation API
- like jquery, but only partial features
- not support cross browsing and use native api, so small and fast
- small size (6kb)

## Installation

```sh
npm install @anylab/idom --save
```

## Getting Started

```js
import idom from '@anylab/idom';

const popupDom = idom(document.getElementById('id')); // or idom('#id')

popupDom.css({
  'position': 'fixed',
  'top': 0,
  'right': 0,
  'bottom': 0,
  'left': 0,
  'background-color': 'rgba(0, 0, 0, 0.8)',
}).transition(
  'transform',
  'translateX(100px)',
  {
    duration: 1000,
    timingFunction: 'ease-in-out',
  },
).on({
  'click': () => {
    console.log('clicked!');
  },
});
```

## Features

- Events
    - `.on(eventName, eventHandler, life?)`
    - `.on(eventSpecification)`
    - `.once(eventName, eventHandler)`
    - `.once(eventSpecification)`
    - `.off()`
    - `.off(eventName)`
    - `.off(eventName, eventHandler)`
- Styles and Attributes
    - `.css(cssProperty)`
    - `.css(cssProperty, cssValue)`
    - `.css(cssMap)`
    - `.attr(attrName)`
    - `.attr(attrName, attrValue)`
    - `.attr(attrMap)`
    - `.data(dataKey)`
    - `.data(dataKey, dataValue)`
    - `.data(dataMap)`
- DOM Tree
    - `.get(index)`
    - `.find(selector)`
    - `.first()`
    - `.last()`
    - `.rect()`
    - `.text()`
    - `.text(innerText)`
    - `.html()`
    - `.html(innerHTML)`
- Animation
    - `.transition(cssProperty, cssValue, transitionOption)`
