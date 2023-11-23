const createInsert = (database) => (sql, params) => new Promise((resolve, reject) => {
  database.run(sql, params, function (error) {
    if(error) reject(error);
    resolve(this.lastID);
  });
});

const createQuery = (database) => (sql, params) => new Promise((resolve, reject) => {
  database.all(sql, params, (error, rows) => {
    if(error) reject(error);
    resolve(rows);
  });
});

const createGet = (database) => (sql, params) => new Promise((resolve, reject) => {
  database.get(sql, params, (error, rows) => {
    if(error) reject(error);
    resolve(rows);
  });
});

const createUpdate = (database) => (sql, params) => new Promise((resolve, reject) => {
  database.run(sql, params, (error) => {
    if(error) reject(error);
    resolve();
  });
});

module.exports = {
  createInsert,
  createQuery,
  createGet,
  createUpdate,
};