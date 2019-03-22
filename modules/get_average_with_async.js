const axios = require('axios');
const validateClassroomId = require('./validation.js').validateClassroomId;
module.exports = {
    /**
     * Async-await based function that validate provided classroomId,
     * fetches students data for that classroom and calculates average students score
     */
    async getStudentsAverageMark(classroomId) {
        validateClassroomId(classroomId);
        const studentsScore = new Map();
        let students;
        const studentsData = await module.exports.fetchData();
        students = studentsData.data.filter(student => student['classroomId'] === classroomId);
        if (students.length === 0) {
            throw(`Unfortunately, classroom with id ${classroomId} does not exist`)
        }
        for (const student of students) {
            const studentEvaluation = await axios.get(`http://localhost:3000/api/evaluation/history?filter=studentId eq${student.id}\``);
            studentsScore.set(student.id, studentEvaluation.data);
        }
        try {
            return module.exports.countStudentsMark(studentsScore, students)
        } catch (e) {
            console.error(e)
        }
    },
    async fetchData() {
        try {
            return await axios.get(`http://localhost:3000/api/students`);
        } catch (e) {
            throw new Error('Failed to get server data')
        }
    },
    async countStudentsMark(studentsScore, students) {
        let studAverage = [];
        studentsScore.forEach(async (student, studentId) => {
            let currentStudent = students.find(student => student.id === studentId);
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
};
