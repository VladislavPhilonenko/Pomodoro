import Event from '../../../observer';
import eventbus from '../../../eventbus';
import addTaskTemp from '../templates/add-task.hbs';
import removeTaskTemp from '../templates/remove-task.hbs';
import addDatepicker from '../helpers/datepicker';

/**
 * represents modal component
 * @namespace ModalView
 */
export default class View {
  /**
   * ModalView constructor
   * @constructs ModalView
   * @memberOf ModalView
   */
  constructor() {
    eventbus.registerEventHandler('renderModal', this.renderModal.bind(this));
    eventbus.registerEventHandler('renderRemoveModal', this.renderRemoveModal.bind(this));
    this.clickCreateTask = new Event();
    this.clickEditTask = new Event();
  }

  /**
   * method for rendering modal with add or edit type
   * @param {object} taskData
   * @memberOf ModalView
   */
  renderModal(taskData) {
    const modalContent = document.getElementsByClassName('modal-wrapper')[0];

    modalContent.innerHTML = addTaskTemp();
    modalContent.innerHTML += removeTaskTemp();

    modalContent.classList.toggle('invisible');
    addDatepicker();

    const removeElem = document.getElementsByClassName('modal__icons-trash')[0];
    const modalTitle = document.getElementsByClassName('modal__title')[0];

    if (taskData) {
      modalTitle.textContent = 'Edit Task';

      const form = document.forms.task;
      const {title} = form.elements;
      const {description} = form.elements;
      const deadline = form.elements.date;

      title.value = taskData.title;
      description.value = taskData.description;
      deadline.value = taskData.deadline;
      deadline.disabled = taskData.isActive;

      Array.from(form).forEach((elem) => {
        elem.checked = elem.value === taskData.category ||
          elem.value === taskData.priority ||
          elem.value === taskData.estimation;
      });

      this.assignEventListener(taskData.id, taskData.isActive);
    } else {
      modalTitle.textContent = 'Add Task';
      removeElem.classList.add('invisible');

      this.assignEventListener();
    }
  }

  /**
   * method for rendering modal with remove type
   * @memberOf ModalView
   */
  renderRemoveModal() {
    const modalContent = document.getElementsByClassName('modal-wrapper')[0];

    modalContent.innerHTML = removeTaskTemp();

    const removeModal = document.getElementsByClassName('overflow-modal')[0];

    modalContent.classList.remove('invisible');
    removeModal.classList.remove('invisible');

    removeModal.addEventListener('click', (e) => {
      const {target} = e;

      if (target.classList.contains('btn-primary') || target.classList.contains('icon-close')) {
        modalContent.innerHTML = '';
        modalContent.classList.add('invisible');
      }

      if (target.classList.contains('btn-remove')) {
        eventbus.dispatch('removeTasks');
        modalContent.innerHTML = '';
        modalContent.classList.add('invisible');
      }
    });
  }

  /**
   * method for assigning events
   * @memberOf ModalView
   */
  assignEventListener(id, isActive) {
    const modalContent = document.getElementsByClassName('modal-wrapper')[0];
    const addTaskBtn = document.getElementsByClassName('icon-check')[0];
    const removeTaskBtn = document.getElementsByClassName('btn-remove')[0];

    modalContent.addEventListener('click', View.actionsWithModal);
    removeTaskBtn.addEventListener('click', (e) => {
      eventbus.dispatch('removeTasks', id);
      modalContent.innerHTML = '';
      modalContent.classList.add('invisible');
      e.stopImmediatePropagation();
    });
    addTaskBtn.addEventListener('click', () => {
      if (id) {
        this.editTask(id, isActive);
      } else {
        this.createTask();
      }
    });
  }

  /**
   * calls modalController's create task method
   * @memberOf ModalView
   */
  createTask() {
    if (!this.validation()) {
      this.hideModal();
      this.clickCreateTask.notifyObservers(this.getTaskData());
    } else {
      eventbus.dispatch('renderNotification', this.notificationData('warning', 'fill all fields'));
    }
  }

  /**
   * calls modalController's edit task method
   * @memberOf ModalView
   */
  editTask(id, isActive) {
    if (!this.validation()) {
      this.hideModal();
      this.clickEditTask.notifyObservers(this.getTaskData(id, isActive));
    } else {
      eventbus.dispatch('renderNotification', this.notificationData('warning', 'fill all fields'));
    }
  }

  /**
   * constructs object for representing notifications
   * @param {string} title - notification type
   * @param {string} message - notificaton message
   * @memberOf ModalView
   * @returns {{title: title, message: message}}
   */
  notificationData(title, message) {
    return {
      title,
      message
    };
  }

  /**
   * hides modal
   * @memberOf ModalView
   */
  hideModal() {
    const modalContent = document.getElementsByClassName('modal-wrapper')[0];

    modalContent.classList.toggle('invisible');
  }

  /**
   * modifies modal content
   * @memberOf ModalView
   */
  static actionsWithModal(e) {
    const modalContent = document.getElementsByClassName('modal-wrapper')[0];
    const removeModal = document.getElementsByClassName('overflow-modal')[0];
    const {target} = e;

    if (target.classList.contains('icon-close')) {
      modalContent.innerHTML = '';
      modalContent.classList.add('invisible');
      e.stopImmediatePropagation();
    }

    if (target.classList.contains('modal__icons-trash') || target.classList.contains('btn-primary')) {
      removeModal.classList.toggle('invisible');
      e.stopImmediatePropagation();
    }
  }

  /**
   * provide validation
   * @memberOf ModalView
   * @returns {boolean} true means invalid
   */
  validation() {
    const form = document.forms.task;
    const {title} = form.elements;
    const {description} = form.elements;
    const formDeadline = form.elements.date;
    const inputs = document.getElementsByClassName('modal__group');

    View.modify(title);
    View.modify(description);
    View.modify(formDeadline);

    return Array.from(inputs).some(elem => elem.classList.contains('error'));
  }

  /**
   * modifies form elements
   * @param {HTMLElement} formElem - form element
   * @memberOf ModalView
   */
  static modify(formElem) {
    if (formElem.value.replace(/\s/g, '') === '') {
      formElem.parentElement.classList.add('error');
    } else {
      formElem.parentElement.classList.remove('error');
    }
  }

  /**
   * gets task data
   * @param {string} id - task id
   * @param {boolean} isActive - task property that means this task in daily list
   * @memberOf ModalView
   * @returns {object} task data
   */
  getTaskData(id, isActive) {
    const form = document.forms.task;
    const title = form.elements.title.value;
    const description = form.elements.description.value;
    const MSINONEDAY = 86399999;
    const deadline = Date.parse(form.elements.date.value) + MSINONEDAY;
    const category = document.querySelector('input[name="category"]:checked').value;
    const estimation = document.querySelector('input[name="estimation"]:checked').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;

    return {
      id,
      isActive,
      title,
      description,
      deadline,
      category,
      priority,
      estimation
    };
  }
}
