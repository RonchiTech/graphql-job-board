import React, { Component } from 'react';
import { JobList } from './JobList';
import { getJobs } from './requests';


export class JobBoard extends Component {
  constructor() {
    super();
    this.state = {
      jobs: [],
    };
  }
  async componentDidMount() {
    // const fetchJobs = async () => {
      const { jobs } = await getJobs();
      this.setState({ jobs: jobs });
    // };
    // fetchJobs();
  }
  render() {
    const { jobs } = this.state;
    return (
      <div>
        <h1 className="title">Job Board</h1>
        <JobList jobs={jobs} />
      </div>
    );
  }
}
