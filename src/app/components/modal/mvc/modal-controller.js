import eventbus from '../../../eventbus';

/**
 * supplies connection between modal component and firebase component
 * @namespace ModalController
 */
export default class Controller {
  /**
   * ModalController constructor
   * @constructs ModalController
   * @param {object} view - instance of ModalView
   * @memberOf ModalController
   */
  constructor(view) {
    this.view = view;
    this.view.clickCreateTask.subscribe(this.createTask, this);
    this.view.clickEditTask.subscribe(this.editTask, this);
  }

  /**
   * calls firebase's create task method
   * @param {object} taskData
   * @memberOf ModalController
   */
  createTask(taskData) {
    eventbus.dispatch('createTask', taskData);
  }

  /**
   * calls firebase's edit task method
   * @param {object} taskData
   * @memberOf ModalController
   */
  editTask(taskData) {
    eventbus.dispatch('editTask', taskData);
  }
}
