import Event from '../../../observer';
import eventbus from '../../../eventbus';
import settingsTemp from '../templates/main-settings.hbs';
import graphTemp from '../templates/graph.hbs';

/**
 * represents settings component
 * @namespace SettingsView
 */
export default class View {
  /**
   * SettingsView constructor
   * @constructs SettingsView
   * @param {object} model - instance of SettingsModel
   * @memberOf SettingsView
   */
  constructor(model) {
    this.clickAddButton = new Event();
    this.clickSubButton = new Event();
    this.clickSaveData = new Event();
    this.model = model;
    this.model.changeModel.subscribe(this.renderGraph, this);
  }

  /**
   * method for assigning events
   * @memberOf SettingsView
   */
  assignEventListener() {
    const catalog = document.getElementsByClassName('settings__catalog')[0];
    const controllers = document.getElementsByClassName('controller');
    const saveData = document.getElementsByClassName('btn-success')[0];

    catalog.addEventListener('click', this.handler.bind(this, controllers));
    catalog.addEventListener('mouseover', this.highlight.bind(null, true));
    catalog.addEventListener('mouseout', this.highlight.bind(null, false));
    saveData.addEventListener('click', this.saveData.bind(this));
  }

  /**
   * renders settings page
   * @param {Array} data - settings data
   * @memberOf SettingsView
   */
  render(data, isSettings) {
    const mainContent = document.getElementsByClassName('main-content')[0];

    eventbus.dispatch('changeHeaderForSettings');

    mainContent.innerHTML = settingsTemp({ data, isSettings });

    if (isSettings) {
      const graph = document.getElementsByClassName('cycle')[0];
      const settingsLink = document.getElementsByClassName('tabs__item')[0];
      const categoriesLink = document.getElementsByClassName('tabs__item')[1];

      settingsLink.classList.add('tabs__active');
      categoriesLink.classList.remove('tabs__active');

      graph.innerHTML = graphTemp();

      this.renderGraph(data);

      this.assignEventListener();

      categoriesLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.render(data, false);
      });

      settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
      });
    } else {
      const settingsLink = document.getElementsByClassName('tabs__item')[0];
      const categoriesLink = document.getElementsByClassName('tabs__item')[1];

      categoriesLink.classList.add('tabs__active');
      settingsLink.classList.remove('tabs__active');

      settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.render(data, true);
      });

      categoriesLink.addEventListener('click', (e) => {
        e.preventDefault();
      });
    }
  }

  /**
   * method for saving data on sesion storage
   * @memberOf SettingsView
   */
  saveData() {
    this.clickSaveData.notifyObservers();
  }

  /**
   * method for highlighting elements on page
   * @param {boolean} state - mouseover or mouseout event
   * @param {event} e
   * @memberOf SettingsView
   */
  highlight(state, e) {
    const { target } = e;

    if ((state && target.classList.contains('icon-add')) || (state && target.classList.contains('icon-minus'))) {
      target.parentElement.classList.add('controller__switcher_active');
    } else {
      target.parentElement.classList.remove('controller__switcher_active');
    }
  }

  /**
   * assigns plus and minus events
   * @param {HTMLElement} controllers - all controllers on page
   * @param {event} e
   * @memberOf SettingsView
   */
  handler(controllers, e) {
    const { target } = e;

    if (target.classList.contains('icon-add')) {
      Array.from(controllers).forEach((elem, i) => {
        if (target.parentElement.parentElement === elem) {
          this.clickAddButton.notifyObservers(i);
        }
      });
    } else if (target.classList.contains('icon-minus')) {
      Array.from(controllers).forEach((elem, i) => {
        if (target.parentElement.parentElement === elem) {
          this.clickSubButton.notifyObservers(i);
        }
      });
    }
  }

  /**
   * renders graph
   * @param {Array} data - settings data
   * @memberOf SettingsView
   */
  renderGraph(data) {
    this.changeValue(data);
    this.elemWidthRecalc(data);
    this.iterationRecalc(data);
    this.timelineRecalc(data);
    this.headerElemsRecalc(data);
  }

  /**
   * method for changing values
   * @param {Array} data - settings data
   * @memberOf SettingsView
   */
  changeValue(data) {
    const values = document.getElementsByClassName('controller__switcher__value');

    Array.from(values).forEach((elem, i) => {
      elem.textContent = data[i].value;
    });
  }

  /**
   * recalculates element width
   * @param {Array} data - settings data
   * @memberOf SettingsView
   */
  elemWidthRecalc(data) {
    const workBlocks = document.getElementsByClassName('work');
    const breakBlocks = document.getElementsByClassName('break');
    const longBreakBlock = document.getElementsByClassName('long-break')[0];

    Array.from(workBlocks).forEach((elem) => {
      elem.style.width = this.widthFormula(data[0].value, data);
    });

    Array.from(breakBlocks).forEach((elem) => {
      elem.style.width = this.widthFormula(data[2].value, data);
    });

    longBreakBlock.style.width = this.widthFormula(data[3].value, data);
  }

  /**
   * formula for recalculating
   * @param {number} elemMins
   * @param {Array} data - settings data
   * @memberOf SettingsView
   * @return {string}
   */
  widthFormula(elemMins, data) {
    const graph = document.getElementsByClassName('graph')[0];

    return `${parseInt(getComputedStyle(graph).width, 10) * elemMins /
    (2 * data[1].value * (data[2].value + data[0].value) -
      2 * data[2].value + data[3].value)}px`;
  }

  /**
   * recalculates itteration
   * @param {Array} data - settings data
   * @memberOf SettingsView
   */
  iterationRecalc(data) {
    const iterations = document.getElementsByClassName('iteration');
    const graph = document.getElementsByClassName('graph')[0];
    let count = 0;

    Array.from(iterations).forEach((elem) => {
      elem.classList.remove('hidden-block');
    });

    Array.from(graph.children).forEach((elem) => {
      if (elem.classList.contains('iteration') && count < 5 - data[1].value) {
        elem.classList.add('hidden-block');
        count++;
      } else if (elem.classList.contains('long-break')) {
        count = 0;
      }
    });
  }

  /**
   * recalculates timeline
   * @param {Array} data - settings data
   * @memberOf SettingsView
   */
  timelineRecalc(data) {
    const timelines = document.getElementsByClassName('time-iteration');

    Array.from(timelines).forEach((elem, i, arr) => {
      elem.style.width = this.widthFormula(30, data);
      elem.classList.remove('hidden-block');

      if (i >= arr.length) {
        elem.classList.add('hidden-block');
      }
    });
  }

  /**
   * recalculates header elements
   * @param {Array} data - settings data
   * @memberOf SettingsView
   */
  headerElemsRecalc(data) {
    const alltime = document.getElementsByClassName('alltime')[0];
    const allTimeIteration = document.getElementsByClassName('alltime-iteration')[0];
    const allMin = (2 * data[1].value * (data[2].value + data[0].value) - 2 * data[2].value + data[3].value);
    const min = allMin % 60;
    const hours = (allMin - min) / 60;

    alltime.textContent = `${hours}h ${min}m`;

    const allIterMins = (data[1].value * (data[2].value + data[0].value) - data[2].value + data[3].value);
    const iterMins = allIterMins % 60;
    const iterHours = (allIterMins - iterMins) / 60;

    allTimeIteration.textContent = `First cycle: ${iterHours}h ${iterMins}m`;
    allTimeIteration.style.width = this.widthFormula(allIterMins, data);
  }
}
