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
        } `,
};

async function getJobs(url) {
  const reponse = await fetch(url, {
    ...metadata,
    body: JSON.stringify(graphqlGetJobsQuery),
  });
  const { data } = await reponse.json();
  return data;
}
export { getJobs };
