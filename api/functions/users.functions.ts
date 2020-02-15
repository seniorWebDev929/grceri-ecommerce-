import Constants from '../misc/constants';
import axios from 'axios';

let main = Constants.misc.api;

class UsersAPI {

	async getEmail(req, res, next) {
		try {
			console.log('Email Check', `${main}/users/email/${req.params.email}`);
			const response = await axios.get(`${main}/users/email/${req.params.email}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getFollowedLists(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}/lists/following`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getDiscoverLists(req, res, next) {
		try {
			const response = await axios.get(`${main}/lists/discover`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getList(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}/lists/${req.params.lid}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async postList(req, res, next) {
		try {
			console.log('Shopping List POST API', `${main}/users/${req.params.uid}/lists/${req.params.name}`);
			const response = await axios.post(`${main}/users/${req.params.uid}/lists/${req.params.name}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateList(req, res, next) {
		try {
			console.log('UPDATE LIST PUT', `${main}/users/${req.params.uid}/lists/${req.params.lid}`, req.body.obj);
			const response = await axios.put(`${main}/users/${req.params.uid}/lists/${req.params.lid}`, req.body.obj);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async deleteList(req, res, next) {
		try {
			const response = await axios.delete(`${main}/users/${req.params.uid}/lists/${req.params.lid}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async deleteUserListItem(req, res, next) {
		try {
			console.log('delete list item', `${main}/users/${req.params.uid}/lists/${req.params.listId}/${req.params.productID}`);
			const response = await axios.delete(`${main}/users/${req.params.uid}/lists/${req.params.listId}/${req.params.productID}`);
			res.json(response.data);
		} catch (error) {
			console.log('error');
			next(error);
		}
	}

	async deleteViewedProduct(req, res, next) {
		try {
			const response = await axios.delete(`${main}/users/${req.params.uid}/viewed/${req.params.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async deleteSearch(req, res, next) {
		try {
			console.log('delete recently searched from API', `${main}/users/${req.params.uid}/history/search`);
			const response = await axios.delete(`${main}/users/${req.params.uid}/history/search`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getViewedProducts(req, res, next) {
		try {
			console.log('viewed products', `${main}/users/${req.params.uid}/viewed?$pageSize=${req.params.pageSize}`);
			const response = await axios.get(`${main}/users/${req.params.uid}/viewed?$pageSize=${req.params.pageSize}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getSearched(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}/history/search`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getSavedProducts(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}/saved`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getWatchlist(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}/watchlist`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getSettings(req, res, next) {
		try {
			const response = await axios.get(`${main}/user/${req.params.uid}/settings`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateSettings(req, res, next) {
		try {
			const response = await axios.put(`${main}/user/${req.params.uid}/settings`, req.body.obj);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getProfile(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateProfile(req, res, next) {
		try {
			const response = await axios.put(`${main}/user/${req.params.uid}/profile`, req.body.obj);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async productViewStatus(req, res, next) {
		try {
			console.log('Product Viewed API', `${main}/users/${req.body.uid}/viewed/${req.body.productID}`);
			const response = await axios.post(`${main}/users/${req.body.uid}/viewed/${req.body.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async postProduct(req, res, next) {
		try {
			console.log('Save product API', `${main}/users/${req.body.uid}/save/${req.body.productID}`);
			const response = await axios.post(`${main}/users/${req.body.uid}/save/${req.body.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async saveSearch(req, res, next) {
		try {
			console.log('Save recently searched API', `${main}/users/${req.body.uid}/history/search`);
			const response = await axios.post(`${main}/users/${req.params.uid}/history/search`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async deleteProduct(req, res, next) {
		try {
			console.log('Delete product API', `${main}/users/${req.params.uid}/save/${req.params.productID}`);
			const response = await axios.delete(`${main}/users/${req.params.uid}/save/${req.params.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async postWatchlist(req, res, next) {
		try {
			console.log('WatchList API', `${main}/users/${req.body.uid}/watchlist/${req.body.productID}`);
			const response = await axios.post(`${main}/users/${req.body.uid}/watchlist/${req.body.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async removeFromWatchList(req, res, next) {
		try {
			console.log('Remove From WatchList API', `${main}/users/${req.params.uid}/watchlist/${req.params.productID}`);
			const response = await axios.delete(`${main}/users/${req.params.uid}/watchlist/${req.params.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateLists(req, res, next) {
		try {
			console.log('Shopping List UPDATE API', `${main}/users/${req.params.uid}/lists/${req.params.listId}/${req.params.productID}`);
			const response = await axios.post(`${main}/users/${req.params.uid}/lists/${req.params.listId}/${req.params.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getLists(req, res, next) {
		try {
			console.log('Shopping List GET API', `${main}/users/${req.params.uid}/lists`);
			const response = await axios.get(`${main}/users/${req.params.uid}/lists`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

}

export default new UsersAPI();
