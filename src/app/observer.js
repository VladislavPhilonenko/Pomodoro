/**
 * supplies connection between Model View and Controller
 * @namespace Event
 */
export default class Event {
  /**
   * Event constructor
   * @constructs Event
   * @memberOf Event
   */
  constructor() {
    this.observers = [];
  }

  /**
   * notify all observers
   * @param {any} data
   * @memberOf Event
   */
  notifyObservers(data) {
    this.observers.forEach((elem) => {
      elem.observer.call(elem.context, data);
    });
  }

  /**
   * adds new observer
   * @param {string} observer - observer name
   * @param {object|null} context - observer content
   * @memberOf Event
   */
  subscribe(observer, context = null) {
    this.observers.push({ observer, context });
  }
}
