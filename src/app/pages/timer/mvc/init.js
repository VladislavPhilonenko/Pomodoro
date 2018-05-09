import View from './timer-view';
import Model from './timer-model';
import Controller from './timer-controller';

const timerModel = new Model();
const timerView = new View(timerModel);
const timerController = new Controller(timerView, timerModel);

export default timerController;
