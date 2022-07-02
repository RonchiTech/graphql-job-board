const db = require('./db');

const Mutation = {
  createJob: (root, args, context, info) => {
    //args = {companyId, title, description}
    const { companyId, title, description } = args.input; //data are stored in the "input" object
    const newJobId = db.jobs.create(args.input); //return a jobId
    return db.jobs.get(newJobId);
  },
};

const Query = {
  jobs: (root, args, context, info) => {
    // console.log('jobs root: ', root);
    // console.log('jobs args: ', args);
    // console.log('jobs context: ', context);
    // console.log('jobs info: ', info);
    return db.jobs.list();
  },
  job: (root, args, context, info) => {
    // console.log('job root: ', root);
    // console.log('job args: ', args);
    // console.log('job context: ', context);
    // console.log('job info: ', info);
    return db.jobs.get(args.id);
  },
  company: (_, args) => {
    return db.companies.get(args.id);
  },
};

const Job = {
  company: (root, args, context, info) => {
    // console.log(job);
    // console.log('company root: ', root);
    // console.log('company args: ', args);
    // console.log('company context: ', context);
    // console.log('company info: ', info);
    return db.companies.get(root.companyId);
  },
};

const Company = {
  //company = root
  jobs: (company) => {
    return db.jobs.list().filter((job) => job.companyId === company.id);
  },
};

module.exports = { Query, Job, Company, Mutation };
