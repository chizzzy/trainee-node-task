module.exports = {
    validateClassroomId(classroomId){
        if (typeof classroomId === "undefined") {
            throw new Error('You did not input anything')
        }
        if (typeof classroomId !== "number") {
            throw TypeError(`Classroom ID should be number`)
        }
    }
};
