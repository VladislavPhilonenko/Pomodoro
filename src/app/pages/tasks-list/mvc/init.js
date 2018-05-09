import View from './tasklist-collection-view';
import Model from './tasklist-collection-model';
import Controller from './tasklist-collection-controller';

const taskListCollectionModel = new Model();
const taskListCollectionView = new View(taskListCollectionModel);
new Controller(taskListCollectionView, taskListCollectionModel);
