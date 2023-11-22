const sqlite3 = require('sqlite3').verbose();
const helpers = require('./helpers');
const isNil = require('lodash/isNil');

// ----- Connect ----- //
const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE);
// db.all()

const createInsert = (database) => (sql, params) => new Promise((resolve, reject) => {
  database.run(sql, params, function (error) {
    if(error) reject(error);
    resolve(this.lastID);
  });
});
const insert = createInsert(db);

const createQuery = (database) => (sql, params) => new Promise((resolve, reject) => {
  database.all(sql, params, (error, rows) => {
    if(error) reject(error);
    resolve(rows);
  });
});
const query = createQuery(db);

const createGet = (database) => (sql, params) => new Promise((resolve, reject) => {
  database.get(sql, params, (error, rows) => {
    if(error) reject(error);
    resolve(rows);
  });
});
const get = createGet(db);

const createUpdate = (database) => (sql, params) => new Promise((resolve, reject) => {
  database.run(sql, params, (error) => {
    if(error) reject(error);
    resolve();
  });
});
const set = createUpdate(db);

// ----- Create Tables ----- //
const createDb = () => {
  let sql;

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
};

// ----- Delete ----- //
const remove = {

};

createDb();

exports.dataAdapter = {
  create,
  read,
  update,
  remove,
};