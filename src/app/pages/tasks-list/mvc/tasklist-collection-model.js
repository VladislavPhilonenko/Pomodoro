import eventbus from '../../../eventbus';
import defaultData from '../data/default-settings';

/**
 * processes information for rendering tasks
 * @namespace TaskListModel
 */
export default class Model {
  /**
   * TaskListModel constructor
   * @constructs TaskListModel
   * @memberOf TaskListModel
   */
  constructor() {
    eventbus.registerEventHandler('updateCollection', this.updateCollection.bind(this));
    this.data = null;
  }

  /**
   * adds default settings in session storage
   * @memberOf TaskListModel
   */
  registerNewUser() {
    defaultData.forEach((elem, i) => {
      sessionStorage.setItem(`obj${i}`, JSON.stringify(elem));
    });
  }

  /**
   * gets distributed data for rendering
   * @memberOf TaskListModel
   * @return {Array} tasks
   */
  getTasks() {
    const tasks = [];

    tasks.push(this.getGlobalTasks());
    tasks.push(this.getDailyTasks());
    tasks.push(this.getDoneTasks());

    return tasks;
  }

  /**
   * updates TaskListModel
   * @memberOf TaskListModel
   */
  updateCollection(newData) {
    if (!newData) {
      newData = {};
    }

    this.data = newData;
  }

  /**
   * gets global tasks
   * @memberOf TaskListModel
   * @return {object} globalTasksData
   */
  getGlobalTasks() {
    const globalTasksData = {
      work: [],
      hobby: [],
      education: [],
      sport: [],
      other: []
    };

    Object.values(this.data).forEach((elem) => {
      const deadline = new Date(elem.deadline);
      const month = deadline.toLocaleString('en-us', { month: 'long' });
      const day = deadline.getDate();
      const year = deadline.getFullYear();

      if (!elem.isActive && !elem.isDone) {
        elem.notOverdue = Date.now() < elem.deadline;

        if (this.isToday(month, day, year)) {
          elem.deadlineMonth = 'today';
        } else {
          elem.deadlineMonth = month;
          elem.deadlineDay = day;
          elem.deadlineYear = year;
        }

        switch (elem.category) {
          case 'work':
            globalTasksData.work.push(elem);
            break;
          case 'hobby':
            globalTasksData.hobby.push(elem);
            break;
          case 'education':
            globalTasksData.education.push(elem);
            break;
          case 'sport':
            globalTasksData.sport.push(elem);
            break;
          case 'other':
            globalTasksData.other.push(elem);
            break;
          default:
            return null;
        }
      }
    });

    return this.isEmptyArr(globalTasksData) ? null : globalTasksData;
  }

  /**
   * gets daily tasks
   * @memberOf TaskListModel
   * @return {object} dailyTasksData
   */
  getDailyTasks() {
    const dailyTasksData = { tasks: [] };

    Object.values(this.data).forEach((elem) => {
      if (elem.isActive && !elem.isDone) {
        elem.deadlineMonth = 'today';
        dailyTasksData.tasks.push(elem);
      }
    });

    return this.isEmptyArr(dailyTasksData) ? null : dailyTasksData;
  }

  /**
   * gets done tasks
   * @memberOf TaskListModel
   * @return {object} doneTasksData
   */
  getDoneTasks() {
    const doneTasksData = { tasks: [] };

    Object.values(this.data).forEach((elem) => {
      const expirationDate = new Date(elem.expirationDate);
      const month = expirationDate.toLocaleString('en-us', { month: 'long' });
      const day = expirationDate.getDate();
      const year = expirationDate.getFullYear();

      if (elem.isDone) {
        if (this.isToday(month, day, year)) {
          elem.deadlineMonth = 'today';
        } else {
          elem.deadlineMonth = month;
          elem.deadlineDay = day;
          elem.deadlineYear = year;
        }

        doneTasksData.tasks.push(elem);
      }
    });

    return this.isEmptyArr(doneTasksData) ? null : doneTasksData;
  }

  /**
   * compares current date with task date
   * @param {string} month - task's month date
   * @param {number} day - task's day date
   * @param {number} year - task's year date
   * @memberOf TaskListModel
   * @return {boolean}
   */
  isToday(month, day, year) {
    const currentDate = new Date();
    const currMonth = currentDate.toLocaleString('en-us', { month: 'long' });
    const currDay = currentDate.getDate();
    const currYear = currentDate.getFullYear();

    return month === currMonth && day === currDay && year === currYear;
  }

  /**
   * checks the object for emptiness
   * @param {object} obj - checked object
   * @memberOf TaskListModel
   * @return {boolean}
   */
  isEmptyArr(obj) {
    let test = 0;
    let arrCount = 0;
    Object.values(obj).forEach((elem) => {
      if (elem.length === 0) {
        test++;
      }

      arrCount++;
    });

    return test === arrCount;
  }
}
