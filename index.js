const express = require("express");
const app = express();
const fs = require('fs');
//REQUIRED FUNCTIONS
//Available classroomIds: 68, 75, 41
const getAverageWithPromises = require('./modules/get_average_with_promises');
const getAverageWithAsync = require('./modules/get_average_with_async');
const getAverageWithCallbacks = require('./modules/get_average_with_callbacks');
const getAverageWithGenerator = require('./modules/get_average_with_generator');


function readData() {
    const students = JSON.parse(fs.readFileSync('./data/students.json', 'utf-8'));
    const courses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf-8'));
    const evaluation = JSON.parse(fs.readFileSync('./data/evaluation.json', 'utf-8'));
    return {
        students: students,
        courses: courses,
        evaluation: evaluation
    }
}

function getData() {
    return readData();
}

app.get('/api/evaluation/history/:studentId', (req, res) => {
    const data = getData();
    const evaluationOfStudent = data.evaluation.filter(evaluation => evaluation.studentId === parseInt(req.params.studentId));
    if (!evaluationOfStudent) res.status(404).send('The evaluation of student with given ID was not found');
    evaluationOfStudent.map(eval => delete eval.studentId);
    res.send(evaluationOfStudent)
});

app.get('/api/students', (req, res) => {
    const data = getData();
    return res.send(data.students);
});

app.get('/api/courses', (req, res) => {
    const data = getData();
    if (Object.keys(req.query).length === 0) {
        console.log('ura');
        return res.send(data.courses);
    }
    const requiredStudentId = req.query.filter.match(/\d+/);
    const studentsCourses = data.courses.filter(course => course.studentId === parseInt(requiredStudentId[0]));
    if (studentsCourses.length === 0) return res.status(404).send('The course with given ID was not found');
    res.send(studentsCourses)
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

// getAverageWithAsync.getStudentsAverageMark(75).then(
//     result => console.log(result),
//     error => console.log(error)
// );
// getAverageWithPromises.getStudentsAverageMark(68).then(
//     result => console.log(result),
//     error => console.error(error)
// );
// getAverageWithCallbacks.getStudentsAverageMark(68, res => console.log(res));
// getAverageWithGenerator.execute(getAverageWithGenerator.getStudentsAverageMark(75, result => console.log(result)));


