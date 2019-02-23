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
app.get('/api/evaluation/history/:studentId', (req, res) => {
    const evaluationOfStudent = evaluation.filter(evaluation => evaluation.studentId === parseInt(req.params.studentId));
    if (!evaluationOfStudent) res.status(404).send('The evaluation of student with given ID was not found');
    evaluationOfStudent.map(eval => delete eval.studentId);
    res.send(evaluationOfStudent)
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

// REQUIRED FUNCTION USING PROMISES
function getStudentsAverageMarkWithPromises(classroomId) {
    return new Promise((resolve, reject) => {
        let studentsScore = new Map();
        let allPromises = [];
        let studAverage = [];
        axios.get(`http://localhost:3000/api/students`)
            .then(response => {
                let students = response.data.filter(student => student['classroomId'] === classroomId);
                if (typeof classroomId === "undefined") {
                    reject('You did not input anything!')
                }
                if (typeof classroomId !== "number") {
                    reject(`Classroom ID should be number`)
                }
                if (students.length === 0) {
                    reject(`Unfortunately, classroom with id ${classroomId} does not exist`)
                }
                return students
            }).then(students => {
            for (let i = 0; i < students.length; i++) {
                let promise = new Promise(resolve => {
                    axios.get(`http://localhost:3000/api/evaluation/history/${students[i].id}`).then(
                        eval => {
                            studentsScore.set(students[i].id, eval.data);
                            resolve();
                        }
                    )
                });
                allPromises.push(promise);
            }
        }).then(() => {
            return Promise.all(allPromises).then(() => {
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
            }).then(() => resolve(studAverage))
                .catch((err) => console.error(err))
        })
    })
}

//REQUIRED FUNCTION USING ASYNC/AWAIT
async function getStudentsAverageMarkWithAsync (classroomId) {
    let studentsScore = new Map();
    let studAverage = [];
    let studentsData = await axios.get(`http://localhost:3000/api/students`);
    let requiredStudents = await studentsData.data.filter(student => student['classroomId'] === classroomId);
    for (const student of requiredStudents) {
          const studentEvaluation = await axios.get(`http://localhost:3000/api/evaluation/history/${student.id}\``);
          studentsScore.set(student.id, studentEvaluation.data);
    }
    studentsScore.forEach(async (student, studentId) => {
        let currentStudent = students.find(student => student.id === studentId);
        let averageMark = 0;
        if (student.length > 1) {
            student.forEach(async (course) => {
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
});
    return studAverage
}


getStudentsAverageMarkWithAsync(68).then(
    (result) => console.log(result)
)
