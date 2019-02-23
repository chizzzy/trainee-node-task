const express = require("express");
const app = express();
const axios = require('axios');
const fs = require('fs');
const students = JSON.parse(fs.readFileSync('students.json', 'utf-8'));
const courses = JSON.parse(fs.readFileSync('courses.json', 'utf-8'));
const evaluation = JSON.parse(fs.readFileSync('evaluation.json', 'utf-8'));

app.get('/api/students', (req, res) => {
    return res.send(students);
});
app.get('/api/courses/:id', (req, res) => {
    const studentCourses = courses.filter(course => course.studentId === parseInt(req.params.id));
    if (!studentCourses) res.status(404).send('The course with given ID was not found');
    res.send(studentCourses);
});
//const port = process.env.PORT || 3000;

/*app.get('/api/classes/performance/:classroomId', (req, res) => {
    const performance = students.filter(student => student.classroomId === parseInt(req.params.classroomId));
    if (!performance) res.status(404).send('The class with given ID was not found');
    res.send(performance);
});*/
app.get('/api/evaluation/history/:studentId', (req, res) => {
    const evaluationOfStudent = evaluation.filter(evaluation => evaluation.studentId === parseInt(req.params.studentId));
    if (!evaluationOfStudent) res.status(404).send('The evaluation of student with given ID was not found');
    evaluationOfStudent.map(eval => delete eval.studentId);
    res.send(evaluationOfStudent)
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});


function getStudentsAverageMarkByClassroom(classroomId) {
    let students = [];
    let studentsScore = new Map();
    let allPromises = [];
    let studAverage = [];
    axios.get(`http://localhost:3000/api/students`)
        .then(response => {
            return students = response.data.filter(student => student['classroomId'] === classroomId);
        }).then(students => {
        for (let i = 0; i < students.length; i++) {
            let promise = new Promise(resolve => {
                axios.get(`http://localhost:3000/api/evaluation/history/${students[i].id}`).then(
                    (eval) => {
                        studentsScore.set(students[i].id, eval.data);
                        resolve();
                    }
                )
            });
            allPromises.push(promise);
        }
    }).then(() => {
        Promise.all(allPromises).then(() => {
            studentsScore.forEach((student, studentId) => {
                let currentStudent = students.find(student => student.id === studentId);
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
        }).then(() => console.log(studAverage))
    })
}


console.log(getStudentsAverageMarkByClassroom(75));

