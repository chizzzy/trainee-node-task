const axios = require('axios');
module.exports = {
    getStudentsAverageMark: function* (classroomId, callback) {
        module.exports.validateClassroomId(classroomId);
        const studentsScore = new Map();
        let requiredStudents;
        const studentsData = yield module.exports.fetchData();
        requiredStudents = studentsData.data.filter(student => student['classroomId'] === classroomId);
        if (requiredStudents.length === 0) {
            throw(`Unfortunately, classroom with id ${classroomId} does not exist`)
        }
        for (const student of requiredStudents) {
            const studentEvaluation = yield axios.get(`http://localhost:3000/api/evaluation/history/${student.id}\``);
            studentsScore.set(student.id, studentEvaluation.data);
        }
        try {
            return callback(module.exports.countStudentsMark(studentsScore, requiredStudents))
        } catch (e) {
            console.error(e)
        }
    },
    validateClassroomId(classroomId){
    if (typeof classroomId === "undefined") {
        throw new Error('You did not input anything')
    }
    if (typeof classroomId !== "number") {
        throw TypeError(`Classroom ID should be number`)
    }
},

fetchData() {
    try {
        return axios.get(`http://localhost:3000/api/students`);
    } catch (e) {
        throw new Error('Не удалось получить данные с сервера')
    }
},

countStudentsMark(studentsScore, requiredStudents) {
    let studAverage = [];
    studentsScore.forEach((student, studentId) => {
        let currentStudent = requiredStudents.find(student => student.id === studentId);
        let averageMark = 0;
        if (student.length > 1) {
            student.forEach(course => {
                averageMark += course.score / student.length;
            });
            studAverage.push({
                id: studentId,
                name: currentStudent.name,
                average: averageMark,
            })
        } else {
            let averageMark = studentsScore.get(studentId)[0].score;
            studAverage.push({
                id: studentId,
                name: currentStudent.name,
                average: averageMark
            })
        }
    });
    return studAverage
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
