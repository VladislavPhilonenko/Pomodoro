let instance = null;

/**
 * supplies connection between components
 * @namespace EventBus
 */
class EventBus {
  /**
   * EventBus constructor
   * @constructs EventBus
   * @memberOf EventBus
   * @returns {object} return single instance
   */
  constructor() {
    this.eventHandlers = {};

    if (!instance) {
      instance = this;
    }
    return instance;
  }

  /**
   * register event handleer
   * @param {string} name
   * @param {function} callback
   * @memberOf EventBus
   */
  registerEventHandler(name, callback) {
    if (name in this.eventHandlers) {
      this.eventHandlers[name].push(callback);
    } else {
      this.eventHandlers[name] = [];
      this.eventHandlers[name].push(callback);
    }
  }

  /**
   * dispatch callback
   * @param {string} eventName
   * @param {any} args
   * @memberOf EventBus
   */
  dispatch(eventName, args) {
    if (eventName in this.eventHandlers) {
      this.eventHandlers[eventName].forEach((event) => {
        event(args);
      });
    }
  }
}

const eventbus = new EventBus();
export default eventbus;
