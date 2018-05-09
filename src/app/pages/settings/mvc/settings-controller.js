/**
 * calls model methods and initialize settings component
 * @namespace SettingsController
 */
export default class Controller {
  /**
   * SettingsController constructor
   * @constructs SettingsController
   * @param {object} view - instance of ReportsView
   * @param {object} model - instance of ReportsModel
   * @memberOf SettingsController
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.clickAddButton.subscribe(this.addSettingsValue, this);
    this.view.clickSubButton.subscribe(this.subSettingsValue, this);
    this.view.clickSaveData.subscribe(this.saveSessionData, this);
  }

  /**
   * adds settings value
   * @param {number} settingsIndex - index of setting item
   * @memberOf SettingsController
   */
  addSettingsValue(settingsIndex) {
    this.model.addSettingsValue(settingsIndex);
  }

  /**
   * subs settings value
   * @param {number} settingsIndex - index of setting item
   * @memberOf SettingsController
   */
  subSettingsValue(settingsIndex) {
    this.model.subSettingsValue(settingsIndex);
  }

  /**
   * save data in session storage
   * @memberOf SettingsController
   */
  saveSessionData() {
    this.model.saveData();
  }

  /**
   * initializes settings component
   * @memberOf SettingsController
   */
  init() {
    this.view.render(this.model.getSettings(), true);
  }
}
