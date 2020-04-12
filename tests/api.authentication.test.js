const DojotFramework = require('../index');
const config = require('./config.test.json');

const dojot = new DojotFramework(config);

describe('Authentication Controller', () => {

    it('Get Socket Token', () => {
        dojot.api.init()
            .then(api => api.authentication.getSocketToken())
            .then(result => {
                expect(result).toBeDefined();
            });
    });

});