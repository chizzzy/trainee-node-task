const express = require("express");
const app = express();
const http = require('http');
const request = require('request');
const fs = require('fs');
const axios = require('axios');
//REQUIRED FUNCTIONS
const getAverageWithPromises = require('./modules/get_average_with_promises');
const getAverageWithAsync = require('./modules/get_average_with_async');


function readData() {
    const students = JSON.parse(fs.readFileSync('students.json', 'utf-8'));
    const courses = JSON.parse(fs.readFileSync('courses.json', 'utf-8'));
    const evaluation = JSON.parse(fs.readFileSync('evaluation.json', 'utf-8'));
    return {
        students: students,
        courses: courses,
        evaluation: evaluation
    }
}

const data = readData();

app.get('/api/students', (req, res) => {
    return res.send(data.students);
});

app.get('/api/courses/:id', (req, res) => {
    const studentCourses = data.courses.filter(course => course.studentId === parseInt(req.params.id));
    if (!studentCourses) res.status(404).send('The course with given ID was not found');
    res.send(studentCourses);
});

app.get('/api/evaluation/history/:studentId', (req, res) => {
    const evaluationOfStudent = data.evaluation.filter(evaluation => evaluation.studentId === parseInt(req.params.studentId));
    if (!evaluationOfStudent) res.status(404).send('The evaluation of student with given ID was not found');
    evaluationOfStudent.map(eval => delete eval.studentId);
    res.send(evaluationOfStudent)
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
// getAverageWithPromises.getStudentsAverageMark(75).then(
//     result => console.log(result),
//             error => console.error(error)
// );
// getAverageWithAsync.getStudentsAverageMark(68).then(
//     result => console.log(result),
//     error => console.error(error));
// async getStudentsAverageMark(classroomId) {
//     if (typeof classroomId === "undefined") {
//         throw new Error('You did not input anything')
//     }
//     if (typeof classroomId !== "number") {
//         throw new Error(`Classroom ID should be number`)
//     }
//     const studentsScore = new Map();
//     let studentsData;
//     let studAverage = [];
//     let requiredStudents;
//     try {
//         studentsData = await axios.get(`http://localhost:3000/api/students`);
//     } catch (e) {
//         throw new Error('Не удалось получить данные с сервера')
//     }
//     requiredStudents = await studentsData.data.filter(student => student['classroomId'] === classroomId);
//
//     if (requiredStudents.length === 0) {
//         throw new Error(`Unfortunately, classroom with id ${classroomId} does not exist`)
//     }
//     for (const student of requiredStudents) {
//         const studentEvaluation = await axios.get(`http://localhost:3000/api/evaluation/history/${student.id}\``);
//         studentsScore.set(student.id, studentEvaluation.data);
//     }
//     studentsScore.forEach(async (student, studentId) => {
//         let currentStudent = requiredStudents.find(student => student.id === studentId);
//         let averageMark = 0;
//         if (student.length > 1) {
//             student.forEach(async (course) => {
//                 averageMark += course.score / student.length;
//             });
//             studAverage.push({
//                 id: studentId,
//                 name: currentStudent.name,
//                 average: averageMark,
//             })
//         } else {
//             let averageMark = studentsScore.get(studentId)[0].score;
//             studAverage.push({
//                 id: studentId,
//                 name: currentStudent.name,
//                 average: averageMark
//             })
//         }
//     });
//     return studAverage
// }
// };


function getStudentsAverageMark(classroomId) {
    let studAverage = [];
    request('http://localhost:3000/api/students', { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        const requiredStudents = body.filter(student => student['classroomId'] === classroomId);
        getStudentsEvaluation(requiredStudents, eval => {
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
}
function sendRequestToStudentsEvaluation(student, callback) {
    request(`http://localhost:3000/api/evaluation/history/${student.id}`, { json: true }, (err, res, body) => {
    callback(body)
    })
}
function getStudentsEvaluation(requiredStudents, callback) {
    const studentsScore = new Map();
    let itemProcessed = 0;
    requiredStudents.forEach(student => {
        sendRequestToStudentsEvaluation(student, (body) => {
            studentsScore.set(student.id, body);
            itemProcessed++;
            if (itemProcessed === requiredStudents.length) {
                callback(studentsScore)
            }
        })
    })
}

