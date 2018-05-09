import View from './reports-view';
import Model from './reports-model';
import Controller from './reports-controller';

const reportsModel = new Model();
const reportsView = new View(reportsModel);
const reportsController = new Controller(reportsView, reportsModel);

export default reportsController;
