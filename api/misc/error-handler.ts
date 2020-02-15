import Constants from './constants';

export default function errorHandler(err, req, res, next) {
	if (!err) {
		return res.sendStatus(500);
	}

	const error = {
		message: err.message || 'Internal Server Error.',
		stack: '',
	};

	if (Constants.envs.development) {
		error.stack = err.stack;
	}

	res.status((err.response && err.response.status) || 500).json(error);
}
