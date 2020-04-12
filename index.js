'use strict'

const API = require('./build/app');
const Simulator = require('./build/simulators/device-simulator');

class Library {

    constructor(config) {
        this.api = new API(config);
        this.simulator = new Simulator(config.platformHost);
    }
};

module.exports = Library;