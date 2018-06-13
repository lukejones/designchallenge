import { on } from 'delegated-events';

// TODO: merge this with the routing code to remove doubling up
class Modal {
  bindModals = () => {
    on('click', '.js-modal-trigger', e => {
      e.preventDefault();
      this.closeModal();

      const modalTarget = e.target.getAttribute('href');
      const modalTemplate = document.querySelector(`.modal-template${modalTarget}`);
      if (modalTemplate) {
        this.createModal(modalTemplate);
      }
    });

    on('click', '.js-modal-close', e => {
      e.preventDefault();
      this.closeModal();
    });
  }

  handleEscape = e => {
    if (e.keyCode == 27) {
      this.closeModal();
    }
  }

  lockScroll = (isLocked = false) => {
    if (isLocked) {
      document.querySelector('html').classList.add('no-scroll');
      document.querySelector('body').classList.add('no-scroll');
    } else {
      document.querySelector('html').classList.remove('no-scroll');
      document.querySelector('body').classList.remove('no-scroll');
    }
  }

  createModal = (template) => {
    this.lockScroll(true);
    const overlay = document.createElement('div');
    overlay.classList.add('overlay', 'overlay--modal');
    overlay.innerHTML = template.innerHTML;
    document.querySelector('body').appendChild(overlay);

    // bind the escape key
    document.addEventListener('keydown', this.handleEscape);
  }

  closeModal = () => {
    const overlay = document.querySelector('.overlay--modal');
    if (!overlay) return false;

    const closeAnim = (e) => {
      if (e.target == overlay) {
        overlay.removeEventListener('animationend', closeAnim);
        overlay.parentNode.removeChild(overlay);
        // release the page scrolling if there are no more modals
        if (!document.querySelector('.overlay')) {
          this.lockScroll(false);
        }
      }
    };

    overlay.addEventListener('animationend', closeAnim);
    overlay.classList.add('is-closing');

    // unbind the escape key
    document.removeEventListener('keydown', this.handleEscape);
  }

  constructor() {
    this.bindModals();
  }
};

export default Modal;
