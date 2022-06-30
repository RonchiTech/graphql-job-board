const ENDPONT_URL = 'http://localhost:9000/graphql';

const metadata = {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
};

async function getJobs() {
  const graphqlGetJobsQuery = {
    query: `
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
  `,
  };
  const reponse = await fetch(ENDPONT_URL, {
    ...metadata,
    body: JSON.stringify(graphqlGetJobsQuery),
  });
  const { data } = await reponse.json();
  return data;
}

async function getJob(jobId) {
  const graphqlGetJobQuery = {
    query: `
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
    `,
    variables: {
      jobId: jobId,
    },
  };
  const reponse = await fetch(ENDPONT_URL, {
    ...metadata,
    body: JSON.stringify(graphqlGetJobQuery),
  });
  const responseBody = await reponse.json();
  return responseBody.data.job;
}

async function getCompany(companyId) {
  const graphqlGetCompanyQuery = {
    query: `query GetCompany($companyId: ID!){
      company(id: $companyId){
        id
        name
        description
      }
    }`,
    variables: {
      companyId,
    },
  };
  const response = await fetch(ENDPONT_URL, {
    ...metadata,
    body: JSON.stringify(graphqlGetCompanyQuery),
  });
  const responseBody = await response.json();
  console.log(responseBody);
  return responseBody.data.company;
}

export { getJobs, getJob, getCompany };
