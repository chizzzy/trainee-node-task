const assert = require('chai').assert;
const expect = require('chai').expect;
let getAverage = require('../modules/get_average_with_callbacks').getStudentsAverageMark;

describe('getAverage function that uses callbacks', () => {
    it('should return \n [{ id: 1, name: \'John\', average: 82 },\n' +
        '  { id: 2, name: \'Alex\', average: 58 },\n' +
        '  { id: 3, name: \'Andrei\', average: 89 } ]\n', async () => {

        getAverage(75, result => {
            assert.deepEqual(result, [{id: 1, name: 'John', average: 82},
                {id: 2, name: 'Alex', average: 58},
                {id: 3, name: 'Andrei', average: 89}])
        })
    });

    it('should return \n [{ id: 4, name: \'Sergei\', average: 80.5 },\n' +
        '  { id: 5, name: \'James\', average: 60 },\n' +
        '  { id: 6, name: \'Ann\', average: 85.5 } ]\n', async () => {
        getAverage(68, result => {
            assert.deepEqual(result, [{id: 4, name: 'Sergei', average: 80.5},
                {id: 5, name: 'James', average: 60},
                {id: 6, name: 'Ann', average: 85.5}])
        })
    });
    it('should return [{id: 7, name: \'Marina\', average: 68},' +
        '{id: 8, name: \'Miron\', average: 62.5}]', async () => {
        getAverage(41, result => {
            assert.deepEqual(result, [{id: 7, name: 'Marina', average: 68},
                {id: 8, name: 'Miron', average: 62.5}])
        })
    });
    it('should throw TypeError', () => {
        expect(() => getAverage('string')).to.throw('Classroom ID should be number')
    });
    it('should throw TypeError', () => {
        expect(() => getAverage({})).to.throw('Classroom ID should be number')
    });
    it('should throw TypeError', () => {
        expect(() => getAverage(true)).to.throw('Classroom ID should be number')
    })
    it('should throw TypeError', () => {
        expect(() => getAverage()).to.throw('You did not input anything')
    })
});
