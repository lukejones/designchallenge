// Load the CSS so that webpack can do its magic
import '../css/main.css';
import Routing from './Routing';
import Clipboard from './Clipboard';

const app = app || {
  routing: new Routing(),
  clipboard: new Clipboard(),
};

window.app = app;
