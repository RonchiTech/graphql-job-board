import React, { Component } from 'react';
import { JobList } from './JobList';
import { getCompany } from './requests';

export class CompanyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { company: null };
  }
  async componentDidMount() {
    const { companyId } = this.props.match.params;
    const company = await getCompany(companyId);
    console.log(company);
    this.setState({ company });
  }
  render() {
    const { company } = this.state;
    return (
      company && (
        <div>
          <h1 className="title">{company.name}</h1>
          <div className="box">{company.description}</div>
          <h5 className="title is-5">Jobs at {company.name}</h5>
          <JobList jobs={company.jobs} />
        </div>
      )
    );
  }
}
