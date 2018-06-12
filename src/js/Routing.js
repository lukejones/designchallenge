import createHistory from 'history/createBrowserHistory';
import { on } from 'delegated-events';

// TODO: merge this with the modal code to remove doubling up
class Routing {
  history = createHistory();
  location = history.location;
  initialTitle = document.title;

  bindRoutes = () => {
    // sniff all internal links for routing
    on('click', '.js-has-routing .js-route', e => {
      if (window.innerWidth < 830) return;

      e.preventDefault();
      const targetUrl = e.target.getAttribute('href');
      console.log(targetUrl);
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
  }

  constructor() {
    // initialise routing
    this.bindRoutes();
  }

  destroy = this.history.listen(this.handleRoute);
};

export default Routing;
