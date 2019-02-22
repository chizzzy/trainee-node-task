const express = require("express");
const app = express();
const fs = require('fs');
const students = JSON.parse(fs.readFileSync('students.json', 'utf-8'));
const courses = JSON.parse(fs.readFileSync('courses.json', 'utf-8'));
const evaluation = JSON.parse(fs.readFileSync('evaluation.json', 'utf-8'));

app.get('/api/students', (req, res) => {
    res.send(students);
});
app.get('/api/courses/:id', (req, res) => {
        const studentCourses = courses.filter(course => course.studentId === parseInt(req.params.id));
        if (!studentCourses) res.status(404).send('The course with given ID was not found');
        res.send(studentCourses);
    });
const port = process.env.PORT || 3000;

app.get('/api/classes/performance/:classroomId', (req, res) => {
    const performance = students.filter(student => student.classroomId === parseInt(req.params.classroomId));
    if (!performance) res.status(404).send('The class with given ID was not found');
    res.send(performance);
});
app.get('/api/evaluation/history/:studentId', (req, res) => {
    const evaluationOfStudent = evaluation.filter(evaluation => evaluation.studentId === parseInt(req.params.studentId));
   if (!evaluationOfStudent) res.status(404).send('The evaluation of student with given ID was not found');
   evaluationOfStudent.map(eval => delete eval.studentId);
   res.send(evaluationOfStudent)
});
function getStudentsAverageMarkByClassroom() {

}
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
