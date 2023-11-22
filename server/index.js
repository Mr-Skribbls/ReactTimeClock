const express = require('express');
const { body, validationResult } = require('express-validator');
const { createProject, readProjects, updateProject } = require('./controllers/projects');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());

// -------------------- //
// API
// -------------------- //

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) {
        console.log('validation errors: ', result.errors);
        break;
      }
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// ----- Projects ----- //
// create
app.post(
  '/api/projects',
  validate([
    body('name').notEmpty().escape(),
    body('activity').notEmpty().escape(),
    body('active').notEmpty().escape(),
    body('description').escape(),
  ]),
  createProject,
);

// read
app.get(
  '/api/projects',
  readProjects,
);

// update
app.put(
  '/api/projects/:id',
  validate([
    body('id').notEmpty().escape(),
    body('active').notEmpty().escape(),
    body('description').escape(),
  ]),
  updateProject,
);

// delete

// ----- Work Days ----- //
// create
// read
// update
// delete

// ----- Time Blocks ----- //
// create
// read
// update
// delete

// ----- Breaks ----- //
// create
// read
// update
// delete



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});