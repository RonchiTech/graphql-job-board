const ENDPONT_URL = 'http://localhost:9000/graphql';

async function fetchData(query, variables = {}) {
  const response = await fetch(ENDPONT_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const responseData = await response.json();
  return responseData;
}

async function getJobs() {
  const query = `
      query GetJobs{
        jobs {
          id
          title
          company {
            id
            name
          }
        }
      }
  `;
  const responseData = await fetchData(query);

  if (responseData.errors) {
    const errorMessages = responseData.errors
      .map((error) => error.message)
      .join('\n');
    throw new Error(errorMessages);
  }

  return responseData.data;
}

async function getJob(jobId) {
  const query = `
      query JobQuery($jobId: ID!) {
        job(id: $jobId) {
          id
          title
          company {
            id
            name
          }
          description
        }
      }
    `;
  const responseBody = await fetchData(query, { jobId });
  return responseBody.data.job;
}

async function getCompany(companyId) {
  const query = `query GetCompany($companyId: ID!){
      company(id: $companyId){
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }`;

  const responseBody = await fetchData(query, { companyId });
  return responseBody.data.company;
}

async function createJob(input) {
  const mutation = `mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input){
      id
      title
      description
      company {
        id 
        name
      }
    }
  }`;
  const responseBody = await fetchData(mutation, { input });
  return responseBody.data.job;
}

export { getJobs, getJob, getCompany, createJob };