const express = require("express");
const app = express();
const fs = require('fs');
//REQUIRED FUNCTIONS
const getAverageWithPromises = require('./modules/get_average_with_promises');
const getAverageWithAsync = require('./modules/get_average_with_async');
const getAverageWithCallbacks = require('./modules/get_average_with_callbacks');
const getAverageWithGenerator = require('./modules/get_average_with_generator');
function getStudentsData() {
    return JSON.parse(fs.readFileSync('./data/students.json', 'utf-8'))
}
function getCoursesData() {
    return JSON.parse(fs.readFileSync('./data/courses.json', 'utf-8'))
}
function getEvaluationData() {
    return JSON.parse(fs.readFileSync('./data/evaluation.json', 'utf-8'));
}

app.get('/api/evaluation/history', (req, res) => {
    const evaluation = getEvaluationData();
    if (Object.keys(req.query).length === 0) {
        return res.send(evaluation);
    }
    const requiredStudentId = req.query.filter.match(/\d+/);
    const evaluationOfStudent = evaluation.filter(evaluation => evaluation.studentId === parseInt(requiredStudentId[0]));
    if (evaluationOfStudent.length === 0) return res.status(404).send('The evaluation of student with given ID was not found');
    evaluationOfStudent.map(eval => delete eval.requiredStudentId);
    res.send(evaluationOfStudent)
});

app.get('/api/students', (req, res) => {
    const students = getStudentsData();
    return res.send(students);
});

app.get('/api/courses', (req, res) => {
    const courses = getCoursesData();
    if (Object.keys(req.query).length === 0) {
        return res.send(courses);
    }
    const requiredStudentId = req.query.filter.match(/\d+/);
    const studentsCourses = courses.filter(course => course.studentId === parseInt(requiredStudentId[0]));
    if (studentsCourses.length === 0) return res.status(404).send('The course with given ID was not found');
    res.send(studentsCourses)
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
//USE THESE FUNCTIONS TO CHECK RESULT
//Available classroomIds: 68, 75, 41

// getAverageWithAsync.getStudentsAverageMark(68).then(
//     result => console.log(result),
//     error => console.log(error)
// );
// getAverageWithPromises.getStudentsAverageMark(75).then(
//     result => console.log(result),
//     error => console.error(error)
// );
// getAverageWithCallbacks.getStudentsAverageMark(68, res => console.log(res));
// getAverageWithGenerator.execute(getAverageWithGenerator.getStudentsAverageMark(41, result => console.log(result)));
