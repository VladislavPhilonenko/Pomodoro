import Highcharts from 'highcharts';
import eventbus from '../../../eventbus';
import Event from '../../../observer';

require('highcharts/modules/exporting')(Highcharts);
/**
 * processes information for rendering charts
 * @namespace ReportsModel
 */
export default class Model {
  /**
   * ReportsModel constructor
   * @constructs ReportsModel
   * @memberOf ReportsModel
   */
  constructor() {
    eventbus.registerEventHandler('updateChartData', this.updateChartData.bind(this));
    this.updateData = new Event();
    this.data = null;
  }

  /**
   * method for updating chart data
   * @param {object} data
   * @memberOf ReportsModel
   */
  updateChartData(data) {
    if (!data) {
      data = {};
    }

    this.data = data;
    this.updateData.notifyObservers();
  }

  /**
   * processes data for rendering daily charts
   * @param {object} data - chart data
   * @param {boolean} isPomodoros - get pomodoros or tasks number
   * @param {number} defaultLength - array length
   * @memberOf ReportsModel
   * @return {array} returns dailyData or pomodorosData
   */
  returnDailyData(data, isPomodoros, defaultLength) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const currentDate = new Date().toLocaleString('en-us', options);
    const pomodorosData = new Array(defaultLength).fill(0);
    let dailyData = new Array(defaultLength).fill(0);

    Object.values(data).forEach((elem) => {
      const date = new Date(elem.expirationDate).toLocaleString('en-us', options);

      if (elem.isDone && !elem.isFailed && currentDate === date) {
        switch (elem.priority) {
          case 'urgent':
            dailyData[0]++;
            pomodorosData[0] += elem.estimationUsed;
            break;
          case 'high':
            dailyData[1]++;
            pomodorosData[1] += elem.estimationUsed;
            break;
          case 'middle':
            dailyData[2]++;
            pomodorosData[2] += elem.estimationUsed;
            break;
          case 'low':
            dailyData[3]++;
            pomodorosData[3] += elem.estimationUsed;
            break;
          default:
            throw new Error('unexpected priority');
        }

        pomodorosData[4] += elem.estimationFailed;
      }
      if (elem.isDone && elem.isFailed && currentDate === date) {
        pomodorosData[4] += elem.estimationFailed;
        dailyData[4]++;
      }
    });

    if (isPomodoros) {
      dailyData = pomodorosData;
    }

    return dailyData.map((elem, i) => {
      if (elem) {
        const num = elem;
        elem = [0, 0, 0, 0, 0];
        elem[i] = num;
      }

      return elem;
    });
  }

  /**
   * processes data for rendering week charts
   * @param {object} data - chart data
   * @param {boolean} isPomodoros - get pomodoros or tasks number
   * @param {number} defaultLength - array length
   * @memberOf ReportsModel
   * @return {array} returns weekData or pomodorosData
   */
  returnWeekData(data, isPomodoros, defaultLength) {
    const currentDate = new Date();
    const MSINWEEK = 86400000 * 7 - 1;
    const currSun = +new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      (currentDate.getDate() - currentDate.getDay())
    );
    const currSut = currSun + MSINWEEK;
    const pomodorosData = new Array(defaultLength).fill(0).map(() => new Array(7).fill(0));
    const weekData = new Array(defaultLength).fill(0).map(() => new Array(7).fill(0));

    Object.values(data).forEach((elem) => {
      const date = elem.expirationDate;
      const dataDay = new Date(date).getDay();

      if (elem.isDone && !elem.isFailed && date >= currSun && date < currSut) {
        switch (elem.priority) {
          case 'urgent':
            weekData[0][dataDay]++;
            pomodorosData[0][dataDay] += elem.estimationUsed;
            break;
          case 'high':
            weekData[1][dataDay]++;
            pomodorosData[1][dataDay] += elem.estimationUsed;
            break;
          case 'middle':
            weekData[2][dataDay]++;
            pomodorosData[2][dataDay] += elem.estimationUsed;
            break;
          case 'low':
            weekData[3][dataDay]++;
            pomodorosData[3][dataDay] += elem.estimationUsed;
            break;
          default:
            return null;
        }

        pomodorosData[4][dataDay] += elem.estimationFailed;
      }
      if (elem.isDone && elem.isFailed && date >= currSun && date < currSut) {
        weekData[4][dataDay]++;
        pomodorosData[4][dataDay] += elem.estimationFailed;
      }
    });

    if (isPomodoros) {
      return pomodorosData;
    }

    return weekData;
  }

  /**
   * processes data for rendering month charts
   * @param {object} data - chart data
   * @param {boolean} isPomodoros - get pomodoros or tasks number
   * @param {number} defaultLength - array length
   * @param {number} daysInMonth - days in month
   * @memberOf ReportsModel
   * @return {array} returns monthData or pomodorosData
   */
  returnMonthData(data, isPomodoros, defaultLength, daysInMonth) {
    const options = { month: 'long', year: 'numeric' };
    const currentDate = new Date().toLocaleString('en-us', options);
    const monthData = new Array(defaultLength).fill(0).map(() => new Array(daysInMonth).fill(0));
    const pomodorosData = new Array(defaultLength).fill(0).map(() => new Array(daysInMonth).fill(0));

    Object.values(data).forEach((elem) => {
      const date = new Date(elem.expirationDate).toLocaleString('en-us', options);
      const taskDate = new Date(elem.expirationDate).getDate();

      if (elem.isDone && !elem.isFailed && date === currentDate) {
        switch (elem.priority) {
          case 'urgent':
            monthData[0][taskDate - 1]++;
            pomodorosData[0][taskDate - 1] += elem.estimationUsed;
            break;
          case 'high':
            monthData[1][taskDate - 1]++;
            pomodorosData[1][taskDate - 1] += elem.estimationUsed;
            break;
          case 'middle':
            monthData[2][taskDate - 1]++;
            pomodorosData[2][taskDate - 1] += elem.estimationUsed;
            break;
          case 'low':
            monthData[3][taskDate - 1]++;
            pomodorosData[3][taskDate - 1] += elem.estimationUsed;
            break;
          default:
            return null;
        }

        pomodorosData[4][taskDate - 1] += elem.estimationFailed;
      }
      if (elem.isDone && elem.isFailed && date === currentDate) {
        monthData[4][taskDate - 1]++;
        pomodorosData[4][taskDate - 1] += elem.estimationFailed;
      }
    });

    if (isPomodoros) {
      return pomodorosData;
    }

    return monthData;
  }

  /**
   * renders daily chart
   * @param {boolean} isPomodoros - get pomodoros or tasks number
   * @memberOf ReportsModel
   */
  renderDailyChart(isPomodoros) {
    const defaultLength = 5;
    const categories = ['Urgent', 'High', 'Middle', 'Low', 'Failed'];
    const dailyData = this.returnDailyData(this.data, isPomodoros, defaultLength);

    this.renderChart(this.setOptions('day', categories, dailyData, isPomodoros));
  }

  /**
   * renders week chart
   * @param {boolean} isPomodoros - get pomodoros or tasks number
   * @memberOf ReportsModel
   */
  renderWeekChart(isPomodoros) {
    const defaultLength = 5;
    const categories = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const weekData = this.returnWeekData(this.data, isPomodoros, defaultLength);

    this.renderChart(this.setOptions('week', categories, weekData, isPomodoros));
  }

  /**
   * renders month chart
   * @param {boolean} isPomodoros - get pomodoros or tasks number
   * @memberOf ReportsModel
   */
  renderMonthChart(isPomodoros) {
    const defaultLength = 5;
    const daysInMonth = this.daysInMonth(new Date());
    const monthData = this.returnMonthData(this.data, isPomodoros, defaultLength, daysInMonth);
    const categories = [];

    for (let i = 1; i <= daysInMonth; i++) {
      categories.push(i);
    }

    this.renderChart(this.setOptions('month', categories, monthData, isPomodoros));
  }

  /**
   * calculates number of days in a month
   * @param {string} currentDate - current date
   * @memberOf ReportsModel
   * @return {number}
   */
  daysInMonth(currentDate) {
    return 32 - new Date(currentDate.getFullYear(), currentDate.getMonth(), 32).getDate();
  }

  /**
   * calculates number of days in a month
   * @param {string} type - chart type
   * @param {string} categories - chart categories
   * @param {string} data - chart data
   * @param {string} isPomodoros - render pomodoros or tasks tooltips
   * @memberOf ReportsModel
   * @return {object} options
   */
  setOptions(type, categories, data, isPomodoros) {
    const options = {
      colors: ['#f75c4c', '#ffa841', '#fddc43', '#1abc9c', '#8da5b8'],

      chart: {
        renderTo: 'chart',
        height: 300,
        type: 'column',
        backgroundColor: 'transparent',
        plotBorderColor: 'white'
      },

      credits: {
        text: ''
      },

      exporting: {
        enabled: false
      },

      title: {
        text: ''
      },

      legend: {
        symbolRadius: 0,
        itemStyle: {
          color: '#8da5b8',
          fontWeight: 'normal'
        },
        itemHoverStyle: {
          color: '#82c7e0'
        },
        itemMarginTop: 30,
        itemDistance: 10
      },

      yAxis: {
        allowDecimals: false,
        gridLineColor: '#2d4a60',
        gridLineWidth: 1,
        lineWidth: 1.5,
        min: 0,
        title: {
          text: ''
        },
        labels: {
          style: {
            color: 'white'
          }
        }
      },

      xAxis: {
        categories,
        labels: {
          style: {
            color: 'white',
            textTransform: 'uppercase'
          }
        },
        tickWidth: 0,
        lineWidth: 1.5
      },

      plotOptions: {
        column: {
          stacking: 'normal',
          borderWidth: 0
        }
      },

      tooltip: {
        formatter: function () {
          return `${this.series.name.toUpperCase()}<br>Tasks:  ${this.y}`;
        }
      },

      series: [{
        name: 'Urgent',
        data: data[0]
      }, {
        name: 'High',
        data: data[1]
      }, {
        name: 'Middle',
        data: data[2]
      }, {
        name: 'Low',
        data: data[3]
      }, {
        name: 'Failed',
        data: data[4]
      }]
    };

    if (isPomodoros) {
      options.tooltip.formatter = function () {
        return `${this.series.name.toUpperCase()}<br>Pomodoros:  ${this.y}`;
      };
    }

    if (type === 'week') {
      options.series.forEach((elem) => {
        elem.stack = 'completed';

        if (elem.name === 'Failed') {
          elem.stack = 'failed';
        }
      });
    }

    return options;
  }

  /**
   * render chart
   * @param {object} options - chart options
   * @memberOf ReportsModel
   */
  renderChart(options) {
    new Highcharts.Chart(options);
  }
}
