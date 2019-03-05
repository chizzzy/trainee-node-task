const axios = require('axios');

module.exports = {
    /**
     * Async-await based function that validate provided classroomId,
     * fetches students data for that classroom and calculates average students score
     */
    async getStudentsAverageMark(classroomId) {
        module.exports.validateClassroomId(classroomId);
        const studentsScore = new Map();
        let requiredStudents;
        const studentsData = await module.exports.fetchData();
        requiredStudents = await studentsData.data.filter(student => student['classroomId'] === classroomId);
        if (requiredStudents.length === 0) {
            throw(`Unfortunately, classroom with id ${classroomId} does not exist`)
        }
        for (const student of requiredStudents) {
            const studentEvaluation = await axios.get(`http://localhost:3000/api/evaluation/history?filter=studentId eq${student.id}\``);
            studentsScore.set(student.id, studentEvaluation.data);
        }
        try {
            return module.exports.countStudentsMark(studentsScore, requiredStudents)
        } catch (e) {
            console.error(e)
        }
    },
    validateClassroomId(classroomId) {
        if (typeof classroomId === "undefined") {
            throw new Error('You did not input anything')
        }
        if (typeof classroomId !== "number") {
            throw TypeError(`Classroom ID should be number`)
        }
    },
    async fetchData() {
        try {
            return await axios.get(`http://localhost:3000/api/students`);
        } catch (e) {
            throw new Error('Failed to get server data')
        }
    },
    async countStudentsMark(studentsScore, requiredStudents) {
        let studAverage = [];
        studentsScore.forEach(async (student, studentId) => {
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
