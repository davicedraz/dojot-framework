const DojotFramework = require('../index');
const config = require('./config.test.json');

const dojot = new DojotFramework(config);

describe('Templates Controller', () => {

    it('get all templates', () => {
        dojot.api.init()
            .then(api => api.templates.getTemplates())
            .then(result => {
                expect(result).toBeDefined();
                expect(result).toHaveProperty("templates");
            });
    });

});