import {
Router,
} from 'express';

import MiscAPI from '../functions/misc.functions';

const routes = new Router();

routes.route('/assets/:asset').get(MiscAPI.assets);

routes.route('/search/:value').get(MiscAPI.search);

export default routes;
