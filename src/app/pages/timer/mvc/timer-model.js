import eventbus from '../../../eventbus';

/**
 * processes information for rendering
 * @namespace TimerModel
 */
export default class Model {
  /**
   * TimerModel constructor
   * @constructs TimerModel
   * @memberOf TimerModel
   */
  constructor() {
    eventbus.registerEventHandler('setTaskData', this.setTaskData.bind(this));
  }

  /**
   * sets task data to local storage
   * @param {object} data
   * @memberOf TimerModel
   */
  setTaskData(data) {
    localStorage.setItem('startedTask', JSON.stringify(data));
  }

  /**
   * gets task data to local storage
   * @memberOf TimerModel
   * @return {object}
   */
  getTaskData() {
    return JSON.parse(localStorage.getItem('startedTask'));
  }

  /**
   * sets curren ieration
   * @param {number} currentIteration
   * @memberOf TimerModel
   */
  setCurrentIteration(currentIteration) {
    localStorage.setItem('currentIteration', JSON.stringify(currentIteration));
  }
}

