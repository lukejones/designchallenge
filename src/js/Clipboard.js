import { on } from 'delegated-events';

class Clipboard {
  copyText = (str) => {
    const el = document.createElement('textarea');
    el.style.position = 'absolute';
    el.style.clip = 'rect(0, 0, 0, 0)';
    el.style.position = 'absolute';
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  bindClipbuttons = () => {
    on('click', '.js-clipboard', e => {
      this.copyText(window.location.href);
      e.target.classList.add('disabled');
      e.target.innerText = 'Copied Link';
    });
  }

  constructor() {
    if (typeof document.execCommand === 'function') {
      this.bindClipbuttons();
    }
  }
}

export default Clipboard;
