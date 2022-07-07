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
  console.log('operation ', operation);
  console.log('forward ', forward);
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

async function getJobs() {
  const query = gql`
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
  const response = await client.query({ query, fetchPolicy: 'no-cache' });
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

async function getJob(jobId) {
  const query = gql`
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
  // const responseBody = await fetchData(query, { jobId });
  // return responseBody.data.job;
  const response = await client.query({ query, variables: { jobId } });
  return response.data.job;
}

async function getCompany(companyId) {
  const query = gql`
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

  // const responseBody = await fetchData(query, { companyId });
  // return responseBody.data.company;
  const response = await client.query({ query, variables: { companyId } });
  return response.data.company;
}

async function createJob(input) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput) {
      job: createJob(input: $input) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `;
  // const responseBody = await fetchData(mutation, { input });
  // return responseBody.data.job;
  const response = await client.mutate({ mutation, variables: { input } });
  return response.data.job;
}

export { getJobs, getJob, getCompany, createJob };
