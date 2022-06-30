const ENDPONT_URL = 'http://localhost:9000/graphql';

const metadata = {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
};

const graphqlGetJobsQuery = {
  query: `
  query {
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

const graphqlGetJobQuery = {
  query: `
  query {
    job
  }
  `
}

async function getJobs() {
  const reponse = await fetch(ENDPONT_URL, {
    ...metadata,
    body: JSON.stringify(graphqlGetJobsQuery),
  });
  const { data } = await reponse.json();
  return data;
}

async function getJob(url) {
  const reponse = await fetch(ENDPONT_URL, {
    ...metadata,
    body: JSON.stringify(graphqlGetJobsQuery),
  });
  const { data } = await reponse.json();
  return data;
}

export { getJobs, getJob };
