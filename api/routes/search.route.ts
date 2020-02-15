import {
Router,
} from 'express';

import SearchAPI from '../functions/search.functions';

const routes = new Router();

routes.route('/sidebar').get(SearchAPI.getSearchPageSidebar);

routes.route('/content').get(SearchAPI.getSearchPageContent);

// routes.route('/:upc').get(ProductsAPI.getProduct);

export default routes;
