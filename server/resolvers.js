const db = require('./db');
const jobs = require('./data/jobs.json');
exports.Query = {
  jobs: () => db.jobs.list(),
};
