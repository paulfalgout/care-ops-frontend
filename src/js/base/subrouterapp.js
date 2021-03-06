import _ from 'underscore';
import { normalizeMethods } from 'marionette';

import App from './app';

export default App.extend({
  constructor() {
    this._current = null;

    this.initRouter();

    App.apply(this, arguments);
  },

  initRouter() {
    const eventRoutes = _.result(this, 'eventRoutes', {});
    this._eventRoutes = normalizeMethods(this, eventRoutes);
  },

  // Start a route from a currentRoute passed from a routerapp
  startRoute({ event, eventArgs }) {
    const action = this._eventRoutes[event];

    action.apply(this, eventArgs);
  },

  mixinOptions(options) {
    const appOptions = _.result(this, 'currentAppOptions');

    return _.extend({}, appOptions, options);
  },

  // handler that ensures one running app per type
  startCurrent(appName, options) {
    this.stopCurrent();

    this._current = this.startChildApp(appName, this.mixinOptions(options));
  },

  stopCurrent() {
    if (this._current) this._current.stop();
  },
});
