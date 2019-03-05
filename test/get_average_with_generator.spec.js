const assert = require('chai').assert;
const expect = require('chai').expect;
let getAverage = require('../modules/get_average_with_generator').getStudentsAverageMark;
const execute = require('../modules/get_average_with_generator').execute;
describe('getAverage function that uses yields', () => {
    it('should return \n [{ id: 1, name: \'John\', average: 82 },\n' +
        '  { id: 2, name: \'Alex\', average: 58 },\n' +
        '  { id: 3, name: \'Andrei\', average: 89 } ]\n', done => {
        execute(getAverage(75, result => {
            assert.deepEqual(result, [{id: 1, name: 'John', average: 82},
                {id: 2, name: 'Alex', average: 58},
                {id: 3, name: 'Andrei', average: 89}]);
            done();
        }))
    });
    it('should return \n [{ id: 4, name: \'Sergei\', average: 80.5 },\n' +
        '  { id: 5, name: \'James\', average: 60 },\n' +
        '  { id: 6, name: \'Ann\', average: 85.5 } ]\n', done => {
        execute(getAverage(68, result => {
            assert.deepEqual(result, [{id: 4, name: 'Sergei', average: 80.5},
                {id: 5, name: 'James', average: 60},
                {id: 6, name: 'Ann', average: 85.5}]);
            done();
        }))
    });
    it('should return [{id: 7, name: \'Marina\', average: 68},' +
        '{id: 8, name: \'Miron\', average: 62.5}]', done => {
        execute(getAverage(41, result => {
            assert.deepEqual(result, [{id: 7, name: 'Marina', average: 68},
                {id: 8, name: 'Miron', average: 62.5}]);
            done()
        }))
    });
    it('should throw TypeError', () => {
        expect(() => execute(getAverage('string'))).to.throw('Classroom ID should be number')
    });
    it('should throw TypeError', () => {
        expect(() => execute(getAverage({}))).to.throw('Classroom ID should be number')
    });
    it('should throw TypeError', () => {
        expect(() => execute(getAverage(true))).to.throw('Classroom ID should be number')
    });
    it('should throw TypeError', () => {
        expect(() => execute(getAverage())).to.throw('You did not input anything')
    })
});
