const axios = require('axios');
const validateClassroomId = require('./validation').validateClassroomId;

module.exports = {
    getStudentsAverageMark: function* (classroomId, callback) {
        validateClassroomId(classroomId);
        const studentsScore = new Map();
        let classroomStudents;
        const studentsData = yield module.exports.fetchData();
        classroomStudents = studentsData.data.filter(student => student['classroomId'] === classroomId);
        if (classroomStudents.length === 0) {
            throw(`Unfortunately, classroom with id ${classroomId} does not exist`)
        }
        for (const student of classroomStudents) {
            const studentEvaluation = yield axios.get(`http://localhost:3000/api/evaluation/history?filter=studentId eq${student.id}`);
            studentsScore.set(student.id, studentEvaluation.data);
        }
        try {
            return callback(module.exports.countStudentsMark(studentsScore, classroomStudents))
        } catch (e) {
            console.error(e)
        }
    },

fetchData() {
    try {
        return axios.get(`http://localhost:3000/api/students`);
    } catch (e) {
        throw new Error('Failed to get server data')
    }
},

countStudentsMark(studentsScore, classroomStudents) {
    let studentsAverage = [];
    studentsScore.forEach((student, studentId) => {
        let currentStudent = classroomStudents.find(student => student.id === studentId);
        let averageMark = 0;
        if (student.length > 1) {
            student.forEach(course => {
                averageMark += course.score / student.length;
            });
            studentsAverage.push({
                id: studentId,
                name: currentStudent.name,
                average: averageMark,
            })
        } else {
            let averageMark = studentsScore.get(studentId)[0].score;
            studentsAverage.push({
                id: studentId,
                name: currentStudent.name,
                average: averageMark
            })
        }
    });
    return studentsAverage
},
    execute(generator, yieldValue) {
    let next = generator.next(yieldValue);
    if (!next.done) {
        next.value.then(
            result => module.exports.execute(generator, result))
            .catch(
                err => console.error(err)
            )
    }
}
};
