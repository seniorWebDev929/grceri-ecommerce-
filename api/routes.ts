import { Router } from 'express';

// ROUTES
import MiscRoutes from './routes/misc.route';
import ProductRoutes from './routes/product.route';
import SearchRoutes from './routes/search.route';
import TransactionRoutes from './routes/transaction.route';
import UserRoutes from './routes/user.route';
import errorHandler from './misc/error-handler';

// ROUTER
export const routes = new Router();

// REFERENCE
routes.use('/misc', MiscRoutes);
routes.use('/products', ProductRoutes);
routes.use('/search', SearchRoutes);
routes.use('/users', UserRoutes);
routes.use('/transactions', TransactionRoutes);

// ERROR
routes.use(errorHandler);

export default routes;
