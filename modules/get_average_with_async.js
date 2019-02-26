const axios = require('axios');
//REQUIRED FUNCTION USING ASYNC/AWAIT
module.exports = {
    async getStudentsAverageMark(classroomId) {
        if (typeof classroomId === "undefined") {
            throw new Error('You did not input anything')
        }
        if (typeof classroomId !== "number") {
            throw new Error(`Classroom ID should be number`)
        }
        const studentsScore = new Map();
        let studentsData;
        let studAverage = [];
        let requiredStudents;
        try {
            studentsData = await axios.get(`http://localhost:3000/api/students`);
        } catch (e) {
            throw new Error('Не удалось получить данные с сервера')
        }
        requiredStudents = await studentsData.data.filter(student => student['classroomId'] === classroomId);
        if (requiredStudents.length === 0) {
            throw(`Unfortunately, classroom with id ${classroomId} does not exist`)
        }
        for (const student of requiredStudents) {
            const studentEvaluation = await axios.get(`http://localhost:3000/api/evaluation/history/${student.id}\``);
            studentsScore.set(student.id, studentEvaluation.data);
        }
        try {
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
        } catch (e) {
            console.error(e)
        }

        return studAverage
    }
};
