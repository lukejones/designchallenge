import createHistory from 'history/createBrowserHistory';
import { on } from 'delegated-events';

class Routing {
  history = createHistory();
  location = history.location;

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
    console.log(action, location.pathname, location.state)

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

    // load route
    fetch(url)
      .then(response => response.text())
      .then(body => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(body, "text/html")
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
    const closeAnim = (e) => {
      if (e.target == overlay) {
        overlay.removeEventListener('animationend', closeAnim);
        overlay.remove();
        this.lockScroll(false);
      }
    };
    overlay.addEventListener('animationend', closeAnim);
    overlay.classList.add('is-closing');
  }

  constructor() {
    // initialise routing
    this.bindRoutes();
  }

  destroy = this.history.listen(this.handleRoute);
};

export default Routing;
