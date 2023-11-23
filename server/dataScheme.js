const createDb = (query) => {
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

module.exports = {
  createDb,
};