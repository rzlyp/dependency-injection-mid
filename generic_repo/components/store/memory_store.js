'use strict';

const memstore = require('memstore').Store;

class Memstore {
    constructor() {
        this.store = memstore;
    }

    get() {
        return this.store;
    }
};

module.exports = Memstore;