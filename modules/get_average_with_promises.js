const axios = require('axios');
module.exports = {
    /**
     * Promises based function that validate provided classroomId,
     * fetches students data for that classroom and calculates average students score
     */
    getStudentsAverageMark(classroomId) {
        return new Promise((resolve, reject) => {
            module.exports.validateClassroomId(classroomId).then(() => {
                let studentsScore = new Map();
                let allPromises = [];
                let requiredStudents;
                module.exports.getRequiredStudents(classroomId).then(students => {
                    requiredStudents = students;
                    for (let i = 0; i < students.length; i++) {
                        let promise = new Promise(resolve => {
                            axios.get(`http://localhost:3000/api/evaluation/history?filter=studentId eq ${students[i].id}`).then(
                                eval => {
                                    studentsScore.set(students[i].id, eval.data);
                                    resolve();
                                }
                            ).catch(err => console.error(err))
                        });
                        allPromises.push(promise);
                    }
                }).then(() => {
                    return module.exports.countStudentsMarks(allPromises, studentsScore, requiredStudents).then(
                        studAverage => resolve(studAverage)
                    )
                }).catch(err => console.error(err))
            }).catch(e => reject(e))
        })
    },
    countStudentsMarks(allPromises, studentsScore, requiredStudents) {
        let studAverage = [];
        return new Promise((resolve, reject) => {
            Promise.all(allPromises).then(() => {
                studentsScore.forEach((student, studentId) => {
                    let currentStudent = requiredStudents.find(student => student.id === studentId);
                    let averageMark = 0;
                    if (student.length > 1) {
                        student.forEach((course) => {
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
                })
            }).then(() => resolve(studAverage))
        })
    },
    getRequiredStudents(classroomId) {
        return new Promise((resolve, reject) => {
            let students = [];
            axios.get(`http://localhost:3000/api/students`)
                .then(response => {
                    students = response.data.filter(student => student['classroomId'] === classroomId);
                    if (students.length === 0) {
                        reject(`Unfortunately, classroom with id ${classroomId} does not exist`)
                    }
                    resolve(students);
                })
        })
    },
    validateClassroomId(classroomId) {
        return new Promise((resolve, reject) => {
            if (typeof classroomId === "undefined") {
                reject('You did not input anything')
            }
            if (typeof classroomId !== "number") {
                reject(`Classroom ID should be number`)
            }
            resolve()
        })
    },
};
