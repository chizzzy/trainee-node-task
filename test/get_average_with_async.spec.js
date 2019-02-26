const assert = require('chai').assert;
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);
let getAverage = require('../modules/get_average_with_async').getStudentsAverageMark;

describe('getAverage function that uses async/await', () => {
    it('should return \n [{ id: 4, name: \'Sergei\', average: 80.5 },\n' +
        '  { id: 5, name: \'James\', average: 60 },\n' +
        '  { id: 6, name: \'Ann\', average: 85.5 } ]\n', async () => {
        const result = await getAverage(68);
        assert.deepEqual(result,
            [{id: 4, name: 'Sergei', average: 80.5},
                {id: 5, name: 'James', average: 60},
                {id: 6, name: 'Ann', average: 85.5}]
        )
    });
    it('should return \n [{ id: 1, name: \'John\', average: 82 },\n' +
        '  { id: 2, name: \'Alex\', average: 58 },\n' +
        '  { id: 3, name: \'Andrei\', average: 89 } ]\n', async () => {
        const result = await getAverage(75);
        assert.deepEqual(result,
            [{id: 1, name: 'John', average: 82},
                {id: 2, name: 'Alex', average: 58},
                {id: 3, name: 'Andrei', average: 89}]
        )
    });
    it('should return \n [{ id: 7, name: \'Marina\', average: 68 },\n' +
        '  { id: 8, name: \'Miron\', average: 62.5 },\n', async () => {
        const result = await getAverage(41);
        assert.deepEqual(result,
            [{id: 7, name: 'Marina', average: 68},
                {id: 8, name: 'Miron', average: 62.5}]
        )
    });
    it('should throw error "You did not input anything"', async () => {
        await expect(getAverage()).to.be.rejectedWith(Error, 'You did not input anything')
    });
    it('should throw error "Classroom ID should be number"', async () => {
        await expect(getAverage({})).to.be.rejectedWith(Error, 'Classroom ID should be number')
    });
    it('should throw error "Classroom ID should be number"', async () => {
        await expect(getAverage('string')).to.be.rejectedWith(Error, 'Classroom ID should be number')
    });
    it('should throw error "Classroom ID should be number"', async () => {
        await expect(getAverage(true)).to.be.rejectedWith(Error, 'Classroom ID should be number')
    });
});
