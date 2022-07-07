import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from 'apollo-boost';
import gql from 'graphql-tag';
import { isLoggedIn, getAccessToken } from './auth';

const ENDPONT_URL = 'http://localhost:9000/graphql';

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    // metadata.headers['authorization'] = 'Bearer ' + getAccessToken();
    operation.setContext({
      headers: {
        Authorization: 'Bearer ' + getAccessToken(),
      },
    });
  }
  // console.log('operation ', operation);
  // console.log('forward ', forward);
  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: ENDPONT_URL })]),
  cache: new InMemoryCache(),
});

// async function fetchData(query, variables = {}) {
//   const metadata = {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json',
//     },
//     body: JSON.stringify({ query, variables }),
//   };

//   if (isLoggedIn()) {
//     metadata.headers['authorization'] = 'Bearer ' + getAccessToken();
//   }

//   const response = await fetch(ENDPONT_URL, metadata);
//   const responseData = await response.json();
//   return responseData;
// }

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }
`;

const getCompanyQuery = gql`
  query GetCompany($companyId: ID!) {
    company(id: $companyId) {
      id
      name
      description
      jobs {
        id
        title
      }
    }
  }
`;
const jobQuery = gql`
  query JobQuery($jobId: ID!) {
    job(id: $jobId) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
const getJobsQuery = gql`
  query GetJobs {
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
async function getJobs() {
  const response = await client.query({
    query: getJobsQuery,
    fetchPolicy: 'no-cache',
  });
  console.log('getJobs: ', response);
  // const responseData = await fetchData(query);

  // if (responseData.errors) {
  //   const errorMessages = responseData.errors
  //     .map((error) => error.message)
  //     .join('\n');
  //   throw new Error(errorMessages);
  // }

  return response.data;
}

async function getCompany(companyId) {
  // const responseBody = await fetchData(query, { companyId });
  // return responseBody.data.company;
  const response = await client.query({
    query: getCompanyQuery,
    variables: { companyId },
  });
  return response.data.company;
}

async function getJob(jobId) {
  // const responseBody = await fetchData(query, { jobId });
  // return responseBody.data.job;
  const response = await client.query({
    query: jobQuery,
    variables: { jobId },
  });
  return response.data.job;
}

async function createJob(input) {
  // const responseBody = await fetchData(mutation, { input });
  // return responseBody.data.job;
  const response = await client.mutate({
    mutation: createJobMutation,
    variables: { input },
    update: (proxy, mutationResult) => {
      // console.log('mutationResult', mutationResult);
      //save the newly created job into the cache

      //after creating a new job it will redirect to that specific job, meaning calling the getJob query.
      //(the query you want to cache is the getJob query)
      proxy.writeQuery({
        query: jobQuery,
        variables: { jobId: mutationResult.data.job.id },
        data: mutationResult.data,
      });
    },
  });
  return response.data.job;
}

export { getJobs, getJob, getCompany, createJob };
