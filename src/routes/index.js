import { Router } from 'express';
import SessionController from '../controllers/SessionController';
import UserController from '../controllers/UserController';
import CategoriesController from '../controllers/CategoriesController';
import StakeholdersController from '../controllers/StakeholdersController';
import ProductsController from '../controllers/ProductsController';
import SalesController from '../controllers/SalesController';

const routes = new Router();

// Sessions
routes.post('/sessions', SessionController.store);

// User
routes.post('/user', UserController.store);

// Categories
routes.get('/categories', CategoriesController.show);

// Person
routes.get('/stakeholders', StakeholdersController.index);
routes.post('/stakeholders', StakeholdersController.store);
routes.put('/stakeholders/:id', StakeholdersController.update);

// Products
routes.post('/products', ProductsController.store);
routes.get('/products', ProductsController.index);
routes.put('/products/:id', ProductsController.update);
routes.delete('/products/:id', ProductsController.destroy);

// Sales
routes.post('/sales', SalesController.store);
routes.get('/sales', SalesController.index);
routes.put('/sales/:id', SalesController.update);
routes.delete('/sales/:id', SalesController.destroy);

// Sales Payments
routes.put('/sales-payments/:id', SalesController.updatePayment);

export default routes;
