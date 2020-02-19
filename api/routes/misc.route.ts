import {
Router,
} from 'express';

import MiscAPI from '../functions/misc.functions';

const routes = Router();

routes.route('/assets/:asset').get(MiscAPI.assets);

routes.route('/search/:value').get(MiscAPI.search);

export default routes;
