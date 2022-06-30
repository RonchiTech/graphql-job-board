const db = require('./db');

exports.Query = {
  jobs: () => db.jobs.list(),
};

exports.Job = {
  company: (job) => {
    console.log(job);
    return db.companies.get(job.companyId)},
};
