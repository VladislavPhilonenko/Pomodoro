/**
 * processes data
 * @namespace TaskModel
 */
export default class TaskModel {
  /**
   * TaskModel constructor
   * @constructs TaskModel
   * @param {object} data - task data
   * @memberOf TaskModel
   */
  constructor(data) {
    this.id = data.id || Date.now();
    this.title = data.title;
    this.description = data.description;
    this.deadline = data.deadline;
    this.category = data.category;
    this.priority = data.priority;
    this.estimation = data.estimation;
    this.estimationUsed = data.estimationUsed || 0;
    this.estimationFailed = data.estimationFailed || 0;
    this.isActive = data.isActive || false;
    this.isDone = data.isDone || false;
    this.isFailed = data.isFailed || false;
    this.expirationDate = data.expirationDate || 0;
  }
}
