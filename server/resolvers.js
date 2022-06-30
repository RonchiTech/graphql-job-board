const db = require('./db');

exports.Query = {
  jobs: (root, args, context, info) => {
    console.log('jobs root: ', root);
    console.log('jobs args: ', args);
    // console.log('jobs context: ', context);
    // console.log('jobs info: ', info);
    return db.jobs.list();
  },
  job: (root, args, context, info) => {
    console.log('job root: ', root);
    console.log('job args: ', args);
    // console.log('job context: ', context);
    // console.log('job info: ', info);
    return db.jobs.get(args.id);
  },
};

exports.Job = {
  company: (root, args, context, info) => {
    // console.log(job);
    console.log('company root: ', root);
    console.log('company args: ', args);
    // console.log('company context: ', context);
    // console.log('company info: ', info);
    return db.companies.get(root.companyId);
  },
};
