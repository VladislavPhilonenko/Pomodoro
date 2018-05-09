import eventbus from '../../../eventbus';
import Event from '../../../observer';
import task from '../templates/task.hbs';
import taskListTemp from '../templates/task-list.hbs';
import firstEnterTemp from '../templates/first-entrance.hbs';
import globalTasksTemp from '../templates/global-tasks.hbs';
import doneTasksTemp from '../templates/tasks-done.hbs';
import emptyDailyTasks from '../templates/empty-daily-tasks-zone.hbs';
import doneAllTasks from '../templates/done-all-tasks.hbs';
import addFirstTask from '../templates/addFirstTask.hbs';
import emptyGlobalTasksTemp from '../templates/empty-global-list.hbs';
import '../../../tooltips';

/**
 * represents task list component
 * @namespace TaskListView
 */
export default class View {
  /**
   * TaskListView constructor
   * @constructs TaskListView
   * @param {object} model - instance of TaskLisModel
   * @memberOf TaskListView
   */
  constructor(model) {
    eventbus.registerEventHandler('onRemoveMode', this.onRemoveMode.bind(this));
    eventbus.registerEventHandler('offRemoveMode', this.offRemoveMode.bind(this));
    eventbus.registerEventHandler('render', this.render.bind(this, true));

    this.model = model;
    this.editTaskStatus = new Event();
    this.registerNewUser = new Event();
  }

  /**
   * adds tooltips
   * @memberOf TaskListView
   */
  addTooltips() {
    $('.link-to-global-tasks').tooltips();
    $('.icon-tomato').tooltips();
    $('.icon-edit').tooltips();
    $('.add-task-btn').tooltips();
    $('.icon-arrows-up').tooltips();
  }

  /**
   * renders task list page
   * @memberOf TaskListView
   */
  render(isToDoPage) {
    if (!sessionStorage.length) {
      this.renderFirstEntrancePage();
    } else {
      this.renderDefaultPage(isToDoPage);
    }
  }

  /**
   * renders first entrance  page
   * @memberOf TaskListView
   */
  renderFirstEntrancePage() {
    const mainContent = document.getElementsByClassName('main-content')[0];

    mainContent.innerHTML = firstEnterTemp();

    const taskListLink = document.getElementsByClassName('btn-primary')[0];
    const addTaskBtn = document.getElementsByClassName('add-task-btn')[0];

    addTaskBtn.addEventListener('click', this.addTask);
    taskListLink.addEventListener('click', this.render.bind(this, true));

    this.registerNewUser.notifyObservers();
  }

  /**
   * renders default page
   * @memberOf TaskListView
   */
  renderDefaultPage(isToDoPage) {
    const mainContent = document.getElementsByClassName('main-content')[0];
    const data = this.model.getTasks();
    const globalTasksData = data[0];
    const dailyTasksData = data[1];
    const doneTasksData = data[2];


    if (!dailyTasksData && !globalTasksData && !doneTasksData) {
      this.renderCreateFirstTaskPage();

      return null;
    } else if (!dailyTasksData && !globalTasksData && doneTasksData) {
      mainContent.innerHTML = taskListTemp();

      const addTaskBtn = document.getElementsByClassName('add-task-btn')[0];
      const globalTaskBtn = document.getElementsByClassName('link-to-global-tasks')[0];
      const toDoLink = document.getElementsByClassName('status-tabs')[0];
      const dailyTasksList = document.getElementsByClassName('daily-list')[0];
      const firstEntranceBlock = document.getElementsByClassName('first-entrance')[0];

      addTaskBtn.addEventListener('click', this.addTask);

      globalTaskBtn.classList.add('invisible');

      if (isToDoPage) {
        dailyTasksList.innerHTML = '';
        toDoLink.children[0].classList.add('tabs__active');
        firstEntranceBlock.innerHTML = doneAllTasks();
        eventbus.dispatch('changeHeaderForTaskList');

        toDoLink.addEventListener('click', this.renderDailyOrDoneTasks.bind(this));
      } else {
        firstEntranceBlock.innerHTML = '';
        toDoLink.children[1].classList.add('tabs__active');
        dailyTasksList.innerHTML = doneTasksTemp(doneTasksData);
        eventbus.dispatch('changeHeaderForTaskList');

        toDoLink.addEventListener('click', this.renderDailyOrDoneTasks.bind(this));
      }

      return null;
    }

    mainContent.innerHTML = taskListTemp();
    eventbus.dispatch('changeHeaderForTaskList');

    const dailyTasksList = document.getElementsByClassName('daily-list')[0];
    const globalTasksList = document.getElementsByClassName('global-list')[0];
    //const linksToTimerPage = globalTasksList.getElementsByClassName('priority-shapes');
    const globalTaskBtn = document.getElementsByClassName('link-to-global-tasks')[0];
    const addTaskBtn = document.getElementsByClassName('add-task-btn')[0];
    const toDoLink = document.getElementsByClassName('status-tabs')[0];
    const priorityTabs = document.getElementsByClassName('priority__tabs')[0];

    if (isToDoPage) {
      toDoLink.children[0].classList.add('tabs__active');

      if (dailyTasksData) {
        dailyTasksList.innerHTML = task(dailyTasksData);
      } else {
        dailyTasksList.innerHTML = emptyDailyTasks();
      }

      if (globalTasksData) {
        globalTasksList.innerHTML = globalTasksTemp(globalTasksData);
      } else {
        globalTasksList.innerHTML = emptyGlobalTasksTemp(globalTasksData);
      }

      this.addTooltips();

      //linksToTimerPage.addEventListener('click', this.unfollowTimerLink.bind(this));

      toDoLink.addEventListener('click', this.renderDailyOrDoneTasks.bind(this));
      addTaskBtn.addEventListener('click', this.addTask);
      globalTaskBtn.addEventListener('click', this.openGlobalTasks);
      mainContent.addEventListener('click', this.editTask.bind(this));
      mainContent.addEventListener('click', this.startTimer.bind(this));
      priorityTabs.addEventListener('click', this.choosePriority.bind(this));
    } else {
      toDoLink.children[1].classList.add('tabs__active');
      globalTaskBtn.classList.add('invisible');
      dailyTasksList.innerHTML = doneTasksTemp(doneTasksData);

      addTaskBtn.addEventListener('click', this.addTask);
      toDoLink.addEventListener('click', this.renderDailyOrDoneTasks.bind(this));
    }
  }

  /**
   * renders unfolow timer link
   * @memberOf TaskListView
   */
  unfollowTimerLink() {
    const notificationData = {
      title: 'warning',
      message: 'You can\'t start timer from global list!'
    };
    eventbus.dispatch('renderNotification', notificationData);
  }

  /**
   * renders create firs tast page
   * @memberOf TaskListView
   */
  renderCreateFirstTaskPage() {
    const mainContent = document.getElementsByClassName('main-content')[0];

    mainContent.innerHTML = addFirstTask();

    const addTaskBtn = document.getElementsByClassName('add-task-btn')[0];

    addTaskBtn.addEventListener('click', this.addTask);
  }

  /**
   * opens modal window
   * @param {event} e
   * @memberOf TaskListView
   */
  addTask(e) {
    e.preventDefault();
    eventbus.dispatch('renderModal');
  }

  /**
   * opens global tasks
   * @memberOf TaskListView
   */
  openGlobalTasks() {
    const globalTaskBtn = document.getElementsByClassName('link-to-global-tasks')[0];
    const globalTasksList = document.getElementsByClassName('global-list')[0];
    const globalTaskBtnArrow = globalTaskBtn.getElementsByTagName('span')[0];
    const priorityTabs = document.getElementsByClassName('priority__tabs')[0];

    if (globalTasksList.classList.contains('invisible')) {
      priorityTabs.classList.toggle('invisible');
      globalTasksList.classList.toggle('invisible');
      globalTaskBtnArrow.classList.toggle('icon-global-list-arrow-down');
      globalTaskBtnArrow.classList.toggle('icon-global-list-arrow-right');
    } else {
      priorityTabs.classList.toggle('invisible');
      globalTasksList.classList.toggle('invisible');
      globalTaskBtnArrow.classList.toggle('icon-global-list-arrow-down');
      globalTaskBtnArrow.classList.toggle('icon-global-list-arrow-right');
    }
  }

  /**
   * gets task data from page
   * @param {HTMLElement} target
   * @memberOf TaskListView
   * @return {object}
   */
  getTaskDataFromPage(target) {
    return {
      id: target.dataset.id,
      title: target.children[2].children[0].textContent,
      description: target.children[2].children[1].textContent,
      category: target.classList[1].split('-')[1],
      priority: target.classList[2].split('-')[1],
      estimation: target.children[4].children[0].textContent
    };
  }

  /**
   * collects data for edit modal
   * @param {event} e
   * @memberOf TaskListView
   */
  editTask(e) {
    const { target } = e;
    const dailyList = document.getElementsByClassName('daily-list')[0];

    if (target.classList.contains('icon-edit')) {
      const currentTask = target.parentElement.parentElement;
      const currentDay = currentTask.children[1].children[0].textContent;
      const currentMonth = currentTask.children[1].children[1].textContent;
      const currentYear = currentTask.children[1].dataset.year;
      const data = this.getTaskDataFromPage(currentTask);
      const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      };

      if (!currentDay) {
        data.deadline = new Date().toLocaleString('en-US', options);
      } else {
        data.deadline = `${currentMonth} ${currentDay}, ${currentYear}`;
      }

      data.isActive = currentTask.dataset.isActive === 'true';

      eventbus.dispatch('renderModal', data);
      e.stopImmediatePropagation();
    } else if (target.classList.contains('icon-arrows-up')) {
      const currentTask = target.parentElement.parentElement;
      const data = this.getTaskDataFromPage(currentTask);
      const MSINONEDAY = 86399999;
      const currentDate = new Date();
      const todayAtMidn = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

      data.isActive = true;
      data.deadline = Date.parse(todayAtMidn) + MSINONEDAY;

      if (dailyList.children && dailyList.children.length >= 5) {
        const notificationData = {
          title: 'warning',
          message: 'You can\'t add to daily tasks more than 5 tasks!'
        };

        eventbus.dispatch('renderNotification', notificationData);

        return null;
      }

      this.editTaskStatus.notifyObservers(data);
      e.stopImmediatePropagation();
    }
  }

  /**
   * starts timer, goes to the timer page
   * @param {event} e
   * @memberOf TaskListView
   */
  startTimer(e) {
    const { target } = e;

    if (target.classList.contains('priority-shapes')) {
      const currentTask = target.parentElement;
      const isGlobalTask = target.parentElement.parentElement.parentElement.classList.contains('global-tasks');

      if (isGlobalTask) {
        e.preventDefault();
        this.unfollowTimerLink();

        return null;
      }

      const data = this.getTaskDataFromPage(currentTask);

      data.isActive = currentTask.dataset.isActive === 'true';
      eventbus.dispatch('setTaskData', data);
      e.stopImmediatePropagation();
    }
  }

  /**
   * assigns tabs events
   * @param {event} e
   * @memberOf TaskListView
   */
  renderDailyOrDoneTasks(e) {
    const { target } = e;

    if (target.classList.contains('done-link')) {
      this.render(false);
    } else if (target.classList.contains('todo-link')) {
      this.render(true);
    }
  }

  /**
   * assigns filter tabs events
   * @param {event} e
   * @memberOf TaskListView
   */
  choosePriority(e) {
    const { target } = e;
    const priorityTabs = Array.from(document.getElementsByClassName('priority__tabs')[0].children);

    if (target.classList.contains('tabs__item')) {
      const { priority } = target.dataset;

      priorityTabs.forEach((elem) => {
        elem.classList.remove('tabs__active');
      });

      target.classList.add('tabs__active');

      switch (priority) {
        case 'all':
          this.priorityFilter();
          break;
        case 'urgent':
          this.priorityFilter('urgent');
          break;
        case 'high':
          this.priorityFilter('high');
          break;
        case 'middle':
          this.priorityFilter('middle');
          break;
        case 'low':
          this.priorityFilter('low');
          break;
        default:
          return null;
      }
    }
  }

  /**
   * filter method
   * @param {string} priority
   * @memberOf TaskListView
   */
  priorityFilter(priority) {
    const taskLists = Array.from(document.getElementsByClassName('global'));

    taskLists.forEach((elem) => {
      const tasks = Array.from(elem.children);

      elem.parentElement.classList.remove('invisible');

      tasks.forEach((elem) => {
        elem.classList.remove('invisible');

        if (priority && !elem.className.match(priority)) {
          elem.classList.add('invisible');
        }
      });

      if (tasks.every(checkForEmptiness)) {
        elem.parentElement.classList.add('invisible');
      }

      /**
       * checks for emptiness
       * @param {HTMLElement} elem
       * @memberOf TaskListView
       * @return {boolean}
       */
      function checkForEmptiness(elem) {
        return elem.classList.contains('invisible');
      }
    });
  }

  /**
   * includes remove mode
   * @memberOf TaskListView
   */
  onRemoveMode() {
    const mainContent = document.getElementsByClassName('main-content')[0];
    const tasks = document.getElementsByClassName('task');
    const dates = document.getElementsByClassName('date');
    const dailyList = document.getElementsByClassName('daily-list')[0];
    const globalList = document.getElementsByClassName('global-list')[0];
    const deleteBtns = document.getElementsByClassName('delete-elem');
    const deleteDailyBtns = dailyList.getElementsByClassName('delete-elem');
    const deleteGlobalBtns = globalList.getElementsByClassName('delete-elem');
    const dailyTabs = document.getElementsByClassName('daily-tabs')[0];
    const globalTabs = document.getElementsByClassName('tabs-global-tasks')[0];
    const isDailyListNotEmpty = Array.from(dailyList.children).some(item => item.classList.contains('task'));
    const isGlobalListNotEmpty = Array.from(globalList.children).some(item => item.classList.contains('global-tasks') && !item.classList.contains('invisible'));

    if (isDailyListNotEmpty) {
      dailyTabs.classList.remove('invisible');
    }

    if (isGlobalListNotEmpty) {
      globalTabs.classList.remove('invisible');
    }

    for (let i = 0; i < tasks.length; i++) {
      tasks[i].classList.add('task-remove');
      deleteBtns[i].classList.remove('invisible');
      dates[i].classList.add('invisible');
    }

    mainContent.addEventListener('click', this.markTaskForRemove);
    dailyTabs.addEventListener('click', this.markAllTasksForRemove.bind(null, deleteDailyBtns, dailyTabs));

    if (globalTabs) {
      globalTabs.addEventListener('click', this.markAllTasksForRemove.bind(null, deleteGlobalBtns, globalTabs));
    }
  }

  /**
   * marks task for removing
   * @memberOf TaskListView
   */
  markTaskForRemove(e) {
    const { target } = e;

    if (target.classList.contains('delete-elem')) {
      if (target.classList.contains('active__btn')) {
        eventbus.dispatch('subRemoveTasks', target.parentElement.dataset.id);
        target.classList.remove('active__btn');
      } else {
        eventbus.dispatch('addRemoveTasks', target.parentElement.dataset.id);
        target.classList.add('active__btn');
      }

      e.stopImmediatePropagation();
    }
  }

  /**
   * marks all tasks for removing
   * @memberOf TaskListView
   */
  markAllTasksForRemove(buttons, tabs, e) {
    const { target } = e;

    Array.from(tabs.children).forEach((elem) => {
      elem.classList.remove('tabs__active');
    });

    if (target.classList.contains('select')) {
      target.classList.add('tabs__active');

      Array.from(buttons).forEach((elem) => {
        if (!elem.classList.contains('active__btn')) {
          elem.classList.add('active__btn');
          eventbus.dispatch('addRemoveTasks', elem.parentElement.dataset.id);
        }
      });
    } else if (target.classList.contains('deselect')) {
      target.classList.add('tabs__active');

      Array.from(buttons).forEach((elem) => {
        if (elem.classList.contains('active__btn')) {
          elem.classList.remove('active__btn');
          eventbus.dispatch('subRemoveTasks', elem.parentElement.dataset.id);
        }
      });
    }
  }

  /**
   * turns off the removing mode
   * @memberOf TaskListView
   */
  offRemoveMode() {
    const tasks = document.getElementsByClassName('task');
    const dates = document.getElementsByClassName('date');
    const deleteBtns = document.getElementsByClassName('delete-elem');
    const removeTabs = document.getElementsByClassName('remove-tabs');
    const dailyTabs = document.getElementsByClassName('daily-tabs')[0];
    const globalTabs = document.getElementsByClassName('tabs-global-tasks')[0];

    this.removedIdList = [];
    this.toDoPage = true;
    localStorage.removeItem('removedIdList');

    if (dailyTabs) {
      Array.from(dailyTabs.children).forEach((elem) => {
        elem.classList.remove('tabs__active');
      });
    }

    if (globalTabs) {
      Array.from(globalTabs.children).forEach((elem) => {
        elem.classList.remove('tabs__active');
      });
    }

    Array.from(removeTabs).forEach((elem) => {
      elem.classList.add('invisible');
    });

    for (let i = 0; i < tasks.length; i++) {
      tasks[i].classList.remove('task-remove');
      deleteBtns[i].classList.add('invisible');
      deleteBtns[i].classList.remove('active__btn');
      dates[i].classList.remove('invisible');
    }
  }
}
