const express = require("express");
const app = express();
const rxjs = require('rxjs');
const request = require('request');
const fs = require('fs');
//REQUIRED FUNCTIONS
const getAverageWithPromises = require('./modules/get_average_with_promises');
const getAverageWithAsync = require('./modules/get_average_with_async');
const getAverageWithCallbacks = require('./modules/get_average_with_callbacks');


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
// getAverageWithAsync.getStudentsAverageMark(75).then(
//     result => console.log(result),
//     error => console.error(error));
// getAverageWithCallbacks.getStudentsAverageMark(68);


