import eventbus from '../../../eventbus';
import Event from '../../../observer';
import timerTemp from '../templates/timer.hbs';

/**
 * represents timer component
 * @namespace TimerView
 */
export default class View {
  /**
   * TimerView constructor
   * @constructs TimerView
   * @param {object} model - instance of TimerModel
   * @memberOf TimerView
   */
  constructor(model) {
    this.model = model;
    this.timeId = null;
    this.currentIteration = this.getCurrentIteration() || 0;
    this.setIteration = new Event();
  }

  /**
   * gets current iteration from local storage
   * @memberOf TimerView
   * @return {number} - current iteration
   */
  getCurrentIteration() {
    return JSON.parse(localStorage.getItem('currentIteration'));
  }

  /**
   * gets current iteration from local storage
   * @memberOf TimerView
   * @return {Array} newData
   */
  getSS() {
    const newData = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      newData.push(JSON.parse(sessionStorage.getItem(`obj${i}`)));
    }

    return newData;
  }

  /**
   * adds tooltips
   * @memberOf TimerView
   */
  addTooltips() {
    $('.back-link').tooltips();
    $('.next-link').tooltips();
  }

  /**
   * renders timer page
   * @memberOf TimerView
   */
  render() {
    const mainContent = document.getElementsByClassName('main-content')[0];
    const data = this.model.getTaskData();

    eventbus.dispatch('changeHeaderForTimer');

    mainContent.innerHTML = timerTemp(data);

    this.addTooltips();

    const startTimerBtn = document.getElementsByClassName('start-timer')[0];

    startTimerBtn.addEventListener('click', this.startTimer.bind(this), { once: true });

    this.renderTomatos(data);
    this.assignEventListener(data);
  }

  /**
   * method for assigning events
   * @param {object} data
   * @memberOf TimerView
   */
  assignEventListener(data) {
    const visibleTimer = document.getElementsByClassName('visible-timer')[0];
    const failPomodora = document.getElementsByClassName('fail-pomodora')[0];
    const finishPomodora = document.getElementsByClassName('finish-pomodora')[0];
    const startPomodora = document.getElementsByClassName('start-pomodora')[0];
    const finishTask = document.getElementsByClassName('finish-task')[0];
    const addBtn = document.getElementsByClassName('add-new-tomato')[0];

    visibleTimer.addEventListener('animationstart', this.listener.bind(this));
    visibleTimer.addEventListener('animationend', this.listener.bind(this));
    failPomodora.addEventListener('click', this.startBreak.bind(this, false));
    finishPomodora.addEventListener('click', this.startBreak.bind(this, true));
    startPomodora.addEventListener('click', this.startTimer.bind(this));
    finishTask.addEventListener('click', this.finishTask.bind(this, data));
    addBtn.addEventListener('click', this.addEstimation);
  }

  /**
   * render tomatos
   * @param {object} data
   * @memberOf TimerView
   */
  renderTomatos(data) {
    const tomatos = document.getElementsByClassName('tomatos__elem');
    let count = +data.estimation;

    Array.from(tomatos).forEach((elem) => {
      if (count <= 0) {
        elem.classList.add('invisible');
      }

      --count;
    });
  }

  /**
   * adds tomatos to tomatos list
   * @memberOf TimerView
   */
  addEstimation() {
    const tomatos = document.getElementsByClassName('tomatos__elem');
    const addBtn = document.getElementsByClassName('add-new-tomato')[0];

    Array.from(tomatos).some((elem) => {
      if (elem.classList.contains('invisible')) {
        elem.classList.remove('invisible');

        return true;
      }
    });

    if (!Array.from(tomatos).some(elem => elem.classList.contains('invisible'))) {
      addBtn.classList.add('invisible');

      return null;
    }
  }

  /**
   * launches timer
   * @memberOf TimerView
   */
  startTimer() {
    const addBtn = document.getElementsByClassName('add-new-tomato')[0];
    const startTimerBtn = document.getElementsByClassName('start-timer')[0];
    const failPomodora = document.getElementsByClassName('fail-pomodora')[0];
    const finishPomodora = document.getElementsByClassName('finish-pomodora')[0];
    const startPomodora = document.getElementsByClassName('start-pomodora')[0];
    const linkToGlobalTask = document.getElementsByClassName('back-link')[0];
    const timeLine = document.getElementsByClassName('time-line')[0];
    const phase = document.getElementsByClassName('phase')[0];
    const finishTask = document.getElementsByClassName('finish-task')[0];
    const tomatos = document.getElementsByClassName('tomatos__elem');

    if (!this.timeId) {
      eventbus.dispatch('changeHeaderForStartedTimer');

      if (Array.from(tomatos).some(elem => elem.classList.contains('invisible'))) {
        addBtn.classList.remove('invisible');
      }
    }

    startTimerBtn.classList.add('invisible');
    failPomodora.classList.remove('invisible');
    finishPomodora.classList.remove('invisible');
    linkToGlobalTask.classList.add('invisible');
    startPomodora.classList.add('invisible');
    timeLine.classList.add('add-padding');
    finishTask.classList.add('invisible');
    phase.textContent = '';

    this.resetTimer(this.timeId);
    this.timeId = this.timer(0);
  }

  /**
   * launches break
   * @param {boolean} result
   * @memberOf TimerView
   */
  startBreak(result) {
    const addBtn = document.getElementsByClassName('add-new-tomato')[0];
    const failPomodora = document.getElementsByClassName('fail-pomodora')[0];
    const finishPomodora = document.getElementsByClassName('finish-pomodora')[0];
    const startPomodora = document.getElementsByClassName('start-pomodora')[0];
    const visibleTimer = document.getElementsByClassName('visible-timer')[0];
    const hiddenTimer = document.getElementsByClassName('hidden-timer')[0];
    const phase = document.getElementsByClassName('phase')[0];
    const finishTask = document.getElementsByClassName('finish-task')[0];
    const tomatos = document.getElementsByClassName('tomatos__elem');
    const totalIteration = +this.getSS()[1].value;

    if (result) {
      finishTask.classList.remove('invisible');
    }

    this.resetTimer(this.timeId);
    this.changePomodoroStatus(result);
    this.currentIteration++;

    if (this.currentIteration >= totalIteration) {
      this.timeId = this.timer(3);
      this.currentIteration = 0;
    } else {
      this.timeId = this.timer(2);
    }

    phase.textContent = 'break';
    visibleTimer.classList.add('on-animation-for-vt');
    hiddenTimer.classList.add('on-animation-for-ht');
    failPomodora.classList.add('invisible');
    addBtn.classList.add('invisible');
    finishPomodora.classList.add('invisible');

    const isEnd = Array.from(tomatos).some((elem) => {
      if (!elem.classList.contains('invisible') && elem.firstChild.getAttribute('src') === '/empty-tomato.svg') {
        return true;
      }
    });

    if (isEnd) {
      startPomodora.classList.remove('invisible');
    } else {
      finishTask.classList.remove('invisible');
      startPomodora.classList.add('invisible');
    }
  }

  /**
   * finishes task
   * @param {object} data
   * @memberOf TimerView
   */
  finishTask(data) {
    const startPomodora = document.getElementsByClassName('start-pomodora')[0];
    const linkToGlobalTask = document.getElementsByClassName('back-link')[0];
    const linkToReports = document.getElementsByClassName('next-link')[0];
    const timeLine = document.getElementsByClassName('timer__message')[0];
    const phase = document.getElementsByClassName('phase')[0];
    const finishTask = document.getElementsByClassName('finish-task')[0];
    const currentMin = document.getElementsByClassName('timer__minutes')[0];
    const hiddenTimer = document.getElementsByClassName('hidden-timer')[0];

    this.resetTimer(this.timeId);
    this.timeId = null;
    eventbus.dispatch('changeHeaderForStartedTimer');
    this.setIteration.notifyObservers(this.currentIteration);

    finishTask.classList.add('invisible');
    startPomodora.classList.add('invisible');
    linkToGlobalTask.classList.remove('invisible');
    linkToReports.classList.remove('invisible');
    timeLine.textContent = 'You completed task';
    phase.textContent = '';
    currentMin.textContent = '';
    hiddenTimer.classList.add('completed-timer');

    this.moveTaskToDoneList(data);
  }

  /**
   * changes pomodoros status
   * @param {boolean} result
   * @memberOf TimerView
   */
  changePomodoroStatus(result) {
    const tomatos = document.getElementsByClassName('tomatos__elem');

    Array.from(tomatos).find((elem) => {
      if (elem.firstChild.getAttribute('src') === '/empty-tomato.svg') {
        if (result) {
          elem.firstChild.setAttribute('src', '/fill-tomato.svg');
        } else {
          elem.firstChild.setAttribute('src', '/tomato-failed.svg');
        }

        return true;
      }
    });
  }

  /**
   * listens animation status changes
   * @param {event} e
   * @memberOf TimerView
   */
  listener(e) {
    const timeLine = document.getElementsByClassName('timer__message')[0];
    const phase = document.getElementsByClassName('phase')[0];
    const currentMin = document.getElementsByClassName('timer__minutes')[0];

    switch (e.type) {
      case 'animationstart':
        timeLine.textContent = 'min';
        break;
      case 'animationend':
        if (phase.textContent === 'break') {
          phase.textContent = '';
          currentMin.textContent = '';
          timeLine.textContent = 'Break is over';
        } else {
          this.startBreak(true);
        }
        break;
      default:
        return null;
    }
  }

  /**
   * starts timer animation
   * @param {number} index
   * @memberOf TimerView
   * @return {number} timeId
   */
  timer(index) {
    const visibleTimer = document.getElementsByClassName('visible-timer')[0];
    const hiddenTimer = document.getElementsByClassName('hidden-timer')[0];
    const currentMin = document.getElementsByClassName('timer__minutes')[0];
    const seconds = +this.getSS()[index].value * 60;
    let count = +this.getSS()[index].value;

    currentMin.textContent = count;

    visibleTimer.classList.remove('hidden');
    hiddenTimer.classList.remove('hidden');
    visibleTimer.classList.add('on-animation-for-vt');
    hiddenTimer.classList.add('on-animation-for-ht');

    visibleTimer.style.animationDuration = `${seconds}s`;
    hiddenTimer.style.animationDuration = `${seconds / 2}s`;
    hiddenTimer.style.animationDelay = `${seconds / 2}s`;

    const timeId = setInterval(() => {
      if (count !== 1) {
        currentMin.textContent = --count;
      } else {
        clearTimeout(timeId);
      }
    }, 60000);

    return timeId;
  }

  /**
   * resets timer animation
   * @param {number} timeId
   * @memberOf TimerView
   */
  resetTimer(timeId) {
    const visibleTimer = document.getElementsByClassName('visible-timer')[0];
    const hiddenTimer = document.getElementsByClassName('hidden-timer')[0];

    clearTimeout(timeId);

    visibleTimer.classList.remove('on-animation-for-vt');
    hiddenTimer.classList.remove('on-animation-for-ht');

    void visibleTimer.offsetWidth;
    void hiddenTimer.offsetWidth;
  }

  /**
   * moves task to done list
   * @param {object} data
   * @memberOf TimerView
   */
  moveTaskToDoneList(data) {
    const tomatos = document.getElementsByClassName('tomatos__elem');

    data.estimationUsed = 0;
    data.estimationFailed = 0;

    Array.from(tomatos).forEach((elem) => {
      if (elem.firstChild.getAttribute('src') === '/fill-tomato.svg') {
        data.estimationUsed++;
      } else if (elem.firstChild.getAttribute('src') === '/tomato-failed.svg') {
        data.estimationFailed++;
      }
    });

    data.isFailed = data.estimationFailed > data.estimationUsed;
    data.isDone = true;
    data.isActive = false;
    data.expirationDate = Date.now();
    data.deadline = 0;

    eventbus.dispatch('editTask', data);
  }
}
