const express = require("express");
const app = express();
const fs = require('fs');
const students = fs.readFileSync('students.json', 'utf-8');
const courses = JSON.parse(fs.readFileSync('courses.json', 'utf-8'));
const evaluation = fs.readFileSync('evaluation.json', 'utf-8');

app.get('/api/students', (req, res) => {
    res.send(students);
});
app.get('/api/courses/:id', (req, res) => {
        const studentCourses = courses.filter(course => course.studentId === parseInt(req.params.id));
        if (!studentCourses) res.status(404).send('The course with given ID was not found');
        res.send(studentCourses);
    });
const port = process.env.PORT || 3000;
app.listen(port, () => {

    console.log(`Server running on port ${port}`);
});
