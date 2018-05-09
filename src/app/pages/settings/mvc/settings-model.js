import Event from '../../../observer';

/**
 * processes information for rendering
 * @namespace SettingsModel
 */
export default class Model {
  /**
   * SettingsModel constructor
   * @constructs SettingsModel
   * @memberOf SettingsModel
   */
  constructor() {
    this.newData = this.getData();
    this.changeModel = new Event();
  }

  /**
   * adds settings value
   * @param {number} settingsIndex - index of setting item
   * @memberOf SettingsModel
   */
  addSettingsValue(settingsIndex) {
    if (this.newData[settingsIndex].value >= this.newData[settingsIndex].max) return null;

    this.newData[settingsIndex].value += this.newData[settingsIndex].step;
    this.changeModel.notifyObservers(this.newData);
  }

  /**
   * subs settings value
   * @param {number} settingsIndex - index of setting item
   * @memberOf SettingsModel
   */
  subSettingsValue(settingsIndex) {
    if (this.newData[settingsIndex].value <= this.newData[settingsIndex].min) return null;

    this.newData[settingsIndex].value -= this.newData[settingsIndex].step;
    this.changeModel.notifyObservers(this.newData);
  }

  /**
   * gets data from session storage
   * @memberOf SettingsModel
   * @return {array} newData
   */
  getData() {
    const newData = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      newData.push(JSON.parse(sessionStorage.getItem(`obj${i}`)));
    }

    return newData;
  }

  /**
   * gets data for rendering
   * @memberOf SettingsModel
   * @return {array} this.newData
   */
  getSettings() {
    this.newData = this.getData();
    return this.newData;
  }

  /**
   * saves data on session storage
   * @memberOf SettingsModel
   */
  saveData() {
    sessionStorage.clear();

    for (let i = 0; i < this.newData.length; i++) {
      sessionStorage.setItem(`obj${i}`, JSON.stringify(this.newData[i]));
    }
  }
}
