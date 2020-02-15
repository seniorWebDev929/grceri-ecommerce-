
// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import { routes } from './api/routes';

import * as cookieparser from 'cookie-parser';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as methodOverride from 'method-override';
import {environment} from './src/environments/environment';

const domino = require('domino');
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync(path.join('.', 'dist', 'browser', 'index.html')).toString();
const win = domino.createWindow(template);
const MockBrowser = require('mock-browser').mocks.MockBrowser;
const mock = new MockBrowser();

global['navigator'] = mock.getNavigator();
global['window'] = win;
global['document'] = win.document;
global['requestAnimationFrame'] = function (callback, element) {
	let lastTime = 0;
	const currTime = new Date().getTime();
	const timeToCall = Math.max(0, 16 - (currTime - lastTime));
	const id = setTimeout(function () { callback(currTime + timeToCall); },
		timeToCall);
	lastTime = currTime + timeToCall;
	return id;
};
global['cancelAnimationFrame'] = function (id) {
	clearTimeout(id);
};

// Faster server renders w/ Prod mode (dev mode never needed)
if (environment.production) {
	enableProdMode();
}

// Express server
const app = express();

app.use(compression());
app.use(cookieparser());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

app.engine('html', ngExpressEngine({
	bootstrap: AppServerModuleNgFactory,
	providers: [
		provideModuleMap(LAZY_MODULE_MAP)
	]
}));
app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
	maxAge: '1y'
}));

// All regular routes use the Universal engine
app.use('/api', routes);

// All regular routes use the Universal engine
app.get('/*/', (req, res) => {
	res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
	console.log(`Node server listening on http://localhost:${PORT}`);
});
