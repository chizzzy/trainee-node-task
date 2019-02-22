const express = require("express");
const app = express();
const fs = require('fs');
const students = fs.readFileSync('students.json', 'utf-8');
const courses = fs.readFileSync('courses.json', 'utf-8');
const evaluation = fs.readFileSync('evaluation.json', 'utf-8');


app.get("/url", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {

    console.log(`Server running on port ${port}`);
});
