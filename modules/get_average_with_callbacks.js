const request = require('request');

module.exports = {
    getStudentsEvaluation(requiredStudents, callback) {
        const studentsScore = new Map();
        let itemProcessed = 0;
        requiredStudents.forEach(student => {
            module.exports.sendRequestToStudentsEvaluation(student, (body) => {
                studentsScore.set(student.id, body);
                itemProcessed++;
                if (itemProcessed === requiredStudents.length) {
                    callback(studentsScore)
                }
            })
        })
    },
    getStudentsAverageMark(classroomId) {
        let studAverage = [];
        request('http://localhost:3000/api/students', {json: true}, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            const requiredStudents = body.filter(student => student['classroomId'] === classroomId);
            module.exports.getStudentsEvaluation(requiredStudents, eval => {
                eval.forEach((student, studentId) => {
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
                        let averageMark = eval.get(studentId)[0].score;
                        studAverage.push({
                            id: studentId,
                            name: currentStudent.name,
                            average: averageMark
                        })
                    }

                });
                console.log(studAverage);
            });
        })
    },
    sendRequestToStudentsEvaluation(student, callback) {
        request(`http://localhost:3000/api/evaluation/history/${student.id}`, {json: true}, (err, res, body) => {
            callback(body)
        })
    }
};
