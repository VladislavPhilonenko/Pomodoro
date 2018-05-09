import Model from './settings-model';
import Controller from './settings-controller';
import View from './settings-view';

const settingsModel = new Model();
const settingView = new View(settingsModel);
const settingsController = new Controller(settingsModel, settingView);

export default settingsController;
