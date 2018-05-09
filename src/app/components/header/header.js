import eventbus from '../../eventbus';
import headerTemp from './templates/header.hbs';
import '../../tooltips';

/**
 * represents header component
 * @namespace Header
 */
export default class Header {
  /**
   * Header constructor
   * @constructs Header
   * @memberOf Header
   */
  constructor() {
    this.render();
    this.addTooltips();
    eventbus.registerEventHandler('changeHeaderForStartedTimer', this.changeHeaderForStartedTimer.bind(this));
    eventbus.registerEventHandler('changeHeaderForSettings', this.changeHeaderForSettings.bind(this));
    eventbus.registerEventHandler('changeHeaderForTaskList', this.changeHeaderForTaskList.bind(this));
    eventbus.registerEventHandler('changeHeaderForReports', this.changeHeaderForReports.bind(this));
    eventbus.registerEventHandler('changeHeaderForTimer', this.changeHeaderForTimer.bind(this));
    eventbus.registerEventHandler('subRemoveTasks', this.subRemoveTasks.bind(this));
    eventbus.registerEventHandler('addRemoveTasks', this.addRemoveTasks.bind(this));
    this.removedIdList = [];
  }

  /**
   * adds tooltips
   * @memberOf Header
   */
  addTooltips() {
    $('.navbar__item a').tooltips();
  }

  /**
   * renders header on the page
   * @memberOf Header
   */
  render() {
    const header = document.getElementsByClassName('header')[0];

    header.innerHTML = headerTemp();

    const trashLink = document.getElementsByClassName('icon-trash')[0];
    const taskListLink = document.getElementsByClassName('icon-list')[0];
    const addTaskBtn = document.getElementsByClassName('icon-add')[0];
    const removeCounter = document.getElementsByClassName('remove-task-counter')[0];

    window.addEventListener('scroll', this.addSticky);

    taskListLink.addEventListener('click', () => {
      eventbus.dispatch('offRemoveMode');
      trashLink.classList.remove('navbar__active');
      taskListLink.classList.add('navbar__active');

      this.resetCounter();
    });

    trashLink.addEventListener('click', () => {
      eventbus.dispatch('onRemoveMode');
      taskListLink.classList.remove('navbar__active');
      trashLink.classList.add('navbar__active');

      if (!removeCounter.classList.contains('invisible')) {
        eventbus.dispatch('renderRemoveModal');
      }
    });

    addTaskBtn.addEventListener('click', (e) => {
      e.preventDefault();
      eventbus.dispatch('renderModal');
    });
  }

  /**
   * adds sticky header behavior
   * @memberOf Header
   */
  addSticky() {
    if (!document.getElementsByTagName('header')[0]) return;

    const header = document.getElementsByTagName('header')[0];
    const logo = document.getElementsByClassName('logo')[0];
    const addTaskBtns = document.getElementsByClassName('icon-add');
    const taskListLink = document.getElementsByClassName('icon-list')[0];

    if (window.pageYOffset > 20) {
      if (header.classList.contains('sticky')) return;

      header.classList.add('sticky');
      logo.classList.remove('invisible');

      if (taskListLink.classList.contains('navbar__active')) {
        addTaskBtns[0].parentElement.classList.remove('invisible');
      }
    } else {
      header.classList.remove('sticky');
      logo.classList.add('invisible');
      addTaskBtns[0].parentElement.classList.add('invisible');
    }
  }

  /**
   * changes header for settings page
   * @memberOf Header
   */
  changeHeaderForSettings() {
    const settingsLink = document.getElementsByClassName('icon-settings')[0];
    const trashLink = document.getElementsByClassName('icon-trash')[0];
    const taskListLink = document.getElementsByClassName('icon-list')[0];
    const reportLInk = document.getElementsByClassName('icon-statistics')[0];
    const addTask = document.getElementsByClassName('icon-add')[0];
    const header = document.getElementsByClassName('header')[0];

    header.classList.remove('hidden');
    taskListLink.classList.remove('navbar__active');
    trashLink.classList.remove('navbar__active');
    reportLInk.classList.remove('navbar__active');
    settingsLink.classList.add('navbar__active');
    trashLink.parentElement.classList.add('invisible');
    addTask.parentElement.classList.add('invisible');

    this.resetCounter();
  }

  /**
   * changes header for task list page
   * @memberOf Header
   */
  changeHeaderForTaskList() {
    const trashLink = document.getElementsByClassName('icon-trash')[0];
    const taskListLink = document.getElementsByClassName('icon-list')[0];
    const settingsLink = document.getElementsByClassName('icon-settings')[0];
    const reportLInk = document.getElementsByClassName('icon-statistics')[0];
    const addTask = document.getElementsByClassName('icon-add')[0];
    const firstEntranceElem = document.getElementsByClassName('first-entrance')[0];
    const header = document.getElementsByClassName('header')[0];

    header.classList.remove('hidden');
    settingsLink.classList.remove('navbar__active');
    reportLInk.classList.remove('navbar__active');
    trashLink.classList.remove('navbar__active');
    taskListLink.classList.add('navbar__active');

    if (window.pageYOffset > 20) {
      addTask.parentElement.classList.remove('invisible');
    }

    if (firstEntranceElem.children.length || !sessionStorage.length) {
      trashLink.parentElement.classList.add('invisible');
    } else {
      trashLink.parentElement.classList.remove('invisible');
    }

    this.resetCounter();
  }

  /**
   * changes header for reports page
   * @memberOf Header
   */
  changeHeaderForReports() {
    const trashLink = document.getElementsByClassName('icon-trash')[0];
    const taskListLink = document.getElementsByClassName('icon-list')[0];
    const settingsLink = document.getElementsByClassName('icon-settings')[0];
    const reportLInk = document.getElementsByClassName('icon-statistics')[0];
    const addTask = document.getElementsByClassName('icon-add')[0];
    const header = document.getElementsByClassName('header')[0];

    header.classList.remove('hidden');
    taskListLink.classList.remove('navbar__active');
    settingsLink.classList.remove('navbar__active');
    trashLink.classList.remove('navbar__active');
    reportLInk.classList.add('navbar__active');
    trashLink.parentElement.classList.add('invisible');
    addTask.parentElement.classList.add('invisible');

    this.resetCounter();
  }

  /**
   * changes header for timer page
   * @memberOf Header
   */
  changeHeaderForTimer() {
    const trashLink = document.getElementsByClassName('icon-trash')[0];
    const taskListLink = document.getElementsByClassName('icon-list')[0];
    const addTask = document.getElementsByClassName('icon-add')[0];
    const header = document.getElementsByClassName('header')[0];

    header.classList.remove('hidden');
    taskListLink.classList.remove('navbar__active');
    trashLink.classList.remove('navbar__active');
    trashLink.parentElement.classList.add('invisible');
    addTask.parentElement.classList.add('invisible');

    this.resetCounter();
  }

  /**
   * changes header for started timer page
   * @memberOf Header
   */
  changeHeaderForStartedTimer() {
    const header = document.getElementsByClassName('header')[0];
    const container = header.getElementsByClassName('container')[0];

    container.classList.toggle('invisible');

    if (container.classList.contains('invisible')) {
      header.classList.remove('sticky');
      window.removeEventListener('scroll', this.addSticky);
    } else {
      window.addEventListener('scroll', this.addSticky);
    }
  }

  /**
   * adds task in remove list
   * @param {string} id - task's id
   * @memberOf Header
   */
  addRemoveTasks(id) {
    const removeCounter = document.getElementsByClassName('remove-task-counter')[0];

    this.removedIdList.push(id);

    localStorage.setItem('removedIdList', JSON.stringify(this.removedIdList));

    removeCounter.classList.remove('invisible');
    removeCounter.textContent++;
  }

  /**
   * removes task from remove list
   * @param {string} id - task's id
   * @memberOf Header
   */
  subRemoveTasks(id) {
    const removeCounter = document.getElementsByClassName('remove-task-counter')[0];

    this.removedIdList.forEach((elem, i, arr) => {
      if (elem === id) {
        arr.splice(i, 1);
      }
    });

    localStorage.setItem('removedIdList', JSON.stringify(this.removedIdList));

    removeCounter.textContent--;

    if (+removeCounter.textContent === 0) {
      removeCounter.classList.add('invisible');
    }
  }

  /**
   * resets all changes in header
   * @memberOf Header
   */
  resetCounter() {
    const removeCounter = document.getElementsByClassName('remove-task-counter')[0];

    this.removedIdList = [];
    localStorage.setItem('removedIdList', JSON.stringify(this.removedIdList));

    removeCounter.textContent = '0';
    removeCounter.classList.add('invisible');
  }
}
