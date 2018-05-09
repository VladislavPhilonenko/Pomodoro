import eventbus from '../../../eventbus';
import Event from '../../../observer';
import reportsTemp from '../templates/reports.hbs';

/**
 * represents reports component
 * @namespace ReportsView
 */
export default class View {
  /**
   * ReportsView constructor
   * @constructs ReportsView
   * @param {object} model - instance of ReportsModel
   * @memberOf ReportsView
   */
  constructor(model) {
    this.model = model;
    this.renderDailyChart = new Event();
    this.renderWeekChart = new Event();
    this.renderMonthChart = new Event();
    this.model.updateData.subscribe(this.render, this);
    this.isPomodoros = false;
  }

  /**
   * adds tooltips
   * @memberOf ReportsView
   */
  addTooltips() {
    $('.back-link').tooltips();
  }

  /**
   * renders reports page
   * @memberOf ReportsView
   */
  render() {
    const mainContent = document.getElementsByClassName('main-content')[0];

    eventbus.dispatch('changeHeaderForReports');
    this.isPomodoros = false;

    mainContent.innerHTML = reportsTemp();
    this.renderDailyChart.notifyObservers(this.isPomodoros);
    this.assignEventListener();
    this.addTooltips();
  }

  /**
   * method for assigning events
   * @memberOf ReportsView
   */
  assignEventListener() {
    const dateTabsBlock = document.getElementsByClassName('tabs-date')[0];
    const typeTabsBlock = document.getElementsByClassName('tabs-type')[0];
    const dateTabs = dateTabsBlock.children;
    const typeTabs = typeTabsBlock.children;

    dateTabs[0].addEventListener('click', () => {
      this.renderDailyChart.notifyObservers(this.isPomodoros);
      this.changeActiveStatus(0, dateTabsBlock);
    });

    dateTabs[1].addEventListener('click', () => {
      this.renderWeekChart.notifyObservers(this.isPomodoros);
      this.changeActiveStatus(1, dateTabsBlock);
    });

    dateTabs[2].addEventListener('click', () => {
      this.renderMonthChart.notifyObservers(this.isPomodoros);
      this.changeActiveStatus(2, dateTabsBlock);
    });

    typeTabs[0].addEventListener('click', () => {
      this.isPomodoros = true;
      this.renderCurrentDateChart();
      this.changeActiveStatus(0, typeTabsBlock);
    });

    typeTabs[1].addEventListener('click', () => {
      this.isPomodoros = false;
      this.renderCurrentDateChart();
      this.changeActiveStatus(1, typeTabsBlock);
    });
  }

  /**
   * method that chooses what type of charts should be rendered
   * @memberOf ReportsView
   */
  renderCurrentDateChart() {
    const dateTabs = document.getElementsByClassName('tabs-date')[0].children;
    let index = 0;

    Array.from(dateTabs).forEach((elem, i) => {
      if (elem.classList.contains('tabs__active')) index = i;
    });

    switch (index) {
      case 0:
        this.renderDailyChart.notifyObservers(this.isPomodoros);
        break;
      case 1:
        this.renderWeekChart.notifyObservers(this.isPomodoros);
        break;
      case 2:
        this.renderMonthChart.notifyObservers(this.isPomodoros);
        break;
      default:
        return null;
    }
  }

  /**
   * modifies tabs status
   * @memberOf ReportsView
   */
  changeActiveStatus(index, currentTabs) {
    Array.from(currentTabs.children).forEach((elem) => {
      elem.classList.remove('tabs__active');
    });

    currentTabs.children[index].classList.add('tabs__active');
  }
}
