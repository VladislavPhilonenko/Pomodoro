/**
 * supplies routing between  pages
 * @namespace Router
 */
export default class Router {
  /**
   * Router constructor
   * @constructs Router
   * @memberOf Router
   */
  constructor() {
    this.routes = [];
    this.defaultRoute = '';
  }

  /**
   * clears slashes
   * @param {string} path
   * @memberOf Router
   * @returns {string} our path without slashes
   */
  clearSlashes(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  }

  /**
   * gets our path
   * @memberOf Router
   * @returns {string} our path without slashes
   */
  getFragment() {
    const match = window.location.href.match(/#(.*)$/);
    const fragment = match ? match[1] : '';

    return this.clearSlashes(fragment);
  }

  /**
   * checks changes in hash
   * @param {string} fragment
   * @memberOf Router
   * @returns {object} return context
   */
  check(fragment = this.getFragment()) {
    this.routes.some((elem) => {
      const match = fragment.match(elem.re);

      if (match) {
        if (match[0] === '') {
          this.navigate(this.defaultRoute);
          return true;
        }

        match.shift();
        elem.handler.apply({}, match);
        return true;
      }
      return false;
    });
    return this;
  }

  /**
   * adds new route
   * @param {string} re
   * @param {function} handler
   * @memberOf Router
   */
  add(re, handler) {
    if (typeof re === 'function') {
      handler = re;
      re = '';
    }

    this.routes.push({ re, handler });
  }

  /**
   * listens hash changes
   * @memberOf Router
   */
  listen() {
    let current = this.getFragment();

    this.check();
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      if (current !== this.getFragment()) {
        current = this.getFragment();
        this.check(current);
      }
    }, 50);
  }

  /**
   * changes hash
   * @memberOf Router
   */
  navigate(path = '') {
    window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;
  }
}
