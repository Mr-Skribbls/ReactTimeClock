const sqlite3 = require('sqlite3').verbose();
const helpers = require('./helpers');
const isNil = require('lodash/isNil');
const {createInsert, createQuery, createGet, createUpdate} = require('./dataQueries');

// ----- Connect ----- //
const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, helpers.errorHandle);

const insert = createInsert(db);
const query = createQuery(db);
const get = createGet(db);
const set = createUpdate(db);

// ----- Create Tables ----- //
const createDb = () => {
  // projects
  query(`CREATE TABLE IF NOT EXISTS projects
    (
        id INTEGER NOT NULL
      , name TEXT NOT NULL
      , activity TEXT NOT NULL
      , active INTEGER NOT NULL
      , description TEXT

      , PRIMARY KEY(id)
      , UNIQUE(name, activity)
    )
  `);

  // work_days
  query(`CREATE TABLE IF NOT EXISTS work_days
    (
        date TEXT NOT NULL
      , start_time TEXT NOT NULL
      , end_time TEXT

      , PRIMARY KEY(date)
    )
  `);

  // time_blocks
  query(`CREATE TABLE IF NOT EXISTS time_blocks
    (
        project_id INTEGER NOT NULL
      , date TEXT NOT NULL
      , allocated_time TEXT NOT NULL
      , work_item_number INTEGER

      , PRIMARY KEY(project_id, date)
      , FOREIGN KEY(project_id) REFERENCES projects(id)
      , FOREIGN KEY(date) REFERENCES work_days(date)
    )
  `);

  // breaks
  query(`CREATE TABLE IF NOT EXISTS breaks
    (
        date TEXT NOT NULL
      , start_time TEXT NOT NULL
      , end_time TEXT
      , description TEXT

      , PRIMARY KEY(date, start_time)
      , FOREIGN KEY(date) REFERENCES work_days(date)
    )
  `);
};

// ----- Create ----- //
const create = {
  project: (project) => {
    const sql = `
      INSERT INTO projects(name, activity, active, description)
      VALUES (?, ?, ?, ?);
    `;

    return insert(sql, [
      project.name,
      project.activity,
      project.active,
      project.description,
    ]);
  },
  workDay: (workDay) => {
    const sql = `
      INSERT INTO work_days(date, start_time, end_time)
      VALUES (?, ?, ?)
    `;
    return insert(sql, [
      workDay.date,
      workDay.startTime,
      workDay.endTime,
    ]);
  },
};

// ----- Read ----- //
const projectsReadBase = `
  SELECT id
    , name
    , activity
    , active
    , description
  FROM projects
`;
const read = {
  project: (id) => {
    if(isNil(id)) throw 'No id provided';
    const sql = `
      ${projectsReadBase}
      WHERE id = ?;
    `;
    return get(sql, [id]);
  },
  projects: () => {
    const sql = `${projectsReadBase};`;
    return query(sql);
  },
  workDay: (date) => {
    if(isNil(date)) throw 'No date provided';
    const sql = `
      SELECT date
        , start_time
        , end_time
      FROM work_days
      WHERE date = ?;
    `;
    return get(sql, [date]);
  },
};

// ----- Update ----- //
const update = {
  project: (id, value) => {
    if(isNil(id)) throw 'No id provided';
    if(id !== value.id) throw 'Ids do not match';
    const sql = `
      UPDATE projects
      SET active = ?
        , description = ?
      WHERE id = ?
    `;
    return set(sql, [value.active, value.description, id]);
  },
  workDay: (date, value) => {
    if(isNil(date)) throw 'No date provided';
    if(date !== value.date) throw 'Dates do not match';
    const sql = `
      UPDATE work_days
      SET start_time = ?
        , end_time = ?
      WHERE date = ?;
    `;
    return set(sql, [value.startTime, value.endTime, date]);
  },
};

// ----- Delete ----- //
const remove = {

};

createDb();

module.exports = {
  create,
  read,
  update,
  remove,
};