import { Router } from 'express';

import productsRoutes from './products.routes';
import clientsRoutes from './clients.routes';
import cartRoutes from './carts.routes';

const routes = Router();

routes.use('/products', productsRoutes);
routes.use('/clients', clientsRoutes);
routes.use('/cart', cartRoutes);

export default routes;