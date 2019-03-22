const request = require('request');
const validateClassroomId = require('./validation').validateClassroomId;

module.exports = {
    /**
     * Callback based function that validate provided classroomId,
     * fetches students data for that classroom and calculates average students score
     */
    getStudentsAverageMark(classroomId, callback) {
        validateClassroomId(classroomId);
        let studentsAverage = [];
        request('http://localhost:3000/api/students', {json: true}, (err, res, students) => {
            if (err) {
                return console.log(err);
            }
            const classroomStudents = students.filter(student => student['classroomId'] === classroomId);
            if (classroomStudents.length === 0) {
                throw new Error(`Unfortunately, classroom with id ${classroomId} does not exist`)
            }
            module.exports.getStudentsEvaluation(classroomStudents, evaluation => {
                evaluation.forEach((student, studentId) => {
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
                        let averageMark = evaluation.get(studentId)[0].score;
                        studentsAverage.push({
                            id: studentId,
                            name: currentStudent.name,
                            average: averageMark
                        })
                    }

                });
                callback(studentsAverage)
            });
        })
    },
    getStudentsEvaluation(classroomStudents, callback) {
        const studentsScore = new Map();
        let itemsProcessed = 0;
        classroomStudents.forEach(student => {
            module.exports.sendRequestToStudentsEvaluation(student, (body) => {
                studentsScore.set(student.id, body);
                itemsProcessed++;
                if (itemsProcessed === classroomStudents.length) {
                    callback(studentsScore)
                }
            })
        })
    },
    sendRequestToStudentsEvaluation(student, callback) {
        request(`http://localhost:3000/api/evaluation/history?filter=studentId eq${student.id}`, {json: true}, (err, res, body) => {
            callback(body)
        })
    },
};
