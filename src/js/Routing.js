import createHistory from 'history/createBrowserHistory';
import { on } from 'delegated-events';

// TODO: merge this with the modal code to remove doubling up
class Routing {
  history = createHistory();
  location = history.location;
  initialTitle = document.title;

  handleEscape = e => {
    if (e.keyCode == 27 && !document.querySelector('.overlay--modal')) {
      this.history.goBack();
    }
  }

  handlClickOutsideBrief = e => {
    const brief = document.querySelector('.brief');
    if (brief) {
      // add event listener to close brief if clicking outside it
      let targetElement = e.target; // clicked element
      do {
        if (targetElement == brief) {
          // we are already on the brief - yay! no action needed - stop here.
          return;
        }
        // Go up the DOM from where we clicked.
        targetElement = targetElement.parentNode;
      } while (targetElement);

      // clicked outside the brief! let's close it.
      this.history.goBack();
    }
  }

  bindRoutes = () => {
    // sniff all internal links for routing
    on('click', '.js-has-routing .js-route', e => {
      if (window.innerWidth < 830) return;
      e.preventDefault();
      const targetUrl = e.target.getAttribute('href');
      this.history.push(targetUrl);
    });
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

  handleRoute = (location, action) => {
    if (location.pathname !== '/') {
      this.loadBrief(location.pathname);
    } else {
      this.closeBrief();
    }
  }

  loadBrief = (url) => {
    this.lockScroll(true);

    const overlay = document.createElement('div');
    overlay.classList.add('overlay', 'is-loading');
    document.querySelector('body').appendChild(overlay);

    // bind the escape key
    document.addEventListener('keydown', this.handleEscape);
    // bind checking for clicks outside the brief modal
    document.addEventListener('click', this.handlClickOutsideBrief);

    // load route
    fetch(url)
      .then(response => response.text())
      .then(body => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(body, "text/html")
        const title = doc.querySelector('title').innerText;
        document.title = title;
        const brief = doc.querySelector('.brief');

        // rename the back link for async modals
        brief.querySelector('.back-link').innerText = "✕ Close";

        overlay.appendChild(brief);
        overlay.classList.remove('is-loading');

      })
      .catch(e => {
        console.log(e);
        this.closeBrief();
        this.history.goBack();
      });
  }

  closeBrief = () => {
    const overlay = document.querySelector('.overlay');
    if (!overlay) return false;

    const closeAnim = (e) => {
      if (e.target == overlay) {
        overlay.removeEventListener('animationend', closeAnim);
        overlay.parentNode.removeChild(overlay);

        // release the page scrolling if there are no more modals
        if (!document.querySelector('.overlay')) {
          this.lockScroll(false);

        }

        // restore the title
        document.title = this.initialTitle;
      }
    };

    overlay.addEventListener('animationend', closeAnim);
    overlay.classList.add('is-closing');

    // unbind the escape key
    document.removeEventListener('keydown', this.handleEscape);
    // unbind checking for clicks outside the brief modal
    document.removeEventListener('click', this.handlClickOutsideBrief);
  }

  constructor() {
    // initialise routing
    this.bindRoutes();
  }

  destroy = this.history.listen(this.handleRoute);
};

export default Routing;
