import idom from '@anylab/idom';
import { Slider } from '../src';

async function main() {
  initBasicExample();
  initSideMarginExample();
  initCodeBoxes();
}

function initBasicExample() {
  const element = idom('#slider_basic').get(0);
  if (!element) {
    return;
  }

  new Slider(element);

  idom('#code_basic ._code[data-target="html"]').text(`<div id="slider_basic" class="slider">
  <ul class="camera">
    <li class="panel">1</li>
    <li class="panel">2</li>
    <li class="panel">3</li>
    <li class="panel">4</li>
    <li class="panel">5</li>
  </ul>
</div>`);
  idom('#code_basic ._code[data-target="css"]').text(`.slider {
  overflow: hidden;
}
.camera {
  white-space: nowrap;
  font-size: 0;
}
.panel {
  display: inline-block;
  width: 100%;
  height: 200px;
  vertical-align: top;
}`);
  idom('#code_basic ._code[data-target="js"]').text(`import Slider from '@anylab/slider';

const slider = new Slider(
  document.getElementById('slider_basic'),
);`);
}

function initSideMarginExample() {
  const element = idom('#slider_sidemargin').get(0);
  if (!element) {
    return;
  }

  new Slider(element);
}

function initCodeBoxes() {
  idom('._btnCode').on('click', e => {
    const btnCode = idom(e.target as HTMLElement);
    const targetName = btnCode.data('target');
    const on = btnCode.hasClass('on');
    const codebox = btnCode.closest('._codebox');

    codebox.find('._btnCode').removeClass('on').addClass('off');
    codebox.find('._code').css('display', null);
    if (!on) {
      codebox.find(`._code[data-target="${targetName}"]`).css('display', 'block');
      codebox.find(`._btnCode[data-target="${targetName}"]`).removeClass('off').addClass('on');
    }
  });
}

main();
