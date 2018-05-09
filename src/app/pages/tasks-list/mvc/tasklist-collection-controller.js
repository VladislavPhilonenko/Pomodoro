import eventbus from '../../../eventbus';

/**
 * calls model methods
 * @namespace TaskListController
 */
export default class Controller {
  /**
   * TaskListController constructor
   * @constructs TaskListController
   * @param {object} view - instance of TaskListView
   * @param {object} model - instance of TaskListVModel
   * @memberOf TaskListController
   */
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.view.editTaskStatus.subscribe(this.editTaskStatus, this);
    this.view.registerNewUser.subscribe(this.registerNewUser, this);
  }

  /**
   * modify task status
   * @param {object} data
   * @memberOf TaskListController
   */
  editTaskStatus(data) {
    eventbus.dispatch('editTask', data);
  }

  /**
   * adds default settings in session storage
   * @memberOf TaskListController
   */
  registerNewUser() {
    this.model.registerNewUser();
  }
}
