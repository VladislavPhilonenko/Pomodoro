import eventbus from '../../../eventbus';

/**
 * calls model methods and initialize report component
 * @namespace ReportsController
 */
export default class Controller {
  /**
   * ReportsController constructor
   * @constructs ReportsController
   * @param {object} view - instance of ReportsView
   * @param {object} model - instance of ReportsModel
   * @memberOf ReportsController
   */
  constructor(view, model) {
    this.model = model;
    this.view = view;
    this.view.renderDailyChart.subscribe(this.renderDailyChart, this);
    this.view.renderWeekChart.subscribe(this.renderWeekChart, this);
    this.view.renderMonthChart.subscribe(this.renderMonthChart, this);
  }

  /**
   * method for rendering daily charts
   * @param {boolean} isPomodoros
   * @memberOf ReportsController
   */
  renderDailyChart(isPomodoros) {
    this.model.renderDailyChart(isPomodoros);
  }

  /**
   * method for rendering week charts
   * @param {boolean} isPomodoros
   * @memberOf ReportsController
   */
  renderWeekChart(isPomodoros) {
    this.model.renderWeekChart(isPomodoros);
  }

  /**
   * method for rendering month charts
   * @param {boolean} isPomodoros
   * @memberOf ReportsController
   */
  renderMonthChart(isPomodoros) {
    this.model.renderMonthChart(isPomodoros);
  }

  /**
   * method for getting chart data
   * @memberOf ReportsController
   */
  init() {
    eventbus.dispatch('getChartData');
  }
}
