'use strict';

let Injector = require('./injector');
let config = require('./config/config.json');
let injector = new Injector(config);
injector.start();