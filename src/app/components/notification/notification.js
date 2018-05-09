import eventbus from '../../eventbus';
import notificationTemp from './templates/notification.hbs';

/**
 * represents notification component
 * @namespace Notification
 */
export default class Notification {
  /**
   * Notification constructor
   * @constructs Notification
   * @memberOf Notification
   */
  constructor() {
    eventbus.registerEventHandler('renderNotification', this.render.bind(this));
    this.timeId = null;
  }

  /**
   * method for rendering notifications
   * @param {object} data
   * @memberOf Notification
   */
  render(data) {
    const wrapper = document.getElementsByClassName('notification-wrapper')[0];
    const main = document.getElementsByClassName('main-content')[0];
    const indent = parseFloat(window.getComputedStyle(main).getPropertyValue('padding-right')) +
      parseFloat(window.getComputedStyle(main).getPropertyValue('margin-right'));

    clearTimeout(this.timeId);

    wrapper.innerHTML = notificationTemp(data);

    const closeNotification = wrapper.getElementsByClassName('icon-close')[0];
    const notification = wrapper.getElementsByClassName('notification')[0];

    if (window.innerWidth >= 768) {
      notification.style.right = `${indent}px`;
    }

    closeNotification.addEventListener('click', () => {
      wrapper.innerHTML = '';
      clearTimeout(this.timeId);
    });

    this.timeId = setTimeout(() => {
      wrapper.innerHTML = '';
    }, 5000);
  }
}
