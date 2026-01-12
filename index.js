const joi = require('joi');  // really useful package for input validation
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // middleware to parse JSON bodies

let courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
];


app.get('/', (req, res) => {
  res.send('Hello World! I come in peace.');
});


app.get('/api/courses', (req, res) => {
  res.send(courses);
});


// Path params (or route params)
app.get('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');
    res.send(course);
});


app.get('/api/posts/:year/:month', (req, res) => {
  res.send(req.params);
});


//' query params
app.get('/api/posts', (req, res) => {
  res.send(req.query);
});


app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = { 
        id: courses.length + 1, 
        name: req.body.name 
    };
    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});


app.delete('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});
 

var validateCourse = course => {
    const schema = joi.object({
        name: joi.string().min(3).required()
    });
    return schema.validate(course);
};


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
