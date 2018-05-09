/**
 * calls model methods and initialize report component
 * @namespace TimerController
 */
export default class Controller {
  /**
   * TimerController constructor
   * @constructs TimerController
   * @param {object} view - instance of TimerView
   * @param {object} model - instance of TimerModel
   * @memberOf TimerController
   */
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.view.setIteration.subscribe(this.setIteration, this);
  }

  /**
   * initializes timer component
   * @memberOf TimerController
   */
  init() {
    this.view.render();
  }

  /**
   * sets current iteration
   * @memberOf TimerController
   */
  setIteration(currentIteration) {
    this.model.setCurrentIteration(currentIteration);
  }
}
