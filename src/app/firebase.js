import * as firebase from 'firebase';
import eventbus from './eventbus';
import TaskModel from './components/task/mvc/task-model';

/**
 * supplies work with firebase
 * @namespace Firebase
 */
export default class Firebase {
  /**
   * Firebase constructor
   * @constructs Firebase
   * @param {object} config firebase configuration
   * @memberOf Firebase
   */
  constructor(config) {
    this.config = config;
    firebase.initializeApp(this.config);
    this.firebaseRef = firebase.database().ref('tasks');

    eventbus.registerEventHandler('createTask', this.createTask.bind(this));
    eventbus.registerEventHandler('editTask', this.editTask.bind(this));
    eventbus.registerEventHandler('removeTasks', this.removeTasks.bind(this));
    eventbus.registerEventHandler('update', this.update.bind(this));
    eventbus.registerEventHandler('getChartData', this.getChartData.bind(this));
  }

  /**
   * gets data for charts
   * @memberOf Firebase
   */
  getChartData() {
    this.getDataFromFirebase()
      .then((data) => {
        eventbus.dispatch('updateChartData', data);
      })
      .catch((error) => {
        eventbus.dispatch('renderNotification', this.notificationData('error', error));
      });
  }

  /**
   * saves task on firebase and renders notification
   * @param {object} taskData - task data
   * @memberOf Firebase
   */
  createTask(taskData) {
    const task = new TaskModel(taskData);

    firebase.database().ref(`tasks/${task.id}`).set(task);
    this.update('Task was successfully added!');
  }

  /**
   * changes task and renders notification
   * @param {object} taskData - task data
   * @memberOf Firebase
   */
  editTask(taskData) {
    const task = new TaskModel(taskData);
    const completedTaskMessage = 'Task was successfully completed!';

    firebase.database().ref(`tasks/${task.id}`).set(task);

    if (task.expirationDate) {
      eventbus.dispatch('renderNotification', this.notificationData('success', completedTaskMessage));
    } else {
      this.update('Task was successfully changed!');
    }
  }

  /**
   * remove task from firebase and renders notification
   * @param {string} id - task id for single deleting
   * @memberOf Firebase
   */
  removeTasks(id) {
    if (id) {
      firebase.database().ref(`tasks/${id}`).set(null);
      this.update('Task was successfully removed!');
    } else {
      const data = JSON.parse(localStorage.getItem('removedIdList'));

      data.forEach((elem) => {
        firebase.database().ref(`tasks/${elem}`).set(null);
      });

      if (data.length === 1) {
        this.update('Task was successfully removed!');
      } else {
        this.update('Tasks were successfully removed!');
      }
    }
  }

  /**
   * method for getting data from firebase
   * @memberOf Firebase
   * @returns {Promise} Promise object represents all tasks data
   */
  getDataFromFirebase() {
    return this.firebaseRef.once('value').then(snap => snap.val());
  }

  /**
   * method for updating our task list
   * @memberOf Firebase
   */
  update(message) {
    this.getDataFromFirebase()
      .then((data) => {
        eventbus.dispatch('updateCollection', data);
        eventbus.dispatch('render');
        eventbus.dispatch('changeHeaderForTaskList');
        if (message) {
          eventbus.dispatch('renderNotification', this.notificationData('success', message));
        }
      })
      .catch((error) => {
        eventbus.dispatch('renderNotification', this.notificationData('error', error));
      });
  }

  /**
   * constructs object for representing notifications
   * @param {string} title - notification type
   * @param {string} message - notificaton message
   * @memberOf Firebase
   * @returns {{title: title, message: message}}
   */
  notificationData(title, message) {
    return {
      title,
      message
    };
  }
}
