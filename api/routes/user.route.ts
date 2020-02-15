import {
Router,
} from 'express';

import UsersAPI from '../functions/users.functions';

const routes = new Router();

routes.route('/email/:email').get(UsersAPI.getEmail);

// user lists
routes.route('/:uid/lists').get(UsersAPI.getLists);

// user list
routes.route('/:uid/lists/:name').post(UsersAPI.postList);
routes.route('/:uid/lists/:lid')
.get(UsersAPI.getList)
.put(UsersAPI.updateList)
.delete(UsersAPI.deleteList);

// shopping list
routes.route('/:uid/lists/:listId/:productID')
.post(UsersAPI.updateLists);
routes.route('/:uid/lists/:listId/delete/:productID')
.delete(UsersAPI.deleteUserListItem);
routes.route('/:uid/lists').get(UsersAPI.getLists);
routes.route('/:uid/lists/:listId').get(UsersAPI.getList);
routes.route('/:uid/lists/following').get(UsersAPI.getFollowedLists);
routes.route('/lists/discover').get(UsersAPI.getDiscoverLists);

// settings
routes.route('/profile/settings/:uid')
.get(UsersAPI.getSettings)
.put(UsersAPI.updateSettings)
.delete(UsersAPI.deleteList);

// profile
routes.route('/:uid')
.get(UsersAPI.getProfile)
.put(UsersAPI.updateProfile);

// PRODUCT INFORMATION
routes.route('/:uid/viewed/:pageSize')
.get(UsersAPI.getViewedProducts);

routes.route('/:uid/viewed/:productID')
.delete(UsersAPI.deleteViewedProduct);

routes.route('/:uid/history/search')
.get(UsersAPI.getSearched);

routes.route('/:uid/history/search')
.post(UsersAPI.saveSearch);

routes.route('/:uid/history/search')
.delete(UsersAPI.deleteSearch);

routes.route('/:uid/saved')
.get(UsersAPI.getSavedProducts);

routes.route('/:uid/watchlist')
.get(UsersAPI.getWatchlist);

routes.route('/postProductStatusViewed')
.post(UsersAPI.productViewStatus);

routes.route('/postProduct')
.post(UsersAPI.postProduct);

routes.route('/:uid/deleteProduct/:productID')
.delete(UsersAPI.deleteProduct);

routes.route('/postWatchlist')
.post(UsersAPI.postWatchlist);

routes.route('/:uid/removeFromWatchList/:productID')
.delete(UsersAPI.removeFromWatchList);

export default routes;
