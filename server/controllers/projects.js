const dataAdapter = require('../dataAdapter');
const reduce = require('lodash/reduce');

const parseProjectForDb = (project) => reduce(project, (project, value, key) => {
  let v = value;
  if(key === 'active') {
    v = !value || value === 'false' ? 0 : 1;
  }
  project[key] = v;
  return project;
}, {});

const parseProjectForAPI = (project) => reduce(project, (project, value, key) => {
  let v = value;
  if(key === 'active') {
    v = value === 1;
  }
  project[key] = v;
  return project;
}, {});

async function createProject(req, res, next) {
  try {
    const project = parseProjectForDb(req.body);
    const id = await dataAdapter.create.project(project);
    const result = parseProjectForAPI(await dataAdapter.read.project(id));
    res.json(result);
  } catch(error) {
    res.status(400).json(error);
  }
}

async function readProject(req, res, next) {
  try {
    const result = parseProjectForAPI(await dataAdapter.read.project(req.params['id']));
    res.json(result);
  } catch(error) {
    next(error);
  }
}

async function readProjects(req, res, next) {
  try {
    let results = await dataAdapter.read.projects() || [];
    results = results.map((project) => parseProjectForAPI(project));
    res.json(results);
  } catch(error) {
    next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    const project = parseProjectForDb(req.body);
    const id = req.params['id'];
    await dataAdapter.update.project(id, project);
    const result = parseProjectForAPI(await dataAdapter.read.project(id));
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProject,
  readProjects,
  updateProject,
};