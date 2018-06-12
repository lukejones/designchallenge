// Load the CSS so that webpack can do its magic
import '../css/main.css';

// Load IE11 polyfills :-(
import './polyfills';

// Import app modules
import Routing from './Routing';
import Clipboard from './Clipboard';
import Modal from './Modal';

// Create a global namespace and inject the modules
const app = app || {
  routing: new Routing(),
  clipboard: new Clipboard(),
  modals: new Modal(),
};

window.app = app;
