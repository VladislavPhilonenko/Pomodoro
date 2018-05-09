/* root component starts here */
import '../assets/less/main.less';
import './components/modal/mvc/init';
import Header from './components/header/header';
import Notification from './components/notification/notification';

import Router from './router';
import Firebase from './firebase';
import eventbus from './eventbus';

import './pages/tasks-list/mvc/init';
import reportsController from './pages/reports/mvc/init';
import timerController from './pages/timer/mvc/init';
import settingsController from './pages/settings/mvc/init';

const config = {
  apiKey: 'AIzaSyCvavhB2E_48W-4xaqoJ0oYM6bUwSzAFo4',
  authDomain: 'pomodoros-f6971.firebaseapp.com',
  databaseURL: 'https://pomodoros-f6971.firebaseio.com',
  projectId: 'pomodoros-f6971',
  storageBucket: 'pomodoros-f6971.appspot.com',
  messagingSenderId: '810898783763'
};

new Header();
new Firebase(config);
new Notification();

const router = new Router();

router.defaultRoute = 'task-list';

router.add(/settings/, settingsController.init.bind(settingsController));
router.add(/reports/, reportsController.init.bind(reportsController));
router.add(/timer/, timerController.init.bind(timerController));
router.add(/task-list/, eventbus.dispatch.bind(eventbus, 'update'));
router.add(eventbus.dispatch.bind(eventbus, 'update'));

router.listen();
