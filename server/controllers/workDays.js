const dataAdapter = require('../dataAdapter');
const isNil = require('lodash/isNil');

async function createWorkDay(req, res, next) {
  try {
    await dataAdapter.create.workDay(req.body);
    const result = await dataAdapter.read.workDay(req.body.date);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
}

async function readWorkDay(req, res, next) {
  try {
    const result = await dataAdapter.read.workDay(req.params['date']);
    if(isNil(result)) {
      res.status(204);
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
}

async function updateWorkDay(req, res, next) {
  try {
    const date = req.params['date'];
    await dataAdapter.update.workDay(date, req.body);
    const result = await dataAdapter.read.workDay(date);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
}

module.exports = {
  createWorkDay,
  readWorkDay,
  updateWorkDay,
};